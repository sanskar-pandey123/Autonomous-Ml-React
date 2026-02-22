import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score

# Load dataset
data = pd.read_csv("url_dataset.csv")

X = data['url']
y = data['label']

# Convert URL to numerical features
vectorizer = TfidfVectorizer()
X_vectorized = vectorizer.fit_transform(X)

# Train test split
X_train, X_test, y_train, y_test = train_test_split(
    X_vectorized, y, test_size=0.3, random_state=42
)


# Train model
model = MultinomialNB()
model.fit(X_train, y_train)

# Accuracy
pred = model.predict(X_test)
print("URL Model Accuracy:", accuracy_score(y_test, pred))

# Save model
pickle.dump(model, open("url_model.pkl", "wb"))
pickle.dump(vectorizer, open("url_vectorizer.pkl", "wb"))

print("URL Model Trained Successfully!")
