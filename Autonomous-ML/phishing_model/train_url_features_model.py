import pandas as pd
import pickle
import re
from urllib.parse import urlparse
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load dataset
data = pd.read_csv("url_dataset.csv")

# Feature extraction function
def extract_features(url):
    parsed = urlparse(url)

    return {
        "url_length": len(url),
        "num_dots": url.count("."),
        "has_https": 1 if "https" in url else 0,
        "has_at": 1 if "@" in url else 0,
        "has_dash": 1 if "-" in url else 0,
        "num_digits": sum(c.isdigit() for c in url),
        "has_login_word": 1 if "login" in url else 0,
        "has_secure_word": 1 if "secure" in url else 0,
        "has_verify_word": 1 if "verify" in url else 0,
    }

# Apply feature extraction
features = data['url'].apply(extract_features)
features_df = pd.DataFrame(features.tolist())

X = features_df
y = data['label']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Train Random Forest
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Evaluate
pred = model.predict(X_test)
print("Feature-Based URL Model Accuracy:", accuracy_score(y_test, pred))

# Save model
pickle.dump(model, open("url_feature_model.pkl", "wb"))

print("Feature-Based URL Model Trained Successfully!")
