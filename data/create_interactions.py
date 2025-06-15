import pandas as pd
import os

# Get the current script's directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Read the CSV files using absolute paths
products_df = pd.read_csv(os.path.join(current_dir, 'products.csv'))
user_df = pd.read_csv(os.path.join(current_dir, 'user_profiles.csv'))

def calculate_health_score(user_data, product_data):
    # Base score starts at 100
    score = 100
    
    # Adjust score based on sugar content
    sugar_per_kg = product_data['sugar_g'] / (product_data['weight_g'] / 1000)
    score -= min(30, sugar_per_kg * 2)  # Maximum penalty for sugar is 30
    
    # Adjust score based on sodium content
    sodium_per_kg = product_data['sodium_mg'] / (product_data['weight_g'] / 1000)
    score -= min(20, sodium_per_kg * 0.01)  # Maximum penalty for sodium is 20
    
    # Adjust score based on preservatives
    preservatives = product_data['preservatives']
    if preservatives != 'none':
        score -= 10  # Reduced preservative penalty to 10
    
    # Adjust score based on user conditions
    if user_data['diabetes'] == 1:
        score -= min(20, sugar_per_kg * 1)  # Reduced diabetes penalty multiplier
    if user_data['hypertension'] == 1:
        score -= min(15, sodium_per_kg * 0.005)  # Reduced hypertension penalty multiplier
    
    # Ensure score stays between 0 and 100
    return max(0, min(100, score))

# Create sample interactions
interactions = []
for user in range(len(user_df)):
    for product in range(len(products_df)):
        user_data = user_df.iloc[user]
        product_data = products_df.iloc[product]
        health_score = calculate_health_score(user_data, product_data)
        
        interactions.append({
            'user_id': user_data['user_id'],
            'barcode': product_data['barcode'],
            'health_score': health_score,
            'age': user_data['age'],
            'weight': user_data['weight_kg'],
            'height': user_data['height_cm'],
            'sugar_level': user_data['sugar_level'],
            'diabetes': user_data['diabetes'],
            'hypertension': user_data['hypertension'],
            'sugar': product_data['sugar_g'],
            'sodium': product_data['sodium_mg'],
            'sugar_per_kg': product_data['sugar_g'] / (product_data['weight_g'] / 1000),
            'sodium_per_kg': product_data['sodium_mg'] / (product_data['weight_g'] / 1000),
            'preservative_count': 0 if product_data['preservatives'] == 'none' else len(product_data['preservatives'].split(','))
        })
    

# Create DataFrame and save using absolute path
interactions_df = pd.DataFrame(interactions)
interactions_df.to_csv(os.path.join(current_dir, 'merged_dataset.csv'), index=False)