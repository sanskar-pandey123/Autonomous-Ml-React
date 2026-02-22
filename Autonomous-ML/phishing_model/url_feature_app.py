from flask import Flask, request, jsonify
import pickle
from urllib.parse import urlparse

app = Flask(__name__)

# Load trained feature-based model
model = pickle.load(open("url_feature_model.pkl", "rb"))

# Same feature extraction logic (IMPORTANT)
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

@app.route("/predict_feature_url", methods=["POST"])
def predict_feature_url():
    try:
        data = request.get_json()
        if not data or "url" not in data:
            return jsonify({"error": "Please provide url field"}), 400

        url = data["url"]
        features = extract_features(url)

        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][1]

        risk_score = round(probability * 100, 2)

        return jsonify({
            "result": "phishing" if prediction == 1 else "safe",
            "risk_score": risk_score,
            "confidence": "High" if risk_score > 75 else "Medium" if risk_score > 40 else "Low"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5002)
