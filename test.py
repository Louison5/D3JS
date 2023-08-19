import pandas as pd
import numpy as py
import json

country_names = []
with open('./world-countries.json','r',encoding='utf-8') as f:
    data = json.load(f)
    for country in data['objects']['countries1']['geometries']:
        country_names.append(country['properties']['name'])
    print(country_names)

df = pd.read_csv('./master.csv')
names_pd = list(df['country'].unique())

print(names_pd)

wrong_ones = []
for name in names_pd:
    if name not in country_names:
        wrong_ones.append(name)

print(wrong_ones)

lisa = ['Afghanistan', 'Angola', 'Albania', 'United Arab Emirates', 'Argentina', 'Armenia', 'Antarctica', 'French Southern and Antarctic Lands', 'Australia', 'Austria', 'Azerbaijan', 'Burundi', 'Belgium', 'Benin', 'Burkina Faso', 'Bangladesh', 'Bulgaria', 'Bahamas', 'Bosnia and Herzegovina', 'Belarus', 'Belize', 'Bermuda', 'Bolivia', 'Brazil', 'Brunei Darussalam', 'Bhutan', 'Botswana', 'Central African Republic', 'Canada', 'Switzerland', 'Chile', 'China', 'Ivory Coast', 'Cameroon', 'Democratic Republic of the Congo', 'Congo, Republic of the...', 'Colombia', 'Costa Rica', 'Cuba', 'Northern Cyprus', 'Cyprus', 'Czech Republic', 'Germany', 'Djibouti', 'Denmark', 'Dominican Republic', 'Algeria', 'Ecuador', 'Egypt', 'Eritrea', 'Spain', 'Estonia', 'Ethiopia', 'Finland', 'Fiji', 'Falkland Islands', 'France', 'Gabon', 'United Kingdom', 'Georgia', 'Ghana', 'Guinea', 'Gambia', 'Guinea Bissau', 'Equatorial Guinea', 'Greece', 'Greenland', 'Guatemala', 'French Guiana', 'Guyana', 'Honduras', 'Croatia', 'Haiti', 'Hungary', 'Indonesia', 'India', 'Ireland', 'Iran', 'Iraq', 'Iceland', 'Israel', 'Italy', 'Jamaica', 'Jordan', 'Japan', 'Kazakhstan', 'Kenya', 'Kyrgyzstan', 'Cambodia', 'South Korea', 'Kosovo', 'Kuwait', 'Laos', 'Lebanon', 'Liberia', 'Libyan Arab Jamahiriya', 'Sri Lanka', 'Lesotho', 'Lithuania', 'Luxembourg', 'Latvia', 'Morocco', 'Republic of Moldova', 'Madagascar', 'Mexico', 'The former Yugoslav Republic of Macedonia', 'Mali', 'Malta', 'Myanmar', 'Montenegro', 'Mongolia', 'Mozambique', 'Mauritania', 'Malawi', 'Malaysia', 'Namibia', 'New Caledonia', 'Niger', 'Nigeria', 'Nicaragua', 'Netherlands', 'Norway', 'Nepal', 'New Zealand', 'Oman', 'Pakistan', 'Panama', 'Peru', 'Philippines', 'Papua New Guinea', 'Poland', 'Puerto Rico', 'North Korea', 'Portugal', 'Paraguay', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'Western Sahara', 'Saudi Arabia', 'Sudan', 'South Sudan', 'Senegal', 'Solomon Islands', 'Sierra Leone', 'El Salvador', 'Somaliland', 'Somalia', 'Serbia', 'Suriname', 'Slovakia', 'Slovenia', 'Sweden', 'Swaziland', 'Syrian Arab Republic', 'Chad', 'Togo', 'Thailand', 'Tajikistan', 'Turkmenistan', 'Timor-Leste', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Taiwan', 'United Republic of Tanzania', 'Uganda', 'Ukraine', 'Uruguay', 'United States', 'Uzbekistan', 'Venezuela, Bolivarian Republic of...', 'Viet Nam', 'Vanuatu', 'West Bank', 'Yemen', 'South Africa', 'Zambia', 'Zimbabwe']

list = [
    ['Antigua and Barbuda', ''],
    ['Aruba','Netherland'],
    ['Bahrain',''],
    ['Barbados',''],
    ['Cabo Verde',''],
    ['Dominica',''],
    ['Grenada',''],
    ['Kiribati',''],
    ['Macau','China'],
    ['Maldives',''],
    ['Mauritius',''],
    ['Republic of Korea','North Korea'],
    ['Saint Kitts and Nevis',''],
    ['Saint Lucia',''],
    ['Saint Vincent and Grenadines',''],
    ['San Marino',''],
    ['Seychelles',''],
    ['Singapore',''],
    ['Czechia','Czech Republic'],
    ['North Macedonia','The former Yugoslav Republic of Macedonia'],
    ['Saint Vincent and the Grenadines',''],
    ['United States of America','United States']
]