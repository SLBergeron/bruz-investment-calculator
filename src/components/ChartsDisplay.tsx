import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { valeurProjetee } from '../lib/calculations';
import { formatCurrency } from '../lib/utils';

interface ChartsDisplayProps {
  prixInitial: number;
  croissanceBase: number;
  croissanceOptimiste: number;
}

const ChartsDisplay: React.FC<ChartsDisplayProps> = ({
  prixInitial,
  croissanceBase,
  croissanceOptimiste
}) => {
  // Génération des données pour le graphique de projections
  const annees = Array.from({ length: 11 }, (_, i) => i);
  const donneesProjections = annees.map(annee => ({
    annee,
    base: valeurProjetee(prixInitial, croissanceBase, annee),
    optimiste: valeurProjetee(prixInitial, croissanceOptimiste, annee)
  }));

  // Données pour le graphique de comparaison des scénarios à 5 et 10 ans
  const donneesComparaison = [
    {
      periode: '5 ans',
      base: valeurProjetee(prixInitial, croissanceBase, 5),
      optimiste: valeurProjetee(prixInitial, croissanceOptimiste, 5)
    },
    {
      periode: '10 ans',
      base: valeurProjetee(prixInitial, croissanceBase, 10),
      optimiste: valeurProjetee(prixInitial, croissanceOptimiste, 10)
    }
  ];

  const formatTooltipValue = (value: number) => [formatCurrency(value), ''];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          Projections de valeur immobilière
        </h2>
        
        {/* Graphique de projections sur 10 ans */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Évolution de la valeur sur 10 ans
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={donneesProjections}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="annee" 
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                />
                <Tooltip 
                  formatter={formatTooltipValue}
                  labelFormatter={(label) => `Année ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="base"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name={`Scénario Base (${(croissanceBase * 100).toFixed(1)}%/an)`}
                />
                <Line
                  type="monotone"
                  dataKey="optimiste"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name={`Scénario Optimiste (${(croissanceOptimiste * 100).toFixed(1)}%/an)`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique de comparaison à 5 et 10 ans */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Comparaison des scénarios à 5 et 10 ans
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donneesComparaison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="periode"
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                />
                <Tooltip 
                  formatter={formatTooltipValue}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="base" 
                  fill="#3b82f6" 
                  name={`Scénario Base (${(croissanceBase * 100).toFixed(1)}%/an)`}
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="optimiste" 
                  fill="#10b981" 
                  name={`Scénario Optimiste (${(croissanceOptimiste * 100).toFixed(1)}%/an)`}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Résumé des données */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Résumé des projections</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Valeur initiale:</p>
              <p className="font-semibold">{formatCurrency(prixInitial)}</p>
            </div>
            <div>
              <p className="text-gray-600">Plus-value potentielle (10 ans, scénario optimiste):</p>
              <p className="font-semibold text-green-600">
                {formatCurrency(valeurProjetee(prixInitial, croissanceOptimiste, 10) - prixInitial)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsDisplay;