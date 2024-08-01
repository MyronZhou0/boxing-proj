from bs4 import BeautifulSoup
import requests
import json
import re
from pymongo import MongoClient

# MongoDB connection (replace '<connection_string>' with your actual MongoDB URI)

client = MongoClient("mongodb://localhost:27017/")
db = client["registeredGyms"]
collection = db["gyms_collection"]

us_states = [
    "alabama", "alaska", "arizona", "arkansas", "california", "colorado",
    "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho",
    "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana",
    "maine", "maryland", "massachusetts", "michigan", "minnesota", "mississippi",
    "missouri", "montana", "nebraska", "nevada", "new_hampshire", "new_jersey",
    "new_mexico", "new_york", "north_carolina", "north_dakota", "ohio", "oklahoma",
    "oregon", "pennsylvania", "rhode_island", "south_carolina", "south_dakota", "tennessee",
    "texas", "utah", "vermont", "virginia", "washington", "west_virginia",
    "wisconsin", "wyoming"
]

for state in us_states:
    try:
        url = f"https://www.boxinghelp.com/{state}.html"
        response = requests.get(url, timeout=5)
        response.raise_for_status()
    except requests.RequestException:
        print({"url": url, "error": "Failed to reach business website", "desc": "description cannot be generated"})
    content = BeautifulSoup(response.content, "html.parser")

    response = requests.get(url)
    content = BeautifulSoup(response.content, "html.parser")

    tds = content.find_all('td')

    # Filter <td> elements with any class starting with 'xl'
    pattern = re.compile(r'\bxl\d+')

    # Apply filter
    gyms = [td for td in tds if any(pattern.match(cls) for cls in td.get('class', []))]

    gyms_list = []
    # process the fields in each gym and store them as json object in gyms_list
    for gym in gyms:
        gym_data = {
            "name": "",
            "address": "",
            "phoneNum": "",
            "link": "",
            "email":"",
            "state": state
        }

        #get the name
        index_of_first_comma = gym.get_text().find(',')
        if index_of_first_comma == -1:
            gym_data["name"] = gym.get_text()
        else:
            gym_data["name"] = gym.get_text()[0:index_of_first_comma]
            gym_data["name"] = gym_data["name"].replace('\r', '').replace('\n', '').strip()
        
        # address
        index_of_Ph = gym.get_text().find("Ph")
        if index_of_Ph == -1:
            gym_data["address"] = gym.get_text()[index_of_first_comma:-1]
        else:
            gym_data["address"] = gym.get_text()[index_of_first_comma+1:index_of_Ph-2]
            gym_data["address"] = gym_data["address"].replace('\r', '').replace('\n', '').strip()
        
        # phoneNum
        if index_of_Ph == -1:
            gym_data["phoneNum"] = ""
        else:
            phone_num_end = gym.get_text().find(',', index_of_Ph)
            gym_data["phoneNum"] = gym.get_text()[index_of_Ph + 3:phone_num_end]
            gym_data["phoneNum"] = gym_data["phoneNum"].replace('\r', '').replace('\n', '').strip()
        
        # website link and email address
        for a_tag in gym.find_all('a', href=True):
            if('@' not in a_tag['href']):
                gym_data["link"] = a_tag['href']
            else:
                gym_data["email"] = a_tag.text
        # check if the gym_data is valid
        # all gym_data should have an address
        if(gym_data["link"] != ""):
            gyms_list.append(gym_data)
        print(gym_data)
    # print(gyms_list)
    # insert into mongoDB
    if(gyms_list != []):
        collection.insert_many(gyms_list)

    # # Print the gym data
    # print(json.dumps(gyms_list, indent=2))