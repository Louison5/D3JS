import pandas as pd
import numpy as np
import json

# 读取数据
df = pd.read_csv('./master.csv')

# 使用每个国家的平均自杀率替换NaN值
average_suicide_rate = df[df['suicides/100k pop'].notna()].groupby('country')['suicides/100k pop'].mean()
for country in df['country'].unique():
    if country in average_suicide_rate:  
        df.loc[(df['country'] == country) & (df['suicides/100k pop'].isna()), 'suicides/100k pop'] = average_suicide_rate[country]

print(df.head())
print(df.columns)
print(df.describe())

# 按 'Country', 'Year', 'Sex', 和 'Age' 分组并聚合
grouped_data = df.groupby(['country', 'year', 'sex', 'age']).agg({
    'suicides_no': "sum", 
    "gdp_per_capita ($)": "mean", 
    "HDI for year": "mean"
}).reset_index()

# 将分组的数据转换为嵌套的字典结构
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
    if age not in nested_dict[country][year]['age']:
        nested_dict[country][year]['age'][age] = 0
    nested_dict[country][year]['sex'][sex] += population
    nested_dict[country][year]['age'][age] += population
    nested_dict[country][year]['num'] += population
    nested_dict[country][year]["ppp"] = ppp

# 将嵌套的字典转换为JSON格式
json_data = json.dumps(nested_dict, indent=4)

# 保存JSON数据到文件
with open('suicide_data.json', 'w') as json_file:
    json_file.write(json_data)

