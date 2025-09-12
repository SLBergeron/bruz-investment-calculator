import React from 'react';
import { Download, FileText, FileSpreadsheet, Code } from 'lucide-react';

const DownloadSection: React.FC = () => {
  const documents = [
    {
      name: 'Rapport d\'analyse PDF',
      description: 'Rapport pédagogique complet avec analyse du marché local et recommandations',
      fileName: 'bruz_invest_report.pdf',
      icon: FileText,
      type: 'PDF',
      color: 'text-red-600 bg-red-50'
    },
    {
      name: 'Calculateur Excel',
      description: 'Fichier Excel interactif avec tous les calculs et analyses de sensibilité',
      fileName: 'bruz_calculator.xlsx',
      icon: FileSpreadsheet,
      type: 'Excel',
      color: 'text-green-600 bg-green-50'
    },
    {
      name: 'Simulateur Python',
      description: 'Script Python avec toute la logique de calcul pour personnalisation avancée',
      fileName: 'bruz_simulator.py',
      icon: Code,
      type: 'Python',
      color: 'text-blue-600 bg-blue-50'
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
          <Download className="h-6 w-6 text-blue-600" />
          Documents à télécharger
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {documents.map((doc, index) => {
            const IconComponent = doc.icon;
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${doc.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${doc.color}`}>
                        {doc.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {doc.description}
                    </p>
                    
                    <button
                      onClick={() => handleDownload(doc.fileName)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">À propos de ces documents</h3>
          <p className="text-sm text-gray-600">
            Ces documents ont été générés dans le cadre de l'analyse d'investissement pour l'appartement de Bruz (35). 
            Le rapport PDF contient une analyse complète du marché local, les calculs Excel permettent une personnalisation 
            des paramètres, et le script Python offre une flexibilité totale pour les analyses avancées.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DownloadSection;