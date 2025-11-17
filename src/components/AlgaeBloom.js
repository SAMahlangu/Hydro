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

const AlgaeBloom = () => {
  const [form, setForm] = useState({
    temperature: 27.5,
    ph: 8.0,
    turbidity: 10.0,
    dissolved_oxygen: 5.0,
    nitrate: 6.0,
    phosphate: 3.0,
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [graphs, setGraphs] = useState(null);
  const [graphsLoading, setGraphsLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const predict = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/algae/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
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

  const loadGraphs = async () => {
    setGraphsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/algae/graphs');
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
          pointRadius: 3,
          tension: 0,
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

  const riskBarConfig = useMemo(() => {
    if (!graphs?.risk_bar) return null;
    return {
      data: {
        labels: graphs.risk_bar.labels,
        datasets: [{
          label: 'Count',
          data: graphs.risk_bar.values,
          backgroundColor: ['green','yellow','orange','red']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, title: { display: true, text: graphs.risk_bar.title } },
        scales: { x: { title: { display: true, text: 'Risk Category' } }, y: { title: { display: true, text: 'Samples' }, beginAtZero: true } }
      }
    };
  }, [graphs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-cream to-water-warm">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-water-blue">🌿 Algae Bloom Prediction</h1>
          <p className="text-water-light mt-2">Predict bloom risk and auto-log to CSV. Charts read from CSV.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['temperature','ph','turbidity','dissolved_oxygen','nitrate','phosphate'].map((k) => (
                <div key={k}>
                  <label className="block text-sm font-medium text-water-blue mb-1">{k.replace('_',' ').replace('_',' ').toUpperCase()}</label>
                  <input name={k} type="number" step="0.01" value={form[k]} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
              ))}
            </div>
            <button type="button" onClick={predict} disabled={loading} className="mt-6 bg-water-primary hover:bg-water-dark text-white px-6 py-3 rounded-lg font-semibold shadow-water disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {loading ? 'Predicting...' : '🔮 Predict Bloom Risk'}
            </button>
            {error && <div className="mt-4 text-red-600">{error}</div>}
            {prediction && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 font-semibold">Risk: {prediction.risk_level} ({prediction.prediction})</div>
                <div className="text-sm text-green-800 mt-1">Saved to: {prediction.results_file}</div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
            <h2 className="text-2xl font-semibold text-water-blue mb-4">📊 Charts</h2>
            {graphsLoading ? (
              <div className="text-water-light">Loading charts...</div>
            ) : !graphs ? (
              <div className="text-water-light">No data yet. Make a prediction first.</div>
            ) : (
              <div className="space-y-8">
                <div className="h-[320px]">{trendConfig && <Line data={trendConfig.data} options={trendConfig.options} />}</div>
                <div className="h-[320px]">{riskBarConfig && <Bar data={riskBarConfig.data} options={riskBarConfig.options} />}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgaeBloom;



