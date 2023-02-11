from pathlib import Path
import json
import numpy as np
import pandas as pd
import sys

def parse_cohort_waves(measure_entry, cohort, n_resps):
    """"""
    # First create a list of 
    # We are working with string values. If value in ecc or mcc column is not a string:
    if isinstance(measure_entry[cohort], (int, float)):
        if measure_entry[cohort] == 0:
            respondent_waves = []
        else:
            respondent_waves = [str(measure_entry[cohort])]
        n_items = 1
    else:
        respondent_waves = [m.strip() for m in measure_entry[cohort].split(';')]
        n_items = len(respondent_waves)
    assert n_items == n_resps
    waves_key = cohort + '_waves'
    measure_entry[waves_key] = {
        "all": []
    }
    # For the cohort, create a list of waves per respondent:
    for i,waves in enumerate(respondent_waves):
        parsed_waves = [el.strip() for el in waves.split(',') if el.strip() != '0']
        measure_entry[waves_key][measure_entry['respondents'][i]] = parsed_waves
        measure_entry[waves_key]["all"] += parsed_waves
    # ensure unique elements in "all" list
    measure_entry[waves_key]["all"] = list(set(measure_entry[waves_key]["all"]))


# SCRIPT STARTS RUNNING HERE

# Read all sheets from the measures excel file into Pandas dataframes
measures_fn = Path(sys.argv[1])
sheet_list = ['overview_measures', 'cd2', 'data_info', 'n_resp-will be added to 1st tab', 'n_quests', 'n_visits']
df_settings = pd.read_excel(measures_fn, sheet_list)
# Access the important dataframe
overview_measures = df_settings['overview_measures']
# Convert the dataframe to a list of dictionaries
overview_measures_list = overview_measures.to_dict('records')
new_list = overview_measures_list.copy()
# These fields will be removed below
fields_to_delete = ['ecc1','ecc2','ecc3','ecc4','ecc5','ecc6','ecc6c','mcc1','mcc2','mcc3','mcc4','mcc5','mcc5c','mcc6','n_ecc1','n_ecc2','n_ecc3','n_ecc4','n_ecc5','n_ecc6','n_ecc6c','n_mcc1','n_mcc2','n_mcc3','n_mcc4','n_mcc5','n_mcc5c','n_mcc6']

# for each measure record:
for x,q in enumerate(overview_measures_list):  
    # Delete unused keys
    for f in fields_to_delete:
        if f in q:
            del new_list[x][f]
        else:
            print(f"key '{f}' not in item '{x}'")

    # Replace NaN values with None
    new_list[x] = { k: "" if np.isreal(q[k]) and np.isnan(q[k]) else q[k] for k in q.keys()}
    # parse respondents into separate elements in a list
    new_list[x]['respondents'] = [r.strip() for r in q['respondent'].split(',')]
    # number of respondents
    n_resps = len(new_list[x]['respondents'])
    # Ensure that values from ecc and mcc columns are strings
    if isinstance(new_list[x]['ecc'], (int, float)):
        new_list[x]['ecc'] = str(new_list[x]['ecc']).replace('.', ',')
    if isinstance(new_list[x]['mcc'], (int, float)):
        new_list[x]['mcc'] = str(new_list[x]['mcc']).replace('.', ',')
    # Write cohorts to list (if cohort contains a wave number, i.e. not zero)
    new_list[x]['cohorts'] = []
    waves = ["1","2","3","4","5","6","7"]
    if any(w in new_list[x]['ecc'] for w in waves):
        new_list[x]['cohorts'].append('ecc')
    if any(w in new_list[x]['mcc'] for w in waves):
        new_list[x]['cohorts'].append('mcc')
    # Parse all the rest
    parse_cohort_waves(new_list[x], 'ecc', n_resps)
    parse_cohort_waves(new_list[x], 'mcc', n_resps)
    # Parse DOIs
    if isinstance(q['doi'], str):
        new_list[x]['doi'] = [d.strip() for d in q['doi'].split(';')]
    else:
        new_list[x]['doi'] = []

# Lastly Write list of dictionaries to file
package_path = Path(__file__).resolve().parent.parent
out_dir = package_path / 'inputs' / 'processed_data'
out_dir.mkdir(parents=True, exist_ok=True)

out_file = out_dir / 'measure_data.json'
with open(out_file, 'w') as f:
    json.dump(new_list, f)