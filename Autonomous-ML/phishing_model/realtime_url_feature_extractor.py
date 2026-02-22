import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def extract_realtime_features(url):

    features = {}

    # Basic URL Features
    features["URLLength"] = len(url)
    features["IsHTTPS"] = 1 if "https" in url else 0
    features["NoOfSubDomain"] = url.count(".")
    features["NoOfDegitsInURL"] = sum(c.isdigit() for c in url)

    try:
        response = requests.get(url, timeout=5)
        html = response.text
        soup = BeautifulSoup(html, "html.parser")

        # HTML-based features
        features["NoOfJS"] = len(soup.find_all("script"))
        features["NoOfImage"] = len(soup.find_all("img"))
        features["NoOfCSS"] = len(soup.find_all("link"))
        features["NoOfiFrame"] = len(soup.find_all("iframe"))
        features["HasPasswordField"] = 1 if soup.find("input", {"type": "password"}) else 0
        features["HasExternalFormSubmit"] = 1 if soup.find("form") else 0
        features["NoOfExternalRef"] = len([a for a in soup.find_all("a") if "http" in a.get("href", "")])

    except:
        # If request fails
        features["NoOfJS"] = 0
        features["NoOfImage"] = 0
        features["NoOfCSS"] = 0
        features["NoOfiFrame"] = 0
        features["HasPasswordField"] = 0
        features["HasExternalFormSubmit"] = 0
        features["NoOfExternalRef"] = 0

    return features
