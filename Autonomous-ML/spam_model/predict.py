import pickle

# Load saved model
model = pickle.load(open("final_model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

while True:
    message = input("Enter SMS: ")

    # Convert to vector
    vector = vectorizer.transform([message])

    # Predict
    prediction = model.predict(vector)[0]

    if prediction == 1:
        print("🚨 SPAM DETECTED\n")
    else:
        print("✅ SAFE MESSAGE\n")
