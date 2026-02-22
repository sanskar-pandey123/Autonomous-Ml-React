from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)

# Load model
model = pickle.load(open("url_model.pkl", "rb"))
vectorizer = pickle.load(open("url_vectorizer.pkl", "rb"))

@app.route("/predict_url", methods=["POST"])
def predict_url():
    try:
        data = request.get_json()

        if not data or "url" not in data:
            return jsonify({"error": "Please provide a url field"}), 400

        url = data["url"]

        vector = vectorizer.transform([url])
        prediction = model.predict(vector)[0]
        probability = model.predict_proba(vector)[0][1]

        risk_score = round(probability * 100, 2)

        return jsonify({
            "result": "phishing" if prediction == 1 else "safe",
            "risk_score": risk_score,
            "confidence": "High" if risk_score > 75 else "Medium" if risk_score > 40 else "Low"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)
