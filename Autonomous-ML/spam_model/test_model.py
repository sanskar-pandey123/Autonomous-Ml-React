import pickle

model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

sample = ["You won 10000 rupees now"]
sample_vec = vectorizer.transform(sample)

prediction = model.predict(sample_vec)
print("Prediction:", prediction[0])
