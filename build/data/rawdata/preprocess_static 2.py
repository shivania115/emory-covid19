import csv
import json
import pandas as pd
import numpy as np
from pprint import pprint
from collections import defaultdict, Counter
from dateutil.parser import *

def barchart(fn="nationalraw.csv"):

    varmap = {}
    with open("variable_mapping.json", "r") as fp:
        varmap = json.load(fp)
  
    date = ""
    data = {}
    with open(fn, "r") as fp:
        reader = csv.reader(fp)
        header = next(reader)
        for row in reader:
            d = {k:v.strip() for k, v in zip(header, row)}
            d_new = {}
            for k in varmap.keys():
                if k == "_013_Urbanization":
                    d_new[k] = d[k]
                    continue
                try:
                    d_new[k] = float(d[k])
                except ValueError:
                    pass
            k = ""
            if d["county"] != "":
                k = d["state"].zfill(2) + d["county"].zfill(3)
            elif d["state"] != "":
                k = d["state"].zfill(2)
            else:
                k = "_nation"
            data[k] = d_new 
            if date < d["date"]:
                date = d["date"]

    with open("../data.json", "w") as fp:
        json.dump(data, fp)

    with open("../date.json", "w") as fp:
        json.dump({"date": date}, fp, indent=2)

if __name__=="__main__":

    barchart()



