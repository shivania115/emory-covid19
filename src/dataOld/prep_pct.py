import csv
import json
import pandas as pd
from pprint import pprint
from collections import defaultdict, Counter

VARS = ["covidmortalitycounty", 
        "caseratecounty",
        "diab_obesity",
        "asdr",
        "PCT_NHBLACK10",
        "PCT_HISP10",
        "POVRATE10",
        "highover_2015",
        "ttpop_2016",
        "ecotype_2015", 
        "v133_rawvalue",
        "v132_rawvalue",
        "v004_rawvalue",
        "v005_rawvalue",
        "v023_rawvalue",
        "v125_rawvalue",
        "v137_rawvalue",
        "v063_rawvalue",
        "v053_rawvalue"]

def get_pct(val, ordered_lst):
    rank = len(ordered_lst)
    for i, x in enumerate(ordered_lst):
        if x > val:
            rank = i
            break
    return rank/len(ordered_lst)

data_us = {}
data_state = {}
data_county = {}
with open("data_us.json", "r") as fp:
    data_us = json.load(fp)

with open("data_state.json", "r") as fp:
    data_state = json.load(fp)

with open("data_county.json", "r") as fp:
    data_county = json.load(fp)

# data by var
coldata = defaultdict(list)
for fip, d in data_state.items():
    for var, val in d.items():
        if var not in VARS:
            continue
        coldata[var].append(val)

for var in coldata.keys():
    coldata[var] = sorted(coldata[var])

data_new = {}
for fip, d in data_state.items():
    d_new = []
    for var, val in d.items():
        if var not in VARS:
            continue
        pct_state = get_pct(val, coldata[var])
        pct_nation = get_pct(data_us[var], coldata[var]) 
        d_new.append({"var": var, 
                    "state": pct_state, 
                    "nation": pct_nation})
    data_new[fip] = d_new

for d in data_new[""]:
    d["state"] = 0

with open("data_state_pct.json", "w") as fp:
    json.dump(data_new, fp, indent=2)


# data by var
coldata = defaultdict(list)
for fip, d in data_county.items():
    for var, val in d.items():
        if var not in VARS:
            continue
        coldata[var].append(val)

for var in coldata.keys():
    coldata[var] = sorted(coldata[var])

data_new = {}
for fip, d in data_county.items():
    d_new = []
    if fip=="":
        continue
    for var, val in d.items():
        if var not in VARS:
            continue
        fip_state = str(int(fip[:2]))
        pct_county = get_pct(data_county[fip][var], coldata[var])
        pct_state = get_pct(data_state.get(fip_state,{}).get(var,0), 
                            coldata[var])
        pct_nation = get_pct(data_us[var], coldata[var]) 
        d_new.append({"var": var, 
                    "county": pct_county,
                    "state": pct_state, 
                    "nation": pct_nation})
    data_new[fip] = d_new

data_new["13000"] = []
for var in VARS:
    pct_state = get_pct(data_state.get("13",{}).get(var,0), 
                        coldata[var])
    pct_nation = get_pct(data_us[var], coldata[var]) 
    data_new["13000"].append({"var": var, 
                "county": 0,
                "state": pct_state, 
                "nation": pct_nation})
 
with open("data_county_pct.json", "w") as fp:
    json.dump(data_new, fp, indent=2)




