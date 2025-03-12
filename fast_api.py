from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to restrict specific domains
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Load the trained model
model = joblib.load("model/best_model_rdfr.pkl")


class FloodPredictionInput(BaseModel):
    Max_Temp: float
    Min_Temp: float
    Rainfall: float
    Relative_Humidity: float
    Wind_Speed: float
    Cloud_Coverage: float
    Bright_Sunshine: float


@app.post("/predict")
def predict_flood(data: FloodPredictionInput):
    input_data = np.array(
        [
            [
                data.Max_Temp,
                data.Min_Temp,
                data.Rainfall,
                data.Relative_Humidity,
                data.Wind_Speed,
                data.Cloud_Coverage,
                data.Bright_Sunshine,
            ]
        ]
    )

    prediction = model.predict(input_data)

    return {"Prediction": bool(prediction[0])}


# uvicorn fast_api:app --reload
