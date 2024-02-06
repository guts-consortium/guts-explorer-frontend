from pathlib import Path
import json
import numpy as np
import pandas as pd
import sys


# SCRIPT STARTS RUNNING HERE

# Read all sheets from the measures excel file into Pandas dataframes
measures_fn = Path(sys.argv[1])
sheet_list = ['measures',
              'cohorts',
              'work-packages',
              'ppn-level']
df_all = pd.read_excel(measures_fn, sheet_list)

# 1. Measures
measures_sheet = df_all['measures']
measures_sheet_list = measures_sheet.to_dict('records')
measure_list = measures_sheet_list.copy()
# These fields will be removed below
fields_to_delete = ["mapping", "cohort", "sessions", "reference", "doi"]

all_measures = []
# for each measure record:
for x,q in enumerate(measures_sheet_list):  
    # Delete unused keys
    for f in fields_to_delete:
        if f in q:
            del measure_list[x][f]
        else:
            print(f"key '{f}' not in item '{x}'")

    # Replace NaN values with empty string
    measure_list[x] = { k: "" if np.isreal(q[k]) and np.isnan(q[k]) else q[k] for k in q.keys()}
    all_measures.append(measure_list[x]["short-name"])

# ensure all measures are unique
all_measures = list(set(all_measures))

# Write list of dictionaries to file
package_path = Path(__file__).resolve().parent.parent
out_dir = package_path / 'data'
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / 'measure_data.json'
with open(out_file, 'w') as f:
    json.dump(measure_list, f)

# 2. Participant data
participant_sheet = df_all['ppn-level']
participant_sheet_list = participant_sheet.to_dict('records')
ppn_list = participant_sheet_list.copy()

# for each ppn record:
for x,q in enumerate(participant_sheet_list):  
    # Replace NaN values with empty string
    ppn_list[x] = { k: "" if np.isreal(q[k]) and np.isnan(q[k]) else q[k] for k in q.keys()}

out_file = out_dir / 'participant_data.json'
with open(out_file, 'w') as f:
    json.dump(ppn_list, f)


# 3. Participant measures
# TODO: this should perhaps rather be done in javascript code, to prevent generation
# of a large file and having to read from a large file in the browser
ppn_measure_list = []
standard_fields = ["ppn", "cohort", "session", "age"]
measure_fields = ["short-name", "data-type", "data-category"]
for i, p in enumerate(ppn_list):
    for m in all_measures:
        # skip measure if it is not collected for the participant (i.e. not included in p)
        if not p.get(m, 0):
            continue
        # create new participant measure with base fields from ppn record
        ppn_measure = {
            f: p.get(f) for f in standard_fields
        }
        ppn_measure["short-name"] = m
        # get corresponding measure from short-name
        m_dict = next((item for item in measure_list if item["short-name"] == m), None)
        # complete short-name associated fields
        if m_dict:
            ppn_measure["data-type"] = m_dict.get("data-type")
            ppn_measure["data-category"] = m_dict.get("data-category")
        else:
            ppn_measure["data-type"] = None
            ppn_measure["data-category"] = None
        # add participant measure to list
        ppn_measure_list.append(ppn_measure)

out_file = out_dir / 'participant_measures.json'
with open(out_file, 'w') as f:
    json.dump(ppn_measure_list, f)

