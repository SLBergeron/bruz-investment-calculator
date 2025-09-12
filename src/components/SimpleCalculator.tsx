import React, { useState, useEffect } from 'react';
import { Calculator as CalculatorIcon, TrendingUp, DollarSign, Home, AlertCircle, CheckCircle } from 'lucide-react';
import {
  mensualite,
  calculTRI10Ans,
  valeurProjetee,
  verificationHCSF
} from '../lib/calculations';
import { formatCurrency, formatPercentage } from '../lib/utils';

interface CalculationResults {
  montantPret: number;
  mensualitePI: number;
  assuranceMensuelle: number;
  mensualiteTotal: number;
  dti: number;
  valeurProjectee5ans: number;
  valeurProjectee10ans: number;
  loyerAnnuelNet: number;
  cashflowLocatif: number;
  triNominal: number | null;
  triReel: number | null;
  conformiteHCSF: {
    conforme: boolean;
    message: string;
  };
}

const SimpleCalculator: React.FC = () => {
  const [parametres, setParametres] = useState({
    prix: 200000,
    surface: 57,
    apport: 50000,
    revenuNet: 2200,
    fraisPct: 0.08,
    taux: 0.0329,
    annees: 25,
    tauxAssur: 0.0015,
    loyerM2: 15,
    chargesPct: 0.3,
    vacancePct: 0.0,
    croissanceBase: 0.025,
    croissanceOptimiste: 0.045,
    inflation: 0.02,
    fraisVentePct: 0.07
  });

  const [resultats, setResultats] = useState<CalculationResults | null>(null);
  const [scenario, setScenario] = useState<'base' | 'optimiste'>('base');

  const calculer = () => {
    const frais = parametres.prix * parametres.fraisPct;
    const montantPret = parametres.prix - (parametres.apport - frais);
    
    const mensualitePI = mensualite(montantPret, parametres.taux, parametres.annees);
    const assuranceMensuelle = montantPret * parametres.tauxAssur / 12;
    const mensualiteTotal = mensualitePI + assuranceMensuelle;
    const dti = mensualiteTotal / parametres.revenuNet;
    
    const loyerBrutAnnuel = parametres.surface * parametres.loyerM2 * 12 * (1 - parametres.vacancePct);
    const loyerAnnuelNet = loyerBrutAnnuel * (1 - parametres.chargesPct);
    
    const croissance = scenario === 'base' ? parametres.croissanceBase : parametres.croissanceOptimiste;
    
    const valeurProjectee5ans = valeurProjetee(parametres.prix, croissance, 5);
    const valeurProjectee10ans = valeurProjetee(parametres.prix, croissance, 10);
    
    const cashflowLocatif = loyerAnnuelNet - (mensualiteTotal * 12);
    
    const { triNominal, triReel } = calculTRI10Ans(
      montantPret,
      loyerAnnuelNet,
      croissance,
      parametres.fraisVentePct,
      parametres.apport,
      parametres.taux,
      parametres.annees,
      assuranceMensuelle,
      parametres.prix
    );
    
    const conformiteHCSF = verificationHCSF(dti);
    
    setResultats({
      montantPret,
      mensualitePI,
      assuranceMensuelle,
      mensualiteTotal,
      dti,
      valeurProjectee5ans,
      valeurProjectee10ans,
      loyerAnnuelNet,
      cashflowLocatif,
      triNominal,
      triReel,
      conformiteHCSF
    });
  };

  useEffect(() => {
    calculer();
  }, [parametres, scenario]);

  const handleInputChange = (field: string, value: number) => {
    setParametres(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CalculatorIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Calculateur d'Investissement Immobilier
                </h1>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                Bruz (35) — Appartement 57 m² à 200 000 €
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerte HCSF */}
        {resultats && (
          <div className={`mb-8 p-4 border rounded-lg flex items-start gap-3 ${
            resultats.conformiteHCSF.conforme 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {resultats.conformiteHCSF.conforme ? (
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 text-sm font-medium">
              {resultats.conformiteHCSF.message}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Panneau de gauche - Paramètres */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Home className="h-5 w-5 text-blue-600" />
                  Bien immobilier
                </h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix du bien (€)
                    </label>
                    <input
                      type="number"
                      value={parametres.prix}
                      onChange={(e) => handleInputChange('prix', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surface (m²)
                    </label>
                    <input
                      type="number"
                      value={parametres.surface}
                      onChange={(e) => handleInputChange('surface', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apport personnel (€)
                    </label>
                    <input
                      type="number"
                      value={parametres.apport}
                      onChange={(e) => handleInputChange('apport', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frais d'acquisition (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={parametres.fraisPct * 100}
                      onChange={(e) => handleInputChange('fraisPct', Number(e.target.value) / 100)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Financement */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Financement
                </h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Revenus nets mensuels (€)
                    </label>
                    <input
                      type="number"
                      value={parametres.revenuNet}
                      onChange={(e) => handleInputChange('revenuNet', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taux d'intérêt (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={parametres.taux * 100}
                      onChange={(e) => handleInputChange('taux', Number(e.target.value) / 100)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée du prêt (années)
                    </label>
                    <input
                      type="number"
                      value={parametres.annees}
                      onChange={(e) => handleInputChange('annees', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taux d'assurance (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={parametres.tauxAssur * 100}
                      onChange={(e) => handleInputChange('tauxAssur', Number(e.target.value) / 100)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Location & Scénarios
                </h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loyer au m² (€/m²/mois)
                    </label>
                    <input
                      type="number"
                      value={parametres.loyerM2}
                      onChange={(e) => handleInputChange('loyerM2', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Charges (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={parametres.chargesPct * 100}
                      onChange={(e) => handleInputChange('chargesPct', Number(e.target.value) / 100)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                    />
                  </div>
                </div>

                {/* Scénarios */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Scénario de croissance
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setScenario('base')}
                      className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                        scenario === 'base'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Base ({formatPercentage(parametres.croissanceBase)}/an)
                    </button>
                    <button
                      onClick={() => setScenario('optimiste')}
                      className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                        scenario === 'optimiste'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Optimiste ({formatPercentage(parametres.croissanceOptimiste)}/an)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panneau de droite - Résultats */}
          <div className="space-y-6">
            {resultats && (
              <>
                {/* Financement */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Financement</h2>
                  </div>
                  <div className="px-6 py-5">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Montant du prêt</span>
                        <span className="font-semibold">{formatCurrency(resultats.montantPret)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Mensualité totale</span>
                        <span className="font-bold text-lg">{formatCurrency(resultats.mensualiteTotal)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Taux d'endettement</span>
                        <span className={`font-bold text-lg ${
                          resultats.dti > 0.35 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatPercentage(resultats.dti)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Projections */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Projections de valeur</h2>
                  </div>
                  <div className="px-6 py-5">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Valeur à 5 ans</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(resultats.valeurProjectee5ans)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Valeur à 10 ans</span>
                        <span className="font-bold text-lg text-blue-600">{formatCurrency(resultats.valeurProjectee10ans)}</span>
                      </div>
                      <div className="pt-4 border-t border-gray-100 text-center">
                        <div className="text-sm text-gray-500">Plus-value projetée (10 ans)</div>
                        <div className="text-xl font-bold text-green-600">
                          +{formatCurrency(resultats.valeurProjectee10ans - parametres.prix)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rentabilité */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Rentabilité</h2>
                  </div>
                  <div className="px-6 py-5">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Loyer annuel net</span>
                        <span className="font-semibold">{formatCurrency(resultats.loyerAnnuelNet)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Cash-flow annuel</span>
                        <span className={`font-semibold ${
                          resultats.cashflowLocatif < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatCurrency(resultats.cashflowLocatif)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">TRI nominal (10 ans)</span>
                        <span className="font-semibold">
                          {resultats.triNominal ? formatPercentage(resultats.triNominal) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">TRI réel (inflation 2%)</span>
                        <span className="font-bold text-lg">
                          {resultats.triReel ? formatPercentage(resultats.triReel) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCalculator;