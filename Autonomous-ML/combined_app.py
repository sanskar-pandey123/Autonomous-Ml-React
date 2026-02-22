from flask import Flask, request, jsonify
import pickle
import re

app = Flask(__name__)

# Load Spam Model
spam_model = pickle.load(open("spam_model/final_model.pkl", "rb"))
spam_vectorizer = pickle.load(open("spam_model/vectorizer.pkl", "rb"))

# Load URL Model
url_model = pickle.load(open("phishing_model/url_model.pkl", "rb"))
url_vectorizer = pickle.load(open("phishing_model/url_vectorizer.pkl", "rb"))

# Simple URL detection function
def is_url(text):
    url_pattern = re.compile(r'https?://|www\.')
    return bool(url_pattern.search(text))


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()

        if not data or "input" not in data:
            return jsonify({"error": "Please provide input field"}), 400

        user_input = data["input"]

        # Check if input is URL
        if is_url(user_input):
            vector = url_vectorizer.transform([user_input])
            prediction = url_model.predict(vector)[0]
            probability = url_model.predict_proba(vector)[0][1]

            result_type = "url"
            result_label = "phishing" if prediction == 1 else "safe"

        else:
            vector = spam_vectorizer.transform([user_input])
            prediction = spam_model.predict(vector)[0]
            probability = spam_model.predict_proba(vector)[0][1]

            result_type = "text"
            result_label = "spam" if prediction == 1 else "safe"

        risk_score = round(probability * 100, 2)

        return jsonify({
            "type": result_type,
            "result": result_label,
            "risk_score": risk_score,
            "confidence": "High" if risk_score > 75 else "Medium" if risk_score > 40 else "Low"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=6000)
