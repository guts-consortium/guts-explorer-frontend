# Since neptune sessions (for now) remain and aren’t deleted, the explorer job that
# will fetch the file- and subject-level metadata will follow these steps:
# - Make an HTTP GET request to the “session” endpoint, retrieving the list.
# - Order the list of sessions by datetime and “active” status
# - Select the most recent session which is active and which contains file+subject
#   level metadata in the “metadata” field.
# - Compare that to the session id from which the current metadata explorer information
#   was taken:
#   - If it’s the same, do nothing further (i.e. do not overwrite the existing metadata
#     in the explorer)
#   - If it’s different, write new metadata to the explorer metadata.

# I.e. the assumption is that a new session is created whenever new metadata is provided,
# and that existing sessions are not updated/patched.

import requests
from pathlib import Path
import json
import sys
from datetime import datetime, timezone

# Constants
repo_path = Path(__file__).resolve().parent.parent

# GET-request details
certpath = repo_path / "certs" / "reallyfullchain.cert"
session_url = "https://neptune1.irodspoc-surf.src.surf-hosted.nl:8443/session/"
headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json'
}
authentication = ('guts_metadata_explorer', 'gutspion33r3')

# Get the session metadata
print("Getting session metadata from Neptune endpoint...")
r = requests.post(
    url=session_url,
    auth=authentication,
    headers=headers,
    verify=str(certpath),
)

# Break if request failed
if r.status_code != 200:
    sys.exit(f"Unsuccessful request: response code {r.status_code}")



# --with:
# --by:




# curl -X 'POST' \
#   'https://neptune1.irodspoc-surf.src.surf-hosted.nl:8443/session/' \
#   -H 'accept: application/json' \
#   -H 'Content-Type: application/json' \
#   -d '{
#   "_id": "5eb7cf5a86d9755df3a6c593",
#   "events": [],
#   "lifetime": 168,
#   "access": "private",
#   "participants": [],
#   "profiles": [],
#   "provenance": []
# }'