import React from 'react';
import WorldMap from './WorldMap';

const Home = () => {
  return (
    <div className="min-h-screen bg-water-gradient-light relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-water-pattern opacity-30"></div>
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="bg-water-pale/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-water-primary/20 shadow-water-lg max-w-5xl mx-auto mb-8">
            <p className="text-water-dark text-lg font-body leading-relaxed font-medium">
              Comprehensive water data analysis platform featuring Linear Regression and Classification models 
              for accurate water level predictions and stress assessment across different regions.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {/* Water Data Prediction System */}
          <div className="water-card p-8 hover:transform hover:-translate-y-2 group animate-fadeInUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-water-gradient rounded-xl flex items-center justify-center mx-auto mb-4 shadow-water group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌊</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-water-dark mb-4 leading-tight">
                Water Data Linear Regression Prediction
              </h2>
              <p className="text-gray-600 text-base font-body leading-relaxed">
                Predict water levels and environmental metrics using advanced Linear Regression models
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Real-time water measurement analysis</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">9 water measurement parameters</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Trained on gwl-daily.csv dataset</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Instant prediction results</span>
              </div>
            </div>

            <div className="bg-water-pale/30 rounded-xl p-5 border border-water-pale/50">
              <h4 className="font-heading font-bold text-water-dark mb-3 text-sm uppercase tracking-wide">Features:</h4>
              <ul className="text-gray-600 text-sm space-y-1.5 font-body">
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>WLM_RPE_QC, WLM_GSE, WLM_GSE_QC</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>RPE_WSE, RPE_WSE_QC, GSE_WSE</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>GSE_WSE_QC, WSE, WSE_QC</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Real-time API integration</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Water Stress Prediction System */}
          <div className="water-card p-8 hover:transform hover:-translate-y-2 group animate-fadeInUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-water-gradient rounded-xl flex items-center justify-center mx-auto mb-4 shadow-water group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌍</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-water-dark mb-4 leading-tight">
                Water Stress Prediction System
              </h2>
              <p className="text-gray-600 text-base font-body leading-relaxed">
                Classify water stress levels (Low, Moderate, High) for different countries
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Multi-country analysis</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">20 supported countries</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Environmental factors included</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Interactive world map</span>
              </div>
            </div>

            <div className="bg-water-pale/30 rounded-xl p-5 border border-water-pale/50">
              <h4 className="font-heading font-bold text-water-dark mb-3 text-sm uppercase tracking-wide">Features:</h4>
              <ul className="text-gray-600 text-sm space-y-1.5 font-body">
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Water consumption analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Agricultural, Industrial, Household use</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Rainfall and groundwater factors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Country-specific predictions</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Flood Risk Prediction System */}
          <div className="water-card p-8 hover:transform hover:-translate-y-2 group animate-fadeInUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-water-gradient rounded-xl flex items-center justify-center mx-auto mb-4 shadow-water group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌊</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-water-dark mb-4 leading-tight">
                Flood Risk Monitoring System
              </h2>
              <p className="text-gray-600 text-base font-body leading-relaxed">
                Assess flood risk probability using 20 environmental factors
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">20 environmental factors</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Interactive sliders (0-10)</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Data visualization charts</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Real-time risk assessment</span>
              </div>
            </div>

            <div className="bg-water-pale/30 rounded-xl p-5 border border-water-pale/50">
              <h4 className="font-heading font-bold text-water-dark mb-3 text-sm uppercase tracking-wide">Features:</h4>
              <ul className="text-gray-600 text-sm space-y-1.5 font-body">
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Monsoon Intensity, Topography</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>River Management, Deforestation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Climate Change, Infrastructure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Interactive data visualization</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Drought Prediction System */}
          <div className="water-card p-8 hover:transform hover:-translate-y-2 group animate-fadeInUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-water-gradient rounded-xl flex items-center justify-center mx-auto mb-4 shadow-water group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌵</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-water-dark mb-4 leading-tight">
                Drought Prediction System
              </h2>
              <p className="text-gray-600 text-base font-body leading-relaxed">
                Assess drought severity using Random Forest classification
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">15 environmental parameters</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Random Forest classifier</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Time series visualization</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">5 drought severity levels</span>
              </div>
            </div>

            <div className="bg-water-pale/30 rounded-xl p-5 border border-water-pale/50">
              <h4 className="font-heading font-bold text-water-dark mb-3 text-sm uppercase tracking-wide">Features:</h4>
              <ul className="text-gray-600 text-sm space-y-1.5 font-body">
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Temperature, Pressure, Humidity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Wind Speed, Surface Conditions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Time series analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Variable distribution charts</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Soil Moisture Simulation */}
          <div className="water-card p-8 hover:transform hover:-translate-y-2 group animate-fadeInUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-water-gradient rounded-xl flex items-center justify-center mx-auto mb-4 shadow-water group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌱</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-water-dark mb-4 leading-tight">
                Soil Moisture Simulation & Forecasting
              </h2>
              <p className="text-gray-600 text-base font-body leading-relaxed">
                Simulate soil conditions, forecast moisture, and plan irrigation with multi-model analysis
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Five regression models with scaler support</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Fully simulated sensor dataset generation</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Line & pie chart visualizations</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Actionable irrigation recommendations</span>
              </div>
            </div>

            <div className="bg-water-pale/30 rounded-xl p-5 border border-water-pale/50">
              <h4 className="font-heading font-bold text-water-dark mb-3 text-sm uppercase tracking-wide">Features:</h4>
              <ul className="text-gray-600 text-sm space-y-1.5 font-body">
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Linear Regression, Random Forest, KNN, SVR, Decision Tree</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Adjustable dryness threshold (500-1000)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Simulated temperature, humidity, pump status</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Preview of generated input data</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Weekly Demand Forecast */}
          <div className="water-card p-8 hover:transform hover:-translate-y-2 group animate-fadeInUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-water-gradient rounded-xl flex items-center justify-center mx-auto mb-4 shadow-water group-hover:scale-110 transition-transform">
                <span className="text-3xl">📅</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-water-dark mb-4 leading-tight">
                Demand Forecast Model
              </h2>
              <p className="text-gray-600 text-base font-body leading-relaxed">
                Predict future water consumption using time-series models for optimal reservoir and pumping operations
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Historical consumption pattern analysis</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">LSTM and Prophet time-series models</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Weather and event impact modeling</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Multi-horizon predictions (hours/days/weeks)</span>
              </div>
            </div>

            <div className="bg-water-pale/30 rounded-xl p-5 border border-water-pale/50">
              <h4 className="font-heading font-bold text-water-dark mb-3 text-sm uppercase tracking-wide">Features:</h4>
              <ul className="text-gray-600 text-sm space-y-1.5 font-body">
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Historical hourly/daily water consumption data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Temperature, rainfall, calendar events integration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Population trends and seasonal patterns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Operational decision support for pumping and reservoir management</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Leak/Anomaly Detection */}
          <div className="water-card p-8 hover:transform hover:-translate-y-2 group animate-fadeInUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-water-gradient rounded-xl flex items-center justify-center mx-auto mb-4 shadow-water group-hover:scale-110 transition-transform">
                <span className="text-3xl">🔍</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-water-dark mb-4 leading-tight">
                Leak/Anomaly Detection
              </h2>
              <p className="text-gray-600 text-base font-body leading-relaxed">
                Real-time pipeline monitoring using unsupervised anomaly detection for leak and theft identification
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Real-time pressure and flow monitoring</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Autoencoder and Isolation Forest models</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Instant leak location alerts</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Severity classification and mapping</span>
              </div>
            </div>

            <div className="bg-water-pale/30 rounded-xl p-5 border border-water-pale/50">
              <h4 className="font-heading font-bold text-water-dark mb-3 text-sm uppercase tracking-wide">Features:</h4>
              <ul className="text-gray-600 text-sm space-y-1.5 font-body">
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Real-time pressure and flow readings across pipeline network</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Unsupervised anomaly detection (autoencoder/Isolation Forest)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Alerts showing location and severity of suspected leaks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Maintenance crew instant notifications</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Algae Bloom Prediction */}
          <div className="water-card p-8 hover:transform hover:-translate-y-2 group animate-fadeInUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-water-gradient rounded-xl flex items-center justify-center mx-auto mb-4 shadow-water group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌿</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-water-dark mb-4 leading-tight">
                Algae Bloom Prediction
              </h2>
              <p className="text-gray-600 text-base font-body leading-relaxed">
                Predict bloom risk based on water quality parameters and visualize trends and risk distribution
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">6 water quality parameters analysis</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Temperature, pH, Turbidity, DO, Nitrate, Phosphate</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Automatic risk classification and CSV logging</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Trend visualization and risk distribution charts</span>
              </div>
            </div>

            <div className="bg-water-pale/30 rounded-xl p-5 border border-water-pale/50">
              <h4 className="font-heading font-bold text-water-dark mb-3 text-sm uppercase tracking-wide">Features:</h4>
              <ul className="text-gray-600 text-sm space-y-1.5 font-body">
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Predict bloom risk and auto-log to CSV</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Nutrient & Temperature Trends line chart visualization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Bloom Risk Distribution bar chart (Low, Moderate, High, Critical)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Charts read from CSV with real-time updates</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Predictive Maintenance */}
          <div className="water-card p-8 hover:transform hover:-translate-y-2 group animate-fadeInUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-water-gradient rounded-xl flex items-center justify-center mx-auto mb-4 shadow-water group-hover:scale-110 transition-transform">
                <span className="text-3xl">🔧</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-water-dark mb-4 leading-tight">
                Predictive Maintenance / Asset Health
              </h2>
              <p className="text-gray-600 text-base font-body leading-relaxed">
                Monitor asset health and predict maintenance needs using Remaining-Useful-Life models
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Pump vibration and sensor signal analysis</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Remaining-Useful-Life (RUL) estimation</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Failure probability prediction</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Proactive maintenance scheduling</span>
              </div>
            </div>

            <div className="bg-water-pale/30 rounded-xl p-5 border border-water-pale/50">
              <h4 className="font-heading font-bold text-water-dark mb-3 text-sm uppercase tracking-wide">Features:</h4>
              <ul className="text-gray-600 text-sm space-y-1.5 font-body">
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Pump vibration signals, pressure data, maintenance logs, operating hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Remaining-Useful-Life model (RUL) estimates time to failure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Probability of failure within X days for each asset</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Schedule repairs before breakdown, reduce downtime</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Consumption Segmentation & Billing Forecast */}
          <div className="water-card p-8 hover:transform hover:-translate-y-2 group animate-fadeInUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-water-gradient rounded-xl flex items-center justify-center mx-auto mb-4 shadow-water group-hover:scale-110 transition-transform">
                <span className="text-3xl">💰</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-water-dark mb-4 leading-tight">
                Consumption Segmentation & Billing Forecast
              </h2>
              <p className="text-gray-600 text-base font-body leading-relaxed">
                Cluster customers by usage patterns and predict future revenue using advanced ML models
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Customer segmentation with k-Means clustering</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Gradient boosting revenue prediction</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Smart meter data integration</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Monthly revenue forecasting</span>
              </div>
            </div>

            <div className="bg-water-pale/30 rounded-xl p-5 border border-water-pale/50">
              <h4 className="font-heading font-bold text-water-dark mb-3 text-sm uppercase tracking-wide">Features:</h4>
              <ul className="text-gray-600 text-sm space-y-1.5 font-body">
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Customer billing records, demographics, smart meter data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>k-Means clusters customers by usage pattern; gradient boosting predicts future revenue</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>User segments (e.g., high-variance industrial users) and monthly revenue predictions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Data visualization with line, pie, and scatter charts</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Citizen Report NLP Classifier */}
          <div className="water-card p-8 hover:transform hover:-translate-y-2 group animate-fadeInUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-water-gradient rounded-xl flex items-center justify-center mx-auto mb-4 shadow-water group-hover:scale-110 transition-transform">
                <span className="text-3xl">📱</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-water-dark mb-4 leading-tight">
                Citizen Report NLP Classifier
              </h2>
              <p className="text-gray-600 text-base font-body leading-relaxed">
                Automatically classify citizen reports using NLP models and extract key entities for incident management
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Text classification with multiple ML models</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Named entity recognition for locations</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Urgency level detection</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Automated ticket routing</span>
              </div>
            </div>

            <div className="bg-water-pale/30 rounded-xl p-5 border border-water-pale/50">
              <h4 className="font-heading font-bold text-water-dark mb-3 text-sm uppercase tracking-wide">Features:</h4>
              <ul className="text-gray-600 text-sm space-y-1.5 font-body">
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Text or images from mobile apps (e.g., "leak on Main Street")</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Fine-tuned BERT model categorizes each report (leak, pollution, other)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Structured incident ticket with category, urgency, coordinates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Automatically routes complaints to relevant maintenance teams</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Weather & Rainfall Prediction */}
          <div className="water-card p-8 hover:transform hover:-translate-y-2 group animate-fadeInUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-water-gradient rounded-xl flex items-center justify-center mx-auto mb-4 shadow-water group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌦️</span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-water-dark mb-4 leading-tight">
                Weather & Rainfall Prediction
              </h2>
              <p className="text-gray-600 text-base font-body leading-relaxed">
                Forecast weather conditions and rainfall patterns using machine learning models
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Multi-feature weather analysis</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Rainfall amount prediction</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Temperature and precipitation forecasting</span>
              </div>
              <div className="flex items-center">
                <span className="text-water-secondary text-xl mr-3">✓</span>
                <span className="text-water-dark font-medium">Historical data visualization</span>
              </div>
            </div>

            <div className="bg-water-pale/30 rounded-xl p-5 border border-water-pale/50">
              <h4 className="font-heading font-bold text-water-dark mb-3 text-sm uppercase tracking-wide">Features:</h4>
              <ul className="text-gray-600 text-sm space-y-1.5 font-body">
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Temperature, precipitation, wind speed, humidity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Weather classification models (Naive Bayes)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Rainfall regression models</span>
                </li>
                <li className="flex items-start">
                  <span className="text-water-primary mr-2">•</span>
                  <span>Interactive charts and time series analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-water-pale mb-16">
          <h2 className="text-3xl font-bold text-water-blue text-center mb-8">
            🛠️ Technology Stack
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚛️</div>
              <h3 className="text-xl font-semibold text-water-blue mb-2">Frontend</h3>
              <ul className="text-water-light space-y-1">
                <li>React.js</li>
                <li>Tailwind CSS</li>
                <li>React Router</li>
                <li>Leaflet Maps</li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🐍</div>
              <h3 className="text-xl font-semibold text-water-blue mb-2">Backend</h3>
              <ul className="text-water-light space-y-1">
                <li>Flask</li>
                <li>scikit-learn</li>
                <li>Pandas & NumPy</li>
                <li>Joblib</li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-water-blue mb-2">Machine Learning</h3>
              <ul className="text-water-light space-y-1">
                <li>Linear Regression</li>
                <li>Classification Models</li>
                <li>Feature Engineering</li>
                <li>Model Persistence</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive World Map */}
        <div className="mb-16">
          <WorldMap />
        </div>

        {/* Developer Info */}
        <div className="text-center mt-16 mb-8">
          <div className="bg-white rounded-2xl shadow-water-lg p-8 border-t-4 border-water-primary/30 max-w-5xl mx-auto">
            <p className="text-base font-heading font-semibold text-water-dark mb-4 tracking-wide uppercase">
              Developed by
            </p>
            <p className="text-xl font-heading font-bold text-water-dark mb-4 tracking-tight">
              Mondli Ntuthuko Gabela | Sipho Alex Mahlangu | Smangaliso Mashinini
            </p>
            <p className="text-lg font-heading font-semibold text-water-primary mb-5">
              Full-stack AI Developers
            </p>
            <p className="text-base font-body text-gray-600 font-medium">
              Machine Learning | Web Applications | Environmental Risk Analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
