import json
import os
import numpy as np
import pandas as pd
import pyreadstat
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import silhouette_score
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import StandardScaler

os.makedirs("artifacts", exist_ok=True)

sav_path = "raw_data/Datasets delivery/Final Weighted Dataset - complete interviews.sav"
df, meta = pyreadstat.read_sav(sav_path)
cit = df[df["target"] == 1.0].copy().reset_index(drop=True)

# 1. Select behavioral, informational, motivational, trust & vulnerability items
prefixes = ("c6__", "c11__", "c14__", "c15__", "c28__", "c39__", "c44__", "c45__", "c46__", "c47__")
candidate_cols = [
    c for c in cit.columns
    if c.startswith(prefixes) and not c.endswith("__open") and cit[c].notna().sum() > 5000
]

# 2. Clean out non-substantive codes (e.g., 6.0 = Don't know / Prefer not to say on 1-5 scales)
X_raw = cit[candidate_cols].copy()
for col in candidate_cols:
    val_labels = meta.variable_value_labels.get(col, {})
    dk_codes = [
        k for k, v in val_labels.items()
        if any(w in str(v).lower() for w in ["know", "prefer", "applicable", "refus"])
    ]
    if dk_codes:
        X_raw[col] = X_raw[col].replace(dk_codes, np.nan)
    X_raw[col] = X_raw[col].fillna(X_raw[col].median())

scaler_cluster = StandardScaler()
X_scaled = scaler_cluster.fit_transform(X_raw)

# 3. Evaluate K=5 vs K=6 UX Personas and fit K=6
for k in [5, 6]:
    km_test = KMeans(n_clusters=k, n_init=25, random_state=42)
    lbls = km_test.fit_predict(X_scaled)
    sil = silhouette_score(X_scaled, lbls, sample_size=3000, random_state=42)
    print(f"K={k} | Silhouette={sil:.4f} | Sizes={np.bincount(lbls).tolist()}")

K = 6
kmeans = KMeans(n_clusters=K, n_init=30, random_state=42)
cit["cluster_id"] = kmeans.fit_predict(X_scaled)

# 4. Print distinguishing features of each cluster
z_df = pd.DataFrame(X_scaled, columns=candidate_cols)
z_df["cluster_id"] = cit["cluster_id"]
centroids = z_df.groupby("cluster_id").mean()

print("\n=== CLUSTER PROFILES (Top Distinguishing Items per Persona) ===")
for cid in range(K):
    row = centroids.loc[cid]
    top_pos = row.sort_values(ascending=False).head(3)
    top_neg = row.sort_values(ascending=True).head(2)
    pct = (cit["cluster_id"] == cid).mean() * 100
    print(f"\nCluster {cid} ({pct:.1f}% of citizens, n={(cit['cluster_id']==cid).sum()}):")
    for col, val in top_pos.items():
        print(f"  + [{val:+.2f} SD] {col}: {meta.column_names_to_labels.get(col, '')[:85]}")
    for col, val in top_neg.items():
        print(f"  - [{val:+.2f} SD] {col}: {meta.column_names_to_labels.get(col, '')[:85]}")

# 5. Distill Top 10 Survey Questions for the Web App Quiz
rf = RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1)
rf.fit(X_raw, cit["cluster_id"])
importances = pd.Series(rf.feature_importances_, index=candidate_cols).sort_values(ascending=False)
top_10 = importances.head(10).index.tolist()

scaler_web = StandardScaler()
X_web = scaler_web.fit_transform(X_raw[top_10])
clf = LogisticRegression(max_iter=1000, random_state=42)
cv_acc = cross_val_score(clf, X_web, cit["cluster_id"], cv=5).mean()
clf.fit(X_web, cit["cluster_id"])

print(f"\n=== DISTILLED 10-QUESTION WEB CLASSIFIER ===")
print(f"5-Fold Cross-Validated Accuracy (10 items vs {len(candidate_cols)} items): {cv_acc*100:.1f}%")

questions_meta = []
for col in top_10:
    val_labels = meta.variable_value_labels.get(col, {})
    clean_options = {
        int(k): str(v) for k, v in val_labels.items()
        if not any(w in str(v).lower() for w in ["know", "prefer", "applicable", "refus"])
    }
    questions_meta.append({
        "id": col,
        "text": meta.column_names_to_labels.get(col, col),
        "options": clean_options
    })

model_artifact = {
    "version": "1.0.0",
    "source_doi": "10.5281/zenodo.10078752",
    "cv_accuracy": round(float(cv_acc), 4),
    "features": top_10,
    "questions": questions_meta,
    "scaler_mean": [round(float(x), 6) for x in scaler_web.mean_],
    "scaler_scale": [round(float(x), 6) for x in scaler_web.scale_],
    "classes": [int(c) for c in clf.classes_],
    "coef": [[round(float(w), 6) for w in row] for row in clf.coef_],
    "intercept": [round(float(b), 6) for b in clf.intercept_]
}

with open("artifacts/personas_model.json", "w") as f:
    json.dump(model_artifact, f, indent=2)

# 6. Export Weighted Country Baselines (all 16 European countries)
country_map = meta.variable_value_labels.get("country", {})
country_baselines = {}
for c_code, c_name in country_map.items():
    sub = cit[cit["country"] == c_code]
    if len(sub) > 0:
        w_tot = sub["weight"].sum()
        dist = {
            str(cid): round(float(sub.loc[sub["cluster_id"] == cid, "weight"].sum() / w_tot * 100), 1)
            for cid in range(K)
        }
        country_baselines[str(c_name)] = {"n": int(len(sub)), "distribution": dist}

with open("artifacts/country_baselines.json", "w") as f:
    json.dump(country_baselines, f, indent=2)

print("Saved artifacts/personas_model.json and artifacts/country_baselines.json successfully!")
