from bs4 import BeautifulSoup
from transformers import pipeline
import requests
import json
import re

def clean_text(text):
    """Remove leading/trailing whitespace and reduce multiple spaces to a single space."""
    # Strip leading and trailing whitespace
    cleaned_text = text.strip()
    # Replace multiple whitespace characters with a single space
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
    return cleaned_text

def generateGymDesc():
    bus_web = "https://wildcardboxing.com/"

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

    for div in content.find_all("div"):  # Adjust "specific-class" as necessary
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

    print(inputText)
    print("----------------------------------------")
    prompt = inputText + "\n write me a summary of the text focusing on gym renown, programs available to customers, and equipment available"
    generator = pipeline("summarization", model="facebook/bart-large-cnn") 
    generatedText = generator(prompt, min_length=120, max_length=200, do_sample=True, top_k=50, top_p=.95)
    return generatedText[0]["summary_text"]

if __name__ == "__main__":
    print(generateGymDesc())