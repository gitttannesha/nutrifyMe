import streamlit as st
import cv2
from PIL import Image
import numpy as np
from pyzbar.pyzbar import decode
import requests
import json
import time

# Initialize session state
if 'barcode' not in st.session_state:
    st.session_state.barcode = ""

# Set page configuration
st.set_page_config(
    page_title="NutriScore Calculator",
    page_icon="🍎",
    layout="wide"
)

# Add some styling
st.markdown(
    """
    <style>
    .stTextInput>div>div>input {
        font-size: 16px;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
    }
    .stButton>button {
        font-size: 16px;
        padding: 12px 24px;
        border-radius: 8px;
        background-color: #4CAF50;
        color: white;
    }
    .stButton>button:hover {
        background-color: #45a049;
    }
    .health-score {
        font-size: 48px;
        font-weight: bold;
        color: green;
    }
    .product-info {
        font-size: 16px;
        padding: 10px;
        border-radius: 8px;
        background-color: #f5f5f5;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Create a function to scan barcode
def scan_barcode():
    # Create a placeholder for the image
    placeholder = st.empty()
    
    # Initialize camera
    cap = cv2.VideoCapture(0)
    
    # Add a stop button for the user
    stop_button = st.button("Stop Scanning")
    
    # Add a container for the camera feed
    container = st.container()
    container.markdown('<div style="text-align: center; margin: 1rem 0;">Press "Stop Scanning" button to close the camera</div>', unsafe_allow_html=True)
    
    while True:
        # Read frame from camera
        success, frame = cap.read()
        if not success:
            break
            
        # Make a copy of the frame for drawing
        frame_with_lines = frame.copy()
        
        # Decode barcodes
        decoded_objects = decode(frame)
        
        for obj in decoded_objects:
            barcode_data = obj.data.decode('utf-8')
            
            # Get the bounding box points
            points = obj.polygon
            
            # If the points do not form a quad, find convex hull
            if len(points) > 4:
                hull = cv2.convexHull(np.array([point for point in points], dtype=np.int32))
                hull = np.squeeze(hull)
            else:
                hull = np.array([point for point in points], dtype=np.int32)
            
            # Draw the convex hull on the frame copy
            n = len(hull)
            for j in range(0, n):
                # Convert points to int
                p1 = (int(hull[j][0]), int(hull[j][1]))
                p2 = (int(hull[(j + 1) % n][0]), int(hull[(j + 1) % n][1]))
                cv2.line(frame_with_lines, p1, p2, (255, 0, 0), 3)
            
            # Display barcode data
            st.success(f"Barcode detected: {barcode_data}")
            
            # Update session state with scanned barcode
            st.session_state.barcode = barcode_data
            
            # Close camera and break loop
            cap.release()
            cv2.destroyAllWindows()
            return barcode_data
            
        # Convert frame to RGB for display
        frame_rgb = cv2.cvtColor(frame_with_lines, cv2.COLOR_BGR2RGB)
        
        # Display the frame
        placeholder.image(frame_rgb, channels="RGB", use_container_width=True)
        
        # Check if stop button was pressed
        if stop_button:
            break
            
        # Small delay to prevent CPU overload
        time.sleep(0.03)
    
    # Ensure camera is properly released
    cap.release()
    cv2.destroyAllWindows()
    return None

# Create a function to get health score
def get_health_score(barcode, user_data):
    try:
        response = requests.post(
            "http://localhost:5000/predict",
            json={"user": user_data, "barcode": barcode},
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

# Create a function to get model version
def get_model_version():
    try:
        response = requests.get(
            "http://localhost:5000/model/version",
            timeout=5
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

# Create a function to check system health
def check_system_health():
    try:
        response = requests.get(
            "http://localhost:5000/health",
            timeout=5
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

# Main content
st.title("NutriScore Calculator 🍏")

# Add model version and health status info
with st.expander("System Status", expanded=False):
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("**Model Version**")
        model_info = get_model_version()
        if "error" in model_info:
            st.error(f"Failed to get model version: {model_info['error']}")
        else:
            st.info(f"Version: {model_info['version']}\n"
                   f"Training Date: {model_info['training_date']}\n"
                   f"Accuracy: {model_info['metrics']['accuracy']:.2%}")
    
    with col2:
        st.markdown("**System Health**")
        health_info = check_system_health()
        if "error" in health_info:
            st.error(f"Failed to check system health: {health_info['error']}")
        else:
            status = "✅ Healthy" if health_info['status'] == "healthy" else "❌ Unhealthy"
            st.info(f"Status: {status}\n"
                   f"Last Updated: {health_info['last_updated']}")

# User Information Section
st.header("Your Health Profile")
col1, col2 = st.columns(2)
with col1:
    age = st.number_input("Age", min_value=1, max_value=150, value=30)
    weight = st.number_input("Weight (kg)", min_value=1, max_value=500, value=70)
    height = st.number_input("Height (cm)", min_value=1, max_value=300, value=170)
    sugar_level = st.number_input("Sugar Level", min_value=0, max_value=500, value=90)
with col2:
    diabetes = st.checkbox("Do you have diabetes?")
    hypertension = st.checkbox("Do you have hypertension?")
    st.write("")  # Add some space
    st.write("")  # Add some space
    st.write("")  # Add some space
    st.write("")  # Add some space

# Product Information Section
st.header("Product Information")
# Use session state for barcode input
barcode = st.text_input("Enter Product Barcode", value=st.session_state.barcode, placeholder="e.g., 5018374350930")

# Scan Barcode Button
if st.button("Scan Barcode"):
    with st.spinner("Scanning..."):
        scan_barcode()

# Calculate Health Score
def calculate_health_score(user_data, barcode):
    with st.spinner("Calculating health score..."):
        try:
            result = get_health_score(barcode, user_data)
            if "error" in result:
                st.error(f"Error calculating score: {result['error']}")
                return None
                
            score = result["health_score"]
            product_details = result["product_details"]
            features = result["computed_features"]
            
            # Display health score with color coding
            score_color = "#4CAF50" if score >= 80 else "#FFA500" if score >= 60 else "#FF4444"
            st.markdown(f"<div class='health-score' style='color: {score_color};'>Health Score: {score:.1f}</div>", unsafe_allow_html=True)
            
            # Display product information
            st.markdown("<div class='product-info'>", unsafe_allow_html=True)
            st.write(f"**Product Name:** {product_details['name']}")
            st.write(f"**Barcode:** {product_details['barcode']}")
            st.write(f"**Sugar Content:** {features['sugar']:.1f}g per 100g")
            st.write(f"**Sodium Content:** {features['sodium']:.1f}mg per 100g")
            st.write(f"**Preservatives:** {features['preservative_count']}")
            st.markdown("</div>", unsafe_allow_html=True)
            
            # Display prediction details
            with st.expander("Prediction Details", expanded=False):
                st.write("**Feature Values:**")
                st.json(features)
                st.write("**Model Version:**", result.get("model_version", "N/A"))
                st.write("**Prediction Time:**", f"{result.get('prediction_time_ms', 0):.2f}ms")
                
            return score
            
        except Exception as e:
            st.error(f"Error: {str(e)}")
            return None

def main():
    # Add a button to calculate health score
    if st.button("Calculate Health Score"):
        if not st.session_state.barcode:
            st.error("Please scan or enter a barcode first")
            return
            
        if not all([age, weight, height, sugar_level]):
            st.error("Please fill in all user information")
            return
            
        user_data = {
            "age": age,
            "weight": weight,
            "height": height,
            "sugar_level": sugar_level,
            "diabetes": 1 if diabetes else 0,
            "hypertension": 1 if hypertension else 0
        }
        
        calculate_health_score(user_data, st.session_state.barcode)

    # Add instructions
    st.markdown("""
## How to Use:
1. Enter your health profile details (age, weight, etc.)
2. Click "Scan Barcode" and hold your product in front of the camera
3. Once the barcode is detected, it will automatically fill in the barcode field
4. Click "Calculate Health Score" to get your personalized health score
5. View your personalized health score and product details

## Tips:
- Make sure the barcode is well-lit
- Hold the product steady
- The barcode should be in focus
- Try different angles if it's not detected

## About Us:
Nutrify is a health and nutrition app that helps you make healthier choices.
""")

if __name__ == "__main__":
    main()
