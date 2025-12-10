import React, { useEffect, useMemo, useState } from 'react';
import { Line, Pie, Scatter } from 'react-chartjs-2';
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

const BillingForecast = () => {
  const [models, setModels] = useState([]);
  const [form, setForm] = useState({
    model_name: '',
    Consumption_HCF: 10,
    days_in_period: 30,
    borough: 'MANHATTAN',
    rate_class: 'DOMESTIC',
    funding_source: 'CITY',
    month: 1,
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [graphs, setGraphs] = useState(null);
  const [graphsLoading, setGraphsLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('http://16.171.142.225/billing-forecast/models');
        const data = await res.json();
        const names = data.models || [];
        setModels(names);
        setForm(prev => ({ ...prev, model_name: names[0] || '' }));
      } catch (e) {
        // ignore
      }
    };
    fetchModels();
    loadGraphs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const predict = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://16.171.142.225/billing-forecast/predict', {
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
      const res = await fetch('http://16.171.142.225/billing-forecast/graphs');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load graphs');
      setGraphs(data);
    } catch (e) {
      setGraphs(null);
    } finally {
      setGraphsLoading(false);
    }
  };

  const lineConfig = useMemo(() => {
    if (!graphs?.line) return null;
    return {
      data: {
        labels: graphs.line.labels,
        datasets: [
          {
            label: 'Avg Predicted Charges ($)',
            data: graphs.line.values,
            borderColor: '#0F2C59',
            backgroundColor: 'rgba(15,44,89,0.1)',
            borderWidth: 3,
            tension: 0,
            pointRadius: 4,
            pointBackgroundColor: '#0F2C59',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top' },
          title: { display: true, text: graphs.line.title },
        },
        scales: {
          x: { title: { display: true, text: 'Month' } },
          y: { title: { display: true, text: 'Charge ($)' }, beginAtZero: true },
        },
      },
    };
  }, [graphs]);

  const pieConfig = useMemo(() => {
    if (!graphs?.pie) return null;
    const palette = ['#0F2C59', '#3D5B90', '#7390D8', '#A2C5FD', '#EADFB4', '#96CEB4', '#45B7D1', '#FF6B6B'];
    return {
      data: {
        labels: graphs.pie.labels,
        datasets: [
          {
            data: graphs.pie.values,
            backgroundColor: graphs.pie.labels.map((_, i) => palette[i % palette.length]),
            borderColor: '#ffffff',
            borderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: graphs.pie.title }
        }
      }
    };
  }, [graphs]);

  const scatterConfig = useMemo(() => {
    if (!graphs?.scatter) return null;
    // Color by borough label
    const palette = ['#0F2C59', '#3D5B90', '#7390D8', '#A2C5FD', '#96CEB4', '#45B7D1', '#FF6B6B', '#EADFB4'];
    const uniqueLabels = Array.from(new Set(graphs.scatter.labels || []));
    const datasets = uniqueLabels.map((lab, idx) => {
      const points = [];
      (graphs.scatter.labels || []).forEach((l, i) => {
        if (l === lab) points.push({ x: graphs.scatter.x[i], y: graphs.scatter.y[i] });
      });
      return {
        label: lab,
        data: points,
        backgroundColor: palette[idx % palette.length],
      };
    });
    return {
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: graphs.scatter.title }
        },
        scales: {
          x: { title: { display: true, text: 'Consumption (HCF)' } },
          y: { title: { display: true, text: 'Predicted Charge ($)' }, beginAtZero: true }
        }
      }
    };
  }, [graphs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-cream to-water-warm">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-water-blue">💧 Billing Forecast</h1>
          <p className="text-water-light mt-2">Predict charges and persist results to CSV, with graphs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-water-blue mb-1">Model</label>
                <select name="model_name" value={form.model_name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                  {models.map(m => (<option key={m} value={m}>{m}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-water-blue mb-1">Consumption (HCF)</label>
                  <input name="Consumption_HCF" type="number" step="0.01" value={form.Consumption_HCF} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-water-blue mb-1">Days in Period</label>
                  <input name="days_in_period" type="number" value={form.days_in_period} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-water-blue mb-1">Borough</label>
                  <input name="borough" value={form.borough} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-water-blue mb-1">Rate Class</label>
                  <input name="rate_class" value={form.rate_class} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-water-blue mb-1">Funding Source</label>
                  <input name="funding_source" value={form.funding_source} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-water-blue mb-1">Month</label>
                <input name="month" type="number" min="1" max="12" value={form.month} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button 
                type="button"
                onClick={predict} 
                disabled={loading || !form.model_name} 
                className="bg-water-primary hover:bg-water-dark text-white px-6 py-3 rounded-lg font-semibold shadow-water disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-1"
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
                  '🔮 Predict Charge'
                )}
              </button>
            </div>

            {error && <div className="mt-4 text-red-600">{error}</div>}
            {prediction && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 font-semibold">Prediction: ${prediction.prediction}</div>
                <div className="text-sm text-green-800 mt-1">Saved to: {prediction.results_file}</div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
            <h2 className="text-2xl font-semibold text-water-blue mb-4">📈 Graphs</h2>
            {graphsLoading ? (
              <div className="text-water-light">Loading graphs...</div>
            ) : !graphs ? (
              <div className="text-water-light">No graph data yet. Make a prediction first.</div>
            ) : (
              <div className="space-y-8">
                {/* Line chart */}
                <div className="h-[320px]">
                  {lineConfig && <Line data={lineConfig.data} options={lineConfig.options} />}
                </div>
                {/* Pie and Scatter charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-[320px]">
                    {pieConfig && <Pie data={pieConfig.data} options={pieConfig.options} />}
                  </div>
                  <div className="h-[320px]">
                    {scatterConfig && <Scatter data={scatterConfig.data} options={scatterConfig.options} />}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingForecast;


