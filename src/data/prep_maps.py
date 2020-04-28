import csv
import json
import pandas as pd
from pprint import pprint
from collections import defaultdict, Counter


allstates = {}
with open("allstates.json", "r") as fp:
    allstates = json.load(fp)

fn_lst = ["AK-02-alaska-counties.json",
        "AL-01-alabama-counties.json",
        "AR-05-arkansas-counties.json",
        "AZ-04-arizona-counties.json",
        "CA-06-california-counties.json",
        "CO-08-colorado-counties.json",
        "CT-09-connecticut-counties.json",
        "DE-10-delaware-counties.json",
        "FL-12-florida-counties.json",
        "GA-13-georgia-counties.json",
        "HI-15-hawaii-counties.json",
        "IA-19-iowa-counties.json",
        "ID-16-idaho-counties.json",
        "IL-17-illinois-counties.json",
        "IN-18-indiana-counties.json",
        "KS-20-kansas-counties.json",
        "KY-21-kentucky-counties.json",
        "LA-22-louisiana-parishes.json",
        "MA-25-massachusetts-counties.json",
        "MD-24-maryland-counties.json",
        "ME-23-maine-counties.json",
        "MI-26-michigan-counties.json",
        "MN-27-minnesota-counties.json",
        "MO-29-missouri-counties.json",
        "MS-28-mississippi-counties.json",
        "MT-30-montana-counties.json",
        "NC-37-north-carolina-counties.json",
        "ND-38-north-dakota-counties.json",
        "NE-31-nebraska-counties.json",
        "NH-33-new-hampshire-counties.json",
        "NJ-34-new-jersey-counties.json",
        "NM-35-new-mexico-counties.json",
        "NV-32-nevada-counties.json",
        "NY-36-new-york-counties.json",
        "OH-39-ohio-counties.json",
        "OK-40-oklahoma-counties.json",
        "OR-41-oregon-counties.json",
        "PA-42-pennsylvania-counties.json",
        "PR-72-puerto-rico-municipios.json",
        "RI-44-rhode-island-counties.json",
        "SC-45-south-carolina-counties.json",
        "SD-46-south-dakota-counties.json",
        "TN-47-tennessee-counties.json",
        "TX-48-texas-counties.json",
        "UT-49-utah-counties.json",
        "VA-51-virginia-counties.json",
        "VT-50-vermont-counties.json",
        "WA-53-washington-counties.json",
        "WI-55-wisconsin-counties.json",
        "WV-54-west-virginia-counties.json",
        "WY-56-wyoming-counties.json"]

# https://d3-wiki.readthedocs.io/zh_CN/master/Geo-Projections/
# Hutchinson, Kansas is the center
root = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/us-states/"
refX = -102.05244802611952
refY = 36.99273649777456
for state_info in allstates:
    
    fn_states = [fn for fn in fn_lst if fn[:2]==state_info["id"]]

    if len(fn_states)==0:
        continue
    fn_state = fn_states[0]

    topojson = json.load(open("us-states/"+fn_state, "r"))
    pprint(topojson["transform"])
    pprint(topojson.keys())
    coord = topojson["transform"]["translate"] 

    state_info["fips"] = str(int(state_info["val"]))
    state_info["url"] = root + fn_state
    state_info["offsetX"] = (refX - coord[0]) * 15
    state_info["offsetY"] = (coord[1] - refY) * 15
    state_info["scale"] = 4000

with open("state_config_org.json", "w") as fp:

    json.dump(allstates, fp, indent=2)






