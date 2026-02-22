from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)

# Load trained model and vectorizer
model = pickle.load(open("final_model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data or "message" not in data:
            return jsonify({"error": "Please provide a message field"}), 400

        message = data["message"]

        # Convert text to vector
        vector = vectorizer.transform([message])

        # Prediction
        prediction = model.predict(vector)[0]

        # Probability (Spam confidence)
        probability = model.predict_proba(vector)[0][1]
        risk_score = round(probability * 100, 2)

        return jsonify({
            "result": "spam" if prediction == 1 else "safe",
            "risk_score": risk_score,
            "confidence": "High" if risk_score > 75 else "Medium" if risk_score > 40 else "Low"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
