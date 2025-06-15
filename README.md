# NutriScore - Personalized Food Health Scoring System

![NutriScore Logo](nextjs-frontend/public/images/bagman2.png)

## 🌟 Overview

NutriScore is an innovative web application that provides personalized health scores for food products based on your individual health profile. Unlike generic nutrition apps, NutriScore takes into account your specific health conditions, age, weight, and other factors to give you truly personalized recommendations.

### Key Features

- 📱 **Personalized Health Scoring**: Get health scores tailored to your specific health profile
- 📷 **Barcode Scanner**: Quickly scan product barcodes to get instant health scores
- 👤 **User Profiles**: Create and manage your health profile
- 📊 **Health Analytics**: Track your food choices and their impact on your health
- 🔍 **Product Search**: Look up products manually if scanning isn't possible
- 📈 **Health History**: View your past scans and track your progress

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamMohSami/nutrifyMe.git
   cd nutrifyMe
   ```

2. **Set up the Backend**
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Start the backend server
   cd backend
   python app.py
   ```

3. **Set up the Frontend**
   ```bash
   cd nextjs-frontend
   
   # Install dependencies
   npm install
   # or
   yarn install
   
   # Start the development server
   npm run dev
   # or
   yarn dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 💡 How It Works

### 1. User Profile Creation
- Sign up with your basic information
- Add your health metrics (weight, height, age)
- Specify any health conditions (diabetes, hypertension, etc.)

### 2. Product Scanning
- Use the barcode scanner to scan food products
- The app fetches product information from our database
- Our ML model calculates a personalized health score

### 3. Health Score Calculation
The health score (0-100) is calculated based on:
- Product nutritional content
- Your personal health profile
- Specific health conditions
- Recommended daily intake values

### 4. Results and Recommendations
- View detailed health score breakdown
- Get personalized recommendations
- Track your food choices over time

## 🛠️ Technical Architecture

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Three Fiber (for 3D models)
- HTML5 QR Code Scanner

### Backend
- Python Flask
- Scikit-learn
- Pandas
- NumPy
- OpenCV

### Machine Learning
- Random Forest Regressor
- Grid Search CV for hyperparameter tuning
- Feature engineering for personalized scoring

### Data Pipeline
1. Data acquisition from OpenFoodFacts API
2. Data processing and cleaning
3. User profile generation
4. Interaction dataset creation
5. Model training and evaluation

## 📊 Model Performance

Our machine learning model achieves:
- Training Accuracy: ~85%
- Test Accuracy: ~82%
- R² Score: 0.83
- Mean Absolute Error: < 5 points

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Mohammed Sami** - *Initial work* - [iamMohSami](https://github.com/iamMohSami)

## 🙏 Acknowledgments

- OpenFoodFacts for providing the product database
- The open-source community for various tools and libraries
- All contributors and users of NutriScore

## 📞 Support

For support, please:
1. Check the [Issues](https://github.com/iamMohSami/nutrifyMe/issues) section
2. Create a new issue if your problem isn't already listed
3. Contact the maintainers for urgent issues

---

Made with ❤️ for better health choices 