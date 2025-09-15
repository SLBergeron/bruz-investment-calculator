import React from 'react';
import { Download, FileText, FileSpreadsheet, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const DownloadSection: React.FC = () => {
  const documents = [
    {
      name: 'Analysis Report PDF',
      description: 'Complete pedagogical report with local market analysis and recommendations',
      fileName: 'bruz_invest_report.pdf',
      icon: FileText,
      type: 'PDF',
      color: 'text-red-600 bg-red-50 border-red-200'
    },
    {
      name: 'Excel Calculator',
      description: 'Interactive Excel file with all calculations and sensitivity analysis',
      fileName: 'bruz_calculator.xlsx',
      icon: FileSpreadsheet,
      type: 'Excel',
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    {
      name: 'Python Simulator',
      description: 'Python script with all calculation logic for advanced customization',
      fileName: 'bruz_simulator.py',
      icon: Code,
      type: 'Python',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    }
  ];

  const handleDownload = (fileName: string) => {
    const link = document.createElement('a');
    // Use Vite's BASE_URL for proper environment compatibility
    link.href = `${import.meta.env.BASE_URL}${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Download Documents
          </h1>
          <p className="text-muted-foreground text-lg">
            Access complete investment analysis documents
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                      <CardTitle className="text-lg mb-2">{doc.name}</CardTitle>
                      <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${doc.color}`}>
                        {doc.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {doc.description}
                    </p>
                    
                    <Button
                      onClick={() => handleDownload(doc.fileName)}
                      className="w-full"
                      size="lg"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>About These Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              These documents were generated as part of the investment analysis for the Bruz (35) apartment. 
              The PDF report contains a complete local market analysis, the Excel calculations allow parameter 
              customization, and the Python script offers total flexibility for advanced analysis.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DownloadSection;