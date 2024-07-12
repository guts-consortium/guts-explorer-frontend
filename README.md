# GUTS Metadata Explorer

This repo contains code to render the GUTS Metadata Explorer: https://guts-consortium.github.io/guts-explorer

## Application design

This application is built using:
- VueJS 3 as the Javascript framework for reactive components
- Vuetify for user interface components
- Vite for building
- Vitest for testing

## Local rendering and data prep

The application requires the `JSON`-structured data in the `data` folder in order to render the explorer correctly.

#### Step 1 - development setup

In order to run the data preparation scripts or serve the application locally, you will first need to get the repository and its contents.

Clone the repository to your local machine and navigate to it:

```
git clone https://github.com/guts-consortium/guts-explorer.git
cd guts-explorer
```

Then you will need a recent installation of Python. Ideally, you should work in a virtual
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

#### Step 2 - add directory structure and metadata

If the `data` subdirectory does not already exist, run the following from the root directory:

```bash
mkdir -p data
```

Then add the necessary three metadata files to this directory:

- `data/guts-subject-level-metadata.json`
- `data/guts-file-level-metadata.json`
- `data/guts-measure-overview.json`

These three files are shared privately via YODA, or in a specific session in the metadata board.
Examples with dummy data are already available in this repository.

#### Step 3 - Render the application locally

From the root directory, run:

```
python -m http.server
```

Then navigate to http://localhost:8000/ in your browser.


## Changes, testing, and contributing

Contributions to the explorer are welcome! Please follow these steps:

1. [Create an issue](https://github.com/guts-consortium/guts-explorer/issues) describing your problem or suggested feature in order to get input from the team
2. In order to make changes, first [fork](https://github.com/guts-consortium/guts-explorer/fork) and then clone your forked repository to your local machine: `git clone https://github.com/<your-user-or-org-name>/guts-explorer.git`
3. Create a new git branch in which to make your changes: `git checkout -b <your-branch-name>` (replace `<your-branch-name>` with an applicable name)
4. Make your changes and test them locally: `python3 -m hhtp.server`. This should be run from the root directory and creates a local server at http://localhost:8000/ where you will be able to see your changes live.
5. Add and commit your changes to git: `git add <files-that-were-changed>`,  `git commit -m <descriptive message>`
6. Push your branch you your fork: `git push origin <your-branch-name>`
7. [Create a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) to merge the proposed changes into the main repository