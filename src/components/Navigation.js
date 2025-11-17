import React from 'react';

const Navigation = ({ activeTab, setActiveTab, activeCategory, setActiveCategory, showSidebar = false }) => {
  const categories = [
    {
      id: 'wsd',
      label: 'Water Supply',
      fullName: 'Water Supply & Distribution',
      items: [
        { id: 'weekly-demand', label: 'Demand Forecast' },
        { id: 'leakage', label: 'Leak Detection' }
      ]
    },
    {
      id: 'wqeh',
      label: 'Water Quality',
      fullName: 'Water Quality & Environmental Health',
      items: [
        { id: 'algae', label: 'Algae Bloom Prediction' },
        { id: 'water-prediction', label: 'Water Prediction' }
      ]
    },
    {
      id: 'rhm',
      label: 'Risk & Hazard',
      fullName: 'Rainfall & Hydrological Management',
      items: [
        { id: 'flood-risk', label: 'Flood Forecasting' },
        { id: 'drought', label: 'Drought' }
      ]
    },
    {
      id: 'gs',
      label: 'Groundwater',
      fullName: 'Groundwater & Soil',
      items: [
        { id: 'water-prediction', label: 'Ground Water Level' },
        { id: 'soil-moisture', label: 'Soil Moisture' },
        { id: 'water-stress', label: 'Water Stress' }
      ]
    },
    {
      id: 'io',
      label: 'Infrastructure',
      fullName: 'Infrastructure & Operations',
      items: [
        { id: 'predictive-maintenance', label: 'Predictive Maintenance' },
        { id: 'energy-optimization', label: 'Energy Optimization' }
      ]
    },
    {
      id: 'ced',
      label: 'Climate',
      fullName: 'Climate & Environmental Data',
      items: [
        { id: 'weather', label: 'Seasonal Climate' },
        { id: 'rainfall', label: 'Rainfall Prediction' }
      ]
    },
    {
      id: 'ugl',
      label: 'User & Governance',
      fullName: 'Utilities & Government Liaison',
      items: [
        { id: 'billing-forecast', label: 'Billing Forecast' },
        { id: 'citizen-report', label: 'Citizen Report' }
      ]
    }
  ];

  // Get current category's items
  const currentCategory = categories.find(cat => cat.id === activeCategory) || categories[0];
  const currentItems = currentCategory?.items || [];

  // If showSidebar is true, render the left sidebar
  if (showSidebar) {
    // If on home page, show welcome/navigation content instead of category items
    if (activeTab === 'home') {
      return (
        <aside className="w-64 bg-white min-h-screen sticky top-0 border-r border-water-pale/30 shadow-water-soft">
          <div className="p-6 pt-8">
            <h2 className="text-sm font-heading font-bold text-water-dark uppercase mb-4 px-2 tracking-widest">
              NAVIGATION
            </h2>
            <p className="text-xs text-gray-600 mb-6 px-2 leading-relaxed font-body">
              Select a category above to explore specific features and tools available in each section.
            </p>
            <div className="border-t-2 border-water-pale pt-6">
              <h3 className="text-xs font-heading font-bold text-water-dark uppercase mb-4 px-2 tracking-widest">
                Quick Access
              </h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory(category.id);
                        setActiveTab(category.items[0]?.id || 'home');
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 text-water-dark hover:bg-water-gradient hover:text-white font-medium text-sm"
                    >
                      {category.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      );
    }

    // Otherwise, show category items as before
    return (
      <aside className="w-64 bg-white min-h-screen sticky top-0 border-r border-water-pale/30 shadow-water-soft">
        <div className="p-6 pt-8">
          <h2 className="text-sm font-heading font-bold text-water-dark uppercase mb-6 px-2 tracking-widest">
            ITEMS
          </h2>
          <ul className="space-y-2">
            {currentItems.map(item => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between font-medium text-sm ${
                    activeTab === item.id
                      ? 'bg-water-gradient text-white shadow-water-lg transform scale-105'
                      : 'text-water-dark hover:bg-water-pale/50 hover:text-water-primary'
                  }`}
                >
                  <span>{item.label}</span>
                  <svg className={`w-4 h-4 ${activeTab === item.id ? 'text-white' : 'text-water-primary/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    );
  }

  // Otherwise, render the top navigation bar
  return (
    <nav className="bg-white shadow-water-soft border-b-2 border-water-pale/30 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-water-gradient rounded-lg flex items-center justify-center shadow-water">
              <span className="text-white text-xl font-bold">💧</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('home');
                setActiveCategory('wsd'); // Reset to first category when going home
              }}
              className="text-2xl font-heading font-extrabold bg-water-gradient bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
            >
              WATER MANAGEMENT SYSTEM 4IR
            </button>
          </div>
          
          <div className="flex space-x-1">
            {categories.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveCategory(category.id);
                  // Set first item of category as active if current item is not in this category
                  if (!category.items.find(item => item.id === activeTab)) {
                    setActiveTab(category.items[0]?.id || 'home');
                  }
                }}
                className={`px-4 py-3 font-heading font-semibold text-sm transition-all duration-300 relative rounded-lg cursor-pointer ${
                  activeCategory === category.id
                    ? 'bg-water-gradient text-white shadow-water-lg'
                    : 'text-water-dark hover:bg-water-pale/50 hover:text-water-primary'
                }`}
                title={category.fullName}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

