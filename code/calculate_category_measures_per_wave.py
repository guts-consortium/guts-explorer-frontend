from pathlib import Path
import json
import numpy as np
import pandas as pd
import sys


# Read processed measures from json file into list of dicts
measures_list_fn = Path(sys.argv[1])
with open(measures_list_fn) as f:
    measures_list = json.load(f)

# This was done for each cohort:
# - measure_category
# - - measure_type
# - - - short_name

# These do not change
cohorts = ['ecc', 'mcc']
categories = [
    "social-competence",
    "parenting",
    "neurobiological-and-physiological-measures",
    "family-background-measures",
    "environmental-factors",
    "differential-susceptibility-markers",
    "behavioral-control",
    "additional-measures",
]


measure_per_wave_per_cohort = {}
for cohort in cohorts:
    # Initialise some variables
    short_names = {}
    short_name_elements = {}
    measure_per_wave = {}
    for cat in categories:
        # print('---')
        # print(cat)
        # print('---')
        short_name_elements[cat] = [m for m in measures_list if m['measure_category']==cat]
        short_names[cat] = [m['short_name'] for m in measures_list if m['measure_category']==cat]
        measure_per_wave[cat] = {}
        for i, sn in enumerate(short_name_elements[cat]):
            short_name = sn['short_name']
            # print(short_name)
            cohort_waves = cohort + '_waves'
            all_waves_collected = []
            for resp in sn['respondents']:
                if resp in sn[cohort_waves]:
                    all_waves_collected += sn[cohort_waves][resp]
            all_waves_collected = list(set(all_waves_collected))
            all_waves_collected = list(filter(None, all_waves_collected))
            measure_per_wave[cat][short_name] = [0,0,0,0,0,0,0]
            # print(f"{short_name} - {all_waves_collected}")
            for wv in all_waves_collected:
                measure_per_wave[cat][short_name][int(wv)-1] = 1
    measure_per_wave_per_cohort[cohort] = measure_per_wave


# Lastly Write list of dictionaries to file
package_path = Path(__file__).resolve().parent.parent
out_dir = package_path / 'inputs' / 'processed_data'
out_dir.mkdir(parents=True, exist_ok=True)

out_file = out_dir / 'measure_per_wave_per_cohort.json'
with open(out_file, 'w') as f:
    json.dump(measure_per_wave_per_cohort, f)