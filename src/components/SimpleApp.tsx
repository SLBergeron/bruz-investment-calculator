import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Code } from 'lucide-react';
import SimpleCalculator from './SimpleCalculator';
import ChartsDisplay from './ChartsDisplay';

const SimpleDownloadSection: React.FC = () => {
  const documents = [
    {
      name: 'Rapport d\'analyse PDF',
      description: 'Rapport pédagogique complet avec analyse du marché local et recommandations',
      fileName: 'bruz_invest_report.pdf',
      icon: FileText,
      type: 'PDF',
      color: 'text-red-600 bg-red-50 border-red-200'
    },
    {
      name: 'Calculateur Excel',
      description: 'Fichier Excel interactif avec tous les calculs et analyses de sensibilité',
      fileName: 'bruz_calculator.xlsx',
      icon: FileSpreadsheet,
      type: 'Excel',
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    {
      name: 'Simulateur Python',
      description: 'Script Python avec toute la logique de calcul pour personnalisation avancée',
      fileName: 'bruz_simulator.py',
      icon: Code,
      type: 'Python',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    }
  ];

  const handleDownload = (fileName: string) => {
    const link = document.createElement('a');
    link.href = `./${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Documents à télécharger</h2>
          <p className="text-gray-600 text-lg">
            Accédez aux documents complets de l'analyse d'investissement
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {documents.map((doc, index) => {
            const IconComponent = doc.icon;
            
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="p-8">
                  <div className="text-center space-y-4">
                    <div className={`inline-flex p-4 rounded-full ${doc.color}`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">{doc.name}</h3>
                      <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${doc.color}`}>
                        {doc.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {doc.description}
                    </p>
                    
                    <button
                      onClick={() => handleDownload(doc.fileName)}
                      className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-8 text-center">
            <h3 className="font-semibold text-gray-900 mb-4 text-xl">À propos de ces documents</h3>
            <p className="text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Ces documents ont été générés dans le cadre de l'analyse d'investissement pour l'appartement de Bruz (35). 
              Le rapport PDF contient une analyse complète du marché local, les calculs Excel permettent une personnalisation 
              des paramètres, et le script Python offre une flexibilité totale pour les analyses avancées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SimpleApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calculator');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="text-xl font-bold text-gray-900">
                Bruz Investment Calculator
              </div>
            </div>
            
            {/* Navigation simple */}
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === 'calculator'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                🧮 Calculateur
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === 'charts'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                📊 Graphiques
              </button>
              <button
                onClick={() => setActiveTab('downloads')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === 'downloads'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                📥 Documents
              </button>
            </div>

            {/* Mobile navigation */}
            <div className="sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="calculator">🧮 Calculateur</option>
                <option value="charts">📊 Graphiques</option>
                <option value="downloads">📥 Documents</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <main>
        {activeTab === 'calculator' && <SimpleCalculator />}
        {activeTab === 'charts' && (
          <div className="py-8">
            <ChartsDisplay
              prixInitial={200000}
              croissanceBase={0.025}
              croissanceOptimiste={0.045}
            />
          </div>
        )}
        {activeTab === 'downloads' && <SimpleDownloadSection />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p className="font-medium">
              Simulateur d'investissement immobilier - Bruz (35)
            </p>
            <p>
              Rapport généré le 12/09/2025 - Données basées sur l'analyse du marché local
            </p>
            <p className="text-xs text-gray-500">
              Application créée avec React, TypeScript et Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimpleApp;