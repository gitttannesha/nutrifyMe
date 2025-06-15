# backend/utils.py

import requests

def get_product_by_barcode(barcode):
    """
    Fetch product details from Open Food Facts using the product barcode.
    URL format: https://world.openfoodfacts.org/api/v0/product/<barcode>.json
    """
    if not barcode:
        raise ValueError("Barcode cannot be empty")
    try:
        barcode = str(barcode)  # Ensure barcode is a string
        if not barcode.isdigit():
            raise ValueError("Barcode must contain only digits")
            
        url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == 1:  # product is found
                return data.get("product", {})
            else:
                raise ValueError(f"Product not found for barcode: {barcode}")
        else:
            raise requests.exceptions.HTTPError(
                f"HTTP {response.status_code} error fetching product data"
            )
            
    except requests.exceptions.RequestException as e:
        raise ConnectionError(f"Failed to fetch product data: {str(e)}")
    except ValueError as e:
        raise ValueError(f"Invalid barcode format: {str(e)}")

def extract_product_details(product):
    """
    Extract key product details required by the system.
    """
    if not product:
        raise ValueError("Product data cannot be empty")
        
    # Validate required fields
    required_fields = {
        "code": "barcode",
        "product_name": "product name",
        "nutriments": "nutritional information"
    }
    
    missing_fields = [field for field, desc in required_fields.items() 
                     if field not in product]
    if missing_fields:
        missing_desc = ", ".join(required_fields[field] for field in missing_fields)
        raise ValueError(f"Missing required product fields: {missing_desc}")
        
    # Extract nutritional data with validation
    nutriments = product.get("nutriments", {})
    try:
        sugar = float(nutriments.get("sugars_100g", 0))
        sodium = float(nutriments.get("sodium_100g", 0))
        
        if sugar < 0 or sodium < 0:
            raise ValueError("Negative values found in nutritional data")
            
    except (ValueError, TypeError):
        raise ValueError("Invalid numerical values in nutritional data")
        
    details = {
        "barcode": product["code"],
        "name": product["product_name"],
        "sugar": sugar,
        "sodium": sodium,
        "ingredients": product.get("ingredients_text", "")
    }
    return details

def compute_features(user_data, product_details):
    """
    Compute the features required for the ML model by combining user data and product details.
    
    Args:
        user_data: dict containing user health information
        product_details: dict containing product nutritional data
        
    Returns:
        dict: dictionary of computed features
    """
    if not user_data or not product_details:
        raise ValueError("Both user data and product details are required")
        
    # Validate user data
    required_user_fields = ["age", "weight", "height", "sugar_level", "diabetes", "hypertension"]
    missing_fields = [field for field in required_user_fields if field not in user_data]
    if missing_fields:
        raise ValueError(f"Missing required user fields: {', '.join(missing_fields)}")
        
    try:
        # Convert all numeric values to float
        age = float(user_data["age"])
        weight = float(user_data["weight"])
        height = float(user_data["height"])
        sugar_level = float(user_data["sugar_level"])
        
        # Validate ranges
        if not (0 < age <= 150):
            raise ValueError("Invalid age value")
        if not (20 <= weight <= 500):
            raise ValueError("Invalid weight value")
        if not (50 <= height <= 250):
            raise ValueError("Invalid height value")
            
    except (ValueError, TypeError):
        raise ValueError("Invalid numerical values in user data")
        
    # Get product data
    sugar = product_details.get("sugar", 0)
    sodium = product_details.get("sodium", 0)
    
    # Compute normalized features
    sugar_per_kg = sugar / weight if weight > 0 else 0
    sodium_per_kg = sodium / weight if weight > 0 else 0
    
    # Count harmful preservatives
    harmful_preservatives = [
        "sodium nitrate", "aspartame", "high fructose corn syrup",
        "sodium benzoate", "potassium sorbate", "sodium propionate"
    ]
    ingredients_text = product_details.get("ingredients", "").lower()
    preservative_count = sum(1 for pres in harmful_preservatives if pres in ingredients_text)
    
    features = {
        "age": age,
        "weight": weight,
        "height": height,
        "sugar_level": sugar_level,
        "diabetes": int(bool(user_data["diabetes"])),
        "hypertension": int(bool(user_data["hypertension"])),
        "sugar": sugar,
        "sodium": sodium,
        "sugar_per_kg": sugar_per_kg,
        "sodium_per_kg": sodium_per_kg,
        "preservative_count": preservative_count
    }
    return features

# Model versioning
MODEL_VERSION = "1.0.0"
MODEL_METADATA = {
    "version": MODEL_VERSION,
    "training_date": "2025-04-21",
    "metrics": {
        "r2_score": 0.9920,
        "mse": 0.0700,
        "mae": 0.1390,
        "accuracy": 0.9986
    }
}

def get_model_metadata():
    """Get metadata about the current model version"""
    return MODEL_METADATA
