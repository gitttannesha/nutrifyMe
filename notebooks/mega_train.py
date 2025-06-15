import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
# import joblib
import os


def load_and_process_data():
    # Set paths to use D drive
    data_dir = 'D:/nutrifymeeee/data'
    model_dir = 'D:/nutrifymeeee/model'
    
    # Create directories if they don't exist
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(model_dir, exist_ok=True)
    
    # Load the large products dataset in chunks
    print("Loading products data in chunks...")
    print(f"Reading from: {data_dir}/products_mega.csv")
    
    # First, let's check the column names
    print("Checking column names...")
    with open(f'{data_dir}/products_mega.csv', 'r', encoding='utf-8') as f:
        first_line = f.readline()
        columns = first_line.strip().split('\t')
    
    print("Available columns:")
    print(columns)
    
    # Define chunk size (process 100,000 rows at a time)
    chunk_size = 100000
    
    # Initialize empty DataFrame for relevant data
    relevant_data = pd.DataFrame()
    
    # Process the CSV file in chunks
    for chunk in pd.read_csv(f'{data_dir}/products_mega.csv', 
                            chunksize=chunk_size,
                            low_memory=False,
                            encoding='utf-8',
                            on_bad_lines='skip',
                            dtype=str,
                            sep='\t'):
        # Get the actual column names from the chunk
        actual_columns = chunk.columns.tolist()
        
        # Map our desired columns to actual column names
        column_map = {
            'code': 'code',  # Barcode
            'product_name': 'product_name',
            'sugars_100g': 'sugars_100g',
            'salt_100g': 'salt_100g',
            'preservatives': 'additives'  # Using additives as proxy for preservatives
        }
        
        # Filter to only include columns that exist in the chunk
        available_columns = {k: v for k, v in column_map.items() if v in actual_columns}
        
        # If no relevant columns found, skip this chunk
        if not available_columns:
            continue
        
        # Select relevant columns and rename them
        filtered_chunk = chunk[list(available_columns.values())].dropna()
        filtered_chunk = filtered_chunk.rename(columns={v: k for k, v in available_columns.items()})
        
        # Append to relevant data
        relevant_data = pd.concat([relevant_data, filtered_chunk], ignore_index=True)
        
        print(f"Processed chunk, current size: {len(relevant_data)} products")
        
        # If we have enough data, break early
        if len(relevant_data) >= 500000:  # Process maximum 500,000 products
            break
    
    print(f"Total products loaded: {len(relevant_data)}")
    
    if len(relevant_data) == 0:
        print("No products found with the required columns")
        return None, None
    
    # Convert numeric columns to appropriate types
    relevant_data['sugars_100g'] = pd.to_numeric(relevant_data['sugars_100g'], errors='coerce')
    relevant_data['salt_100g'] = pd.to_numeric(relevant_data['salt_100g'], errors='coerce')
    
    # Drop rows with NaN values after conversion
    products_df = relevant_data.dropna()
    print(f"DataFrame after numeric conversion: {products_df.shape}")
    
    if len(products_df) < 10:
        print(f"Warning: Only {len(products_df)} products available. Using all products for each user.")
    
    # Generate random user profiles
    num_users = 1000  # Generate 1000 user profiles
    print(f"Generating {num_users} user profiles...")
    user_profiles = pd.DataFrame({
        'age': np.random.normal(30, 10, num_users).astype(int),
        'weight_kg': np.random.normal(70, 15, num_users).astype(int),
        'height_cm': np.random.normal(170, 10, num_users).astype(int),
        'sugar_level': np.random.normal(90, 15, num_users).astype(int),
        'diabetes': np.random.binomial(1, 0.1, num_users),  # 10% chance of diabetes
        'hypertension': np.random.binomial(1, 0.15, num_users)  # 15% chance of hypertension
    })
    
    # Create interactions dataset
    print("Creating interactions dataset...")
    interactions = []
    for _, user in user_profiles.iterrows():
        # Randomly sample products for each user
        num_samples = min(10, len(products_df))  # Sample up to 10 products, or less if available
        sampled_products = products_df.sample(num_samples, replace=False)
        
        for _, product in sampled_products.iterrows():
            # Calculate health score based on various factors
            score = 100
            sugar_per_kg = product['sugars_100g'] * 10
            sodium_per_kg = product['salt_1000g'] * 1000 if 'salt_1000g' in product else product['salt_100g'] * 1000
            
            score -= min(30, sugar_per_kg * 2)  # Sugar penalty
            score -= min(20, sodium_per_kg * 0.01)  # Sodium penalty
            score -= 10 if pd.notna(product['preservatives']) else 0  # Preservative penalty
            
            if user['diabetes'] == 1:
                score -= min(20, sugar_per_kg * 1)  # Diabetes penalty
            if user['hypertension'] == 1:
                score -= min(15, sodium_per_kg * 0.005)  # Hypertension penalty
            
            score = max(0, min(100, score))
            
            interactions.append({
                'user_id': user.name,
                'barcode': product['code'],
                'product_name': product['product_name'],
                'sugar': product['sugars_100g'] * 10,
                'sodium': product['salt_1000g'] * 1000 if 'salt_1000g' in product else product['salt_100g'] * 1000,
                'sugar_per_kg': sugar_per_kg,
                'sodium_per_kg': sodium_per_kg,
                'preservative_count': len(str(product['preservatives']).split(',')) if pd.notna(product['preservatives']) else 0,
                'age': user['age'],
                'weight': user['weight_kg'],
                'height': user['height_cm'],
                'sugar_level': user['sugar_level'],
                'diabetes': user['diabetes'],
                'hypertension': user['hypertension'],
                'health_score': score
            })
    
    interactions_df = pd.DataFrame(interactions)
    print(f"Created interactions dataset with {len(interactions_df)} entries")
    
    if len(interactions_df) == 0:
        print("No interactions created. Check if products have required data.")
        return None, None
    
    # Split the data into training and testing sets (70% train, 30% test)
    print("Splitting data into train and test sets...")
    train_df, test_df = train_test_split(
        interactions_df,
        test_size=0.3,
        random_state=42,
        stratify=interactions_df['health_score'].apply(lambda x: int(x/10))  # Stratify by score range
    )
    
    print(f"Train set size: {len(train_df)}")
    print(f"Test set size: {len(test_df)}")
    
    # Save the datasets to D drive
    train_df.to_csv(f'{data_dir}/train_dataset.csv', index=False)
    test_df.to_csv(f'{data_dir}/test_dataset.csv', index=False)
    
    print("Data processing completed successfully!")
    return train_df, test_df


