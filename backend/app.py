from flask import Flask, request, jsonify
import joblib
import numpy as np
from utils import (
    get_product_by_barcode,
    extract_product_details,
    compute_features,
    get_model_metadata
)
import os
import logging
from datetime import datetime

# --- ADD THIS: CORS ---
from flask_cors import CORS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('nutriscore.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # <-- Enable CORS for all routes

# Get the root directory of the project
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load the model with error handling
try:
    model_path = os.path.join(root_dir, "model/health_score_model.pkl")
    model = joblib.load(model_path)
    logger.info(f"Successfully loaded model from {model_path}")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise SystemExit(f"Failed to load model: {str(e)}")

# Add model version endpoint
@app.route('/model/version', methods=['GET'])
def get_model_version():
    """Get current model version and metadata"""
    return jsonify(get_model_metadata())

@app.route('/predict', methods=['POST'])
def predict():
    try:
        start_time = datetime.now()
        data = request.get_json(force=True)
        
        # Input validation
        if not isinstance(data, dict):
            raise ValueError("Request body must be a JSON object")
            
        user_data = data.get("user")
        barcode = data.get("barcode")
        
        if not user_data:
            raise ValueError("'user' data is required")
        if not barcode:
            raise ValueError("'barcode' is required")
            
        # Log request
        logger.info(f"Prediction request received for barcode: {barcode}")
        
        # Get product details
        product = get_product_by_barcode(barcode)
        
        # Extract and validate product details
        product_details = extract_product_details(product)
        
        # Compute features
        features_dict = compute_features(user_data, product_details)
        
        # Prepare feature vector
        feature_vector = np.array([
            features_dict["age"],
            features_dict["weight"],
            features_dict["height"],
            features_dict["sugar_level"],
            features_dict["diabetes"],
            features_dict["hypertension"],
            features_dict["sugar"],
            features_dict["sodium"],
            features_dict["sugar_per_kg"],
            features_dict["sodium_per_kg"],
            features_dict["preservative_count"]
        ]).reshape(1, -1)
        
        # Get prediction
        health_score = model.predict(feature_vector)[0]
        
        # Log prediction
        logger.info(f"Prediction completed for barcode {barcode}. Score: {health_score:.2f}")
        
        response = {
            "health_score": float(health_score),
            "product_details": product_details,
            "computed_features": features_dict,
            "model_version": get_model_metadata()["version"],
            "prediction_time_ms": (datetime.now() - start_time).total_seconds() * 1000
        }
        
        return jsonify(response)
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({"error": str(e)}), 400
        
    except ConnectionError as e:
        logger.error(f"Connection error: {str(e)}")
        return jsonify({"error": "Failed to connect to product database"}), 503
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return jsonify({
            "error": "An unexpected error occurred",
            "details": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Test model prediction with dummy data
        test_data = {
            "age": 30,
            "weight": 70,
            "height": 170,
            "sugar_level": 90,
            "diabetes": 0,
            "hypertension": 0
        }
        test_product = {
            "code": "test",
            "product_name": "Test Product",
            "nutriments": {
                "sugars_100g": 5,
                "sodium_100g": 0.1
            }
        }
        
        test_features = compute_features(test_data, extract_product_details(test_product))
        test_vector = np.array([
            test_features["age"],
            test_features["weight"],
            test_features["height"],
            test_features["sugar_level"],
            test_features["diabetes"],
            test_features["hypertension"],
            test_features["sugar"],
            test_features["sodium"],
            test_features["sugar_per_kg"],
            test_features["sodium_per_kg"],
            test_features["preservative_count"]
        ]).reshape(1, -1)
        
        # Try to get a prediction
        model.predict(test_vector)
        
        return jsonify({
            "status": "healthy",
            "model_version": get_model_metadata()["version"],
            "last_updated": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}", exc_info=True)
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        raise