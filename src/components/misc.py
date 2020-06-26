import json

data = {}
with open("hlthdet_rate_varmap.json", "r") as fp:
    data = json.load(fp)

data_new = []
for d in data.values():
    x = {}
    x["key"] = d["nameShort"]
    x["value"] = d["nameShort"]
    x["text"] = d["nameShort"]
    data_new.append(x)

with open("measureOptions.json", "w") as fp:
    json.dump(data_new, fp, indent=2, sort_keys=True)



