import React, { useEffect, useState } from 'react';
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

const RainfallPrediction = () => {
  const [features, setFeatures] = useState([]);
  const [defaults, setDefaults] = useState({});
  const [formData, setFormData] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [graphs, setGraphs] = useState(null);
  const [graphsLoading, setGraphsLoading] = useState(true);

  useEffect(() => {
    loadFeatures();
    loadGraphs();
  }, []);

  const loadFeatures = async () => {
    try {
      const res = await fetch('http://localhost:5000/rainfall/features');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load features');
      setFeatures(data.features || []);
      setDefaults(data.defaults || {});
      const initial = {};
      (data.features || []).forEach((f) => {
        initial[f] = data.defaults?.[f] ?? 0;
      });
      setFormData(initial);
    } catch (e) {
      setError(e.message);
    }
  };

  const loadGraphs = async () => {
    setGraphsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/rainfall/graphs');
      const data = await res.json();
      setGraphs(res.ok ? data : null);
    } catch (e) {
      setGraphs(null);
    } finally {
      setGraphsLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const randomizeInputs = () => {
    const next = {};
    features.forEach((feature) => {
      const base = defaults?.[feature] ?? 0;
      const spread = Math.abs(base) * 0.4 || 5;
      const val = base + (Math.random() - 0.5) * 2 * spread;
      next[feature] = parseFloat(val.toFixed(2));
    });
    setFormData(next);
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const res = await fetch('http://localhost:5000/rainfall/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Prediction failed');
      setPrediction(data);
      await loadGraphs();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const lineConfig = () => {
    if (!graphs?.trend?.labels?.length) return null;
    return {
      data: {
        labels: graphs.trend.labels,
        datasets: [
          {
            label: 'Rainfall (mm)',
            data: graphs.trend.values,
            borderColor: '#0F2C59',
            backgroundColor: '#0F2C5920',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: graphs.trend.title },
        },
        scales: {
          x: { title: { display: true, text: 'Timestamp' } },
          y: { title: { display: true, text: 'mm' }, beginAtZero: true },
        },
      },
    };
  };

  const barConfig = () => {
    if (!graphs?.dist?.labels?.length) return null;
    return {
      data: {
        labels: graphs.dist.labels,
        datasets: [
          {
            label: 'Predictions',
            data: graphs.dist.values,
            backgroundColor: ['#3D5B90', '#96CEB4'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: graphs.dist.title },
        },
        scales: {
          x: { title: { display: true, text: 'Outcome' } },
          y: { title: { display: true, text: 'Count' }, beginAtZero: true },
        },
      },
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-cream to-water-warm">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-water-blue">🌧️ Rainfall Prediction</h1>
          <p className="text-water-light mt-2">
            Estimate rainfall chance and expected precipitation using atmospheric indicators.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
            <h2 className="text-2xl font-semibold text-water-blue mb-4">Weather Inputs</h2>
            {features.length === 0 ? (
              <div className="text-water-light">Loading inputs...</div>
            ) : (
              <>
                <div className="max-h-96 overflow-y-auto mb-5 pr-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature) => (
                      <div key={feature}>
                        <label className="block text-sm font-medium text-water-blue mb-1">
                          {feature}
                        </label>
                        <input
                          type="number"
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                          value={formData[feature] ?? 0}
                          onChange={(e) => handleChange(feature, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={randomizeInputs}
                    className="px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-all"
                  >
                    🎲 Randomize
                  </button>
                  <button
                    type="button"
                    onClick={handlePredict}
                    disabled={loading}
                    className="flex-1 bg-water-primary hover:bg-water-dark text-white px-4 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-water transition-all"
                  >
                    {loading ? 'Predicting...' : '🚀 Predict Rainfall'}
                  </button>
                </div>
                {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
              </>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-water-blue mb-4">Prediction Result</h2>
            {prediction ? (
              <div className="space-y-4">
                <div
                  className={`p-6 rounded-lg ${
                    prediction.prediction === 'Rain'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <div className="text-3xl font-bold mb-2">{prediction.prediction}</div>
                  <div className="text-sm opacity-75">
                    {prediction.prediction === 'Rain'
                      ? 'Carry an umbrella and monitor advisories.'
                      : 'Low rainfall probability detected.'}
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-green-700">Estimated Rainfall</div>
                  <div className="text-2xl font-bold text-green-800">
                    {prediction.rainfall_mm} mm
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-water-light">
                <div className="text-6xl mb-4">☔</div>
                <p>Provide input values and tap predict to see rainfall estimation.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-xl border border-water-pale p-6">
          <h2 className="text-2xl font-semibold text-water-blue mb-6">📊 Rainfall Insights</h2>
          {graphsLoading ? (
            <div className="text-water-light text-center py-8">Loading charts...</div>
          ) : !graphs?.trend && !graphs?.dist ? (
            <div className="text-water-light text-center py-8">
              No data yet. Generate predictions to build history.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {lineConfig() && (
                <div className="h-[350px]">
                  <Line {...lineConfig()} />
                </div>
              )}
              {barConfig() && (
                <div className="h-[350px]">
                  <Bar {...barConfig()} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RainfallPrediction;