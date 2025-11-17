import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherPrediction = () => {
  const [formData, setFormData] = useState({
    temp_min: '',
    temp_max: '',
    precipitation: '',
    wind: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('Ready');
  const [weatherChartData, setWeatherChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('prediction');

  // Load chart data on component mount
  useEffect(() => {
    loadWeatherChartData();
  }, []);

  const loadWeatherChartData = async () => {
    try {
      console.log('Loading weather chart data...');
      setChartLoading(true);
      const response = await fetch('http://localhost:5000/weather-chart-data');
      console.log('Weather chart data response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Weather chart data loaded:', data);
        setWeatherChartData(data);
      } else {
        console.error('Weather chart data response not ok:', response.status);
      }
    } catch (err) {
      console.error('Error loading weather chart data:', err);
    } finally {
      setChartLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setApiStatus('Connecting...');

    try {
      console.log('Submitting weather prediction request:', formData);
      setApiStatus('Processing...');
      
      const response = await fetch('http://localhost:5000/predict-weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Weather prediction response status:', response.status);
      setApiStatus(`Response: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log('Weather prediction result:', data);
        setPrediction(data);
        setApiStatus('Success');
      } else {
        const errorData = await response.json();
        console.error('Weather prediction error:', errorData);
        setError(errorData.error || 'Failed to get weather prediction');
        setApiStatus('Error');
      }
    } catch (err) {
      console.error('Weather prediction request failed:', err);
      setError('Network error: Unable to connect to weather prediction service');
      setApiStatus('Connection Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      temp_min: '',
      temp_max: '',
      precipitation: '',
      wind: ''
    });
    setPrediction(null);
    setError(null);
    setApiStatus('Ready');
  };

  const getWeatherIcon = (weather) => {
    if (!weather) return '🌦️';
    const weatherLower = weather.toLowerCase();
    if (weatherLower.includes('sunny') || weatherLower.includes('clear')) return '☀️';
    if (weatherLower.includes('cloudy') || weatherLower.includes('overcast')) return '☁️';
    if (weatherLower.includes('rain') || weatherLower.includes('drizzle')) return '🌧️';
    if (weatherLower.includes('storm') || weatherLower.includes('thunder')) return '⛈️';
    if (weatherLower.includes('snow')) return '❄️';
    if (weatherLower.includes('fog') || weatherLower.includes('mist')) return '🌫️';
    return '🌦️';
  };

  const getWeatherColor = (weather) => {
    if (!weather) return 'text-blue-600 bg-blue-100';
    const weatherLower = weather.toLowerCase();
    if (weatherLower.includes('sunny') || weatherLower.includes('clear')) return 'text-yellow-600 bg-yellow-100';
    if (weatherLower.includes('cloudy') || weatherLower.includes('overcast')) return 'text-gray-600 bg-gray-100';
    if (weatherLower.includes('rain') || weatherLower.includes('drizzle')) return 'text-blue-600 bg-blue-100';
    if (weatherLower.includes('storm') || weatherLower.includes('thunder')) return 'text-purple-600 bg-purple-100';
    if (weatherLower.includes('snow')) return 'text-blue-200 bg-blue-200';
    if (weatherLower.includes('fog') || weatherLower.includes('mist')) return 'text-gray-500 bg-gray-100';
    return 'text-blue-600 bg-blue-100';
  };

  const generateWeatherChart = (variable) => {
    if (!weatherChartData || !weatherChartData.dates || !weatherChartData[variable]) return null;

    // Get last 50 values
    const dates = weatherChartData.dates.slice(-50);
    const values = weatherChartData[variable].slice(-50);

    const data = {
      labels: dates,
      datasets: [{
        label: variable === 'temp_min' ? 'Minimum Temperature (°C)' :
               variable === 'temp_max' ? 'Maximum Temperature (°C)' :
               variable === 'precipitation' ? 'Precipitation (mm)' :
               variable === 'wind' ? 'Wind Speed (m/s)' : variable,
        data: values,
        borderColor: variable === 'temp_min' ? '#FF6B6B' :
                    variable === 'temp_max' ? '#4ECDC4' :
                    variable === 'precipitation' ? '#45B7D1' :
                    variable === 'wind' ? '#96CEB4' : '#0F2C59',
        backgroundColor: variable === 'temp_min' ? 'rgba(255, 107, 107, 0.1)' :
                        variable === 'temp_max' ? 'rgba(78, 205, 196, 0.1)' :
                        variable === 'precipitation' ? 'rgba(69, 183, 209, 0.1)' :
                        variable === 'wind' ? 'rgba(150, 206, 180, 0.1)' : 'rgba(15, 44, 89, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0,
        pointBackgroundColor: variable === 'temp_min' ? '#FF6B6B' :
                            variable === 'temp_max' ? '#4ECDC4' :
                            variable === 'precipitation' ? '#45B7D1' :
                            variable === 'wind' ? '#96CEB4' : '#0F2C59',
        pointBorderColor: variable === 'temp_min' ? '#FF6B6B' :
                         variable === 'temp_max' ? '#4ECDC4' :
                         variable === 'precipitation' ? '#45B7D1' :
                         variable === 'wind' ? '#96CEB4' : '#0F2C59',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: variable === 'temp_min' ? '#FF6B6B' :
                                 variable === 'temp_max' ? '#4ECDC4' :
                                 variable === 'precipitation' ? '#45B7D1' :
                                 variable === 'wind' ? '#96CEB4' : '#0F2C59',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3
      }]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'rect',
            padding: 20,
            font: {
              size: 14,
              weight: 'bold',
              color: '#0F2C59'
            }
          }
        },
        title: {
          display: true,
          text: `${variable === 'temp_min' ? 'Minimum Temperature' :
                 variable === 'temp_max' ? 'Maximum Temperature' :
                 variable === 'precipitation' ? 'Precipitation' :
                 variable === 'wind' ? 'Wind Speed' : variable} Over Time (Last 50 Days)`,
          color: '#0F2C59',
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 20,
            bottom: 30
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 44, 89, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#0F2C59',
          borderWidth: 2,
          cornerRadius: 8,
          displayColors: false,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          padding: 12
        }
      },
      scales: {
        y: {
          beginAtZero: variable === 'precipitation' || variable === 'wind',
          ticks: {
            color: '#666666',
            font: {
              size: 12,
              weight: '500'
            },
            padding: 10
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1,
            drawBorder: false
          },
          title: {
            display: true,
            text: variable === 'temp_min' ? 'Temperature (°C)' :
                  variable === 'temp_max' ? 'Temperature (°C)' :
                  variable === 'precipitation' ? 'Precipitation (mm)' :
                  variable === 'wind' ? 'Wind Speed (m/s)' : 'Value',
            color: '#0F2C59',
            font: {
              size: 14,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          }
        },
        x: {
          ticks: {
            color: '#666666',
            font: {
              size: 12,
              weight: '500'
            },
            padding: 10,
            maxRotation: 45,
            minRotation: 0
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1,
            drawBorder: false
          },
          title: {
            display: true,
            text: 'Date',
            color: '#0F2C59',
            font: {
              size: 14,
              weight: 'bold'
            },
            padding: {
              top: 20,
              bottom: 10
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      elements: {
        line: {
          tension: 0
        }
      }
    };

    return <Line data={data} options={options} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-cream to-water-warm">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-water-blue mb-4 flex items-center justify-center">
            <span className="mr-4">🌦️</span>
            Weather Prediction System
          </h1>
          <p className="text-xl text-water-light max-w-4xl mx-auto">
            Enter today's weather parameters to predict tomorrow's weather condition using Gaussian Naive Bayes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-water-pale">
            <h2 className="text-2xl font-semibold text-water-blue mb-6 flex items-center">
              <span className="mr-3">🌡️</span>
              Weather Parameters
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Temperature Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-water-blue">
                    Minimum Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="temp_min"
                    value={formData.temp_min}
                    onChange={handleInputChange}
                    placeholder="Enter minimum temperature"
                    className="w-full px-4 py-3 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-water-blue">
                    Maximum Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="temp_max"
                    value={formData.temp_max}
                    onChange={handleInputChange}
                    placeholder="Enter maximum temperature"
                    className="w-full px-4 py-3 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                    required
                  />
                </div>
              </div>

              {/* Precipitation */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-water-blue">
                  Precipitation (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  name="precipitation"
                  value={formData.precipitation}
                  onChange={handleInputChange}
                  placeholder="Enter precipitation amount"
                  className="w-full px-4 py-3 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                  required
                />
              </div>

              {/* Wind Speed */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-water-blue">
                  Wind Speed (m/s)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  name="wind"
                  value={formData.wind}
                  onChange={handleInputChange}
                  placeholder="Enter wind speed"
                  className="w-full px-4 py-3 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-water-blue text-white py-3 px-6 rounded-lg font-semibold hover:bg-water-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Predicting...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🔮</span>
                      Predict Tomorrow's Weather
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border-2 border-water-blue text-water-blue rounded-lg font-semibold hover:bg-water-blue hover:text-white transition-all duration-200"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-water-pale">
            <h2 className="text-2xl font-semibold text-water-blue mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Weather Forecast
            </h2>

            {/* API Status */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm font-medium">
                🔗 API Status: {apiStatus}
              </p>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-water-blue"></div>
                <p className="mt-4 text-water-light">Analyzing weather patterns...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                  <span className="text-red-500 text-2xl mr-3">⚠️</span>
                  <div>
                    <h3 className="text-red-800 font-semibold">Error</h3>
                    <p className="text-red-600 mt-1">{error}</p>
                    <p className="text-red-500 text-sm mt-2">
                      Make sure the Flask backend is running on http://localhost:5000
                    </p>
                  </div>
                </div>
              </div>
            )}

            {prediction && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-water-pale to-water-accent bg-opacity-30 rounded-lg p-6 border border-water-accent">
                  <h3 className="text-lg font-semibold text-water-blue mb-3">Tomorrow's Weather</h3>
                  <div className="text-center">
                    <div className="text-6xl mb-4">{getWeatherIcon(prediction.prediction)}</div>
                    <div className={`text-3xl font-bold p-4 rounded-lg ${getWeatherColor(prediction.prediction)}`}>
                      {prediction.prediction?.toUpperCase() || 'UNKNOWN'}
                    </div>
                    <p className="text-water-light mt-2">Predicted Weather Condition</p>
                    <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">
                        ✅ Prediction received from Flask server (Model: {prediction.model_type})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-water-neutral bg-opacity-50 rounded-lg p-4">
                  <h4 className="font-semibold text-water-blue mb-2">Model Information</h4>
                  <p className="text-water-light text-sm">
                    Model Type: {prediction.model_type || 'Gaussian Naive Bayes'}
                  </p>
                  <p className="text-water-light text-sm">
                    Data Source: {prediction.data_source || 'Weather Dataset'}
                  </p>
                  <p className="text-water-light text-sm">
                    Server: {prediction.server_timestamp || 'Unknown'}
                  </p>
                </div>

                <div className="bg-water-warm bg-opacity-30 rounded-lg p-4">
                  <h4 className="font-semibold text-water-blue mb-2">Input Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-water-light">Min Temp:</span>
                      <span className="text-water-blue font-medium">{prediction.input_features?.temp_min}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-water-light">Max Temp:</span>
                      <span className="text-water-blue font-medium">{prediction.input_features?.temp_max}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-water-light">Precipitation:</span>
                      <span className="text-water-blue font-medium">{prediction.input_features?.precipitation}mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-water-light">Wind Speed:</span>
                      <span className="text-water-blue font-medium">{prediction.input_features?.wind}m/s</span>
                    </div>
                  </div>
                </div>

                {/* Weather Tips */}
                <div className="bg-water-pale bg-opacity-30 rounded-lg p-4">
                  <h4 className="font-semibold text-water-blue mb-2">🌤️ Weather Tips</h4>
                  <div className="text-sm text-water-light">
                    {prediction.prediction?.toLowerCase().includes('sunny') && (
                      <p>• Perfect day for outdoor activities! Don't forget sunscreen.</p>
                    )}
                    {prediction.prediction?.toLowerCase().includes('rain') && (
                      <p>• Carry an umbrella and waterproof clothing.</p>
                    )}
                    {prediction.prediction?.toLowerCase().includes('cloudy') && (
                      <p>• Good weather for walking and light outdoor activities.</p>
                    )}
                    {prediction.prediction?.toLowerCase().includes('storm') && (
                      <p>• Stay indoors and avoid outdoor activities.</p>
                    )}
                    {prediction.prediction?.toLowerCase().includes('snow') && (
                      <p>• Dress warmly and be careful on slippery surfaces.</p>
                    )}
                    {!prediction.prediction?.toLowerCase().includes('sunny') && 
                     !prediction.prediction?.toLowerCase().includes('rain') && 
                     !prediction.prediction?.toLowerCase().includes('cloudy') && 
                     !prediction.prediction?.toLowerCase().includes('storm') && 
                     !prediction.prediction?.toLowerCase().includes('snow') && (
                      <p>• Check local weather updates for detailed conditions.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && !prediction && (
              <div className="text-center py-12 text-water-light">
                <div className="text-6xl mb-4">🌦️</div>
                <p className="text-lg">Enter weather parameters and click "Predict Tomorrow's Weather" to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* Weather Charts Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl border border-water-pale">
          <div className="flex border-b border-water-pale">
            <button
              type="button"
              onClick={() => setActiveChart('prediction')}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                activeChart === 'prediction' 
                  ? 'bg-water-blue text-white' 
                  : 'text-water-blue hover:bg-water-pale'
              }`}
            >
              🌦️ Weather Prediction
            </button>
            <button
              type="button"
              onClick={() => setActiveChart('temp_min')}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                activeChart === 'temp_min' 
                  ? 'bg-water-blue text-white' 
                  : 'text-water-blue hover:bg-water-pale'
              }`}
            >
              🌡️ Min Temperature
            </button>
            <button
              type="button"
              onClick={() => setActiveChart('temp_max')}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                activeChart === 'temp_max' 
                  ? 'bg-water-blue text-white' 
                  : 'text-water-blue hover:bg-water-pale'
              }`}
            >
              🌡️ Max Temperature
            </button>
            <button
              type="button"
              onClick={() => setActiveChart('precipitation')}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                activeChart === 'precipitation' 
                  ? 'bg-water-blue text-white' 
                  : 'text-water-blue hover:bg-water-pale'
              }`}
            >
              🌧️ Precipitation
            </button>
            <button
              type="button"
              onClick={() => setActiveChart('wind')}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                activeChart === 'wind' 
                  ? 'bg-water-blue text-white' 
                  : 'text-water-blue hover:bg-water-pale'
              }`}
            >
              💨 Wind Speed
            </button>
          </div>

          <div className="p-8">
            {activeChart === 'prediction' ? (
              <div className="text-center py-12 text-water-light">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-lg">Select a chart tab above to view weather data trends</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border border-water-pale">
                {chartLoading ? (
                  <div className="text-center py-12 text-water-light">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-water-blue mb-4"></div>
                    <p>Loading weather chart data...</p>
                  </div>
                ) : weatherChartData ? (
                  <div className="h-[500px] w-full">
                    {generateWeatherChart(activeChart)}
                  </div>
                ) : (
                  <div className="text-center py-12 text-water-light">
                    <div className="text-4xl mb-4">❌</div>
                    <p>Failed to load weather chart data</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-water-light">
          <p className="text-sm">
            Developed by Mondli Ntuthuko Gabela | Full-stack AI Developer
          </p>
          <p className="text-xs mt-2 opacity-75">
            Machine Learning | Web Applications | Weather Forecasting
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherPrediction;