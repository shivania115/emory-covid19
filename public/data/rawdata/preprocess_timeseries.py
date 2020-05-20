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
    try:
        cases = int(d["cases"])
        deaths = int(d["deaths"])
    except ValueError:
        cases = 0
        deaths = 0
    return {"t": int(parse(d["date"]).timestamp()),
            "cases": cases,
            "deaths": deaths}

def sma(a, n=7) :
    ret = np.cumsum(a, dtype=float)
    ret[n:] = ret[n:] - ret[:-n]
    return ret[n - 1:] / n

def linechart(fn="covidtimeseries.csv"):

    item0 = {"t": 1579582800, "death": 1, "case": 1}
    item1 = {"t": 1588731173, "death": 1, "case": 1}

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

    for k in data.keys():
        v = sorted(data[k], key=lambda x: x["t"])
        cases_sma = sma([x["cases"] for x in v], SMA_WINDOW)
        deaths_sma = sma([x["deaths"] for x in v], SMA_WINDOW)

        for i, item in enumerate(v):
            if i < SMA_WINDOW:
                item["casesMA"] = 0
                item["deathsMA"] = 0
            else:
                item["casesMA"] = cases_sma[i-SMA_WINDOW]
                item["deathsMA"] = deaths_sma[i-SMA_WINDOW]
        data[k] = v

    output = defaultdict(dict)
    for k, v in data.items():
        if k == "_nation":
            continue
        output[k[:2]][k] = v

    for k, v in output.items():
        v["_nation"] = data["_nation"] 
        with open(f"../timeseries{k}.json", "w") as fp:
            json.dump(v, fp, indent=2)


if __name__=="__main__":

    linechart()



