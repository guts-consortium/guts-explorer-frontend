# GUTS Metadata Explorer

This repo contains code to render the GUTS Metadata Explorer: https://guts-consortium.github.io/guts-explorer

## Application design

This application is built using:
- HTML
- VueJS as the Javascript framework for reactive components
- BootstrapVue for Vue-specific components with Bootstrap styling
- Plotly's Javascript library for interactive graphs

## Local rendering and data prep

The application requires the `JSON`-structured data in the `data` folder in order to render the explorer correctly.

While not necessary for local rendering, the steps below detail how the data can be generated from inputs.

#### Step 0 - development setup

In order to run the data preparation scripts or serve the application locally, you will first need to get the repository and its contents.

Clone the repository to your local machine and navigate to it:

```
git clone https://github.com/guts-consortium/guts-explorer.git
cd guts-explorer
```

Then you will need to install Python and several packages. Ideally, you should work in a virtual
environment to keep this installation from interfering with other development projects on your system.
First create and activate a virtual environment, for example with Python `venv` or `miniconda`

```
# venv
python -m venv ~/my_explorer_env
source ~/my_explorer_env/bin/activate

# miniconda
conda create -n my_explorer_env
conda activate my_explorer_env
```

Then install the requirements, from the the root directory of this repository
```
pip install -r requirements.txt
```

#### Step 1 - add raw input data and directory structure

If this subdirectory does not already exist, run the following from the root directory:

```bash
mkdir -p inputs
```

Then add the raw input data to the `inputs` directory. The raw input data includes:
- the Excel sheet with all measure metadata, named along the lines of `guts-measure_overview*.xlsx`.

The `inputs` directory and all its recursive content is not committed to `git` (it is included in `.gitignore`) for data privacy reasons. Whoever runs this code will therefore require separate access to the input data.

#### Step 2 - Convert `.xlsx` sheet metadata to structured JSON

This converts the raw input metadata into a more structured and easily filterable JSON array, for use in the metadata exporer.

Run the following from the repo's root directory:

```python
python code/read_measures.py inputs/guts-measure-overview*.xlsx
```

This will generate the files in the `data` directory:
- `measure_data.json`
- `participant_data.json`

## Changes, testing, and contributing

Contributions to the explorer are welcome! Please follow these steps:

1. [Create an issue](https://github.com/guts-consortium/guts-explorer/issues) describing your problem or suggested feature in order to get input from the team
2. In order to make changes, first [fork](https://github.com/guts-consortium/guts-explorer/fork) and then clone your forked repository to your local machine: `git clone https://github.com/<your-user-or-org-name>/guts-explorer.git`
3. Create a new git branch in which to make your changes: `git checkout -b <your-branch-name>` (replace `<your-branch-name>` with an applicable name)
4. Make your changes and test them locally: `python3 -m hhtp.server`. This should be run from the root directory and creates a local server at http://localhost:8000/ where you will be able to see your changes live.
5. Add and commit your changes to git: `git add <files-that-were-changed>`,  `git commit -m <descriptive message>`
6. Push your branch you your fork: `git push origin <your-branch-name>`
7. [Create a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) to merge the proposed changes into the main repository