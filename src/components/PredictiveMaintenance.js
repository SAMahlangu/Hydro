import React, { useEffect, useState } from 'react';
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

const PredictiveMaintenance = () => {
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
      const res = await fetch('http://16.171.150.121/predictive-maintenance/features');
      const data = await res.json();
      if (res.ok && data.features) {
        setFeatures(data.features);
        setDefaults(data.defaults || {});
        const initialForm = {};
        data.features.forEach(f => {
          initialForm[f] = data.defaults?.[f] || 0.0;
        });
        setFormData(initialForm);
      }
    } catch (e) {
      console.error('Failed to load features:', e);
    }
  };

  const loadGraphs = async () => {
    setGraphsLoading(true);
    try {
      const res = await fetch('http://16.171.150.121/predictive-maintenance/graphs');
      const data = await res.json();
      setGraphs(res.ok ? data : null);
    } catch (e) {
      setGraphs(null);
    } finally {
      setGraphsLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const randomizeInputs = () => {
    const newData = {};
    features.forEach((feature) => {
      const baseline = defaults?.[feature] ?? 0;
      const spread = Math.abs(baseline) * 0.3 || 1;
      const randomized = baseline + (Math.random() - 0.5) * 2 * spread;
      newData[feature] = parseFloat(randomized.toFixed(4));
    });
    setFormData(newData);
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://16.171.150.121/predictive-maintenance/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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

  const generateChartConfig = (graphData) => {
    if (!graphData || !graphData.series || graphData.series.length === 0) return null;
    const colors = ['#0F2C59', '#3D5B90', '#7390D8', '#A2C5FD', '#96CEB4', '#45B7D1', '#FF6B6B', '#EADFB4', '#F4A261', '#E76F51'];
    return {
      data: {
        labels: graphs?.labels || [],
        datasets: graphData.series.map((s, i) => ({
          label: s.name,
          data: s.values,
          borderColor: colors[i % colors.length],
          backgroundColor: colors[i % colors.length] + '20',
          borderWidth: 2,
          tension: 0,
          pointRadius: 2,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: graphData.title }
        },
        scales: {
          x: { title: { display: true, text: 'Time' } },
          y: { title: { display: true, text: 'Value' }, beginAtZero: false }
        }
      }
    };
  };

  const getHealthColor = (status) => {
    if (status === 'CRITICAL') return 'text-red-600 bg-red-100';
    if (status === 'Minor Degradation') return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-cream to-water-warm">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-water-blue">🔧 Predictive Maintenance</h1>
          <p className="text-water-light mt-2">Monitor asset health and predict remaining useful life (RUL)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
            <h2 className="text-2xl font-semibold text-water-blue mb-4">Sensor Readings</h2>
            
            {features.length === 0 ? (
              <div className="text-water-light">Loading features...</div>
            ) : (
              <>
                <div className="max-h-96 overflow-y-auto mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((f) => (
                      <div key={f}>
                        <label className="block text-sm font-medium text-water-blue mb-1">{f}</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={formData[f] || 0}
                          onChange={(e) => handleInputChange(f, e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 text-sm"
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
                    {loading ? 'Predicting...' : '🚀 Predict Asset Health'}
                  </button>
                </div>

                {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}

                {prediction && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Prediction Results</h3>
                    <div className={`p-3 rounded-lg ${getHealthColor(prediction.health_status)}`}>
                      <div className="font-bold text-lg">{prediction.health_status}</div>
                    </div>
                    <div className="mt-2 text-sm">
                      <div>RUL: <strong>{prediction.rul} cycles</strong></div>
                      <div>Failure Probability: <strong>{prediction.failure_probability}%</strong></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Results Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
            <h2 className="text-2xl font-semibold text-water-blue mb-4">Asset Health Status</h2>
            {prediction ? (
              <div className="space-y-4">
                <div className={`p-6 rounded-lg ${getHealthColor(prediction.health_status)}`}>
                  <div className="text-3xl font-bold mb-2">{prediction.health_status}</div>
                  <div className="text-sm opacity-75">Current Status</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600">Remaining Useful Life</div>
                    <div className="text-2xl font-bold text-blue-800">{prediction.rul} cycles</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-sm text-orange-600">Failure Probability</div>
                    <div className="text-2xl font-bold text-orange-800">{prediction.failure_probability}%</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-water-light">
                <div className="text-6xl mb-4">🔧</div>
                <p>Enter sensor readings and click "Predict Asset Health" to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* 6 Line Charts */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl border border-water-pale p-6">
          <h2 className="text-2xl font-semibold text-water-blue mb-6">📊 Sensor Data Trends</h2>
          {graphsLoading ? (
            <div className="text-water-light text-center py-8">Loading charts...</div>
          ) : !graphs?.graphs ? (
            <div className="text-water-light text-center py-8">No data yet. Make a prediction first.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {graphs.graphs.graph1 && (
                <div className="h-[400px]">
                  {generateChartConfig(graphs.graphs.graph1) && (
                    <Line {...generateChartConfig(graphs.graphs.graph1)} />
                  )}
                </div>
              )}
              {graphs.graphs.graph2 && (
                <div className="h-[400px]">
                  {generateChartConfig(graphs.graphs.graph2) && (
                    <Line {...generateChartConfig(graphs.graphs.graph2)} />
                  )}
                </div>
              )}
              {graphs.graphs.graph3 && (
                <div className="h-[400px]">
                  {generateChartConfig(graphs.graphs.graph3) && (
                    <Line {...generateChartConfig(graphs.graphs.graph3)} />
                  )}
                </div>
              )}
              {graphs.graphs.graph4 && (
                <div className="h-[400px]">
                  {generateChartConfig(graphs.graphs.graph4) && (
                    <Line {...generateChartConfig(graphs.graphs.graph4)} />
                  )}
                </div>
              )}
              {graphs.graphs.graph5 && (
                <div className="h-[400px]">
                  {generateChartConfig(graphs.graphs.graph5) && (
                    <Line {...generateChartConfig(graphs.graphs.graph5)} />
                  )}
                </div>
              )}
              {graphs.graphs.graph6 && (
                <div className="h-[400px]">
                  {generateChartConfig(graphs.graphs.graph6) && (
                    <Line {...generateChartConfig(graphs.graphs.graph6)} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictiveMaintenance;

