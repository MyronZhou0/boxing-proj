from bs4 import BeautifulSoup
import requests
import json

with open('twitterData.json') as json_data:
    jsonData = json.load(json_data)
    for i in jsonData:
        if "obama" in i['tweet'].lower():
            print(i)