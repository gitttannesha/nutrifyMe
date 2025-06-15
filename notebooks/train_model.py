import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import numpy as np

# Load the merged dataset
df = pd.read_csv('../data/merged_dataset.csv')

# Define the feature columns and the target variable
features = ["age", "weight", "height", "sugar_level", "diabetes", "hypertension", 
            "sugar", "sodium", "sugar_per_kg", "sodium_per_kg", "preservative_count"]
X = df[features]
y = df["health_score"]

# Split dataset into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Set up parameter grid for hyperparameter tuning
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

# Create a RandomForestRegressor
rf = RandomForestRegressor(random_state=42)

# Set up GridSearchCV for hyperparameter tuning
grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, 
                          cv=5, n_jobs=-1, verbose=2, scoring='r2')

# Train the model
print("Starting model training...")
grid_search.fit(X_train, y_train)
print("Model training completed!")

# Get the best model
best_model = grid_search.best_estimator_

# Evaluate the model
y_pred = best_model.predict(X_test)
print("\nModel Evaluation Results:")
print(f"Best Parameters: {grid_search.best_params_}")
print(f"R2 Score: {r2_score(y_test, y_pred):.4f}")
print(f"Mean Squared Error: {mean_squared_error(y_test, y_pred):.4f}")

# Save the model to the model directory
model_path = '../model/health_score_model.pkl'
joblib.dump(best_model, model_path)
print(f"\nModel saved to {model_path}")

# Let's also save the feature names for future reference
feature_names_path = '../model/feature_names.pkl'
joblib.dump(features, feature_names_path)
print(f"Feature names saved to {feature_names_path}")


