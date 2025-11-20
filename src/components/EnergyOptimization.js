import React, { useState } from 'react';

const EnergyOptimization = () => {
  const [form, setForm] = useState({
    Rainfall_mm: '',
    Inflow_million_m3: '',
    Evaporation_million_m3: '',
    ReservoirVolume_m3: '',
    GeneratorFlow_m3: '',
    SpillwayFlow_m3: '',
    EnergyGenerated_MWh: '',
    MaintenanceCost_USD: '',
    EnergyRevenue_USD: ''
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadRandomInputs = async () => {
    setLoadingRandom(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/energy-optimization/random');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get random inputs');
      setForm(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingRandom(false);
    }
  };

  const handlePredict = async () => {
    // Validate all fields are filled
    const missingFields = Object.entries(form).filter(([key, value]) => !value || value === '');
    if (missingFields.length > 0) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('http://localhost:5000/energy-optimization/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Prediction failed');
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      Rainfall_mm: '',
      Inflow_million_m3: '',
      Evaporation_million_m3: '',
      ReservoirVolume_m3: '',
      GeneratorFlow_m3: '',
      SpillwayFlow_m3: '',
      EnergyGenerated_MWh: '',
      MaintenanceCost_USD: '',
      EnergyRevenue_USD: ''
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-water-gradient-light relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-water-pattern opacity-30"></div>
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-water-gradient rounded-full flex items-center justify-center shadow-water-xl mx-auto">
              <span className="text-4xl">⚡</span>
            </div>
          </div>
          <h1 className="text-5xl font-heading font-extrabold bg-water-gradient bg-clip-text text-transparent mb-4">
            Energy Optimization - Dam Cost Prediction
          </h1>
          <p className="text-xl font-body text-water-dark max-w-3xl mx-auto">
            Predict monthly total cost for dam operations using machine learning models
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="water-card p-8 animate-fadeInUp">
              <h2 className="text-2xl font-heading font-bold text-water-dark mb-6 flex items-center">
                <span className="mr-3">📊</span>
                Dam Parameters
              </h2>

              <div className="space-y-6">
                {/* Rainfall */}
                <div>
                  <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                    Rainfall (mm)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="Rainfall_mm"
                    value={form.Rainfall_mm}
                    onChange={handleChange}
                    className="w-full border-2 border-water-pale rounded-lg px-4 py-3 focus:ring-2 focus:ring-water-primary focus:border-water-primary transition-all bg-white font-body"
                    placeholder="Enter rainfall in mm"
                  />
                </div>

                {/* Inflow */}
                <div>
                  <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                    Inflow (million m³)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="Inflow_million_m3"
                    value={form.Inflow_million_m3}
                    onChange={handleChange}
                    className="w-full border-2 border-water-pale rounded-lg px-4 py-3 focus:ring-2 focus:ring-water-primary focus:border-water-primary transition-all bg-white font-body"
                    placeholder="Enter inflow in million m³"
                  />
                </div>

                {/* Evaporation */}
                <div>
                  <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                    Evaporation (million m³)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="Evaporation_million_m3"
                    value={form.Evaporation_million_m3}
                    onChange={handleChange}
                    className="w-full border-2 border-water-pale rounded-lg px-4 py-3 focus:ring-2 focus:ring-water-primary focus:border-water-primary transition-all bg-white font-body"
                    placeholder="Enter evaporation in million m³"
                  />
                </div>

                {/* Reservoir Volume */}
                <div>
                  <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                    Reservoir Volume (m³)
                  </label>
                  <input
                    type="number"
                    step="1"
                    name="ReservoirVolume_m3"
                    value={form.ReservoirVolume_m3}
                    onChange={handleChange}
                    className="w-full border-2 border-water-pale rounded-lg px-4 py-3 focus:ring-2 focus:ring-water-primary focus:border-water-primary transition-all bg-white font-body"
                    placeholder="Enter reservoir volume in m³"
                  />
                </div>

                {/* Generator Flow */}
                <div>
                  <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                    Generator Flow (m³)
                  </label>
                  <input
                    type="number"
                    step="1"
                    name="GeneratorFlow_m3"
                    value={form.GeneratorFlow_m3}
                    onChange={handleChange}
                    className="w-full border-2 border-water-pale rounded-lg px-4 py-3 focus:ring-2 focus:ring-water-primary focus:border-water-primary transition-all bg-white font-body"
                    placeholder="Enter generator flow in m³"
                  />
                </div>

                {/* Spillway Flow */}
                <div>
                  <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                    Spillway Flow (m³)
                  </label>
                  <input
                    type="number"
                    step="1"
                    name="SpillwayFlow_m3"
                    value={form.SpillwayFlow_m3}
                    onChange={handleChange}
                    className="w-full border-2 border-water-pale rounded-lg px-4 py-3 focus:ring-2 focus:ring-water-primary focus:border-water-primary transition-all bg-white font-body"
                    placeholder="Enter spillway flow in m³"
                  />
                </div>

                {/* Energy Generated */}
                <div>
                  <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                    Energy Generated (MWh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="EnergyGenerated_MWh"
                    value={form.EnergyGenerated_MWh}
                    onChange={handleChange}
                    className="w-full border-2 border-water-pale rounded-lg px-4 py-3 focus:ring-2 focus:ring-water-primary focus:border-water-primary transition-all bg-white font-body"
                    placeholder="Enter energy generated in MWh"
                  />
                </div>

                {/* Maintenance Cost */}
                <div>
                  <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                    Maintenance Cost (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="MaintenanceCost_USD"
                    value={form.MaintenanceCost_USD}
                    onChange={handleChange}
                    className="w-full border-2 border-water-pale rounded-lg px-4 py-3 focus:ring-2 focus:ring-water-primary focus:border-water-primary transition-all bg-white font-body"
                    placeholder="Enter maintenance cost in USD"
                  />
                </div>

                {/* Energy Revenue */}
                <div>
                  <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                    Energy Revenue (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="EnergyRevenue_USD"
                    value={form.EnergyRevenue_USD}
                    onChange={handleChange}
                    className="w-full border-2 border-water-pale rounded-lg px-4 py-3 focus:ring-2 focus:ring-water-primary focus:border-water-primary transition-all bg-white font-body"
                    placeholder="Enter energy revenue in USD"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={loadRandomInputs}
                    disabled={loadingRandom}
                    className="px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  >
                    {loadingRandom ? 'Loading...' : '🎲 Randomize Inputs'}
                  </button>
                  <button
                    type="button"
                    onClick={handlePredict}
                    disabled={loading}
                    className="flex-1 bg-water-primary hover:bg-water-dark text-white px-6 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-water transition-all"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Predicting...
                      </>
                    ) : (
                      '🔮 Predict Cost'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2.5 border-2 border-water-primary text-water-primary rounded-lg hover:bg-water-primary hover:text-white font-medium transition-all"
                  >
                    Reset
                  </button>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Results Panel */}
            <div className="water-card p-8 animate-fadeInUp">
              <h2 className="text-2xl font-heading font-bold text-water-dark mb-6 flex items-center">
                <span className="mr-3">💰</span>
                Prediction Result
              </h2>

              {!result ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-600 font-body">
                    Enter dam parameters and click "Predict Cost" to get the monthly total cost prediction.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Main Result */}
                  <div className="bg-water-gradient rounded-xl p-8 text-center shadow-water-lg">
                    <div className="text-5xl mb-4">💵</div>
                    <div className="text-4xl font-heading font-bold text-white mb-2">
                      {result.formatted_prediction}
                    </div>
                    <p className="text-white/90 font-body text-lg mt-2">
                      Predicted Monthly Total Cost
                    </p>
                  </div>

                  {/* Message */}
                  <div className="bg-water-pale/30 rounded-lg p-4 border border-water-pale/50">
                    <p className="text-water-dark font-body leading-relaxed">
                      {result.message}
                    </p>
                  </div>

                  {/* Information Box */}
                  <div className="bg-water-pale/50 rounded-lg p-6 border border-water-pale">
                    <h3 className="font-heading font-bold text-water-dark mb-3 text-sm uppercase tracking-wide">
                      About This Prediction
                    </h3>
                    <p className="text-gray-600 text-sm font-body leading-relaxed">
                      This prediction uses machine learning models trained on realistic dam cost data. 
                      The model analyzes 9 key parameters including rainfall, inflow, evaporation, 
                      reservoir volume, generator flow, spillway flow, energy generation, maintenance costs, 
                      and energy revenue to predict the monthly total operational cost.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyOptimization;
