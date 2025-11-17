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
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

const defaultForm = () => ({
  model_name: '',
  pressure: 500,
  flow: 100,
  lat: -33.9,
  lon: 151.2,
  timestamp: new Date().toISOString(),
});

const randomizeValues = () => ({
  pressure: +(Math.random() * (700 - 200) + 200).toFixed(2),
  flow: +(Math.random() * (300 - 50) + 50).toFixed(2),
  lat: +(Math.random() * (-30 + 35) - 35).toFixed(5),
  lon: +(Math.random() * (145 - 140) + 140).toFixed(5),
  timestamp: new Date().toISOString(),
});

const severityColors = {
  HIGH: '#FF4C4C',
  MEDIUM: '#FFAA00',
  LOW: '#3B82F6',
};

const LeakageDetection = () => {
  const [models, setModels] = useState([]);
  const [form, setForm] = useState(defaultForm());
  const [result, setResult] = useState(null);
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('http://localhost:5000/leakage/models');
        const data = await res.json();
        setModels(data.models || []);
        setForm(prev => ({
          ...prev,
          model_name: data.default || data.models?.[0] || '',
        }));
      } catch (e) {
        setError('Failed to load leakage models.');
      }
    };
    fetchModels();
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const res = await fetch('http://localhost:5000/leakage/summary');
      const data = await res.json();
      setSummary(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRandomize = () => {
    const random = randomizeValues();
    setForm(prev => ({
      ...prev,
      ...random,
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/leakage/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Prediction failed');
      setResult(data);
      setReport(data.report);
      await loadSummary();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const severityChart = useMemo(() => {
    if (!summary?.severity_counts) return null;
    const labels = Object.keys(summary.severity_counts);
    const values = Object.values(summary.severity_counts);
    const palette = labels.map(label => severityColors[label] || '#3B82F6');
    return {
      data: {
        labels,
        datasets: [{
          label: 'Count',
          data: values,
          backgroundColor: palette,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Severity Distribution' },
        },
        scales: {
          x: { title: { display: true, text: 'Severity' } },
          y: { title: { display: true, text: 'Count' }, beginAtZero: true },
        },
      },
    };
  }, [summary]);

  const scoreChart = useMemo(() => {
    if (!summary?.score_history || summary.score_history.length === 0) return null;
    const labels = summary.score_history.map(item => item.timestamp);
    const values = summary.score_history.map(item => item.score);
    return {
      data: {
        labels,
        datasets: [{
          label: 'Anomaly Score',
          data: values,
          borderColor: '#0F2C59',
          backgroundColor: 'rgba(15, 44, 89, 0.1)',
          borderWidth: 2,
          tension: 0.2,
          pointRadius: 3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Anomaly Score Over Time' },
        },
        scales: {
          x: { title: { display: true, text: 'Timestamp' } },
          y: { title: { display: true, text: 'Score (0-1)' }, beginAtZero: true, max: 1 },
        },
      },
    };
  }, [summary]);

  const mapCenter = useMemo(() => {
    if (summary?.map_markers && summary.map_markers.length > 0) {
      const avgLat = summary.map_markers.reduce((sum, m) => sum + m.lat, 0) / summary.map_markers.length;
      const avgLon = summary.map_markers.reduce((sum, m) => sum + m.lon, 0) / summary.map_markers.length;
      return [avgLat, avgLon];
    }
    return [0, 0];
  }, [summary]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-cream to-water-warm">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-water-blue">💧 Leakage Detection Dashboard</h1>
          <p className="text-water-light mt-2">Detect leaks/anomalies, generate reports, and visualize locations in real time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-water-blue mb-1">Model</label>
                <select name="model_name" value={form.model_name} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2">
                  {models.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-water-blue mb-1">Pressure (kPa)</label>
                  <input type="number" name="pressure" value={form.pressure} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-water-blue mb-1">Flow (L/s)</label>
                  <input type="number" name="flow" value={form.flow} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-water-blue mb-1">Latitude</label>
                  <input type="number" name="lat" value={form.lat} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-water-blue mb-1">Longitude</label>
                  <input type="number" name="lon" value={form.lon} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-water-blue mb-1">Timestamp (ISO)</label>
                <input type="text" name="timestamp" value={form.timestamp} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button type="button" onClick={handleRandomize} className="px-4 py-2.5 border-2 border-water-primary text-water-primary rounded-lg hover:bg-water-primary hover:text-white transition-all font-medium">
                🎲 Randomize
              </button>
              <button type="button" onClick={handlePredict} disabled={loading} className="flex-1 bg-water-primary hover:bg-water-dark text-white px-6 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-water transition-all">
                {loading ? 'Predicting...' : '🚀 Run Detection'}
              </button>
            </div>

            {error && <div className="mt-4 text-red-600">{error}</div>}

            {result && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-water-blue font-semibold text-lg">Anomaly Score: {result.anomaly_score}</p>
                  <p className="text-water-blue">Severity: <span className="font-bold">{result.severity}</span></p>
                </div>
                <div className="p-4 bg-white border border-water-pale rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-water-blue">{report}</pre>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
            <h2 className="text-2xl font-semibold text-water-blue mb-4">📍 Map View</h2>
            <div className="h-[360px] rounded-lg overflow-hidden border border-water-pale">
              <MapContainer center={mapCenter} zoom={summary?.map_markers?.length ? 6 : 2} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {(summary?.map_markers || []).map((marker, idx) => (
                  <CircleMarker
                    key={`${marker.lat}-${marker.lon}-${idx}`}
                    center={[marker.lat, marker.lon]}
                    radius={8}
                    color={severityColors[marker.severity] || '#0F2C59'}
                    fillOpacity={0.7}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p><strong>{marker.model}</strong></p>
                        <p>Severity: {marker.severity}</p>
                        <p>{marker.timestamp}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
                {result && (
                  <CircleMarker
                    center={[result.lat, result.lon]}
                    radius={10}
                    color="#FF0000"
                    fillOpacity={0.8}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p><strong>{result.model}</strong></p>
                        <p>Severity: {result.severity}</p>
                        <p>{new Date(result.timestamp).toLocaleString()}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                )}
              </MapContainer>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
            <h2 className="text-2xl font-semibold text-water-blue mb-4">📊 Severity Distribution</h2>
            <div className="h-[320px]">
              {severityChart ? (
                <Bar data={severityChart.data} options={severityChart.options} />
              ) : (
                <p className="text-water-light">No data yet.</p>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
            <h2 className="text-2xl font-semibold text-water-blue mb-4">📈 Anomaly Score Trend</h2>
            <div className="h-[320px]">
              {scoreChart ? (
                <Line data={scoreChart.data} options={scoreChart.options} />
              ) : (
                <p className="text-water-light">No data yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeakageDetection;


