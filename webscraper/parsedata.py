from bs4 import BeautifulSoup
# from webscraper import bus_web
from transformers import pipeline
import requests
import json

def generateGymDesc():
    sampleText = """Thick clouds of dirt and sand fill the air as our convoy of Humvees arrives in Rafah, the first time international reporters have been allowed in since the Israeli military launched its ground assault on this city two months ago.

As the dust settles, the scale of destruction is startling. But it is also all-too familiar.

This part of Rafah, Gaza’s southernmost city which became the last refuge for more than a million Palestinians earlier in the war, is now unrecognizable.

Israel has repeatedly described its ground operation in Rafah as “limited.” But in this neighborhood in southern Rafah, the destruction looks almost identical to what I’ve seen in northern Gaza, in central Gaza and in Khan Younis through the limited prism of trips into Gaza with the Israeli military.

Some homes are flattened and other buildings bombed out.

“This is where the main destruction is because it was booby-trapped and because the tunnels were booby trapped,” Rear Adm. Daniel Hagari, the IDF’s top spokesman, tells me when I press him on how this represents a “limited” operation.

“And when you see destruction, it’s because either the houses were booby trapped, either when we demolished a tunnel the houses fell apart, or that Hamas fired from those houses and risked our forces and we had no other method but to make sure that our forces were safe,” Hagari added.Other parts of Rafah are not nearly as devastated, he says. But CNN cannot independently verify his claims: Israel has barred foreign journalists from entering Gaza independently and our only access is via embeds with the Israeli military. And this devastated section of Rafah is where they have brought us.

The Israeli military has brought us here not to see the destruction, but to talk about why they launched an offensive here in the first place, what they say they’ve uncovered and what they’ve accomplished."""

    generator = pipeline("summarization", model="google/flan-t5-large") 
    generatedText = generator(sampleText, min_length = 30, max_length = 100, do_sample = True, top_k=50, top_p=.95)
    print(generatedText)

if __name__ == "__main__":
    generateGymDesc()
