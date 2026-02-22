import pandas as pd

# Load only first 5000 rows (safe start)
data = pd.read_csv("PhiUSIIL_Phishing_URL_Dataset.csv", nrows=5000)

print("\nFirst 5 rows:")
print(data.head())

print("\nColumns:")
print(data.columns)

print("\nShape:")
print(data.shape)

print("\nLabel distribution:")
if "label" in data.columns:
    print(data["label"].value_counts())
elif "Label" in data.columns:
    print(data["Label"].value_counts())
