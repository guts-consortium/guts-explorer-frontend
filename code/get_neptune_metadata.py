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
_sesspath = repo_path / "data" / "_sessions.json"
mdata = [
    "guts-file-level-metadata.json",
    "guts-subject-level-metadata.json",
    "guts-measure-overview.json",
]

# Functions
def sort_by_datetime(items, dt_key):
    return sorted(items, key=lambda x: datetime.fromisoformat(x[dt_key]), reverse=True)


def load_json_from_file(file_path):
    with open(file_path) as f:
        return json.load(f)


def write_json_to_file(data, file_path):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


def add_latest_to_sessions(previous_sessions, latest_session):
    previous_sessions.append(
        {
            "_id": latest_session["_id"],
            "create_ts": latest_session["create_ts"],
            "updated": datetime.now(timezone.utc).isoformat(timespec="milliseconds")
        }
    )
    write_json_to_file(previous_sessions, _sesspath)


def find_element_in_list(arr, key, val, mode='equals'):

    if mode == 'contains':
        found_el = [el for el in arr if val in el[key]]
    else:
        found_el = [el for el in arr if el[key] == val]
    
    if len(found_el) == 0:
        return found_el
    elif len(found_el) == 1:
        return found_el[0]
    else:
        raise ValueError(f"Multiple elements found in list where 'el[{key}]' {mode} '{val}'")


# GET-request details
certpath = repo_path / "certs" / "reallyfullchain.cert"
session_url = "https://neptune1.irodspoc-surf.src.surf-hosted.nl:8443/session/"
headers = {'accept': 'application/json'}
authentication = ('guts_metadata_explorer', 'gutspion33r3')

# Get the session metadata
print("Getting session metadata from Neptune endpoint...")
r = requests.get(
    url=session_url,
    auth=authentication,
    headers=headers,
    verify=str(certpath),
)

# Break if request failed
if r.status_code != 200:
    sys.exit(f"Unsuccessful request: response code {r.status_code}")

# Response to JSON
sessions = r.json()

# Sessions must be active and have events with metadata
# Metadata must be a list of 3 elements (TODO: confirm if this will be the standard)
active_sessions = [s for s in sessions if
                   s.get("status") == "active" and
                   len(s.get("events")) > 0 and
                   len(s.get("events")[0].get("metadata")) == 3 ]

if len(active_sessions) == 0:
    sys.exit(f"No active sessions found with 3 sets of metadata, existing process.")

# Sort by datetime and access latest
sorted_sessions = sort_by_datetime(active_sessions, 'create_ts')
latest_session = sorted_sessions[0]
latest_session_id = latest_session["_id"]

print(f"Latest session ID from Neptune: {latest_session_id}")

# Compare to previous session details
# exit if session already used
previous_sessions = load_json_from_file(_sesspath)
try:
    existing_ses = find_element_in_list(previous_sessions, "_id", latest_session_id)
    if existing_ses:
        sys.exit(f"Metadata from latest session (id={latest_session_id}) has already been loaded previously ({existing_ses['updated']})")
except ValueError as e:
    sys.exit(e)

# Write metadata to files
print("Latest session ID is new, updating explorer metadata...")
metadata_list = latest_session.get("events")[0].get("metadata")
for m in mdata:
    el = find_element_in_list(metadata_list, 1, m, 'contains')
    current_metadata = el[2]
    filepath = repo_path / "data" / m
    write_json_to_file(current_metadata, filepath)

# Add latest session details to previous sessions json
print("Adding latest session details to persistent list of previous sessions")
add_latest_to_sessions(previous_sessions, latest_session)