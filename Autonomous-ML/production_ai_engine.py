from phishing_model.realtime_url_feature_extractor import extract_realtime_features
from flask import Flask, request, jsonify
import pickle
import re
import numpy as np
import pandas as pd

app = Flask(__name__)

# Load Spam Model
spam_model = pickle.load(open("spam_model/final_model.pkl", "rb"))
spam_vectorizer = pickle.load(open("spam_model/vectorizer.pkl", "rb"))

# Load Real URL Model
url_model = pickle.load(open("phishing_model/real_url_model.pkl", "rb"))

# Load feature column order
feature_columns = pickle.load(open("phishing_model/real_url_feature_columns.pkl", "rb"))

# Suspicious keyword list
SUSPICIOUS_KEYWORDS = [
    "login", "secure", "verify", "update",
    "bank", "paypal", "account", "free",
    "bonus", "crypto", "win", "prize"
]

SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".ru", ".tk", ".ml", ".ga"
]

# URL detection
def is_url(text):
    return bool(re.search(r'https?://|www\.', text))

# Rule-based suspicious scoring
def rule_based_url_score(url):

    score = 0

    if len(url) > 75:
        score += 15

    if any(url.endswith(tld) for tld in SUSPICIOUS_TLDS):
        score += 25

    if url.count("-") >= 2:
        score += 15

    if sum(c.isdigit() for c in url) > 5:
        score += 15

    if any(keyword in url.lower() for keyword in SUSPICIOUS_KEYWORDS):
        score += 20

    if not url.startswith("https"):
        score += 10

    return min(score, 100)

# Feature Extraction (Realtime + Structured)
def extract_real_url_features(url):

    realtime_features = extract_realtime_features(url)

    feature_row = pd.DataFrame([[0]*len(feature_columns)], columns=feature_columns)

    for key, value in realtime_features.items():
        if key in feature_row.columns:
            feature_row[key] = value

    return feature_row.values


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()

        if not data or "input" not in data:
            return jsonify({"error": "Provide input field"}), 400

        user_input = data["input"]

        # ---------- TEXT ANALYSIS ----------
        if not is_url(user_input):
            vector = spam_vectorizer.transform([user_input])
            spam_prob = spam_model.predict_proba(vector)[0][1]

            risk_score = round(spam_prob * 100, 2)
            threat = "HIGH" if risk_score > 75 else "MEDIUM" if risk_score > 40 else "LOW"

            return jsonify({
                "type": "text",
                "risk_score": risk_score,
                "threat_level": threat,
                "model_used": "Spam ML Model"
            })

        # ---------- URL ANALYSIS (Hybrid Rule + ML with Fallback) ----------
        else:

            rule_score = rule_based_url_score(user_input)

            features = extract_real_url_features(user_input)
            url_prob = url_model.predict_proba(features)[0][1]
            ml_score = url_prob * 100

            #  Fallback Logic Added
            if ml_score == 0:
                final_risk = rule_score
            else:
                final_risk = (rule_score * 0.4) + (ml_score * 0.6)

            risk_score = round(final_risk, 2)

            threat = "HIGH" if risk_score > 75 else "MEDIUM" if risk_score > 40 else "LOW"

            return jsonify({
                "type": "url",
                "rule_score": round(rule_score, 2),
                "ml_score": round(ml_score, 2),
                "final_risk_score": risk_score,
                "threat_level": threat,
                "model_used": "Hybrid Rule + ML Engine"
            })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=8000)
