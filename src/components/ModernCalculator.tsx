import React, { useState, useEffect } from 'react';
import { Calculator as CalculatorIcon, TrendingUp, DollarSign, Home } from 'lucide-react';
import {
  mensualite,
  calculTRI10Ans,
  valeurProjetee,
  verificationHCSF
} from '../lib/calculations';
import { formatCurrency, formatPercentage } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';

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

const ModernCalculator: React.FC = () => {
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
  const [activeSection, setActiveSection] = useState('parameters');

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
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalculatorIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Calculateur d'Investissement
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Bruz (35) — Appartement 57 m² à 200 000 €
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="text-right">
                <div className="text-sm text-gray-500">Dernière mise à jour</div>
                <div className="text-sm font-medium">12/09/2025</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeSection} onChange={setActiveSection}>
          <div className="mb-8">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="parameters">Paramètres</TabsTrigger>
              <TabsTrigger value="results">Résultats</TabsTrigger>
              <TabsTrigger value="scenarios">Scénarios</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="parameters">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Bien immobilier */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-blue-600" />
                    Bien immobilier
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Prix du bien (€)"
                    type="number"
                    value={parametres.prix}
                    onChange={(e) => handleInputChange('prix', Number(e.target.value))}
                  />
                  <Input
                    label="Surface (m²)"
                    type="number"
                    value={parametres.surface}
                    onChange={(e) => handleInputChange('surface', Number(e.target.value))}
                  />
                  <Input
                    label="Apport personnel (€)"
                    type="number"
                    value={parametres.apport}
                    onChange={(e) => handleInputChange('apport', Number(e.target.value))}
                  />
                  <Input
                    label="Frais d'acquisition (%)"
                    type="number"
                    step="0.01"
                    value={parametres.fraisPct * 100}
                    onChange={(e) => handleInputChange('fraisPct', Number(e.target.value) / 100)}
                  />
                </CardContent>
              </Card>

              {/* Financement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Financement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Revenus nets mensuels (€)"
                    type="number"
                    value={parametres.revenuNet}
                    onChange={(e) => handleInputChange('revenuNet', Number(e.target.value))}
                  />
                  <Input
                    label="Taux d'intérêt (%)"
                    type="number"
                    step="0.01"
                    value={parametres.taux * 100}
                    onChange={(e) => handleInputChange('taux', Number(e.target.value) / 100)}
                  />
                  <Input
                    label="Durée du prêt (années)"
                    type="number"
                    value={parametres.annees}
                    onChange={(e) => handleInputChange('annees', Number(e.target.value))}
                  />
                  <Input
                    label="Taux d'assurance (%)"
                    type="number"
                    step="0.01"
                    value={parametres.tauxAssur * 100}
                    onChange={(e) => handleInputChange('tauxAssur', Number(e.target.value) / 100)}
                  />
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Loyer au m² (€/m²/mois)"
                    type="number"
                    value={parametres.loyerM2}
                    onChange={(e) => handleInputChange('loyerM2', Number(e.target.value))}
                  />
                  <Input
                    label="Charges (%)"
                    type="number"
                    step="0.01"
                    value={parametres.chargesPct * 100}
                    onChange={(e) => handleInputChange('chargesPct', Number(e.target.value) / 100)}
                  />
                  <Input
                    label="Taux de vacance (%)"
                    type="number"
                    step="0.01"
                    value={parametres.vacancePct * 100}
                    onChange={(e) => handleInputChange('vacancePct', Number(e.target.value) / 100)}
                  />
                  <div className="pt-2">
                    <Button 
                      onClick={calculer} 
                      className="w-full"
                      size="lg"
                    >
                      Recalculer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results">
            {resultats && (
              <div className="space-y-6">
                {/* Alerte HCSF */}
                <Alert variant={resultats.conformiteHCSF.conforme ? 'success' : 'warning'}>
                  {resultats.conformiteHCSF.message}
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Financement */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Financement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Montant du prêt</span>
                          <span className="font-semibold">{formatCurrency(resultats.montantPret)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Mensualité P&I</span>
                          <span className="font-semibold">{formatCurrency(resultats.mensualitePI)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Assurance</span>
                          <span className="font-semibold">{formatCurrency(resultats.assuranceMensuelle)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Total mensuel</span>
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
                    </CardContent>
                  </Card>

                  {/* Projections */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Projections de valeur</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Valeur actuelle</span>
                          <span className="font-semibold">{formatCurrency(parametres.prix)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Valeur à 5 ans</span>
                          <span className="font-semibold text-blue-600">{formatCurrency(resultats.valeurProjectee5ans)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">Valeur à 10 ans</span>
                          <span className="font-bold text-lg text-blue-600">{formatCurrency(resultats.valeurProjectee10ans)}</span>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Plus-value projetée (10 ans)</div>
                            <div className="text-xl font-bold text-green-600">
                              +{formatCurrency(resultats.valeurProjectee10ans - parametres.prix)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Rentabilité */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Rentabilité</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="scenarios">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comparaison des scénarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Button
                      variant={scenario === 'base' ? 'primary' : 'outline'}
                      onClick={() => setScenario('base')}
                      className="w-full"
                    >
                      Scénario Base ({formatPercentage(parametres.croissanceBase)}/an)
                    </Button>
                    <Button
                      variant={scenario === 'optimiste' ? 'primary' : 'outline'}
                      onClick={() => setScenario('optimiste')}
                      className="w-full"
                    >
                      Scénario Optimiste ({formatPercentage(parametres.croissanceOptimiste)}/an)
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Croissance base (%/an)"
                      type="number"
                      step="0.01"
                      value={parametres.croissanceBase * 100}
                      onChange={(e) => handleInputChange('croissanceBase', Number(e.target.value) / 100)}
                    />
                    <Input
                      label="Croissance optimiste (%/an)"
                      type="number"
                      step="0.01"
                      value={parametres.croissanceOptimiste * 100}
                      onChange={(e) => handleInputChange('croissanceOptimiste', Number(e.target.value) / 100)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModernCalculator;