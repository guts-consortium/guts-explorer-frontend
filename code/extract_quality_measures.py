from pathlib import Path
import json
import numpy as np
import pandas as pd
import sys

# SCRIPT STARTS RUNNING HERE
# Read all sheets from the measures excel file into Pandas dataframes
measures_fn = Path(sys.argv[1])
sheet_list = ['MCC_allSteps_QCw0305']
df_settings = pd.read_excel(measures_fn, sheet_list)

# Get cd2 keywords
main_sheet = df_settings['MCC_allSteps_QCw0305']
main_sheet_list = main_sheet.to_dict('records')
# These fields will be removed below
fields_to_delete = ['VisitID','SubjectID','DropOut','scancount_secured','T1_dcm2nii','nii2fs720','Subject','Datum','X','Pre.processed','L..temp.pole.ok','R..temp.pole.ok','Missing.LH','Missing.RH','Dura.LH','Dura.RH','Excessive.movement','Notes','Coder','Recommendation','manual_QC_adviced']

out_dict = {
    "3": dict(
        score=[],
        qoalat=[]
    ),
    "5": dict(
        score=[],
        qoalat=[]
    )
}
# for each measure record:
for x,q in enumerate(main_sheet_list):
    # Delete unused keys
    for f in fields_to_delete:
        if f in q:
            del main_sheet_list[x][f]
        else:
            print(f"key '{f}' not in item '{x}'")
    # Replace NaN values with empty string
    main_sheet_list[x] = { k: "" if np.isreal(q[k]) and np.isnan(q[k]) else q[k] for k in q.keys()}

for x,q in enumerate(main_sheet_list):

    if not q['Scan_QoalaT']:
        continue
    
    if q['ses'] == 'w03':
        out_dict['3']['score'].append(q['Score'])
        out_dict['3']['qoalat'].append(q['Scan_QoalaT'])
    if q['ses'] == 'w05':
        out_dict['5']['score'].append(q['Score'])
        out_dict['5']['qoalat'].append(q['Scan_QoalaT'])


# Write list of dictionaries to file
package_path = Path(__file__).resolve().parent.parent
out_dir = package_path / 'inputs' / 'processed_data'
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / 'quality_data_structural.json'
with open(out_file, 'w') as f:
    json.dump(out_dict, f)