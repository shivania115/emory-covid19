import csv
import json
import pandas as pd
import numpy as np
from pprint import pprint
from collections import defaultdict, Counter
from dateutil.parser import *

SMA_WINDOW = 7

def get_lineitem(d):
    cases = None
    deaths = None
    caserate = None
    mortality = None
    caserate_ma = None
    mortality_ma = None
    try:
        cases = int(d["cases"])
        deaths = int(d["deaths"])
        caserate = float(d["caserate"])
        mortality = float(d["covidmortality"])
        caserate_ma = float(d["caserate7day"])
        mortality_ma = float(d["covidmortality7day"])
    except ValueError:
        cases = 0
        deaths = 0
        caserate = 0
        mortality = 0
        caserate_ma = 0
        mortality_ma = 0
    return {"t": int(parse(d["date"]).timestamp()),
            "cases": cases,
            "deaths": deaths,
            "caseRate": caserate,
            "mortality": mortality,
            "caseRateMA": caserate_ma,
            "mortalityMA": mortality_ma}

def linechart(fn="covidtimeseries.csv"):

    data = defaultdict(list)
    with open(fn, "r") as fp:
        reader = csv.reader(fp)
        header = next(reader)
        for row in reader:
            d = {k:v.strip() for k, v in zip(header, row)}
            
            if d["date"] == "":
                continue

            item = get_lineitem(d)
            k = ""
            if d["nation"] != "":
                k = "_nation"
            elif d["statename"] != "":
                k = d["fips"].zfill(2)
            else:
                k = d["fips"].zfill(5)
            data[k].append(item)

    item0 = {"t": 1579582800, "deaths": 1, "cases": 1,
                "caseRate": 0, "mortality": 0,
                "caseRateMA": 0, "mortalityMA": 0}
    item1 = {"t": 1588731173, "deaths": 1, "cases": 1,
                "caseRate": 0, "mortality": 0,
                "caseRateMA": 0, "mortalityMA": 0}

    data["_"] = [item0, item1]

    output = defaultdict(dict)
    for k, v in data.items():
        if k == "_nation":
            continue
        output[k[:2]][k] = v

    for k, v in output.items():
        v["_nation"] = data["_nation"] 
        v["_"] = data["_"]
        with open(f"../timeseries{k}.json", "w") as fp:
            json.dump(v, fp, indent=2)


if __name__=="__main__":

    linechart()



