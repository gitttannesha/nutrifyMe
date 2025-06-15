import joblib
import pandas as pd
import numpy as np

# Load the model and feature names
model = joblib.load('../model/health_score_model.pkl')
features = joblib.load('../model/feature_names.pkl')

# Create a sample input
def calculate_health_score(user_data, product_data):
    # Base score starts at 100
    score = 100
    
    # Adjust score based on sugar content
    sugar_per_kg = product_data['sugar'] / (product_data['weight_g'] / 1000)
    # Reduced penalty multiplier from 10 to 2
    score -= min(30, sugar_per_kg * 2)  # Maximum penalty for sugar is 30
    
    # Adjust score based on sodium content
    sodium_per_kg = product_data['sodium'] / (product_data['weight_g'] / 1000)
    # Reduced penalty multiplier from 0.1 to 0.01
    score -= min(20, sodium_per_kg * 0.01)  # Maximum penalty for sodium is 20
    
    # Adjust score based on preservatives
    preservatives = product_data['preservative_count']
    if preservatives > 0:
        score -= 10  # preservative penalty 10
    
    # Adjust score based on user conditions
    if user_data['diabetes'] == 1:
        score -= min(20, sugar_per_kg * 1)  #  diabetes penalty multiplier
    if user_data['hypertension'] == 1:
        score -= min(15, sodium_per_kg * 0.005)  #  hypertension penalty multiplier
    
    # Ensure score stays between 0 and 100
    return max(0, min(100, score))

# Create sample data with correct calculations
test_data = {
    "age": 25,
    "weight": 70,
    "height": 175,
    "sugar_level": 90,
    "diabetes": 0,
    "hypertension": 0,
    "sugar": 25,       # 25g of sugar
    "sodium": 50,      # 50mg of sodium
    "weight_g": 100,   # 100g product weight
    "preservative_count": 1
}

# Calculate per kg values
test_data['sugar_per_kg'] = test_data['sugar'] / (test_data['weight_g'] / 1000)
test_data['sodium_per_kg'] = test_data['sodium'] / (test_data['weight_g'] / 1000)

# Calculate expected health score
expected_score = calculate_health_score(test_data, test_data)
print(f"Expected health score (based on our formula): {expected_score:.2f}")

# Convert to DataFrame in the correct order
test_df = pd.DataFrame([test_data])[features]

# Make prediction
prediction = model.predict(test_df)
print(f"Model predicted health score: {prediction[0]:.2f}")

# Now let's test with a healthier product
healthy_test_data = {
    "age": 25,
    "weight": 70,
    "height": 175,
    "sugar_level": 90,
    "diabetes": 0,
    "hypertension": 0,
    "sugar": 5,        # Only 5g of sugar
    "sodium": 10,      # Only 10mg of sodium
    "weight_g": 100,
    "preservative_count": 0  # No preservatives
}

# Calculate per kg values for healthy product
healthy_test_data['sugar_per_kg'] = healthy_test_data['sugar'] / (healthy_test_data['weight_g'] / 1000)
healthy_test_data['sodium_per_kg'] = healthy_test_data['sodium'] / (healthy_test_data['weight_g'] / 1000)

# Calculate expected health score for healthy product
healthy_score = calculate_health_score(healthy_test_data, healthy_test_data)
print(f"\nExpected health score for healthier product: {healthy_score:.2f}")

# Convert to DataFrame and predict
healthy_test_df = pd.DataFrame([healthy_test_data])[features]
healthy_prediction = model.predict(healthy_test_df)
print(f"Model predicted health score for healthier product: {healthy_prediction[0]:.2f}")