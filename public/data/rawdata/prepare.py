import csv
import json
import pandas as pd
from pprint import pprint
from collections import defaultdict, Counter
from dateutil.parser import *

def read_num(x):
    x = x.replace("%","")
    try:
        x = float(x)
    except ValueError:
        x = None
    return x

def normalize(data, w, varmap):
    for loc_id, d in data.items():
        for k in d.keys():
            d[k] /= w[loc_id]
    return data

def get_pct(val, ordered_lst):
    rank = len(ordered_lst)
    for i, x in enumerate(ordered_lst):
        if x >= val:
            rank = i
            break
    return rank/len(ordered_lst)

def get_coldata(data):
    coldata = defaultdict(list)
    for _, d in data.items():
        for k, v in d.items():
            coldata[k].append(v)
    for k in coldata.keys():
        coldata[k] = sorted(coldata[k])
    return coldata

def barchart(fn="nationalraw.csv"):

    varmap = {}
    with open("barchart_varmap.json", "r") as fp:
        varmap = json.load(fp)
    
    weight = "Population"
    state_fips = "state_fips"
    county_fips = "county_fips"

    data_county = defaultdict(Counter)
    data_state = defaultdict(Counter)
    data_nation = defaultdict(Counter)
    data_state_w = Counter()
    data_nation_w = Counter()
    with open("nationalraw.csv", "r") as fp:
        reader = csv.reader(fp)
        header = next(reader)
        for row in reader:
            d = {k:v for k, v in zip(header, row)}
            if d[state_fips] == "" or d[county_fips] == "":
                continue

            sid = d[state_fips].zfill(2)
            cid = d[county_fips].zfill(3)

            for k in varmap.keys():
                v = read_num(d[k])
                w = read_num(d[weight])
                if v is None:
                    continue
                data_county[sid+cid][k] = v
                data_state[sid][k] += (w * v)
                data_nation["US"][k] += (w * v)

            data_state_w[sid] += w
            data_nation_w["US"] += w

    data_state = normalize(data_state, data_state_w, varmap)
    data_nation = normalize(data_nation, data_nation_w, varmap)

    coldata = get_coldata(data_county)

    # 2 outputs (ready to print)
    output_nv = {} # nation view
    output_sv = {} # state views
    for sid, d in data_state.items():
        output_nv[sid] = [{"nameShort": varmap[k]["nameShort"],
                            "name": varmap[k]["name"],
                            "var": k,
                            "value": v,
                            "pct": get_pct(v, coldata[k])}
                            for k, v in d.items()]
    output_nv[""] = [{"nameShort": varmap[k]["nameShort"],
                            "name": varmap[k]["name"],
                            "var": k,
                            "value": 0,
                            "pct": 0}
                        for k, v in data_nation["US"].items()]
    output_nv["nation"] = [{"nameShort": varmap[k]["nameShort"],
                            "name": varmap[k]["name"],
                            "var": k,
                            "value": v,
                            "pct": get_pct(v, coldata[k])}
                        for k, v in data_nation["US"].items()]

    for fips, d in data_county.items():
        sid = fips[:2]
        cid = fips[2:]
        if sid not in output_sv:
            output_sv[sid] = {}
        output_sv[sid][cid] = [{"nameShort": varmap[k]["nameShort"],
                            "name": varmap[k]["name"],
                            "var": k,
                            "value": v,
                            "pct": get_pct(v, coldata[k])}
                            for k, v in d.items()]
    for sid in output_sv.keys():
        output_sv[sid][""] = [{"nameShort": varmap[k]["nameShort"],
                            "name": varmap[k]["name"],
                            "var": k,
                            "value": 0,
                            "pct": 0}
                        for k, v in data_nation["US"].items()]
        output_sv[sid]["nation"] = [{"nameShort": varmap[k]["nameShort"],
                            "name": varmap[k]["name"],
                            "var": k,
                            "value": v,
                            "pct": get_pct(v, coldata[k])}
                        for k, v in data_nation["US"].items()]
        output_sv[sid]["state"] = [{"nameShort": varmap[k]["nameShort"],
                            "name": varmap[k]["name"],
                            "var": k,
                            "value": v,
                            "pct": get_pct(v, coldata[k])}
                            for k, v in d.items()]

    with open("../barchartNV.json", "w") as fp:
        json.dump(output_nv, fp)

    for sid, d in output_sv.items():
        with open(f"../barchartSV{sid}.json", "w") as fp:
            json.dump(output_sv[sid], fp)

def linechart(fn0="us.csv", 
            fn1="us-states.csv", 
            fn2="us-counties.csv"):

    output_nv = {"nation": []}
    with open(fn0, "r") as fp:
        reader = csv.reader(fp)
        header = next(reader)
        for row in reader:
            d = {k:v for k, v in zip(header, row)}
            try:
                item = {"t": int(parse(d["date"]).timestamp()),
                        "case": int(d["cases"]),
                        "death": int(d["deaths"])}
                output_nv["nation"].append(item)
            except ValueError:
                pass
    with open(fn1, "r") as fp:
        reader = csv.reader(fp)
        header = next(reader)
        for row in reader:
            d = {k:v for k, v in zip(header, row)}
            try:
                item = {"t": int(parse(d["date"]).timestamp()),
                        "case": int(d["cases"]),
                        "death": int(d["deaths"])}
                k = d["fips"].zfill(2)
                if k not in output_nv:
                    output_nv[k] = []
                output_nv[k].append(item)
            except ValueError:
                pass
  
    output_sv = {}
    with open(fn2, "r") as fp:
        reader = csv.reader(fp)
        header = next(reader)
        for row in reader:
            d = {k:v for k, v in zip(header, row)}
            try:
                item = {"t": int(parse(d["date"]).timestamp()),
                        "case": int(d["cases"]),
                        "death": int(d["deaths"])}
                k = d["fips"].zfill(5)
                sid = k[:2]
                cid = k[2:]
                if sid not in output_nv:
                    continue
                if sid not in output_sv:
                    output_sv[sid] = {"nation": output_nv["nation"],
                                    "state": output_nv[sid]}
                if cid not in output_sv[sid]:
                    output_sv[sid][cid] = []
                output_sv[sid][cid].append(item)
            except ValueError:
                pass
 

    with open("../linechartNV.json", "w") as fp:
        json.dump(output_nv, fp)

    for sid, d in output_sv.items():
        with open(f"../linechartSV{sid}.json", "w") as fp:
            json.dump(output_sv[sid], fp)


def numbers(fn="nationalraw.csv"):

    varmap = {}
    with open("numbers_varmap.json", "r") as fp:
        varmap = json.load(fp)
    
    weight = "Population"
    state_fips = "state_fips"
    county_fips = "county_fips"

    data = defaultdict(Counter)
    with open("nationalraw.csv", "r") as fp:
        reader = csv.reader(fp)
        header = next(reader)
        for row in reader:
            d = {k:v for k, v in zip(header, row)}
            if d[state_fips] == "" or d[county_fips] == "":
                continue

            sid = d[state_fips].zfill(2)
            cid = d[county_fips].zfill(3)

            for k in varmap.keys():
                v = read_num(d[k])
                w = read_num(d[weight])
                if v is None:
                    continue
                data[sid+cid][k] = v
                data[sid][k] += v
                data["US"][k] += v

    with open("../numbers.json", "w") as fp:
        json.dump(data, fp, indent=2, sort_keys=True)

if __name__=="__main__":

    barchart()
    linechart()
    numbers()




