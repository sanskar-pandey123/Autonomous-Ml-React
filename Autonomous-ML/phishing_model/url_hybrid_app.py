from flask import Flask, request, jsonify
import pickle
import re
from urllib.parse import urlparse

app = Flask(__name__)

# Load TF-IDF model
tfidf_model = pickle.load(open("url_model.pkl", "rb"))
tfidf_vectorizer = pickle.load(open("url_vectorizer.pkl", "rb"))

# Load Feature-based model
feature_model = pickle.load(open("url_feature_model.pkl", "rb"))

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

@app.route("/predict_hybrid_url", methods=["POST"])
def predict_hybrid_url():
    try:
        data = request.get_json()
        if not data or "url" not in data:
            return jsonify({"error": "Please provide url field"}), 400

        url = data["url"]

        # TF-IDF risk
        tfidf_vector = tfidf_vectorizer.transform([url])
        tfidf_prob = tfidf_model.predict_proba(tfidf_vector)[0][1]

        # Feature risk
        features = extract_features(url)
        feature_prob = feature_model.predict_proba(features)[0][1]

        # Hybrid risk calculation
        final_risk = (feature_prob * 0.6) + (tfidf_prob * 0.4)
        risk_score = round(final_risk * 100, 2)

        return jsonify({
            "tfidf_risk": round(tfidf_prob * 100, 2),
            "feature_risk": round(feature_prob * 100, 2),
            "final_risk_score": risk_score,
            "threat_level": "HIGH" if risk_score > 75 else "MEDIUM" if risk_score > 40 else "LOW"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5003)
