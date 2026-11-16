import json, shutil

with open("artifacts/personas_model.json") as f:
    model = json.load(f)

model["classes"] = [int(c) + 1 for c in model["classes"]]

with open("artifacts/personas_model.json", "w") as f:
    json.dump(model, f, indent=2)

with open("artifacts/country_baselines.json") as f:
    baselines = json.load(f)

for country, info in baselines.items():
    info["distribution"] = {str(int(k) + 1): v for k, v in info["distribution"].items()}

with open("artifacts/country_baselines.json", "w") as f:
    json.dump(baselines, f, indent=2)

shutil.copy("artifacts/personas_model.json", "web/public/data/personas_model.json")
shutil.copy("artifacts/country_baselines.json", "web/public/data/country_baselines.json")
print("Updated classes to 1..6:", model["classes"])
