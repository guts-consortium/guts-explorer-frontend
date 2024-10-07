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

## Implementation details

The overall application has several core components:

### 1. Fetch metadata from Neptune and process it for use by `guts-explorer` frontend

This is a Python script that should run every X days/weeks and does
the following:

1. Fetch metadata from `providers`, `data_users`, and `projects` endpoints
2. Fetch and filter `sessions` endpoint
3. Merge all subject-level and file-level metadata from all providers:
   - IMPORTANT: adds provider to file-level metadata, which is needed by browser app during basket checkout
4. Save state data (processed sessions from specific providers)
5. Save provider/user/project data, metadata, and state data to persistent shared storage or POST to Neptune


### 2. The `guts-explorer` frontend

This is the VueJS browser application that allows users to
- browse/search metadata
- add specific metadata items to a basket
- Log in via SRAM
- Check out the basket

This application will be served at e.g. **https://metadata.gutsproject.com**


### 3. Authenticate a user via SRAM

***TODO:***

- Implement first-level interaction with Neptune to see if user exists as part of the SRAM collaboration or should be created+invited: https://gitlab.com/surf-dms/neptune_project/neptune_server/-/blob/main/waves/docs/auth_flow-sram-by-invitation.md. This will be done within the frontend and backend.
- Implement Fask / FastAPI backend service that stores the `guts-explorer`-SRAM app ID and secret and that handles token exchange with the SRAM OIDC, i.e. improving security by not handling these aspects in the frontend. This service and subfunctionalities will be served at e.g. **https://metadata.gutsproject.com/api**
- guts-explorer browser app, i.e. frontend, will do the following when a user tries to log in via SRAM:
   - construct SRAM authorization url and direct user to it
   - receive authorization code after redirecting back, and send this to backend via POST request (e.g. at **https://metadata.gutsproject.com/api/auth**)
   - receive a response to confirm/deny login (*note: perhaps user-info can be included here?*)
- Backend service will:
   - exchange authorization code for tokens
   - store tokens and manage sessions
- frontend will interact with backend via secure session, not directly with OIDC, when requesting user info


### 4. Send a data request to Neptune

This is a JavaScript function that runs in the browser when a user checks out their basket after they have authenticated via SRAM.

The basket consists of an array of file-level metadata objects. These "files" originate from different providers, and data requests have to be done per provider.

The function does the following (*to be tested*):

1. Run through all file-level metadata objects and split them up per data provider
2. Create a data request per data provider
   - See example payload data: https://gitlab.com/surf-dms/neptune_project/neptune_server/-/blob/main/waves/docs/requesting_data_session_example.md
   - Specify participants:
      - Participant 1: service account of the data provider (getting mapping from 'projects')
      - Participant 2: the reviewer who has to approve/reject the request (from project 'members', filtering on 'reviewer' role)
3. POST data requests to Neptune (consider doing this via backend service, e.g. at **https://metadata.gutsproject.com/api/data-request**, so that Neptune credentials do not have to be passed via client)