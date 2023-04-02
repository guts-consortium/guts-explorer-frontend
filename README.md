# LCID Metadata Explorer

This repo contains code to render the LCID Metadata Explorer.

## Functionality

_TBC_

## Data description

_TBC_

## Preparing data for rendering

#### Step 0 - development setup

In order to run the data preparation scripts, you will first need to get the repository and its content.

Clone the repository to your local machine and navigate to it:

```
git clone https://github.com/leidencid/lcid-metadata-explorer.git
cd lcid-metadata-explorer
```

Then you will need to install Python and several packages.Ideally, you should work in a virtual
environment to keep this installation from interfering with other development projects on your system.
First create and activate a virtual environment, for example with Python `venv` or `miniconda`

```
# venv
python -m venv my_explorer_env
source my_explorer_env/bin/activate

# miniconda
conda create -n my_explorer_env
conda activate my_explorer_env
```

Then install the requirements, from the the root directory of this repository
```
pip install -r requirements.txt
```

#### Step 1 - add raw input data and directory structure

If these subdirectories do not already exist, run the following from the root directory:

```bash
mkdir -p inputs/raw_data
mkdir -p inputs/processed_data
```

Then add the raw input data to the `inputs/raw_data` directory. The raw input data include:
- the Excel sheet with all metadata, named along the lines of `*_lcid-measures_*.xlsx`.
- the `.sav` files (one per cohort) with participant inclusion information, named along the lines of `*_GeneralInformation_FamilyLevel_*.sav`

The `inputs` directory and all its recursive content is not committed to `git` (it is included in `.gitignore`) for data privacy reasons. Whoever runs this code will therefore require separate access to the input data.

#### Step 2 - `.xlsx` sheet metadata to structured JSON

This converts the raw input metadata into a more structured and easily filterable JSON array, for use in the metadata exporer.

Run the following from the repo's root directory:

```python
python code/convert_sheet_measures.py inputs/raw_data/sfm_lcid-measures_*.xlsx
```

It generates the file at: `inputs/processed_data/measure_data.json`

#### Step 3 - `.sav`-files to structured JSON

This converts the SPSS files into structured JSON for the participant dropout/recovery graphs.

Run the following from the repo's root directory (replace with actual filenames!):

```python
python code/extract_dropout_measures.py inputs/raw_data/[name-of-ECC-file.sav] inputs/raw_data/[name-of-MCC-file.sav]
```

NOTE: The order of the input files is important!

This script generates the file at: `inputs/processed_data/participant_data.json`

#### Step 4 - `.csv`-files to structured JSON

This converts the CSV files into structured JSON for structural MRI quality plots

Run the following from the repo's root directory (replace with actual filenames!):

```python
python code/extract_quality_measures.py inputs/raw_data/[name-of-ECC-file.csv] inputs/raw_data/[name-of-MCC-file.csv]
```

NOTE: The order of the input files is important!

This script generates the file at: `inputs/processed_data/quality_data_structural.json`


## Changing text content of explorer pages

To allow easier updates to page/section headings and descriptions, the content for these items can be edited in the JSON file:

```
assets/text_content.json
```

Once a change is committed and merged into the `main` branch, these text-based changes will render in the live explorer.

## Changes, testing, and contributing

Contributions to the explorer are welcome! Please follow these steps:

1. [Create an issue](https://github.com/leidencid/lcid-metadata-explorer/issues) describing your problem or suggested feature in order to get input from the team
2. In order to make changes, first [fork](https://github.com/leidencid/lcid-metadata-explorer/fork) and then clone your forked repository to your local machine: `git clone https://github.com/<your-user-or-org-name>/lcid-metadata-explorer.git`
3. Create a new git branch in which to make your changes: `git checkout -b <your-branch-name>` (replace `<your-branch-name>` with an applicable name)
4. Make your changes and test them locally: `python3 -m hhtp.server`. This should be run from the root directory and creates a local server at http://localhost:8000/ where you will be able to see your changes live.
5. Add and commit your changes to git: `git add <files-that-were-changed>`,  `git commit -m <descriptive message>`
6. Push your branch you your fork: `git push origin <your-branch-name>`
7. [Create a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) to merge the proposed changes into the main repository


## Application design

This application is built using:
- HTML
- VueJS as the Javascript framework for reactive components
- BootstrapVue for Vue-specific components with Bootstrap styling
- Plotly's Javascript library for interactive graphs

Before the application can run via an http server, the steps highlighted in ***Preparing data for rendering*** have to be completed.

## TODO

- Capture data preprocessing provenance with `datalad run`