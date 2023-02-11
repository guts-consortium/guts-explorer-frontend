from pathlib import Path
import json
import numpy as np
import pandas as pd
import sys

def parse_cohort_waves(measure_entry, cohort, n_resps):
    """"""
    # print(f"type: {type(measure_entry[cohort])}")
    if isinstance(measure_entry[cohort], (int, float)):
        if measure_entry[cohort] == 0:
            items = []
        else:
            items = [str(measure_entry[cohort])]
        n_items = 1
    else:
        items = [m.strip() for m in measure_entry[cohort].split(';')]
        n_items = len(items)
    # print(f"items: {items}")
    # print(f"n_resps: {n_resps}")
    # print(f"n_items: {n_items}")
    assert n_items == n_resps
    waves_key = cohort + '_waves'
    measure_entry[waves_key] = {}
    for i,m in enumerate(items):
        measure_entry[waves_key][measure_entry['respondents'][i]] = [el.strip() for el in m.split(',') if el.strip() != '0']


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
    # parse respondents into separate entities
    new_list[x]['respondents'] = [r.strip() for r in q['respondent'].split(',')]
    n_resps = len(new_list[x]['respondents'])

    if isinstance(new_list[x]['ecc'], (int, float)):
        new_list[x]['ecc'] = str(new_list[x]['ecc']).replace('.', ',')
    
    if isinstance(new_list[x]['mcc'], (int, float)):
        new_list[x]['mcc'] = str(new_list[x]['mcc']).replace('.', ',')

    # print(f"respondents: {new_list[x]['respondents']}")
    # parse waves per cohort
    # print(f"ecc waves: {new_list[x]['ecc']}")
    # print(f"mcc waves: {new_list[x]['mcc']}")

    parse_cohort_waves(new_list[x], 'ecc', n_resps)
    parse_cohort_waves(new_list[x], 'mcc', n_resps)
    # parse dois
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