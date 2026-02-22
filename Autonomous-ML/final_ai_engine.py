from flask import Flask, request, jsonify
import pickle
import re

app = Flask(__name__)

# Load Spam Model
spam_model = pickle.load(open("spam_model/final_model.pkl", "rb"))
spam_vectorizer = pickle.load(open("spam_model/vectorizer.pkl", "rb"))

# Load URL TF-IDF Model
tfidf_model = pickle.load(open("phishing_model/url_model.pkl", "rb"))
tfidf_vectorizer = pickle.load(open("phishing_model/url_vectorizer.pkl", "rb"))

# Load URL Feature Model
feature_model = pickle.load(open("phishing_model/url_feature_model.pkl", "rb"))

# Feature extractor
def extract_features(url):
    return [[
        len(url),
        url.count("."),
        1 if "https" in url else 0,
        1 if "@" in url else 0,
        1 if "-" in url else 0,
        sum(c.isdigit() for c in url),
        1 if "login" in url else 0,
        1 if "secure" in url else 0,
        1 if "verify" in url else 0
    ]]

def is_url(text):
    return bool(re.search(r'https?://|www\.', text))


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        if not data or "input" not in data:
            return jsonify({"error": "Provide input field"}), 400

        user_input = data["input"]

        # -------- TEXT ANALYSIS --------
        if not is_url(user_input):
            vector = spam_vectorizer.transform([user_input])
            spam_prob = spam_model.predict_proba(vector)[0][1]

            risk_score = round(spam_prob * 100, 2)
            threat = "HIGH" if risk_score > 75 else "MEDIUM" if risk_score > 40 else "LOW"

            return jsonify({
                "type": "text",
                "spam_risk": risk_score,
                "final_threat_level": threat
            })

        # -------- URL ANALYSIS (Hybrid) --------
        else:
            tfidf_vector = tfidf_vectorizer.transform([user_input])
            tfidf_prob = tfidf_model.predict_proba(tfidf_vector)[0][1]

            features = extract_features(user_input)
            feature_prob = feature_model.predict_proba(features)[0][1]

            final_risk = (feature_prob * 0.6) + (tfidf_prob * 0.4)
            risk_score = round(final_risk * 100, 2)

            threat = "HIGH" if risk_score > 75 else "MEDIUM" if risk_score > 40 else "LOW"

            return jsonify({
                "type": "url",
                "tfidf_risk": round(tfidf_prob * 100, 2),
                "feature_risk": round(feature_prob * 100, 2),
                "final_risk_score": risk_score,
                "final_threat_level": threat
            })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=7000)
