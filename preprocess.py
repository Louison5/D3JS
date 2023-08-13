import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
import plotly.subplots as sp
import seaborn as sns
import matplotlib.pyplot as plt
import json
import re
df = pd.read_csv('./master.csv')
# df = df.replace(0, np.nan).dropna()
print(df.head())
print(df.columns)
print(df.describe())
# Group by 'Country', 'Year', 'Sex', and 'Age', and aggregate
grouped_data = df.groupby(['country', 'year', 'sex', 'age']).agg({'suicides_no': "sum", "gdp_per_capita ($)": "mean", "HDI for year": "mean"}).reset_index()
# print(grouped_data)

# Convert grouped data to a nested dictionary structure
nested_dict = {}
for index, row in grouped_data.iterrows():
    country = row['country']
    year = int(row['year'])
    sex = row['sex']
    age = row['age']
    population = row['suicides_no']
    ppp = row['gdp_per_capita ($)']
    hdi = row['HDI for year']

    if country not in nested_dict:
        nested_dict[country] = {}
    if year not in nested_dict[country]:
        nested_dict[country][year] = {'sex': {}, 'age': {}, "num": 0}
    if sex not in nested_dict[country][year]['sex']:
        nested_dict[country][year]['sex'][sex] = 0
    if sex not in nested_dict[country][year]['age']:
        nested_dict[country][year]['age'][sex] = {}
    if age not in nested_dict[country][year]['age'][sex]:
        nested_dict[country][year]['age'][sex][age] = 0
    nested_dict[country][year]['sex'][sex] += population
    nested_dict[country][year]['age'][sex][age] += population
    nested_dict[country][year]['num'] += population
    nested_dict[country][year]["ppp"] = ppp
    # nested_dict[country][year]["hdi"] = hdi

# Convert the nested dictionary to JSON format
json_data = json.dumps(nested_dict, indent=4)

# Save the JSON data to a file
with open('suicide_data.json', 'w') as json_file:
    json_file.write(json_data)
