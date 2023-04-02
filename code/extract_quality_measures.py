from pathlib import Path
import json
import numpy as np
import pandas as pd
import sys

# variables
cohorts = ['ecc', 'mcc']
fn = [None, None]
df = [None, None]
records = [None, None]
cohort_dict = {
    "1": dict(
        score=[],
        qoalat=[]
    ),
    "3": dict(
        score=[],
        qoalat=[]
    ),
    "5": dict(
        score=[],
        qoalat=[]
    )
}
out_dict = {
    "ecc": {
        "1": {
            "score": [],
            "qoalat": []
        },
        "3": {
            "score": [],
            "qoalat": []
        },
        "5": {
            "score": [],
            "qoalat": []
        }
    },
    "mcc": {
        "1": {
            "score": [],
            "qoalat": []
        },
        "3": {
            "score": [],
            "qoalat": []
        },
        "5": {
            "score": [],
            "qoalat": []
        }
    },
}
fields_to_delete = {
    "ecc": ['VisitID', 'L..temp.pole.ok', 'R..temp.pole.ok', 'Missing.LH', 'Missing.RH', 'Dura.LH', 'Dura.RH', 'Excessive.movement', 'Notes', 'Coder', 'Recommendation', 'manual_QC_adviced'],
    "mcc": ['VisitID', 'DropOut', 'scancount_secured', 'T1_dcm2nii', 'nii2fs720', 'L..temp.pole.ok', 'R..temp.pole.ok', 'Missing.LH', 'Missing.RH', 'Dura.LH', 'Dura.RH', 'Excessive.movement', 'Notes', 'Coder', 'Recommendation', 'manual_QC_adviced', 'Step3Long', 'SubjectID']
}
ses_map = {
    'w01': '1',
    'w03': '3',
    'w05': '5'
}

# Read ecc and mcc csv files into Pandas dataframes
for i,c in enumerate(cohorts):
    fn[i] = Path(sys.argv[i+1])
    print(f"Reading: {fn[i]}")

for i,c in enumerate(cohorts):
    # if i==1:
    #     continue
    print(f"Extracting: {cohorts[i]}")
    df[i] = pd.read_csv(fn[i])
    records[i] = df[i].to_dict('records')

    for x,q in enumerate(records[i]):
    # Delete unused keys
        for f in fields_to_delete[c]:
            if f in q:
                del records[i][x][f]
            else:
                print(f"key '{f}' not in item '{x}'")
        # Replace NaN values with empty string
        records[i][x] = { k: "" if np.isreal(q[k]) and np.isnan(q[k]) else q[k] for k in q.keys()}

    print(f"Length of records for {c}: {len(records[i])}")

    for x,q in enumerate(records[i]):
        if not q['Scan_QoalaT']:
            continue
        out_dict[c][ses_map[q['ses']]]['score'].append(q['Score'])
        out_dict[c][ses_map[q['ses']]]['qoalat'].append(q['Scan_QoalaT'])

# Write list of dictionaries to file
package_path = Path(__file__).resolve().parent.parent
out_dir = package_path / 'inputs' / 'processed_data'
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / 'quality_data_structural.json'
with open(out_file, 'w') as f:
    json.dump(out_dict, f)