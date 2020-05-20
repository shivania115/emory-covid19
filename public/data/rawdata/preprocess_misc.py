import csv
import json
import pandas as pd
import numpy as np
from pprint import pprint
from collections import defaultdict, Counter
from dateutil.parser import *

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

    fips2county()



