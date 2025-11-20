import React, { useState, useEffect } from 'react';

const CitizenReport = () => {
  const [models, setModels] = useState([]);
  const [, setDefaultModel] = useState('');

  const [form, setForm] = useState({
    model_name: '',
    report_text: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingRandom, setLoadingRandom] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('http://16.171.150.121/citizen-report/models');
        const data = await res.json();
        const modelNames = data.models || [];
        
        setModels(modelNames);

        const defaultModelName = data.default || modelNames[0] || '';
        setDefaultModel(defaultModelName);

        setForm(prev => ({
          ...prev,
          model_name: defaultModelName
        }));
      } catch (e) {
        setError('Failed to load citizen report models.');
        console.error(e);
      }
    };

    fetchModels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const loadRandomReport = async () => {
    setLoadingRandom(true);
    setError(null);
    try {
      const res = await fetch('http://16.171.150.121/citizen-report/random');
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to get random report');

      setForm(prev => ({
        ...prev,
        report_text: data.report_text || ''
      }));

    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingRandom(false);
    }
  };

  const handlePredict = async () => {
    if (!form.report_text.trim()) {
      setError('Please enter a report to classify.');
      return;
    }
    if (!form.model_name) {
      setError('Please select a model.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('http://16.171.150.121/citizen-report/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_text: form.report_text,
          model_name: form.model_name
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Classification failed');

      setResult(data);

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(prev => ({
      ...prev,
      report_text: ''
    }));
    setResult(null);
    setError(null);
  };

  const urgencyColors = {
    High: 'bg-red-100 text-red-800 border-red-300',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Low: 'bg-green-100 text-green-800 border-green-300'
  };

  const categoryColors = {
    Leakage: 'bg-blue-100 text-blue-800',
    Pollution: 'bg-red-100 text-red-800',
    'Maintenance Required': 'bg-orange-100 text-orange-800',
    Flooding: 'bg-purple-100 text-purple-800',
    'Infrastructure Damage': 'bg-gray-100 text-gray-800',
    'Water Shortage': 'bg-yellow-100 text-yellow-800',
    Other: 'bg-indigo-100 text-indigo-800'
  };

  return (
    <div className="min-h-screen bg-water-gradient-light relative overflow-hidden">
      <div className="absolute inset-0 bg-water-pattern opacity-30"></div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-water-gradient rounded-full flex items-center justify-center shadow-water-xl mx-auto">
              <span className="text-4xl">📱</span>
            </div>
          </div>
          <h1 className="text-5xl font-heading font-extrabold bg-water-gradient bg-clip-text text-transparent mb-4">
            Citizen Report NLP Classifier
          </h1>
          <p className="text-xl font-body text-water-dark max-w-3xl mx-auto">
            Automatically classify citizen reports and extract key information for efficient incident management
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Input Form */}
          <div className="water-card p-8 animate-fadeInUp">
            <h2 className="text-2xl font-heading font-bold text-water-dark mb-6 flex items-center">
              <span className="mr-3">📝</span>
              Report Classification
            </h2>

            <div className="space-y-6">

              <div>
                <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                  Model
                </label>
                <select
                  name="model_name"
                  value={form.model_name}
                  onChange={handleChange}
                  className="w-full border-2 border-water-pale rounded-lg px-4 py-3 bg-white font-body focus:ring-2 focus:ring-water-primary transition-all"
                >
                  {models.map(m => (
                    <option key={m} value={m}>
                      {m === 'LR' ? 'Logistic Regression' :
                       m === 'NB' ? 'Naive Bayes' :
                       m === 'RM' ? 'Random Forest' :
                       m === 'SVM' ? 'Support Vector Machine' : m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                  Report Text
                </label>
                <textarea
                  name="report_text"
                  value={form.report_text}
                  onChange={handleChange}
                  rows={6}
                  className="w-full border-2 border-water-pale rounded-lg px-4 py-3 bg-white font-body resize-none focus:ring-2 focus:ring-water-primary"
                  placeholder="Enter your water-related report (e.g., 'Leak detected in the main water pipeline near town.')"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={loadRandomReport}
                  disabled={loadingRandom}
                  className="px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium flex-1 disabled:opacity-50"
                >
                  {loadingRandom ? 'Loading...' : '🎲 Load Random Report'}
                </button>

                <button
                  type="button"
                  onClick={handlePredict}
                  disabled={loading}
                  className="flex-1 bg-water-primary hover:bg-water-dark text-white px-6 py-2.5 rounded-lg font-semibold shadow-water disabled:opacity-50"
                >
                  {loading ? 'Classifying...' : '🔮 Classify Report'}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 border-2 border-water-primary text-water-primary rounded-lg hover:bg-water-primary hover:text-white font-medium"
                >
                  Reset
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              )}

            </div>
          </div>

          {/* Results Panel */}
          <div className="water-card p-8 animate-fadeInUp">
            <h2 className="text-2xl font-heading font-bold text-water-dark mb-6 flex items-center">
              <span className="mr-3">🎫</span>
              Incident Ticket
            </h2>

            {!result ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-600 font-body">
                  Enter a report and click "Classify Report" to generate an incident ticket.
                </p>
              </div>
            ) : (
              <div className="space-y-6">

                <div>
                  <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                    Category
                  </label>
                  <div className={`px-4 py-3 rounded-lg border font-semibold ${
                    categoryColors[result.category] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {result.category}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                    Urgency
                  </label>
                  <div className={`px-4 py-3 rounded-lg border font-semibold ${
                    urgencyColors[result.urgency] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {result.urgency}
                  </div>
                </div>

                {result.entities && result.entities.length > 0 && (
                  <div>
                    <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                      Extracted Entities (Locations)
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {result.entities.map((entity, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-water-pale text-water-primary rounded-lg text-sm font-medium border border-water-primary/30"
                        >
                          📍 {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-heading font-semibold text-water-dark mb-2">
                    Summary
                  </label>
                  <div className="bg-water-pale/30 rounded-lg p-4 border border-water-pale/50">
                    <p className="text-water-dark font-body">{result.summary}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-water-pale">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-body">Model Used:</span>
                    <span className="font-semibold text-water-primary">{result.model_name}</span>
                  </div>

                  {result.results_file && (
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600 font-body">Saved to:</span>
                      <span className="text-water-dark font-medium text-xs">{result.results_file}</span>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenReport;
