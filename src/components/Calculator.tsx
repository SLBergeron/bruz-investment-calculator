import React, { useState, useEffect } from 'react';
import { Calculator as CalculatorIcon } from 'lucide-react';
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

const Calculator: React.FC = () => {
  // Paramètres d'entrée avec valeurs par défaut du fichier Python
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* En-tête */}
      <div className="text-center bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <CalculatorIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Simulateur d'Investissement Immobilier
          </h1>
        </div>
        <p className="text-lg text-gray-600">Bruz (35) — Appartement 57 m² à 200 000 €</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de paramètres */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Paramètres du projet</h2>
          
          <div className="space-y-6">
            {/* Section Bien immobilier */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800">Bien immobilier</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix du bien (€)
                  </label>
                  <input
                    type="number"
                    value={parametres.prix}
                    onChange={(e) => handleInputChange('prix', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section Financement */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800">Financement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Revenus nets mensuels (€)
                  </label>
                  <input
                    type="number"
                    value={parametres.revenuNet}
                    onChange={(e) => handleInputChange('revenuNet', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section Location */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loyer au m² (€/m²/mois)
                  </label>
                  <input
                    type="number"
                    value={parametres.loyerM2}
                    onChange={(e) => handleInputChange('loyerM2', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taux de vacance (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={parametres.vacancePct * 100}
                    onChange={(e) => handleInputChange('vacancePct', Number(e.target.value) / 100)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section Croissance */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800">Croissance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Croissance base (%/an)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={parametres.croissanceBase * 100}
                    onChange={(e) => handleInputChange('croissanceBase', Number(e.target.value) / 100)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Croissance optimiste (%/an)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={parametres.croissanceOptimiste * 100}
                    onChange={(e) => handleInputChange('croissanceOptimiste', Number(e.target.value) / 100)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sélection du scénario */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800">Scénario</h3>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="scenario"
                    value="base"
                    checked={scenario === 'base'}
                    onChange={(e) => setScenario(e.target.value as 'base' | 'optimiste')}
                    className="mr-2"
                  />
                  <span>Scénario Base ({formatPercentage(parametres.croissanceBase)}/an)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="scenario"
                    value="optimiste"
                    checked={scenario === 'optimiste'}
                    onChange={(e) => setScenario(e.target.value as 'base' | 'optimiste')}
                    className="mr-2"
                  />
                  <span>Scénario Optimiste ({formatPercentage(parametres.croissanceOptimiste)}/an)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Affichage des résultats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Résultats de simulation</h2>
          
          {resultats && (
            <div className="space-y-6">
              {/* Conformité HCSF */}
              <div className={`p-4 rounded-lg ${resultats.conformiteHCSF.conforme ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className={`font-medium ${resultats.conformiteHCSF.conforme ? 'text-green-800' : 'text-red-800'}`}>
                  {resultats.conformiteHCSF.message}
                </p>
              </div>

              {/* Financement */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-800">Financement</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Montant du prêt</p>
                    <p className="font-semibold">{formatCurrency(resultats.montantPret)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mensualité P&I</p>
                    <p className="font-semibold">{formatCurrency(resultats.mensualitePI)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Assurance mensuelle</p>
                    <p className="font-semibold">{formatCurrency(resultats.assuranceMensuelle)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mensualité totale</p>
                    <p className="font-semibold">{formatCurrency(resultats.mensualiteTotal)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Taux d'endettement (DTI)</p>
                    <p className="font-semibold text-lg">{formatPercentage(resultats.dti)}</p>
                  </div>
                </div>
              </div>

              {/* Projections */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-800">Projections de valeur</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Valeur à 5 ans</p>
                    <p className="font-semibold">{formatCurrency(resultats.valeurProjectee5ans)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Valeur à 10 ans</p>
                    <p className="font-semibold">{formatCurrency(resultats.valeurProjectee10ans)}</p>
                  </div>
                </div>
              </div>

              {/* Analyse locative */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-800">Analyse locative</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Loyer annuel net</p>
                    <p className="font-semibold">{formatCurrency(resultats.loyerAnnuelNet)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cash-flow annuel</p>
                    <p className={`font-semibold ${resultats.cashflowLocatif < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(resultats.cashflowLocatif)}
                    </p>
                  </div>
                </div>
              </div>

              {/* TRI */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-800">TRI sur 10 ans</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">TRI nominal</p>
                    <p className="font-semibold">
                      {resultats.triNominal ? formatPercentage(resultats.triNominal) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">TRI réel (inflation 2%)</p>
                    <p className="font-semibold">
                      {resultats.triReel ? formatPercentage(resultats.triReel) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;