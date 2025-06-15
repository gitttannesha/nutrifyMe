import pandas as pd

user_profiles = {
    'user_id': [1, 2, 3, 4, 5],
    'age': [25, 35, 45, 55, 65],
    'weight_kg': [70, 80, 90, 100, 75],
    'height_cm': [175, 180, 170, 175, 165],
    'sugar_level': [90, 100, 110, 120, 95],
    'diabetes': [0, 1, 0, 1, 0],
    'hypertension': [0, 0, 1, 1, 0],
    'activity_level': ['moderate', 'low', 'high', 'low', 'moderate']
}

user_df = pd.DataFrame(user_profiles)
user_df.to_csv('data/user_profiles.csv', index=False)