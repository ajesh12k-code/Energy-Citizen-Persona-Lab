# Energy Citizen Persona Lab

An open-science web application and machine learning pipeline for classifying **6 UX-oriented Energy Citizen Personas** and auditing residential energy dashboards against empirical European survey data.

## Core Modules
- **Citizen Persona Quiz:** 12-item distilled multinomial logistic regression model (**88.2% 5-fold CV accuracy**) trained on the Horizon 2020 GRETA survey ($N = 9,414$ citizens across 16 European countries; DOI: `10.5281/zenodo.10078752`), with global reference benchmarking.
- **Dashboard UX Auditor:** Evaluates utility apps, smart-meter portals, and municipal dashboards against the 6 personas, supporting pasted screenshots, portal URLs, and widget coverage scoring.
- **Open Energy Datasets Catalogue & CSV Profiler:** Curated open-access datasets, automated weekly Zenodo REST API discovery (`scripts/sync_datasets.py`), and an in-browser CSV persona profiler.

## Repository Structure
- `build_ux_personas.py` & `refine_model.py`: Offline K-Means ($K=6$) clustering and 12-item classifier distillation pipeline.
- `scripts/sync_datasets.py`: Automated Zenodo open dataset discovery script.
- `web/`: React + TypeScript + Tailwind CSS v4 frontend with client-side Softmax inference.
