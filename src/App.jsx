import { useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Divider,
  Box,
  Grid,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";

const FAST_API_URL =
  import.meta.env.VITE_FAST_API_URL || "http://127.0.0.1:8000";

function App() {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [place, setPlace] = useState("");
  const [weatherForFloodPrediction, setWeatherForFloodPrediction] =
    useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);

  const estimateBrightSunshine = (data) => {
    const sunrise = data.city.sunrise;
    const sunset = data.city.sunset;
    const cloudCover = data.list[0].clouds.all;
    const totalDaylightHours = (sunset - sunrise) / 3600;
    return (totalDaylightHours * (1 - cloudCover / 100)).toFixed(9);
  };

  const getLocation = async () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          fetchWeather(position.coords.latitude, position.coords.longitude);
          fetchLocation(position);
        },
        (error) => {
          setLocation({ error: error.message });
          setLoading(false);
        }
      );
    } else {
      setLocation({ error: "Geolocation is not supported by this browser." });
    }
  };

  const fetchLocation = async (position) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
      );
      setPlace(`${res.data.address.city}, ${res.data.address.country}`);
    } catch (error) {
      alert(error);
    }
  };

  const fetchCoordinates = async () => {
    if (!place) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
      );
      if (res.data.length > 0) {
        const { lat, lon } = res.data[0];
        setLocation({ latitude: lat, longitude: lon });
        fetchWeather(lat, lon);
      } else {
        alert("Không tìm thấy địa điểm");
      }
    } catch (error) {
      alert("Lỗi khi lấy tọa độ: " + error.message);
    }
    setLoading(false);
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${
          import.meta.env.VITE_OPEN_WEATHER_KEY
        }&units=metric`
      );
      console.log(res.data);
      const weatherData = {
        Max_Temp: parseFloat(res.data.list[0].main.temp_max.toFixed(1)),
        Min_Temp: parseFloat(res.data.list[0].main.temp_min.toFixed(1)),
        Rainfall: res.data.list[0].rain?.["3h"] ?? 0 / 0.1,
        Relative_Humidity: res.data.list[0].main.humidity,
        Wind_Speed: parseFloat((res.data.list[0].wind.speed / 3.6).toFixed(9)),
        Cloud_Coverage: parseFloat(
          ((res.data.list[0].clouds.all * 8) / 100).toFixed(1)
        ),
        Bright_Sunshine: parseFloat(estimateBrightSunshine(res.data)),
      };
      setWeatherForFloodPrediction(weatherData);
    } catch (error) {
      alert("Error fetching weather data: " + error.message);
    }
    setLoading(false);
  };

  const predict = async () => {
    setPredictLoading(true);
    try {
      const res = await axios.post(
        `${FAST_API_URL}/predict`,
        weatherForFloodPrediction
      );
      console.log(res.data);
      setPrediction(res.data.Prediction);
    } catch (error) {
      alert("Prediction error: " + error.message);
    }
    setPredictLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Card sx={{ p: 3, boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                🌊 Dự báo lũ lụt 🌊
              </Typography>
              <TextField
                label="Nhập địa điểm"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
              <Button
                onClick={fetchCoordinates}
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mb: 2 }}
                disabled={loading || !place}
                startIcon={<SearchIcon />}
              >
                Lấy tọa độ từ địa điểm
              </Button>
              <Divider sx={{ my: 2 }}>Hoặc</Divider>

              <Button
                onClick={getLocation}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
                disabled={loading}
                startIcon={<LocationOnIcon />}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Dùng địa điểm hiện tại"
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          {weatherForFloodPrediction && (
            <Card sx={{ p: 3, boxShadow: 3, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6">
                  Dữ liệu thời tiết ở {place}:
                </Typography>
                {Object.entries(weatherForFloodPrediction).map(
                  ([key, value]) => (
                    <Typography
                      key={key}
                      variant="body2"
                    >{`${key}: ${value}`}</Typography>
                  )
                )}
              </CardContent>
            </Card>
          )}
          <Button
            onClick={predict}
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 3 }}
            disabled={!weatherForFloodPrediction || predictLoading}
          >
            {predictLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Dự Đoán Khả Năng Xảy Ra Lũ Lụt"
            )}
          </Button>
          {prediction !== null && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Kết quả: {prediction ? "Nguy hiểm" : "An toàn"}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
