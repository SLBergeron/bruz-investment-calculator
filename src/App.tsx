import { useState } from 'react';
import Calculator from './components/Calculator';
import ChartsDisplay from './components/ChartsDisplay';
import DownloadSection from './components/DownloadSection';

function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'charts' | 'downloads'>('calculator');

  const tabs = [
    { id: 'calculator' as const, label: 'Calculateur', description: 'Simulateur interactif' },
    { id: 'charts' as const, label: 'Graphiques', description: 'Projections visuelles' },
    { id: 'downloads' as const, label: 'Documents', description: 'Téléchargements' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">
                Bruz Investment Calculator
              </h1>
            </div>
            
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu */}
      <main className="py-6">
        {activeTab === 'calculator' && <Calculator />}
        {activeTab === 'charts' && (
          <ChartsDisplay
            prixInitial={200000}
            croissanceBase={0.025}
            croissanceOptimiste={0.045}
          />
        )}
        {activeTab === 'downloads' && <DownloadSection />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              Simulateur d'investissement immobilier - Bruz (35)
            </p>
            <p>
              Rapport généré le 12/09/2025 - Données basées sur l'analyse du marché local
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;