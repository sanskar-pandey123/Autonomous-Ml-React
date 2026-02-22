import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import cross_val_score

# Load dataset
data = pd.read_csv("PhiUSIIL_Phishing_URL_Dataset.csv", nrows=5000)

# Keep only numeric columns
data = data.select_dtypes(include=['int64', 'float64'])

# Separate features and label
X = data.drop(columns=["label"])
y = data["label"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Predictions
pred = model.predict(X_test)

# Evaluation
print("Accuracy:", accuracy_score(y_test, pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, pred))
print("\nClassification Report:\n", classification_report(y_test, pred))

# Cross Validation
scores = cross_val_score(model, X, y, cv=5)
print("\nCross Validation Accuracy:", scores.mean())

# Feature Importance
importances = model.feature_importances_
feature_names = X.columns

feat_importance = pd.Series(importances, index=feature_names)
print("\nTop 10 Important Features:")
print(feat_importance.sort_values(ascending=False).head(10))

# Save model
pickle.dump(model, open("real_url_model.pkl", "wb"))

#  Save feature column order (NEW)
pickle.dump(X.columns.tolist(), open("real_url_feature_columns.pkl", "wb"))

print("\n Real URL Model Trained Successfully!")
