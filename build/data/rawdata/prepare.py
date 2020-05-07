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

def get_vizitems(d, varmap):
    items = [{"nameShort": varmap[k].get("nameShort",""),
                "name": varmap[k].get("name",""),
                "var": k,
                "rawvalue": v,
                "value": v * 100 / varmap[k].get("rangeMax", 1),
                "seq": varmap[k].get("seq",0)}
                for k, v in d.items()]
    return sorted(items, key=lambda x: -x["seq"])

def get_vizitems0(varmap):
    items = [{"nameShort": varmap[k].get("nameShort",""),
                "name": varmap[k].get("name",""),
                "var": k,
                "rawvalue": 0,
                "value": 0,
                "seq": varmap[k].get("seq",0)}
                for k in varmap.keys()]
    return sorted(items, key=lambda x: -x["seq"])

def get_scatter(d, fips, varmap):

    item = {}
    for k, v in d.items():
        item[varmap[k].get("nameShort","")] = (v * 100 / varmap[k].get("rangeMax", 1))
        item["fips"] = fips
    return item

def barchart(fn="nationalraw.csv"):

    varmap = {}
    with open("hlthdet_rate_varmap.json", "r") as fp:
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

    # 2 outputs (ready to print)
    output_nv = {} # nation view
    output_sv = {} # state views
    for sid, d in data_state.items():
        output_nv[sid] = get_vizitems(d, varmap)
    output_nv["nation"] = get_vizitems(data_nation["US"], varmap)
    output_nv[""] = get_vizitems0(varmap)

    data_by_state = defaultdict()
    for fips, d in data_county.items():
        sid = fips[:2]
        cid = fips[2:]
        if sid not in output_sv:
            output_sv[sid] = {}
            data_by_state[sid] = {}
        output_sv[sid][cid] = get_vizitems(d, varmap)
        data_by_state[sid][cid] = d


    coldata_nation = get_coldata(data_county)
    for sid in output_sv.keys():
        if sid not in data_state:
            continue
        coldata_state = get_coldata(data_by_state[sid])
        for items in output_sv[sid].values():
            for item in items:
                item["pctNation"] = get_pct(item["rawvalue"], 
                                        coldata_nation[item["var"]])
                item["pctState"] = get_pct(item["rawvalue"], 
                                        coldata_state[item["var"]])

        output_sv[sid]["nation"] = get_vizitems(data_nation["US"], varmap)
        output_sv[sid]["state"] = get_vizitems(data_state[sid], varmap)
        output_sv[sid][""] = get_vizitems0(varmap)
        output_sv[sid]["scatter"] = [get_scatter(v, k, varmap)
                                for k, v in data_by_state[sid].items()]

    with open("../barchartNV.json", "w") as fp:
        json.dump(output_nv, fp)

    for sid, d in output_sv.items():
        with open(f"../barchartSV{sid}.json", "w") as fp:
            json.dump(output_sv[sid], fp)

def get_lineitem(d):
    case = None
    death = None
    try:
        case = int(d["cases"])
        death = int(d["deaths"])
    except ValueError:
        case = 0
        death = 0
    if case == 0:
        case = None
    if death == 0:
        death = None
    return {"t": int(parse(d["date"]).timestamp()),
            "case": case,
            "death": death}

def linechart(fn0="us.csv", 
            fn1="us-states.csv", 
            fn2="us-counties.csv"):

    output_nv = {"nation": [], "": [{"t": 1579582800, 
                                    "death": 1, "case": 1},
                                    {"t": 1588731173, 
                                    "death": 1, "case": 1}
                                    ]}
    with open(fn0, "r") as fp:
        reader = csv.reader(fp)
        header = next(reader)
        for row in reader:
            d = {k:v for k, v in zip(header, row)}
            item = get_lineitem(d)
            output_nv["nation"].append(item)
    with open(fn1, "r") as fp:
        reader = csv.reader(fp)
        header = next(reader)
        for row in reader:
            d = {k:v for k, v in zip(header, row)}
            item = get_lineitem(d)
            k = d["fips"].zfill(2)
            if k not in output_nv:
                output_nv[k] = []
            output_nv[k].append(item)
  
    output_sv = {}
    with open(fn2, "r") as fp:
        reader = csv.reader(fp)
        header = next(reader)
        for row in reader:
            d = {k:v for k, v in zip(header, row)}
            item = get_lineitem(d)
            k = d["fips"].zfill(5)
            sid = k[:2]
            cid = k[2:]
            if sid not in output_nv:
                continue
            if sid not in output_sv:
                output_sv[sid] = {"nation": output_nv["nation"],
                                "state": output_nv[sid],
                                "": [{"t": 1579582800, 
                                    "death": 1, "case": 1},
                                    {"t": 1588731173, 
                                    "death": 1, "case": 1}]}
            if cid not in output_sv[sid]:
                output_sv[sid][cid] = []
            output_sv[sid][cid].append(item)

    with open("../linechartNV.json", "w") as fp:
        json.dump(output_nv, fp)

    for sid, d in output_sv.items():
        with open(f"../linechartSV{sid}.json", "w") as fp:
            json.dump(output_sv[sid], fp)

def fips2county(fn="all-geocodes-v2017.csv"):

    fips2county = {}
    with open(fn, "r", encoding='latin-1') as fp:
        reader = csv.reader(fp)
        header = next(reader)
        for row in reader:
            if row[3] != "00000":
                continue
            fips = row[1].strip() + row[2].strip()
            name = row[6].strip()
            fips2county[fips] = name
    with open("../fips2county.json", "w") as fp:
        json.dump(fips2county, fp)

if __name__=="__main__":

    barchart()
    linechart()
    fips2county()



