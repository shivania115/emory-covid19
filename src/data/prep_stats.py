import csv
import json
import pandas as pd
from pprint import pprint
from collections import defaultdict, Counter

VARS = ['asdr', 'highover_2015', 'ttpop_2016', 'ecotype_2015', 
        'v133_rawvalue', 'v132_rawvalue', 'v004_rawvalue', 
        'v005_rawvalue', 'v023_rawvalue', 'v125_rawvalue', 
        'v137_rawvalue', 'v063_rawvalue', 'v053_rawvalue', 
        'PCT_NHBLACK10', 'PCT_HISP10', 'POVRATE10', 'POPLOSS00', 
        'DiagDiabetes_2016', 'Obesity_2016', 'asdr_201416', 
        'asdr_diabetes_201016', 'asdr_ischaemic_201016', 
        'DiagDiabetes_2016_cat', 'Obesity_2016_cat', 
        'totalCVD_201416_cat', 'hearddisease_201416_cat', 
        'asdr_201416_cat', 'asdr_diabetes_201016_cat', 
        'asdr_ischaemic_201016_cat', 'diab_obesity', 
        'diab_obesity_cvd', 'asdr_diab_isch', 
        'cases', 'deaths', 'NObs', 
        'monthlydeaths_N', 'monthlydeaths_Sum', 
        'marchaprildeaths', 'dailydeaths',
        'annualdeaths2018', 'annualmortality2018', 
        'expecteddeaths', 'excessdeathscounty', 
        'covidmortalitycounty', 'caseratecounty', 
        'refzero', 'Countyhotspot']
WEIGHT = 'Population'
STATE = 'state_fips'
COUNTY = 'fips'

norm_us = 0
norm_state = Counter()
fips2state = {}
fips2county = {}

data = []
with open("CovidCountyLevel.csv", "r") as fp:
    reader = csv.reader(fp)
    header = next(reader)
    for row in reader:
        d = {}
        for k, v in zip(header, row):
            if k in VARS or k == WEIGHT:
                try:
                    d[k] = float(v)
                except ValueError:
                    d[k] = 0
            else:
                d[k] = v
        norm_us += d[WEIGHT]
        norm_state[d[STATE]] += d[WEIGHT]
        if d[STATE] != "":
            fips2state[d[STATE]] = d["statename"]
        if d[COUNTY] != "":
            fips2county[d[COUNTY]] = d["countyname"]
        data.append(d)

data_us = Counter()
data_state = defaultdict(Counter)
data_county = defaultdict(Counter)
for d in data:
    for k in VARS:
        data_us[k] += (d[k] * d[WEIGHT])
        data_state[d[STATE]][k] += (d[k] * d[WEIGHT])
        data_county[d[COUNTY]][k] = d[k]

for k in VARS:
    data_us[k] /= norm_us
    for state, data_state_stat in data_state.items():
        data_state_stat[k] /= norm_state[state]

data_us = dict(data_us)
data_us["name"] = "US"

for state in data_state.keys():
    data_state[state] = dict(data_state[state])
    data_state[state]["name"] = fips2state.get(state, "")

for county in data_county.keys():
    data_county[county] = dict(data_county[county])
    data_county[county]["name"] = fips2county.get(county, "")

with open("data_us.json", "w") as fp:
    json.dump(data_us, fp, indent=2)

with open("data_state.json", "w") as fp:
    json.dump(data_state, fp, indent=2)

with open("data_county.json", "w") as fp:
    json.dump(data_county, fp, indent=2)




