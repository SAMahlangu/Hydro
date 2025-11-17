import React, { useEffect, useMemo, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WaterStressPrediction = () => {
  const [formData, setFormData] = useState({
    Country: '',
    Year: 2025,
    'Total Water Consumption (Billion Cubic Meters)': '',
    'Per Capita Water Use (Liters per Day)': '',
    'Agricultural Water Use (%)': '',
    'Industrial Water Use (%)': '',
    'Household Water Use (%)': '',
    'Rainfall Impact (Annual Precipitation in mm)': '',
    'Groundwater Depletion Rate (%)': ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('Ready');
  const [graphs, setGraphs] = useState(null);
  const [graphsLoading, setGraphsLoading] = useState(true);

  const countries = [
    'Argentina', 'Australia', 'Brazil', 'Canada', 'China', 'France',
    'Germany', 'India', 'Indonesia', 'Italy', 'Japan', 'Mexico',
    'Russia', 'Saudi Arabia', 'South Africa', 'South Korea', 'Spain',
    'Turkey', 'UK', 'USA'
  ];

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
    setPrediction(null);

    console.log('Submitting water stress form data:', formData);
    setApiStatus('Calling Flask API...');

    try {
      console.log('Making API call to Flask server for water stress prediction...');
      const response = await fetch('http://localhost:5000/predict-water-stress', {
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
      // Reload graphs after logging
      loadGraphs();
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
      setApiStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadGraphs = async () => {
    setGraphsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/water-stress/graphs');
      const data = await res.json();
      setGraphs(res.ok ? data : null);
    } catch (e) {
      setGraphs(null);
    } finally {
      setGraphsLoading(false);
    }
  };

  useEffect(() => { loadGraphs(); }, []);

  const trendConfig = useMemo(() => {
    if (!graphs?.trend) return null;
    return {
      data: {
        labels: graphs.trend.labels,
        datasets: graphs.trend.series.map((s, i) => ({
          label: s.name,
          data: s.values,
          borderColor: ['#0F2C59','#45B7D1','#96CEB4'][i % 3],
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 3,
          tension: 0,
          pointRadius: 3,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' }, title: { display: true, text: graphs.trend.title } },
        scales: { x: { title: { display: true, text: 'Sample Index'} }, y: { title: { display: true, text: 'Value' }, beginAtZero: true } }
      }
    };
  }, [graphs]);

  const barConfig = useMemo(() => {
    if (!graphs?.bar) return null;
    return {
      data: {
        labels: graphs.bar.labels,
        datasets: [{ label: 'Count', data: graphs.bar.values, backgroundColor: ['green','yellow','red'] }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, title: { display: true, text: graphs.bar.title } },
        scales: { x: { title: { display: true, text: 'Stress Level' } }, y: { title: { display: true, text: 'Samples' }, beginAtZero: true } }
      }
    };
  }, [graphs]);

  const handleReset = () => {
    setFormData({
      Country: '',
      Year: 2025,
      'Total Water Consumption (Billion Cubic Meters)': '',
      'Per Capita Water Use (Liters per Day)': '',
      'Agricultural Water Use (%)': '',
      'Industrial Water Use (%)': '',
      'Household Water Use (%)': '',
      'Rainfall Impact (Annual Precipitation in mm)': '',
      'Groundwater Depletion Rate (%)': ''
    });
    setPrediction(null);
    setError(null);
    setApiStatus('Ready');
  };

  const getStressColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-cream to-water-warm">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-water-blue mb-4">
            🌍 Water Stress Prediction System
          </h1>
          <p className="text-xl text-water-light max-w-3xl mx-auto">
            Advanced Machine Learning Model for Predicting Water Stress Levels (Low, Moderate, High)
          </p>
          <div className="mt-6 p-4 bg-water-pale bg-opacity-30 rounded-lg border border-water-accent">
            <p className="text-water-blue font-medium">
              Enter water consumption and environmental data to predict water stress levels for different countries
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-water-pale">
            <h2 className="text-2xl font-semibold text-water-blue mb-6 flex items-center">
              <span className="mr-3">🌍</span>
              Water Stress Parameters
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Country and Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-water-blue">
                    Country
                  </label>
                  <select
                    name="Country"
                    value={formData.Country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-water-blue">
                    Year
                  </label>
                  <input
                    type="number"
                    name="Year"
                    value={formData.Year}
                    onChange={handleInputChange}
                    placeholder="2025"
                    className="w-full px-4 py-3 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                    required
                  />
                </div>
              </div>

              {/* Water Consumption */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-water-blue">
                    Total Water Consumption (Billion Cubic Meters)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="Total Water Consumption (Billion Cubic Meters)"
                    value={formData['Total Water Consumption (Billion Cubic Meters)']}
                    onChange={handleInputChange}
                    placeholder="Enter total water consumption"
                    className="w-full px-4 py-3 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-water-blue">
                    Per Capita Water Use (Liters per Day)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="Per Capita Water Use (Liters per Day)"
                    value={formData['Per Capita Water Use (Liters per Day)']}
                    onChange={handleInputChange}
                    placeholder="Enter per capita water use"
                    className="w-full px-4 py-3 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                    required
                  />
                </div>
              </div>

              {/* Water Use Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-water-blue">
                    Agricultural Water Use (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="Agricultural Water Use (%)"
                    value={formData['Agricultural Water Use (%)']}
                    onChange={handleInputChange}
                    placeholder="Enter agricultural use %"
                    className="w-full px-4 py-3 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-water-blue">
                    Industrial Water Use (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="Industrial Water Use (%)"
                    value={formData['Industrial Water Use (%)']}
                    onChange={handleInputChange}
                    placeholder="Enter industrial use %"
                    className="w-full px-4 py-3 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-water-blue">
                    Household Water Use (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="Household Water Use (%)"
                    value={formData['Household Water Use (%)']}
                    onChange={handleInputChange}
                    placeholder="Enter household use %"
                    className="w-full px-4 py-3 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                    required
                  />
                </div>
              </div>

              {/* Environmental Factors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-water-blue">
                    Rainfall Impact (Annual Precipitation in mm)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="Rainfall Impact (Annual Precipitation in mm)"
                    value={formData['Rainfall Impact (Annual Precipitation in mm)']}
                    onChange={handleInputChange}
                    placeholder="Enter annual rainfall in mm"
                    className="w-full px-4 py-3 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-water-blue">
                    Groundwater Depletion Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="Groundwater Depletion Rate (%)"
                    value={formData['Groundwater Depletion Rate (%)']}
                    onChange={handleInputChange}
                    placeholder="Enter groundwater depletion %"
                    className="w-full px-4 py-3 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                    required
                  />
                </div>
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
                      <span className="mr-2">🔍</span>
                      Predict Water Stress
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
              Prediction Results
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
                <p className="mt-4 text-water-light">Analyzing water stress data...</p>
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
                  <h3 className="text-lg font-semibold text-water-blue mb-3">Water Stress Prediction</h3>
                  <div className={`text-4xl font-bold p-4 rounded-lg ${getStressColor(prediction.prediction)}`}>
                    {prediction.prediction}
                  </div>
                  <p className="text-water-light mt-2">Predicted Water Stress Level</p>
                  <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-green-800 text-sm font-medium">
                      ✅ Prediction received from Flask server (Model: {prediction.model_type})
                    </p>
                  </div>
                </div>

                <div className="bg-water-neutral bg-opacity-50 rounded-lg p-4">
                  <h4 className="font-semibold text-water-blue mb-2">Model Information</h4>
                  <p className="text-water-light text-sm">
                    Model Type: {prediction.model_type || 'Water Stress Classification'}
                  </p>
                  <p className="text-water-light text-sm">
                    Data Source: {prediction.data_source || 'Water Stress Dataset'}
                  </p>
                  <p className="text-water-light text-sm">
                    Server: {prediction.server_timestamp || 'Unknown'}
                  </p>
                </div>

                <div className="bg-water-warm bg-opacity-30 rounded-lg p-4">
                  <h4 className="font-semibold text-water-blue mb-2">Input Summary</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {Object.entries(prediction.input_features || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-water-light">{key}:</span>
                        <span className="text-water-blue font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && !prediction && (
              <div className="text-center py-12 text-water-light">
                <div className="text-6xl mb-4">🌍</div>
                <p className="text-lg">Enter water stress parameters and click "Predict Water Stress" to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* Water Stress Charts */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl border border-water-pale p-6">
          <h2 className="text-2xl font-semibold text-water-blue mb-6">📊 Water Stress Charts</h2>
          {graphsLoading ? (
            <div className="text-water-light">Loading charts...</div>
          ) : !graphs ? (
            <div className="text-water-light">No data yet. Make a prediction first.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-[320px]">{trendConfig && <Line data={trendConfig.data} options={trendConfig.options} />}</div>
              <div className="h-[320px]">{barConfig && <Bar data={barConfig.data} options={barConfig.options} />}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-water-light">
          <p className="text-sm">
            Developed by Mondli Ntuthuko Gabela | Full-stack AI Developer
          </p>
          <p className="text-xs mt-2 opacity-75">
            Machine Learning | Web Applications | Environmental Data Analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaterStressPrediction;

