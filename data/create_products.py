import pandas as pd

# Create sample product data
products_data = {
    'barcode': ['5018374350930', '5018374350931', '5018374350932', '5018374350933', '5018374350934'],
    'product_name': ['Chocolate Bar', 'Apple Juice', 'Whole Grain Bread', 'Chips', 'Yogurt'],
    'sugar_g': [25, 20, 10, 30, 15],
    'sodium_mg': [50, 10, 200, 600, 100],
    'preservatives': ['sodium benzoate', 'sodium benzoate', 'none', 'sodium benzoate, potassium sorbate', 'none'],
    'calories_per_100g': [500, 50, 200, 550, 80],
    'protein_g': [2, 0, 10, 1, 5],
    'fat_g': [30, 0, 2, 30, 3],
    'fiber_g': [2, 1, 5, 1, 2],
    'weight_g': [100, 200, 500, 150, 200]
}

# Create DataFrame
products_df = pd.DataFrame(products_data)

# Save to CSV in the data directory
products_df.to_csv('data/products.csv', index=False)