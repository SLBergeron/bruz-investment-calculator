import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Code } from 'lucide-react';
import ModernCalculator from './ModernCalculator';
import ChartsDisplay from './ChartsDisplay';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Tabs, TabsList, TabsTrigger } from './ui/Tabs';

const ModernDownloadSection: React.FC = () => {
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Documents à télécharger</h2>
        <p className="text-gray-600">
          Accédez aux documents complets de l'analyse d'investissement
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {documents.map((doc, index) => {
          const IconComponent = doc.icon;
          
          return (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className={`inline-flex p-4 rounded-full ${doc.color}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{doc.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${doc.color}`}>
                      {doc.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {doc.description}
                  </p>
                  
                  <Button
                    onClick={() => handleDownload(doc.fileName)}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">À propos de ces documents</h3>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Ces documents ont été générés dans le cadre de l'analyse d'investissement pour l'appartement de Bruz (35). 
            Le rapport PDF contient une analyse complète du marché local, les calculs Excel permettent une personnalisation 
            des paramètres, et le script Python offre une flexibilité totale pour les analyses avancées.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const ModernApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calculator');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="text-xl font-bold text-gray-900">
                Bruz Investment Calculator
              </div>
            </div>
            
            <div className="hidden sm:block">
              <Tabs value={activeTab} onChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="calculator">
                    🧮 Calculateur
                  </TabsTrigger>
                  <TabsTrigger value="charts">
                    📊 Graphiques
                  </TabsTrigger>
                  <TabsTrigger value="downloads">
                    📥 Documents
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Mobile navigation */}
            <div className="sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="calculator">🧮 Calculateur</option>
                <option value="charts">📊 Graphiques</option>
                <option value="downloads">📥 Documents</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <main>
        {activeTab === 'calculator' && <ModernCalculator />}
        {activeTab === 'charts' && (
          <div className="py-8">
            <ChartsDisplay
              prixInitial={200000}
              croissanceBase={0.025}
              croissanceOptimiste={0.045}
            />
          </div>
        )}
        {activeTab === 'downloads' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ModernDownloadSection />
          </div>
        )}
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

export default ModernApp;