# LCID Metadata Explorer

This repo contains code to render the LCID Metadata Explorer.

## Functionality


## Data description


## Preparing data for rendering

#### Step 0 - add raw input data and directory structure

If these subdirectories do not already exist, run the following from the root directory:

```bash
mkdir -p inputs/raw_data
mkdir -p inputs/processed_data
```

Then add the raw input data to the `inputs/raw_data` directory. The raw input data is the sheet with all metadata, named along the lines of `sfm_lcid-measures_*.xlsx`.

The `inputs` directory and all its recursive content is not committed to `git` (it is included in `.gitignore`) for data privacy reasons. Whoever runs this code will therefore require separate access to the input data.

#### Step 1 - raw input data to structured JSON

This converts the raw input data into a more structured and easily filterable JSON array, for use in the metadata exporer.

Run the following from the repo's root directory:

```python
python code/convert_sheet_measures.py inputs/raw_data/sfm_lcid-measures_*.xlsx
```

It generates the file at: `inputs/processed_data/measure_data.json`

#### Step 2 - structured JSON to data for "measures-per-wave" graph

This prepares the data from ***Step 1*** for plotting the interactive graph that shows which measures were collected during which waves.

Run the following from the repo's root directory:

```python
python code/calculate_category_measures_per_wave.py inputs/processed_data/measure_data.json
```

It generates the file at: `inputs/processed_data/measure_per_wave_per_cohort.json`



## Application design

This application is built using:
- HTML
- VueJS as the Javascript framework for reactive components
- BootstrapVue for Vue-specific components with Bootstrap styling
- Plotly's Javascript library for interactive graphs

Before the application can run via an http server, the steps highlighted in ***Preparing data for rendering*** have to be completed.

## TODO

- Capture data preprocessing provenance with `datalad run`