import json
import urllib.parse
import urllib.request
from datetime import datetime

CURATED_PATH = "web/public/data/datasets_curated.json"
OUTPUT_PATH = "web/public/data/datasets.json"

QUERIES = [
    '"energy citizenship" survey',
    '"energy personas" OR "energy consumer segmentation"',
    '"household energy" "smart meter" survey',
]

def fetch_zenodo_datasets(query: str, size: int = 6):
    params = urllib.parse.urlencode({
        "q": query,
        "type": "dataset",
        "sort": "mostrecent",
        "size": size,
    })
    url = f"https://zenodo.org/api/records?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "EnergyPersonaLab-Sync/1.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    results = []
    for hit in data.get("hits", {}).get("hits", []):
        meta = hit.get("metadata", {})
        doi = hit.get("doi") or meta.get("doi", "")
        results.append({
            "id": f"zenodo-{hit.get('id')}",
            "title": meta.get("title", "Untitled Zenodo Dataset"),
            "provider": ", ".join(c.get("name", "") for c in meta.get("creators", [])[:2]) or "Zenodo",
            "year": str(meta.get("publication_date", ""))[:4] or str(datetime.now().year),
            "region": "International / See Record",
            "sampleSize": "Auto-indexed from Zenodo API",
            "license": meta.get("license", {}).get("id", "Open Access").upper(),
            "category": "Survey & Personas",
            "doiOrUrl": f"https://doi.org/{doi}" if doi else hit.get("links", {}).get("html", ""),
            "summary": (meta.get("description", "") or "").replace("<p>", "").replace("</p>", "")[:240] + "...",
            "keyVariables": meta.get("keywords", [])[:4] or ["Energy behavior", "Open dataset"],
            "howToUseWithPersonas": "Auto-discovered recent release; map Likert items to Personas 1–6 via the CSV Analyzer.",
            "autoIndexed": True,
        })
    return results

if __name__ == "__main__":
    with open(CURATED_PATH, "r", encoding="utf-8") as f:
        curated = json.load(f)

    seen_urls = {d["doiOrUrl"] for d in curated}
    discovered = []
    for q in QUERIES:
        try:
            for item in fetch_zenodo_datasets(q):
                if item["doiOrUrl"] and item["doiOrUrl"] not in seen_urls:
                    seen_urls.add(item["doiOrUrl"])
                    discovered.append(item)
        except Exception as e:
            print(f"Warning: query '{q}' failed: {e}")

    merged = curated + discovered
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(merged, f, indent=2)
    print(f"Synced {len(curated)} curated + {len(discovered)} newly discovered datasets -> {OUTPUT_PATH}")
