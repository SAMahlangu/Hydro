import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Home from './components/Home';
import WaterPredictionForm from './components/WaterPredictionForm';
import WaterStressPrediction from './components/WaterStressPrediction';
import FloodRiskPrediction from './components/FloodRiskPrediction';
import DroughtPrediction from './components/DroughtPrediction';
import WeatherPrediction from './components/WeatherPrediction';
import BillingForecast from './components/BillingForecast';
import AlgaeBloom from './components/AlgaeBloom';
import RainfallPrediction from './components/RainfallPrediction';
import SoilMoisturePrediction from './components/SoilMoisturePrediction';
import WeeklyWaterDemand from './components/WeeklyWaterDemand';
import LeakageDetection from './components/LeakageDetection';
import PredictiveMaintenance from './components/PredictiveMaintenance';
import CitizenReport from './components/CitizenReport';
import EnergyOptimization from './components/EnergyOptimization';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState('wsd');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'water-prediction':
        return <WaterPredictionForm />;
      case 'water-stress':
        return <WaterStressPrediction />;
      case 'flood-risk':
        return <FloodRiskPrediction />;
      case 'drought':
        return <DroughtPrediction />;
      case 'weather':
        return <WeatherPrediction />;
      case 'billing-forecast':
        return <BillingForecast />;
      case 'algae':
        return <AlgaeBloom />;
      case 'rainfall':
        return <RainfallPrediction />;
      case 'soil-moisture':
        return <SoilMoisturePrediction />;
      case 'weekly-demand':
        return <WeeklyWaterDemand />;
      case 'leakage':
        return <LeakageDetection />;
      case 'predictive-maintenance':
        return <PredictiveMaintenance />;
      case 'citizen-report':
        return <CitizenReport />;
      case 'energy-optimization':
        return <EnergyOptimization />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App bg-water-cream">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        showSidebar={false}
      />
      <div className="flex">
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          showSidebar={true}
        />
        <div className="flex-1 bg-water-cream min-h-screen">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
}

export default App;
