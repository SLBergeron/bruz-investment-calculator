import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Home, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';
import {
  mensualite,
  calculTRI10Ans,
  valeurProjetee,
  verificationHCSF
} from '../lib/calculations';
import { formatCurrency, formatPercentage } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { InputWithUnit } from './ui/input-with-unit';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';

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

const InvestmentCalculator: React.FC = () => {
  const [parameters, setParameters] = useState({
    price: 200000,
    area: 57,
    downPayment: 50000,
    netIncome: 2200,
    feesPercent: 0.08,
    interestRate: 0.0329,
    loanYears: 25,
    insuranceRate: 0.0015,
    rentPerSqm: 15,
    chargesPercent: 0.3,
    vacancyPercent: 0.0,
    baseGrowth: 0.025,
    optimisticGrowth: 0.045,
    inflation: 0.02,
    sellCostPercent: 0.07
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [scenario, setScenario] = useState<'base' | 'optimistic'>('base');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateParameters = () => {
    const errors: Record<string, string> = {};
    
    // Check for NaN/invalid numbers first
    if (!Number.isFinite(parameters.price)) errors.price = "Invalid number";
    else if (parameters.price <= 0) errors.price = "Price must be greater than 0";
    
    if (!Number.isFinite(parameters.area)) errors.area = "Invalid number";
    else if (parameters.area <= 0) errors.area = "Area must be greater than 0";
    
    if (!Number.isFinite(parameters.downPayment)) errors.downPayment = "Invalid number";
    else if (parameters.downPayment < 0) errors.downPayment = "Down payment cannot be negative";
    
    if (!Number.isFinite(parameters.feesPercent)) errors.feesPercent = "Invalid number";
    else if (parameters.feesPercent < 0 || parameters.feesPercent > 1) errors.feesPercent = "Acquisition fees must be between 0% and 100%";
    
    // Calculate fees to validate against total cost (only if values are valid)
    if (Number.isFinite(parameters.price) && Number.isFinite(parameters.feesPercent) && Number.isFinite(parameters.downPayment)) {
      const fees = parameters.price * parameters.feesPercent;
      const totalCost = parameters.price + fees;
      if (parameters.downPayment >= totalCost) errors.downPayment = "Down payment cannot exceed property price plus fees";
    }
    
    if (!Number.isFinite(parameters.netIncome)) errors.netIncome = "Invalid number";
    else if (parameters.netIncome <= 0) errors.netIncome = "Net income must be greater than 0";
    
    if (!Number.isFinite(parameters.interestRate)) errors.interestRate = "Invalid number";
    else if (parameters.interestRate < 0 || parameters.interestRate > 0.2) errors.interestRate = "Interest rate must be between 0% and 20%";
    
    if (!Number.isFinite(parameters.loanYears)) errors.loanYears = "Invalid number";
    else if (parameters.loanYears <= 0 || parameters.loanYears > 50) errors.loanYears = "Loan duration must be between 1 and 50 years";
    
    if (!Number.isFinite(parameters.insuranceRate)) errors.insuranceRate = "Invalid number";
    else if (parameters.insuranceRate < 0 || parameters.insuranceRate > 0.1) errors.insuranceRate = "Insurance rate must be between 0% and 10%";
    
    if (!Number.isFinite(parameters.rentPerSqm)) errors.rentPerSqm = "Invalid number";
    else if (parameters.rentPerSqm <= 0) errors.rentPerSqm = "Rent per m² must be greater than 0";
    
    if (!Number.isFinite(parameters.chargesPercent)) errors.chargesPercent = "Invalid number";
    else if (parameters.chargesPercent < 0 || parameters.chargesPercent > 1) errors.chargesPercent = "Charges must be between 0% and 100%";
    
    if (!Number.isFinite(parameters.vacancyPercent)) errors.vacancyPercent = "Invalid number";
    else if (parameters.vacancyPercent < 0 || parameters.vacancyPercent > 1) errors.vacancyPercent = "Vacancy rate must be between 0% and 100%";
    
    if (!Number.isFinite(parameters.baseGrowth)) errors.baseGrowth = "Invalid number";
    else if (parameters.baseGrowth < -0.05 || parameters.baseGrowth > 0.2) errors.baseGrowth = "Base growth must be between -5% and 20%";
    
    if (!Number.isFinite(parameters.optimisticGrowth)) errors.optimisticGrowth = "Invalid number";
    else if (parameters.optimisticGrowth < -0.05 || parameters.optimisticGrowth > 0.2) errors.optimisticGrowth = "Optimistic growth must be between -5% and 20%";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculate = () => {
    if (!validateParameters()) {
      setResults(null);
      return;
    }

    const fees = parameters.price * parameters.feesPercent;
    const loanAmount = parameters.price + fees - parameters.downPayment;
    
    // Guard against invalid loan amount or NaN values
    if (loanAmount <= 0 || !Number.isFinite(loanAmount)) {
      setResults(null);
      return;
    }
    
    const monthlyPI = mensualite(loanAmount, parameters.interestRate, parameters.loanYears);
    const monthlyInsurance = loanAmount * parameters.insuranceRate / 12;
    const totalMonthly = monthlyPI + monthlyInsurance;
    
    // Add validation to prevent division by zero
    const dti = parameters.netIncome > 0 ? totalMonthly / parameters.netIncome : 0;
    
    const grossAnnualRent = parameters.area * parameters.rentPerSqm * 12 * (1 - parameters.vacancyPercent);
    const netAnnualRent = grossAnnualRent * (1 - parameters.chargesPercent);
    
    const growth = scenario === 'base' ? parameters.baseGrowth : parameters.optimisticGrowth;
    
    const projectedValue5y = valeurProjetee(parameters.price, growth, 5);
    const projectedValue10y = valeurProjetee(parameters.price, growth, 10);
    
    const rentalCashflow = netAnnualRent - (totalMonthly * 12);
    
    // Pass inflation parameter to fix IRR calculation
    const { triNominal, triReel } = calculTRI10Ans(
      loanAmount,
      netAnnualRent,
      growth,
      parameters.sellCostPercent,
      parameters.downPayment,
      parameters.interestRate,
      parameters.loanYears,
      monthlyInsurance,
      parameters.price,
      parameters.inflation
    );
    
    const hcsfCompliance = verificationHCSF(dti);
    
    setResults({
      montantPret: loanAmount,
      mensualitePI: monthlyPI,
      assuranceMensuelle: monthlyInsurance,
      mensualiteTotal: totalMonthly,
      dti,
      valeurProjectee5ans: projectedValue5y,
      valeurProjectee10ans: projectedValue10y,
      loyerAnnuelNet: netAnnualRent,
      cashflowLocatif: rentalCashflow,
      triNominal,
      triReel,
      conformiteHCSF: hcsfCompliance
    });
  };

  useEffect(() => {
    calculate();
  }, [parameters, scenario]);

  const handleInputChange = (field: string, value: number) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }));
    // Trigger validation on input change for real-time feedback
    setTimeout(() => validateParameters(), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  Real Estate Investment Calculator
                </h1>
              </div>
              <p className="text-muted-foreground">
                Bruz (35) — 57 m² Apartment at €200,000
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* HCSF Compliance Alert */}
        {results && (
          <Alert 
            variant={results.conformiteHCSF.conforme ? "success" : "warning"} 
            className="mb-8"
          >
            {results.conformiteHCSF.conforme ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {results.conformiteHCSF.message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="parameters" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="parameters" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Parameters
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Scenarios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parameters" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <InputWithUnit
                    label="Property Price"
                    unit="€"
                    type="number"
                    value={parameters.price}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    helperText="Total purchase price for the 57m² apartment"
                    error={validationErrors.price}
                  />
                  <InputWithUnit
                    label="Area"
                    unit="m²"
                    type="number"
                    value={parameters.area}
                    onChange={(e) => handleInputChange('area', Number(e.target.value))}
                    helperText="Living area of the property"
                    error={validationErrors.area}
                  />
                  <InputWithUnit
                    label="Down Payment"
                    unit="€"
                    type="number"
                    value={parameters.downPayment}
                    onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
                    helperText="Initial cash payment (applied to total cost including fees)"
                    error={validationErrors.downPayment}
                  />
                  <InputWithUnit
                    label="Acquisition Fees"
                    unit="%"
                    type="number"
                    step="0.01"
                    value={parameters.feesPercent * 100}
                    onChange={(e) => handleInputChange('feesPercent', Number(e.target.value) / 100)}
                    helperText="Notary, registration, and agency fees"
                    error={validationErrors.feesPercent}
                  />
                </CardContent>
              </Card>

              {/* Financing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Financing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <InputWithUnit
                    label="Monthly Net Income"
                    unit="€"
                    type="number"
                    value={parameters.netIncome}
                    onChange={(e) => handleInputChange('netIncome', Number(e.target.value))}
                    helperText="Your monthly take-home salary"
                    error={validationErrors.netIncome}
                  />
                  <InputWithUnit
                    label="Interest Rate"
                    unit="%"
                    type="number"
                    step="0.01"
                    value={parameters.interestRate * 100}
                    onChange={(e) => handleInputChange('interestRate', Number(e.target.value) / 100)}
                    helperText="Annual mortgage interest rate"
                    error={validationErrors.interestRate}
                  />
                  <InputWithUnit
                    label="Loan Duration"
                    unit="years"
                    type="number"
                    value={parameters.loanYears}
                    onChange={(e) => handleInputChange('loanYears', Number(e.target.value))}
                    helperText="Mortgage repayment period"
                    error={validationErrors.loanYears}
                  />
                  <InputWithUnit
                    label="Insurance Rate"
                    unit="%"
                    type="number"
                    step="0.01"
                    value={parameters.insuranceRate * 100}
                    onChange={(e) => handleInputChange('insuranceRate', Number(e.target.value) / 100)}
                    helperText="Annual loan insurance premium"
                    error={validationErrors.insuranceRate}
                  />
                </CardContent>
              </Card>

              {/* Rental */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Rental Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <InputWithUnit
                    label="Rent per m²"
                    unit="€/m²/month"
                    type="number"
                    value={parameters.rentPerSqm}
                    onChange={(e) => handleInputChange('rentPerSqm', Number(e.target.value))}
                    helperText="Monthly rent per square meter"
                    error={validationErrors.rentPerSqm}
                  />
                  <InputWithUnit
                    label="Charges"
                    unit="%"
                    type="number"
                    step="0.01"
                    value={parameters.chargesPercent * 100}
                    onChange={(e) => handleInputChange('chargesPercent', Number(e.target.value) / 100)}
                    helperText="Property management and maintenance costs"
                    error={validationErrors.chargesPercent}
                  />
                  <InputWithUnit
                    label="Vacancy Rate"
                    unit="%"
                    type="number"
                    step="0.01"
                    value={parameters.vacancyPercent * 100}
                    onChange={(e) => handleInputChange('vacancyPercent', Number(e.target.value) / 100)}
                    helperText="Expected periods without tenants"
                    error={validationErrors.vacancyPercent}
                  />
                  
                  <Separator className="my-4" />
                  
                  <Button 
                    onClick={calculate} 
                    className="w-full" 
                    size="lg"
                    disabled={Object.keys(validationErrors).length > 0}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Recalculate Investment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {results && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Financing Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Financing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Loan Amount</span>
                        <span className="font-semibold">{formatCurrency(results.montantPret)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Monthly P&I</span>
                        <span className="font-semibold">{formatCurrency(results.mensualitePI)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Insurance</span>
                        <span className="font-semibold">{formatCurrency(results.assuranceMensuelle)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Total Monthly</span>
                        <span className="font-bold text-lg">{formatCurrency(results.mensualiteTotal)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground">Debt-to-Income</span>
                        <span className={`font-bold text-lg ${
                          results.dti > 0.35 ? 'text-destructive' : 'text-green-600'
                        }`}>
                          {formatPercentage(results.dti)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Value Projections */}
                <Card>
                  <CardHeader>
                    <CardTitle>Value Projections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Current Value</span>
                        <span className="font-semibold">{formatCurrency(parameters.price)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">5-Year Value</span>
                        <span className="font-semibold text-primary">{formatCurrency(results.valeurProjectee5ans)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">10-Year Value</span>
                        <span className="font-bold text-lg text-primary">{formatCurrency(results.valeurProjectee10ans)}</span>
                      </div>
                      <div className="pt-4 border-t text-center">
                        <div className="text-sm text-muted-foreground">Projected Gain (10 years)</div>
                        <div className="text-xl font-bold text-green-600">
                          +{formatCurrency(results.valeurProjectee10ans - parameters.price)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Profitability */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profitability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Annual Net Rent</span>
                        <span className="font-semibold">{formatCurrency(results.loyerAnnuelNet)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Annual Cash Flow</span>
                        <span className={`font-semibold ${
                          results.cashflowLocatif < 0 ? 'text-destructive' : 'text-green-600'
                        }`}>
                          {formatCurrency(results.cashflowLocatif)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Nominal IRR (10y)</span>
                        <span className="font-semibold">
                          {results.triNominal ? formatPercentage(results.triNominal) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground">Real IRR (2% inflation)</span>
                        <span className="font-bold text-lg">
                          {results.triReel ? formatPercentage(results.triReel) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Button
                    variant={scenario === 'base' ? 'default' : 'outline'}
                    onClick={() => setScenario('base')}
                    className="w-full"
                  >
                    Base Scenario ({formatPercentage(parameters.baseGrowth)}/year)
                  </Button>
                  <Button
                    variant={scenario === 'optimistic' ? 'default' : 'outline'}
                    onClick={() => setScenario('optimistic')}
                    className="w-full"
                  >
                    Optimistic Scenario ({formatPercentage(parameters.optimisticGrowth)}/year)
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputWithUnit
                    label="Base Growth"
                    unit="%/year"
                    type="number"
                    step="0.01"
                    value={parameters.baseGrowth * 100}
                    onChange={(e) => handleInputChange('baseGrowth', Number(e.target.value) / 100)}
                    helperText="Conservative property value growth"
                    error={validationErrors.baseGrowth}
                  />
                  <InputWithUnit
                    label="Optimistic Growth"
                    unit="%/year"
                    type="number"
                    step="0.01"
                    value={parameters.optimisticGrowth * 100}
                    onChange={(e) => handleInputChange('optimisticGrowth', Number(e.target.value) / 100)}
                    helperText="Optimistic property value growth"
                    error={validationErrors.optimisticGrowth}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InvestmentCalculator;