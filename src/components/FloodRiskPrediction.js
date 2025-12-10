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

const FloodRiskPrediction = () => {
  const [formData, setFormData] = useState({
    MonsoonIntensity: 5,
    TopographyDrainage: 5,
    RiverManagement: 5,
    Deforestation: 5,
    Urbanization: 5,
    ClimateChange: 5,
    DamsQuality: 5,
    Siltation: 5,
    AgriculturalPractices: 5,
    Encroachments: 5,
    IneffectiveDisasterPreparedness: 5,
    DrainageSystems: 5,
    CoastalVulnerability: 5,
    Landslides: 5,
    Watersheds: 5,
    DeterioratingInfrastructure: 5,
    PopulationScore: 5,
    WetlandLoss: 5,
    InadequatePlanning: 5,
    PoliticalFactors: 5
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('Ready');
  const [chartType, setChartType] = useState('Bar Chart (Average Factor Score)');
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);

  const featureNames = [
    "MonsoonIntensity", "TopographyDrainage", "RiverManagement", "Deforestation", "Urbanization",
    "ClimateChange", "DamsQuality", "Siltation", "AgriculturalPractices", "Encroachments",
    "IneffectiveDisasterPreparedness", "DrainageSystems", "CoastalVulnerability", "Landslides",
    "Watersheds", "DeterioratingInfrastructure", "PopulationScore", "WetlandLoss",
    "InadequatePlanning", "PoliticalFactors"
  ];

  // Load chart data on component mount
  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      console.log('Loading chart data...');
      setChartLoading(true);
      const response = await fetch('http://16.171.142.225/flood-chart-data');
      console.log('Chart data response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Chart data loaded:', data);
        setChartData(data);
      } else {
        console.error('Chart data response not ok:', response.status);
      }
    } catch (err) {
      console.error('Error loading chart data:', err);
    } finally {
      setChartLoading(false);
    }
  };

  const handleSliderChange = (feature, value) => {
    setFormData(prev => ({
      ...prev,
      [feature]: parseInt(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    console.log('Submitting flood prediction form data:', formData);
    setApiStatus('Calling Flask API...');

    try {
      console.log('Making API call to Flask server for flood prediction...');
      const response = await fetch('http://16.171.142.225/predict-flood', {
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
    const resetData = {};
    featureNames.forEach(feature => {
      resetData[feature] = 5;
    });
    setFormData(resetData);
    setPrediction(null);
    setError(null);
    setApiStatus('Ready');
  };

  const generateChart = () => {
    if (!chartData) return null;

    const colors = ['#0F2C59', '#3D5B90', '#7390D8', '#A2C5FD', '#F8F0E5', '#EADFB4', '#F4EBDA', '#E5DDC8', '#D6C8A1', '#C7B97A'];
    
    const data = {
      labels: chartData.factors,
      datasets: [{
        label: 'Average Factor Scores',
        data: chartData.values,
        backgroundColor: colors.slice(0, chartData.factors.length),
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
          text: chartType.includes('Bar') ? 'Average Score of Top 10 Flood Factors' : 
                chartType.includes('Line') ? 'Trend of Average Factor Scores' : 
                'Relative Distribution of Average Factor Scores',
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
            text: 'Average Score (1-10)',
            color: '#0F2C59'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Flood Factors',
            color: '#0F2C59'
          }
        }
      }
    };

    if (chartType.includes('Bar')) {
      return <Bar data={data} options={options} />;
    } else if (chartType.includes('Line')) {
      return <Line data={data} options={options} />;
    } else if (chartType.includes('Pie')) {
      return <Pie data={data} options={options} />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-cream to-water-warm">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-water-blue mb-4">
            🌊 Flood Risk Monitoring System
          </h1>
          <p className="text-xl text-water-light max-w-3xl mx-auto">
            Advanced Machine Learning Model for Flood Risk Assessment and Environmental Factor Analysis
          </p>
          <div className="mt-6 p-4 bg-water-pale bg-opacity-30 rounded-lg border border-water-accent">
            <p className="text-water-blue font-medium">
              Adjust environmental factor sliders (0-10) to assess flood risk probability
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
              🌊 Risk Assessment
            </button>
            <button
              type="button"
              onClick={() => setChartType('Bar Chart (Average Factor Score)')}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 ${
                chartType !== 'prediction' 
                  ? 'bg-water-blue text-white' 
                  : 'text-water-blue hover:bg-water-pale'
              }`}
            >
              📈 Data Overview
            </button>
          </div>

          {/* Prediction Tab */}
          {chartType === 'prediction' && (
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-water-blue mb-6 flex items-center">
                    <span className="mr-3">🎛️</span>
                    Environmental Factors
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {featureNames.map(feature => (
                      <div key={feature} className="space-y-2">
                        <label className="block text-sm font-medium text-water-blue">
                          {feature.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={formData[feature]}
                          onChange={(e) => handleSliderChange(feature, e.target.value)}
                          className="w-full h-2 bg-water-pale rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-water-light">
                          <span>0</span>
                          <span className="font-semibold text-water-blue">{formData[feature]}</span>
                          <span>10</span>
                        </div>
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
                          <span className="mr-2">🔍</span>
                          Assess Flood Risk
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
                    Risk Assessment Results
                  </h2>

                  {/* API Status */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm font-medium">
                      🔗 API Status: {apiStatus}
                    </p>
                  </div>

                  {loading && (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-water-blue"></div>
                      <p className="mt-4 text-water-light">Analyzing flood risk factors...</p>
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
                        <h3 className="text-lg font-semibold text-water-blue mb-3">Flood Risk Assessment</h3>
                        <div className="text-4xl font-bold text-water-blue text-center">
                          {prediction.prediction}
                        </div>
                        <p className="text-water-light mt-2 text-center">Predicted Flood Probability</p>
                        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                          <p className="text-green-800 text-sm font-medium text-center">
                            ✅ Prediction received from Flask server (Model: {prediction.model_type})
                          </p>
                        </div>
                      </div>

                      <div className="bg-water-neutral bg-opacity-50 rounded-lg p-4">
                        <h4 className="font-semibold text-water-blue mb-2">Model Information</h4>
                        <p className="text-water-light text-sm">
                          Model Type: {prediction.model_type || 'Flood Risk Prediction'}
                        </p>
                        <p className="text-water-light text-sm">
                          Data Source: {prediction.data_source || 'Flood Dataset'}
                        </p>
                      </div>
                    </div>
                  )}

                  {!loading && !error && !prediction && (
                    <div className="text-center py-12 text-water-light">
                      <div className="text-6xl mb-4">🌊</div>
                      <p className="text-lg">Adjust the environmental factor sliders and click "Assess Flood Risk" to see results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Visualization Tab */}
          {chartType !== 'prediction' && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-water-blue mb-4 flex items-center">
                  <span className="mr-3">📈</span>
                  Data Visualization
                </h2>
                
                <div className="flex space-x-4 mb-6">
                  {[
                    "Bar Chart (Average Factor Score)",
                    "Line Graph (Average Factor Score)", 
                    "Pie Chart (Relative Influence)"
                  ].map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setChartType(type)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        chartType === type
                          ? 'bg-water-blue text-white'
                          : 'bg-water-pale text-water-blue hover:bg-water-accent'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {chartData && (
                  <div className="bg-water-neutral bg-opacity-30 rounded-lg p-4 mb-6">
                    <p className="text-water-blue text-center font-medium">
                      Average Flood Probability in Dataset: {(chartData.avg_flood_prob * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg p-6 border border-water-pale">
                {chartLoading ? (
                  <div className="text-center py-12 text-water-light">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-water-blue mb-4"></div>
                    <p>Loading chart data...</p>
                  </div>
                ) : chartData ? (
                  <div className="h-96">
                    {generateChart()}
                  </div>
                ) : (
                  <div className="text-center py-12 text-water-light">
                    <div className="text-4xl mb-4">❌</div>
                    <p>Failed to load chart data</p>
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
            Machine Learning | Web Applications | Environmental Risk Analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default FloodRiskPrediction;
