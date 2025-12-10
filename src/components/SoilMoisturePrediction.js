import React, { useEffect, useMemo, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SoilMoisturePrediction = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [drynessThreshold, setDrynessThreshold] = useState(750);
  const [samples, setSamples] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
    fetchModels();
    fetchInitialPrediction();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('http://16.171.142.225/soil-moisture/models');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load soil moisture models');
      setModels(data.models || []);
      setAvailableModels(data.available || []);
      setSelectedModel(data.default_model || data.models?.[0] || '');
      setDrynessThreshold(data.default_threshold ?? 750);
    } catch (e) {
      setError(e.message);
    }
  };

  const fetchInitialPrediction = async () => {
    try {
      const res = await fetch('http://16.171.142.225/soil-moisture/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_name: 'Linear Regression (Best)',
          dryness_threshold: DEFAULTS.dryness,
          samples: DEFAULTS.samples,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      }
    } catch (e) {
      // ignore initial fetch errors silently
    }
  };

  const handlePredict = async () => {
    if (!selectedModel) {
      setError('Please select a model before predicting.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://16.171.142.225/soil-moisture/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_name: selectedModel,
          dryness_threshold: drynessThreshold,
          samples,
        }),
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

  const lineChartConfig = useMemo(() => {
    if (!result?.line?.labels) return null;
    const colours = ['#0F2C59', '#FF6B6B', '#96CEB4', '#3D5B90'];
    const datasets = (result.line.series || []).map((series, idx) => ({
      label: series.name,
      data: series.values,
      borderColor: colours[idx % colours.length],
      backgroundColor: `${colours[idx % colours.length]}33`,
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 2,
      borderDash: series.dashed ? [6, 6] : [],
    }));
    return {
      data: {
        labels: result.line.labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Predicted Soil Moisture Trend' },
        },
        scales: {
          x: { title: { display: true, text: 'Timestamp' } },
          y: { title: { display: true, text: 'Sensor Value' } },
        },
      },
    };
  }, [result]);

  const pieChartConfig = useMemo(() => {
    if (!result?.pie?.labels) return null;
    return {
      data: {
        labels: result.pie.labels,
        datasets: [
          {
            label: 'Soil Condition',
            data: result.pie.values,
            backgroundColor: ['#4CAF50', '#FF9800'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Average Soil Condition Distribution' },
        },
      },
    };
  }, [result]);

  const renderPreviewTable = () => {
    if (!result?.preview?.length) {
      return <div className="text-water-light">No preview data available.</div>;
    }
    const headers = Object.keys(result.preview[0]);
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-water-pale">
          <thead className="bg-water-cream">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-2 text-left text-xs font-semibold text-water-blue uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-water-pale text-sm">
            {result.preview.map((row, idx) => (
              <tr key={idx} className="hover:bg-water-cream/60">
                {headers.map((header) => (
                  <td key={header} className="px-4 py-2 text-water-deep">
                    {typeof row[header] === 'number' ? row[header].toFixed(2) : row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-cream to-water-warm">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-water-blue">🌱 Smart Soil Moisture Dashboard</h1>
          <p className="text-water-light mt-2">
            Simulate soil conditions, forecast moisture, and receive data-driven irrigation guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
            <h2 className="text-2xl font-semibold text-water-blue mb-4">Simulation Settings</h2>

            <label className="block text-sm font-medium text-water-blue mb-2">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
            >
              {models.map((model) => (
                <option key={model} value={model} disabled={!availableModels.includes(model)}>
                  {model}{!availableModels.includes(model) ? ' (Unavailable)' : ''}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-water-blue mb-2">
              Dryness Threshold ({Math.round(drynessThreshold)})
            </label>
            <input
              type="range"
              min="500"
              max="1000"
              step="10"
              value={drynessThreshold}
              onChange={(e) => setDrynessThreshold(Number(e.target.value))}
              className="w-full mb-4"
            />
            <div className="text-xs text-water-light mb-4">
              If the average predicted sensor reading exceeds this value, irrigation is recommended.
            </div>

            <label className="block text-sm font-medium text-water-blue mb-2">
              Number of Simulated Samples ({samples})
            </label>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={samples}
              onChange={(e) => setSamples(Number(e.target.value))}
              className="w-full mb-4"
            />

            <button
              type="button"
              onClick={handlePredict}
              disabled={loading}
              className="w-full bg-water-primary hover:bg-water-dark text-white py-3 px-6 rounded-lg font-semibold shadow-water disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running Simulation...
                </>
              ) : (
                '🔮 Simulate & Predict'
              )}
            </button>

            {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
              <h2 className="text-2xl font-semibold text-water-blue mb-4">Irrigation Recommendation</h2>
              {result?.recommendation ? (
                <div className="p-4 bg-water-cream border border-water-pale rounded-lg text-water-deep">
                  {result.recommendation}
                </div>
              ) : (
                <div className="text-water-light">Run a simulation to receive recommendations.</div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale h-[360px]">
                {lineChartConfig ? (
                  <Line {...lineChartConfig} />
                ) : (
                  <div className="text-water-light flex items-center justify-center h-full">
                    Run a simulation to see the moisture trend.
                  </div>
                )}
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale h-[360px]">
                {pieChartConfig ? (
                  <Pie {...pieChartConfig} />
                ) : (
                  <div className="text-water-light flex items-center justify-center h-full">
                    Run a simulation to view soil condition distribution.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
              <h2 className="text-2xl font-semibold text-water-blue mb-4">Simulated Input Data (First 10 Rows)</h2>
              {renderPreviewTable()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DEFAULTS = {
  dryness: 750,
  samples: 100,
};

export default SoilMoisturePrediction;

