from bs4 import BeautifulSoup
from transformers import pipeline
import requests
import sys
import json

def fetch_yelp_page(url):
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.content
    except requests.RequestException:
        return {"url": "unknown", "error": "Failed to reach Yelp page", "desc": "description cannot be generated"}

def get_business_website(yelp_page_content):
    soup = BeautifulSoup(yelp_page_content, 'html.parser')
    for link in soup.find_all('a', href=True):
        if 'biz_redir' in link['href']:
            if link.text and link['href'].startswith('/biz_redir'):
                return link.text
    return {"url": "unknown", "error": "No business page found on Yelp page", "desc": "description cannot generated"}

#SOME JAVASCRIPT AND HTML IS GENERATED WITH API THEREFORE CANNOT WEBSCRAPE
def clean_text(text):
    """Remove leading/trailing whitespace and reduce multiple spaces to a single space."""
    # Strip leading and trailing whitespace
    cleaned_text = text.strip()
    # Replace multiple whitespace characters with a single space
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
    return cleaned_text

def generate_gym_desc(bus_web):
    bus_web = "https://wildcardboxing.com/"
    generator = pipeline("summarization", model="facebook/bart-large-cnn") 

    try:
        response = requests.get(bus_web, timeout=5)
        response.raise_for_status()
    except requests.RequestException:
        return {"url": bus_web, "error": "Failed to reach business website", "desc": "description cannot be generated"}

    content = BeautifulSoup(response.content, "html.parser")
    
    # Extracting important information
    key_sections = []

    # Extracting headings
    for heading in content.find_all(["h1", "h2", "h3", "h4"]):
        text = heading.get_text()
        if text:
            key_sections.append(clean_text(text))

    # Extracting paragraphs and specific divs
    for paragraph in content.find_all("p"):
        text = paragraph.get_text()
        if text:
            key_sections.append(clean_text(text))

    for div in content.find_all("div", class_="elementor-widget-container"):  # Adjust "specific-class" as necessary
        text = div.get_text()
        if text:
            key_sections.append(clean_text(text))

    # Combine the extracted text
    inputText = " ".join(key_sections)

    # If the text is too long, truncate it to a reasonable length for the generator
    max_input_length = 1024  # Adjust as needed for the summarizer
    inputText = inputText[:max_input_length] if len(inputText) > max_input_length else inputText

    # Handle case when there's too little text
    if len(inputText.strip()) == 0:
        return {"url": bus_web, "error": "No meaningful content was found on the website", "desc": "description cannot be generated"}
    
    generatedText = generator(inputText, min_length=120, max_length=200, do_sample=True, top_k=50, top_p=.95)
    return generatedText[0]["summary_text"]

if __name__ == "__main__":
    print(generateGymDesc())
def contains_keywords(url, keywords):
    url_lower = url.lower()
    return any(keyword in url_lower for keyword in keywords)

def find_prices(start_url):
    start_url = "https://" + start_url
    visited = set()
    visit_queue = [start_url]
    keyword_array = ["member", "fee", "price", "pricing", "classes"]

    while visit_queue:
        current_url = visit_queue.pop(0)
        if current_url in visited:
            continue

        try:
            response = requests.get(current_url, timeout=5)
            response.raise_for_status()
        except requests.RequestException:
            continue

        content = BeautifulSoup(response.content, "html.parser")
        text = content.get_text().lower()
        month_index = text.find("month")
        if month_index == -1:
            month_index = text.find("4 weeks")

        if month_index != -1:
            dollar_index = text.find("$", month_index)
            if dollar_index != -1:
                i = dollar_index + 1
                price_digits = []
                while i < len(text) and (text[i].isdigit() or text[i] == '.'):
                    price_digits.append(text[i])
                    i += 1

                if price_digits:
                    monthly_price = "".join(price_digits)
                    return {"url": start_url, "price": monthly_price}

        for link in content.find_all('a', href=True):
            full_url = requests.compat.urljoin(current_url, link['href'])
            if full_url not in visited and full_url.startswith('http') and contains_keywords(full_url, keyword_array):
                visit_queue.append(full_url)

        visited.add(current_url)
    
    return {"url": start_url, "error": "cannot find price"}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"url": "unkown", "error": "No URL provided"}))
        sys.exit(1)

    yelp_url = sys.argv[1]

    yelp_page_content = fetch_yelp_page(yelp_url)
    if isinstance(yelp_page_content, dict):
        if "error" in yelp_page_content:
            print(json.dumps(yelp_page_content), flush=True)
            sys.exit(1)
    bus_web = get_business_website(yelp_page_content)

    if isinstance(bus_web, dict):
        if "error" in bus_web:
            print(json.dumps(bus_web), flush=True)
            sys.exit(1)
    #able to get the bus_web successfully
    gymDesc = generate_gym_desc(bus_web)
    if isinstance(gymDesc, dict):
        if "error" in gymDesc:
            gymDesc = "failed to reach business website"
    #may or may not have be able to find the price
    #generate description successfully
    price_info = find_prices(bus_web)
    if isinstance(price_info, dict):
        price_info["desc"] = gymDesc
    print(json.dumps(price_info), flush=True)
