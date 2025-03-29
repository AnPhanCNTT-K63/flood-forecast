# Flood Prediction Project

## Overview
This project aims to predict floods using machine learning models based on past data. It consists of two main branches:
- **api+model**: Includes the dataset, trained model, FastAPI server, and Jupyter notebook for model training.
- **frontend**: A React-based web application to visualize flood predictions.

## Branches
### 1. `api+model`
This branch contains the backend logic for the flood prediction system, including:
- `dataset/` - The dataset used for training the model.
- `model/` - The trained machine learning model.
- `fast_api.py` - A FastAPI server to serve the model for predictions.
- `main.ipynb` - A Jupyter Notebook with model training and evaluation steps.
- `requirements.txt` - Dependencies required to run the backend.

#### Installation & Usage
1. Clone the repository and switch to the `api+model` branch:
   ```bash
   git clone -b api+model https://github.com/your-username/flood-prediction.git
   cd flood-prediction
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   uvicorn fast_api:app --host 0.0.0.0 --port 8000
   ```
4. API will be available at `http://localhost:8000` with documentation at `http://localhost:8000/docs`.

### 2. `frontend`
This branch contains the React-based web application to interact with the prediction model.

#### Installation & Usage
1. Clone the repository and switch to the `frontend` branch:
   ```bash
   git clone -b frontend https://github.com/your-username/flood-prediction.git
   cd flood-prediction
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. The web app will be available at `http://localhost:3000`.

   ![image](https://github.com/user-attachments/assets/aaafc488-eefb-4fc4-be33-c732efa31237)

## Contributing
Feel free to submit issues and pull requests to improve the project.

## License
This project is licensed under the MIT License.

---
### Author
[Phan Đức An] - [phanducan147@gmail.com]

