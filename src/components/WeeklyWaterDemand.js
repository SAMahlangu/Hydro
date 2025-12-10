import React, { useEffect, useMemo, useState } from 'react';
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

const WeeklyWaterDemand = () => {
  const [models, setModels] = useState([]);

  // FIXED — correct state format
  const [, setDefaultModel] = useState('');


  const [form, setForm] = useState({
    model_name: '',
    day_of_week: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
    current_level: 850000,
    target_level: 900000,
    max_capacity: 1000000
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lines, setLines] = useState(null);
  const [linesLoading, setLinesLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('http://16.171.142.225/weekly-demand/models');
        const data = await res.json();
        const names = data.models || [];

        setModels(names);

        const chosenDefault = data.default || (names[0] || '');
        setDefaultModel(chosenDefault);

        setForm(prev => ({ ...prev, model_name: chosenDefault }));
      } catch (e) {
        console.error("Failed to load models");
      }
    };

    fetchModels();
    loadLines();
  }, []); // dependency array OK — setDefaultModel is stable

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const predict = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://16.171.142.225/weekly-demand/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_name: form.model_name,
          day_of_week: Number(form.day_of_week),
          current_level: Number(form.current_level),
          target_level: Number(form.target_level),
          max_capacity: Number(form.max_capacity),
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Prediction failed');

      setResult(data);
      await loadLines();

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLines = async () => {
    setLinesLoading(true);
    try {
      const res = await fetch('http://16.171.142.225/weekly-demand/graphs');
      const data = await res.json();
      setLines(res.ok ? data : null);
    } catch (e) {
      setLines(null);
    } finally {
      setLinesLoading(false);
    }
  };

  const lineConfig = useMemo(() => {
    if (!lines?.labels) return null;

    const palette = ['#0F2C59', '#3D5B90', '#45B7D1', '#96CEB4'];

    return {
      data: {
        labels: lines.labels,
        datasets: (lines.series || []).map((s, idx) => ({
          label: s.name,
          data: s.values,
          borderColor: palette[idx % palette.length],
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 3,
          pointRadius: 3,
          tension: 0,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: lines.title || 'Weekly Water Demand & Reservoir Levels'
          }
        },
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Liters' }, beginAtZero: true }
        }
      }
    };
  }, [lines]);

  const REGION_OF_FOCUS = 'North';

  const formatNum = (v) =>
    new Intl.NumberFormat().format(Number(v || 0));

  const summary = useMemo(() => {
    if (!result) return '';

    const statusEmoji =
      result.reservoir_status === 'CRITICAL_OVERFLOW' ? '🔴 CRITICAL: OVERFLOW RISK' :
      result.reservoir_status === 'LOW' ? '🟠 LOW: BELOW 20% CAPACITY' :
      result.reservoir_status === 'BELOW_TARGET' ? '🟡 BELOW TARGET' :
      '🟢 ABOVE TARGET';

    const reason = Number(result.required_pump_volume) > Number(result.predicted_demand)
      ? 'to cover the demand and fill the reservoir to the target level.'
      : 'to cover the predicted demand.';

    const pumpingLine =
      Number(result.required_pump_volume) > 0
        ? `💧 PUMPING REQUIRED: Pump ${formatNum(result.required_pump_volume)} liters ${reason}`
        : '✅ PUMPING NOT REQUIRED: Current reservoir supply is sufficient.';

    return [
      `Demand Forecast & Operational Alert for ${REGION_OF_FOCUS} Region`,
      `1. Predicted Water Demand (Model: ${result.model_name})`,
      `Predicted Consumption: ${formatNum(result.predicted_demand)} liters`,
      '',
      '2. Reservoir Status Check',
      `Current: ${formatNum(result.current_level)} L   Target: ${formatNum(result.target_level)} L   Capacity: ${formatNum(result.max_capacity)} L   Status: ${statusEmoji}`,
      '',
      '3. Pumping Recommendation',
      pumpingLine
    ].join('\n');
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-cream to-water-warm">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-water-dark mb-2">
            💧 Weekly Water Demand
          </h1>
          <p className="text-gray-600 mt-2 font-body">
            Predict demand and log daily values. Charts read from weekly_water_demand.csv.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT PANEL */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
            <div className="grid grid-cols-1 gap-4">
              {/* MODEL SELECT */}
              <div>
                <label className="block text-sm font-medium text-water-dark mb-1 font-heading">
                  Model
                </label>
                <select
                  name="model_name"
                  value={form.model_name}
                  onChange={handleChange}
                  className="w-full border-2 border-water-pale rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-water-primary focus:border-water-primary transition-all"
                >
                  {models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* DAY */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-water-dark mb-1 font-heading">
                    Day of Week (0=Mon, 6=Sun)
                  </label>
                  <input
                    name="day_of_week"
                    type="number"
                    min="0"
                    max="6"
                    value={form.day_of_week}
                    onChange={handleChange}
                    className="w-full border-2 border-water-pale rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-water-primary"
                  />
                </div>
              </div>

              {/* LEVEL FIELDS */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-water-dark mb-1 font-heading">Current Level (L)</label>
                  <input
                    name="current_level"
                    type="number"
                    value={form.current_level}
                    onChange={handleChange}
                    className="w-full border-2 border-water-pale rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-water-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-water-dark mb-1 font-heading">Target Level (L)</label>
                  <input
                    name="target_level"
                    type="number"
                    value={form.target_level}
                    onChange={handleChange}
                    className="w-full border-2 border-water-pale rounded-lg px-4 py-2.5 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-water-dark mb-1 font-heading">Max Capacity (L)</label>
                  <input
                    name="max_capacity"
                    type="number"
                    value={form.max_capacity}
                    onChange={handleChange}
                    className="w-full border-2 border-water-pale rounded-lg px-4 py-2.5 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={predict}
                disabled={loading || !form.model_name}
                className="bg-water-primary hover:bg-water-dark text-white px-6 py-3 rounded-lg font-semibold shadow-water disabled:opacity-50 transition-all flex-1"
              >
                {loading ? 'Predicting...' : '🔮 Predict & Log Today'}
              </button>
            </div>

            {/* ERRORS */}
            {error && <div className="mt-4 text-red-600">{error}</div>}

            {/* RESULT */}
            {result && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 font-semibold">
                  Predicted Demand: {formatNum(result.predicted_demand)} L
                </div>
                <div className="text-sm text-green-800 mt-1">
                  Status: {result.reservoir_status} | Saved: {result.results_file}
                </div>
              </div>
            )}

            {/* SUMMARY */}
            {result && (
              <div className="mt-4 p-4 bg-white border border-water-pale rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-water-blue">
                  {summary}
                </pre>
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-water-pale">
            <h2 className="text-2xl font-heading font-semibold text-water-dark mb-4">
              📈 Demand & Reservoir Levels
            </h2>

            {linesLoading ? (
              <div className="text-water-light">Loading chart...</div>
            ) : !lines ? (
              <div className="text-water-light">No data yet. Make a prediction first.</div>
            ) : (
              <div className="h-[420px]">
                {lineConfig && (
                  <Line
                    data={lineConfig.data}
                    options={lineConfig.options}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyWaterDemand;