def train_model(train_df, test_df):
    # Define features and target
    features = [
        "age", "weight", "height", "sugar_level", "diabetes", "hypertension",
        "sugar", "sodium", "sugar_per_kg", "sodium_per_kg", "preservative_count"
    ]
    
    X_train = train_df[features]
    y_train = train_df["health_score"]
    
    X_test = test_df[features]
    y_test = test_df["health_score"]
    
    # Set up parameter grid for hyperparameter tuning
    param_grid = {
        'n_estimators': [200, 300, 400, 500],  # Increased number of trees
        'max_depth': [None, 20, 30, 40, 50],
        'min_samples_split': [2, 5, 10, 15],
        'min_samples_leaf': [1, 2, 4, 6],
        'max_features': ['auto', 'sqrt', 'log2']
    }
    
    # Create a RandomForestRegressor
    rf = RandomForestRegressor(random_state=42)
    
    # Set up GridSearchCV for hyperparameter tuning
    print("Starting hyperparameter tuning...")
    grid_search = GridSearchCV(
        estimator=rf,
        param_grid=param_grid,
        cv=5,  # 5-fold cross-validation
        n_jobs=-1,
        verbose=2,
        scoring='r2',
        return_train_score=True
    )
    
    # Train the model
    print("Starting model training...")
    grid_search.fit(X_train, y_train)
    print("Model training completed!")
    
    # Get the best model
    best_model = grid_search.best_estimator_
    
    # Evaluate the model on training data
    y_train_pred = best_model.predict(X_train)
    train_r2 = r2_score(y_train, y_train_pred)
    train_mse = mean_squared_error(y_train, y_train_pred)
    train_mae = mean_absolute_error(y_train, y_train_pred)
    
    # Evaluate the model on test data
    y_test_pred = best_model.predict(X_test)
    test_r2 = r2_score(y_test, y_test_pred)
    test_mse = mean_squared_error(y_test, y_test_pred)
    test_mae = mean_absolute_error(y_test, y_test_pred)
    
    # Print detailed evaluation metrics
    print("\nModel Evaluation Results:")
    print(f"Best Parameters: {grid_search.best_params_}")
    print("\nTraining Set Performance:")
    print(f"R2 Score: {train_r2:.4f}")
    print(f"Mean Squared Error: {train_mse:.4f}")
    print(f"Mean Absolute Error: {train_mae:.4f}")
    print(f"Training Accuracy: {100 * (1 - train_mae / 100):.2f}%")
    
    print("\nTest Set Performance:")
    print(f"R2 Score: {test_r2:.4f}")
    print(f"Mean Squared Error: {test_mse:.4f}")
    print(f"Mean Absolute Error: {test_mae:.4f}")
    print(f"Test Accuracy: {100 * (1 - test_mae / 100):.2f}%")



if __name__ == "__main__":
    # Create necessary directories
    os.makedirs('../model', exist_ok=True)
    
    # Load and process data
    train_df, test_df = load_and_process_data()
    
    # Train the model
    train_model(train_df, test_df)