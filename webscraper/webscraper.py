from bs4 import BeautifulSoup
import requests

testUrl = 'https://www.lobosboxingclub.com/'
monthlyPrice = ""

def contains_keywords(url, keywords):
    url_lower = url.lower()
    return any(keyword in url_lower for keyword in keywords)

def find_prices(startUrl):
    visited = set()
    visitQueue = [startUrl]
    priceFound = False
    global monthlyPrice
    keywordArray = ["member", "fee", "price", "pricing", "classes"]

    while visitQueue and not priceFound:
        currentUrl = visitQueue.pop(0)
        if currentUrl in visited:
            continue

        try:
            # Make the request and handle potential errors
            response = requests.get(currentUrl, timeout=5)
            response.raise_for_status()  # Raise an HTTPError for bad responses
        except requests.RequestException as e:
            print(f"An error occurred: {e}")
            continue

        # Process the content
        content = BeautifulSoup(response.content, "html.parser")
        text = content.get_text().lower()
        monthIndex = text.find("month" or "4 weeks")
        if monthIndex != -1:
            dollarIndex = text.find("$", monthIndex)
            if dollarIndex != -1:
                # Loop through the next characters after the $ sign
                currentIndex = dollarIndex + 1
                priceDigits = []
                while currentIndex < len(text) and (text[currentIndex].isdigit() or text[currentIndex] == '.'):
                    priceDigits.append(text[currentIndex])
                    currentIndex += 1

                if priceDigits:
                    monthlyPrice = "".join(priceDigits)
                    priceFound = True
                    continue

        # Add links to the queue to visit
        for link in content.find_all('a', href=True):
            full_url = requests.compat.urljoin(currentUrl, link['href'])
            if full_url not in visited and full_url.startswith('http') and contains_keywords(full_url,keywordArray):
                visitQueue.append(full_url)

        # Add currentUrl to visited because it's finished
        visited.add(currentUrl)

find_prices(testUrl)
print(monthlyPrice)