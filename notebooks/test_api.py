import requests
import json

# Test data
test_data = {
    "user": {
        "age": 25,
        "weight": 70,
        "height": 175,
        "sugar_level": 90,
        "diabetes": 0,
        "hypertension": 0
    },
    "barcode": "5018374350930"  # This is the barcode for Chocolate Bar in our dataset
}

# Make the API call
response = requests.post("http://localhost:5000/predict", json=test_data)

# Print the response
print("API Response:")
print(json.dumps(response.json(), indent=2))