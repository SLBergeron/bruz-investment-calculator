import { useState } from 'react';
import { Calculator, BarChart3, Download } from 'lucide-react';
import InvestmentCalculator from './components/InvestmentCalculator';
import ChartsDisplay from './components/ChartsDisplay';
import DownloadSection from './components/DownloadSection';
import { Button } from './components/ui/button';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="text-xl font-bold text-foreground">
                Bruz Investment Calculator
              </div>
            </div>
            
            {/* Navigation */}
            <div className="hidden sm:flex space-x-2">
              <Button
                variant={activeTab === 'calculator' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('calculator')}
                className="flex items-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                Calculator
              </Button>
              <Button
                variant={activeTab === 'charts' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('charts')}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Charts
              </Button>
              <Button
                variant={activeTab === 'downloads' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('downloads')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Downloads
              </Button>
            </div>

            {/* Mobile navigation */}
            <div className="sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="border border-input rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value="calculator">🧮 Calculator</option>
                <option value="charts">📊 Charts</option>
                <option value="downloads">📥 Downloads</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main>
        {activeTab === 'calculator' && <InvestmentCalculator />}
        {activeTab === 'charts' && (
          <ChartsDisplay
            initialPrice={200000}
            baseGrowth={0.025}
            optimisticGrowth={0.045}
          />
        )}
        {activeTab === 'downloads' && <DownloadSection />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p className="font-medium">
              Real Estate Investment Simulator - Bruz (35)
            </p>
            <p>
              Report generated on 12/09/2025 - Data based on local market analysis
            </p>
            <p className="text-xs">
              Application built with React, TypeScript and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;