import json, os
import numpy as np
import pandas as pd
import pyreadstat
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import StandardScaler

os.makedirs("artifacts", exist_ok=True)
sav_path = "raw_data/Datasets delivery/Final Weighted Dataset - complete interviews.sav"
df, meta = pyreadstat.read_sav(sav_path)
cit = df[df["target"] == 1.0].copy().reset_index(drop=True)

# Core UX-relevant survey items spanning motivation, complexity, comfort, vulnerability, trust, and agency
core_cols = [
    "c11__1", "c11__2", "c11__3",           # Information complexity barriers
    "c14__1", "c14__2", "c14__3", "c14__7", "c14__8", "c14__10", # Convenience, comfort, moral duty, peer talk
    "c15__3", "c15__7",                     # Climate urgency vs national energy independence
    "c28__1", "c28__2", "c28__4",           # Bill anxiety, disconnection risk, thermal discomfort
    "c39__1", "c39__5",                     # Social trust & community spirit
    "c44__1", "c45__2", "c45__4", "c46__1"  # Eco-identity, transition skepticism, joint action, daily saving
]
core_cols = [c for c in core_cols if c in cit.columns]

X_raw = cit[core_cols].copy()
for col in core_cols:
    val_labels = meta.variable_value_labels.get(col, {})
    dk_codes = [k for k, v in val_labels.items() if any(w in str(v).lower() for w in ["know", "prefer", "applicable", "refus"])]
    if dk_codes:
        X_raw[col] = X_raw[col].replace(dk_codes, np.nan)
    X_raw[col] = X_raw[col].fillna(X_raw[col].median())

scaler_c = StandardScaler()
X_scaled = scaler_c.fit_transform(X_raw)

K = 6
kmeans = KMeans(n_clusters=K, n_init=30, random_state=42)
cit["cluster_id"] = kmeans.fit_predict(X_scaled)

# Rank top 12 items for the web quiz
rf = RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1).fit(X_raw, cit["cluster_id"])
top_12 = pd.Series(rf.feature_importances_, index=core_cols).sort_values(ascending=False).head(12).index.tolist()

scaler_web = StandardScaler()
X_web = scaler_web.fit_transform(X_raw[top_12])
clf = LogisticRegression(max_iter=1000, random_state=42)
cv_acc = cross_val_score(clf, X_web, cit["cluster_id"], cv=5).mean()
clf.fit(X_web, cit["cluster_id"])

print(f"5-Fold Cross-Validated Accuracy (12 quiz items): {cv_acc*100:.1f}%")
for i, col in enumerate(top_12, 1):
    print(f"  Q{i:02d} [{col}]: {meta.column_names_to_labels.get(col, col)}")

# Export model + country baselines
questions_meta = []
for col in top_12:
    val_labels = meta.variable_value_labels.get(col, {})
    clean_options = {
        int(k): str(v) for k, v in val_labels.items()
        if not any(w in str(v).lower() for w in ["know", "prefer", "applicable", "refus"])
    }
    questions_meta.append({"id": col, "text": meta.column_names_to_labels.get(col, col), "options": clean_options})

model_artifact = {
    "version": "1.1.0",
    "source_doi": "10.5281/zenodo.10078752",
    "cv_accuracy": round(float(cv_acc), 4),
    "features": top_12,
    "questions": questions_meta,
    "scaler_mean": [round(float(x), 6) for x in scaler_web.mean_],
    "scaler_scale": [round(float(x), 6) for x in scaler_web.scale_],
    "classes": [int(c) for c in clf.classes_],
    "coef": [[round(float(w), 6) for w in row] for row in clf.coef_],
    "intercept": [round(float(b), 6) for b in clf.intercept_]
}
with open("artifacts/personas_model.json", "w") as f:
    json.dump(model_artifact, f, indent=2)

# Print cluster centroids on top_12 so we map cluster_id 0..5 to exact persona names
z_df = pd.DataFrame(X_scaled, columns=core_cols)
z_df["cluster_id"] = cit["cluster_id"]
print("\nCluster Centroids (Z-scores on key items):")
print(z_df.groupby("cluster_id")[["c14__10", "c14__2", "c28__2", "c39__1", "c45__2", "c15__7", "c11__1"]].mean().round(2))

country_map = meta.variable_value_labels.get("country", {})
country_baselines = {}
for c_code, c_name in country_map.items():
    sub = cit[cit["country"] == c_code]
    if len(sub) > 0:
        w_tot = sub["weight"].sum()
        dist = {str(cid): round(float(sub.loc[sub["cluster_id"] == cid, "weight"].sum() / w_tot * 100), 1) for cid in range(K)}
        country_baselines[str(c_name)] = {"n": int(len(sub)), "distribution": dist}
with open("artifacts/country_baselines.json", "w") as f:
    json.dump(country_baselines, f, indent=2)
