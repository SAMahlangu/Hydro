import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DroughtPrediction = () => {
  const [formData, setFormData] = useState({
    PS: 1010.0,
    QV2M: 10.0,
    T2M: 25.0,
    T2MDEW: 20.0,
    T2M_MAX: 30.0,
    T2M_MIN: 15.0,
    T2M_RANGE: 15.0,
    TS: 25.0,
    WS10M: 5.0,
    WS10M_RANGE: 2.0,
    WS50M: 8.0,
    WS50M_MAX: 10.0,
    WS50M_RANGE: 3.0,
    YEAR: 2025.0,
    DATE: 1.0
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('Ready');
  const [chartType, setChartType] = useState('prediction');
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [variableData, setVariableData] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);

  const droughtCategories = {
    0: "Abnormally Dry",
    1: "Moderate Drought",
    2: "Severe Drought", 
    3: "Extreme Drought",
    4: "Exceptional Drought"
  };

  const droughtColors = {
    0: "text-green-600 bg-green-100",
    1: "text-yellow-600 bg-yellow-100", 
    2: "text-orange-600 bg-orange-100",
    3: "text-red-600 bg-red-100",
    4: "text-red-800 bg-red-200"
  };

  const droughtIcons = {
    0: "🌱",
    1: "⚠️", 
    2: "🔥",
    3: "💧",
    4: "🚨"
  };

  // Load chart data on component mount
  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      console.log('Loading drought chart data...');
      setChartLoading(true);
      
      // Load time series data
      const timeSeriesResponse = await fetch('http://16.171.150.121/drought-timeseries-data');
      if (timeSeriesResponse.ok) {
        const timeSeriesData = await timeSeriesResponse.json();
        setTimeSeriesData(timeSeriesData);
      }

      // Load variable data
      const variableResponse = await fetch('http://16.171.150.121/drought-variable-data');
      if (variableResponse.ok) {
        const variableData = await variableResponse.json();
        setVariableData(variableData);
      }
    } catch (err) {
      console.error('Error loading chart data:', err);
    } finally {
      setChartLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    console.log('Submitting drought prediction form data:', formData);
    setApiStatus('Calling Flask API...');

    try {
      console.log('Making API call to Flask server for drought prediction...');
      const response = await fetch('http://16.171.150.121/predict-drought', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      setApiStatus(`Flask API responded with status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      setPrediction(result);
      setApiStatus('✅ Successfully received prediction from Flask server');
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
      setApiStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      PS: 1010.0,
      QV2M: 10.0,
      T2M: 25.0,
      T2MDEW: 20.0,
      T2M_MAX: 30.0,
      T2M_MIN: 15.0,
      T2M_RANGE: 15.0,
      TS: 25.0,
      WS10M: 5.0,
      WS10M_RANGE: 2.0,
      WS50M: 8.0,
      WS50M_MAX: 10.0,
      WS50M_RANGE: 3.0,
      YEAR: 2025.0,
      DATE: 1.0
    });
    setPrediction(null);
    setError(null);
    setApiStatus('Ready');
  };

  const generateTimeSeriesChart = () => {
    if (!timeSeriesData) return null;

    const data = {
      labels: timeSeriesData.labels,
      datasets: [{
        label: 'Drought Score',
        data: timeSeriesData.values,
        borderColor: '#0F2C59',
        backgroundColor: 'rgba(15, 44, 89, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0,
        pointBackgroundColor: '#0F2C59',
        pointBorderColor: '#0F2C59',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#0F2C59',
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
          text: 'Drought Score Over Time',
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
          beginAtZero: true,
          max: 10,
          ticks: {
            stepSize: 1,
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
            text: 'Drought Score',
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

  const generateVariableChart = () => {
    if (!variableData) return null;

    const colors = ['#0F2C59', '#3D5B90', '#7390D8', '#A2C5FD', '#F8F0E5', '#EADFB4', '#F4EBDA', '#E5DDC8', '#D6C8A1', '#C7B97A', '#A8C8A1', '#8BB88A', '#6CA873', '#4D985C', '#2E8845'];

    const data = {
      labels: variableData.labels,
      datasets: [{
        label: 'Variable Values',
        data: variableData.values,
        backgroundColor: colors.slice(0, variableData.labels.length),
        borderColor: '#0F2C59',
        borderWidth: 1
      }]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: chartType.includes('Bar') ? 'Environmental Variables Distribution' : 
                chartType.includes('Pie') ? 'Relative Variable Influence' : 
                'Environmental Variables Distribution',
          color: '#0F2C59',
          font: {
            size: 16
          }
        },
      },
      scales: chartType.includes('Pie') ? {} : {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Variable Value',
            color: '#0F2C59'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Environmental Variables',
            color: '#0F2C59'
          }
        }
      }
    };

    if (chartType.includes('Bar')) {
      return <Bar data={data} options={options} />;
    } else if (chartType.includes('Pie')) {
      return <Pie data={data} options={options} />;
    }
    return <Bar data={data} options={options} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-cream to-water-warm">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-water-blue mb-4">
            🌵 Drought Prediction System
          </h1>
          <p className="text-xl text-water-light max-w-3xl mx-auto">
            Advanced Random Forest Model for Drought Severity Assessment and Environmental Analysis
          </p>
          <div className="mt-6 p-4 bg-water-pale bg-opacity-30 rounded-lg border border-water-accent">
            <p className="text-water-blue font-medium">
              Enter environmental parameters to predict drought severity using Random Forest classification
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-water-pale mb-8">
          <div className="flex border-b border-water-pale">
            <button
              type="button"
              onClick={() => setChartType('prediction')}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                chartType === 'prediction' 
                  ? 'bg-water-blue text-white' 
                  : 'text-water-blue hover:bg-water-pale'
              }`}
            >
              🌵 Drought Prediction
            </button>
            <button
              type="button"
              onClick={() => setChartType('time-series')}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                chartType === 'time-series' 
                  ? 'bg-water-blue text-white' 
                  : 'text-water-blue hover:bg-water-pale'
              }`}
            >
              📈 Time Series
            </button>
            <button
              type="button"
              onClick={() => setChartType('variables')}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                chartType === 'variables' 
                  ? 'bg-water-blue text-white' 
                  : 'text-water-blue hover:bg-water-pale'
              }`}
            >
              📊 Variables
            </button>
          </div>

          {/* Prediction Tab */}
          {chartType === 'prediction' && (
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-water-blue mb-6 flex items-center">
                    <span className="mr-3">🌡️</span>
                    Environmental Parameters
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {Object.entries(formData).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-medium text-water-blue">
                          {key === 'PS' ? 'Surface Pressure (PS)' :
                           key === 'QV2M' ? 'Specific Humidity (QV2M)' :
                           key === 'T2M' ? 'Mean Temperature (T2M)' :
                           key === 'T2MDEW' ? 'Dew Temperature (T2MDEW)' :
                           key === 'T2M_MAX' ? 'Max Temperature (T2M_MAX)' :
                           key === 'T2M_MIN' ? 'Min Temperature (T2M_MIN)' :
                           key === 'T2M_RANGE' ? 'Temperature Range (T2M_RANGE)' :
                           key === 'TS' ? 'Surface Temperature (TS)' :
                           key === 'WS10M' ? 'Wind Speed at 10m (WS10M)' :
                           key === 'WS10M_RANGE' ? 'Wind Speed Range at 10m (WS10M_RANGE)' :
                           key === 'WS50M' ? 'Wind Speed at 50m (WS50M)' :
                           key === 'WS50M_MAX' ? 'Max Wind Speed at 50m (WS50M_MAX)' :
                           key === 'WS50M_RANGE' ? 'Wind Speed Range at 50m (WS50M_RANGE)' :
                           key === 'YEAR' ? 'Year' :
                           key === 'DATE' ? 'Day of Year' : key}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={value}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className="w-full px-3 py-2 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-water-blue text-white py-3 px-6 rounded-lg font-semibold hover:bg-water-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">🔮</span>
                          Predict Drought Severity
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
                </div>

                {/* Results Panel */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-water-blue mb-6 flex items-center">
                    <span className="mr-3">📊</span>
                    Drought Assessment
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
                      <p className="mt-4 text-water-light">Analyzing drought conditions...</p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <div className="flex items-center">
                        <span className="text-red-500 text-2xl mr-3">⚠️</span>
                        <div>
                          <h3 className="text-red-800 font-semibold">Error</h3>
                          <p className="text-red-600 mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {prediction && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-water-pale to-water-accent bg-opacity-30 rounded-lg p-6 border border-water-accent">
                        <h3 className="text-lg font-semibold text-water-blue mb-3">Drought Severity Assessment</h3>
                        <div className="text-center">
                          <div className="text-6xl mb-4">{droughtIcons[prediction.prediction] || '🌵'}</div>
                          <div className={`text-3xl font-bold p-4 rounded-lg ${droughtColors[prediction.prediction] || 'text-gray-600 bg-gray-100'}`}>
                            {droughtCategories[prediction.prediction] || 'UNKNOWN'}
                          </div>
                          <p className="text-water-light mt-2">Predicted Drought Category</p>
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
                          Model Type: {prediction.model_type || 'Random Forest Classifier'}
                        </p>
                        <p className="text-water-light text-sm">
                          Data Source: {prediction.data_source || 'Drought Dataset'}
                        </p>
                      </div>
                    </div>
                  )}

                  {!loading && !error && !prediction && (
                    <div className="text-center py-12 text-water-light">
                      <div className="text-6xl mb-4">🌵</div>
                      <p className="text-lg">Enter environmental parameters and click "Predict Drought Severity" to see results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Time Series Tab */}
          {chartType === 'time-series' && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-water-blue mb-4 flex items-center">
                  <span className="mr-3">📈</span>
                  Drought Score Over Time
                </h2>
                <p className="text-water-light">
                  Historical drought scores from validation dataset
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-water-pale">
                {chartLoading ? (
                  <div className="text-center py-12 text-water-light">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-water-blue mb-4"></div>
                    <p>Loading time series data...</p>
                  </div>
                ) : timeSeriesData ? (
                  <div className="h-[500px] w-full">
                    {generateTimeSeriesChart()}
                  </div>
                ) : (
                  <div className="text-center py-12 text-water-light">
                    <div className="text-4xl mb-4">❌</div>
                    <p>Failed to load time series data</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Variables Tab */}
          {chartType === 'variables' && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-water-blue mb-4 flex items-center">
                  <span className="mr-3">📊</span>
                  Environmental Variables Analysis
                </h2>
                
                <div className="flex space-x-4 mb-6">
                  {[
                    "Bar Chart",
                    "Pie Chart"
                  ].map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setChartType(`variables-${type}`)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        chartType === `variables-${type}`
                          ? 'bg-water-blue text-white'
                          : 'bg-water-pale text-water-blue hover:bg-water-accent'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-water-pale">
                {chartLoading ? (
                  <div className="text-center py-12 text-water-light">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-water-blue mb-4"></div>
                    <p>Loading variable data...</p>
                  </div>
                ) : variableData ? (
                  <div className="h-96">
                    {generateVariableChart()}
                  </div>
                ) : (
                  <div className="text-center py-12 text-water-light">
                    <div className="text-4xl mb-4">❌</div>
                    <p>Failed to load variable data</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-water-light">
          <p className="text-sm">
            Developed by Mondli Ntuthuko Gabela | Full-stack AI Developer
          </p>
          <p className="text-xs mt-2 opacity-75">
            Machine Learning | Web Applications | Environmental Risk Assessment
          </p>
        </div>
      </div>
    </div>
  );
};

export default DroughtPrediction;
