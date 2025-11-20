import React, { useState } from 'react';

const WaterPredictionForm = () => {
  const [formData, setFormData] = useState({
    WLM_RPE_QC: '',
    WLM_GSE: '',
    WLM_GSE_QC: '',
    RPE_WSE: '',
    RPE_WSE_QC: '',
    GSE_WSE: '',
    GSE_WSE_QC: '',
    WSE: '',
    WSE_QC: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('Ready');

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

    console.log('Submitting form data:', formData);
    setApiStatus('Calling Flask API...');

    try {
      console.log('Making API call to Flask server...');
      const response = await fetch('http://16.171.150.121/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
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
      WLM_RPE_QC: '',
      WLM_GSE: '',
      WLM_GSE_QC: '',
      RPE_WSE: '',
      RPE_WSE_QC: '',
      GSE_WSE: '',
      GSE_WSE_QC: '',
      WSE: '',
      WSE_QC: ''
    });
    setPrediction(null);
    setError(null);
  };

  const inputFields = [
    { name: 'WLM_RPE_QC', label: 'Water Level Measurement - RPE Quality Control', placeholder: 'Enter RPE QC value' },
    { name: 'WLM_GSE', label: 'Water Level Measurement - Ground Surface Elevation', placeholder: 'Enter GSE value' },
    { name: 'WLM_GSE_QC', label: 'Water Level Measurement - GSE Quality Control', placeholder: 'Enter GSE QC value' },
    { name: 'RPE_WSE', label: 'RPE Water Surface Elevation', placeholder: 'Enter RPE WSE value' },
    { name: 'RPE_WSE_QC', label: 'RPE Water Surface Elevation Quality Control', placeholder: 'Enter RPE WSE QC value' },
    { name: 'GSE_WSE', label: 'Ground Surface Elevation Water Surface Elevation', placeholder: 'Enter GSE WSE value' },
    { name: 'GSE_WSE_QC', label: 'GSE Water Surface Elevation Quality Control', placeholder: 'Enter GSE WSE QC value' },
    { name: 'WSE', label: 'Water Surface Elevation', placeholder: 'Enter WSE value' },
    { name: 'WSE_QC', label: 'Water Surface Elevation Quality Control', placeholder: 'Enter WSE QC value' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-cream to-water-warm">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-water-blue mb-4">
            💧 Ground Water Prediction
          </h1>
          <p className="text-xl text-water-light max-w-3xl mx-auto">
            Advanced Linear Regression Model for Water Level and Environmental Metrics Prediction
          </p>
          <div className="mt-6 p-4 bg-water-pale bg-opacity-30 rounded-lg border border-water-accent">
            <p className="text-water-blue font-medium">
              Enter water measurement data to get instant predictions for environmental analysis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-water-pale">
            <h2 className="text-2xl font-semibold text-water-blue mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Input Parameters
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {inputFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium text-water-blue">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-water-accent rounded-lg focus:ring-2 focus:ring-water-blue focus:border-transparent transition-all duration-200 bg-water-cream bg-opacity-30"
                    required
                  />
                </div>
              ))}

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
                      Get Prediction
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
              <span className="mr-3">📈</span>
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
                <p className="mt-4 text-water-light">Processing your data...</p>
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
                  <h3 className="text-lg font-semibold text-water-blue mb-3">Prediction Result</h3>
                  <div className="text-4xl font-bold text-water-blue">
                    {prediction.prediction?.toFixed(4) || 'N/A'}
                  </div>
                  <p className="text-water-light mt-2">Predicted Water Level/Environmental Metric</p>
                  <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-green-800 text-sm font-medium">
                      ✅ Prediction received from Flask server (Model: {prediction.model_type})
                    </p>
                  </div>
                </div>

                <div className="bg-water-neutral bg-opacity-50 rounded-lg p-4">
                  <h4 className="font-semibold text-water-blue mb-2">Model Information</h4>
                  <p className="text-water-light text-sm">
                    Model Type: {prediction.model_type || 'Linear Regression'}
                  </p>
                  <p className="text-water-light text-sm">
                    Data Source: {prediction.data_source || 'Unknown'}
                  </p>
                  <p className="text-water-light text-sm">
                    Server: {prediction.server_timestamp || 'Unknown'}
                  </p>
                </div>

                <div className="bg-water-warm bg-opacity-30 rounded-lg p-4">
                  <h4 className="font-semibold text-water-blue mb-2">Input Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
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
                <div className="text-6xl mb-4">🌊</div>
                <p className="text-lg">Enter your water data parameters and click "Get Prediction" to see results</p>
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
            Machine Learning | Web Applications | Environmental Data Analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaterPredictionForm;


