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
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ChartsDisplayProps {
  initialPrice: number;
  baseGrowth: number;
  optimisticGrowth: number;
}

const ChartsDisplay: React.FC<ChartsDisplayProps> = ({
  initialPrice,
  baseGrowth,
  optimisticGrowth
}) => {
  // Generate data for projections chart
  const years = Array.from({ length: 11 }, (_, i) => i);
  const projectionsData = years.map(year => ({
    year,
    base: valeurProjetee(initialPrice, baseGrowth, year),
    optimistic: valeurProjetee(initialPrice, optimisticGrowth, year)
  }));

  // Data for comparison chart at 5 and 10 years
  const comparisonData = [
    {
      period: '5 years',
      base: valeurProjetee(initialPrice, baseGrowth, 5),
      optimistic: valeurProjetee(initialPrice, optimisticGrowth, 5)
    },
    {
      period: '10 years',
      base: valeurProjetee(initialPrice, baseGrowth, 10),
      optimistic: valeurProjetee(initialPrice, optimisticGrowth, 10)
    }
  ];

  const formatTooltipValue = (value: number) => [formatCurrency(value), ''];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Property Value Projections
          </h1>
          <p className="text-muted-foreground">
            Investment analysis charts for Bruz property
          </p>
        </div>

        <div className="space-y-8">
          {/* 10-year projections chart */}
          <Card>
            <CardHeader>
              <CardTitle>Value Evolution Over 10 Years</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectionsData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="year" 
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      className="text-muted-foreground"
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                    />
                    <Tooltip 
                      formatter={formatTooltipValue}
                      labelFormatter={(label) => `Year ${label}`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="base"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "hsl(var(--primary))" }}
                      name={`Base Scenario (${(baseGrowth * 100).toFixed(1)}%/year)`}
                    />
                    <Line
                      type="monotone"
                      dataKey="optimistic"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#10b981" }}
                      name={`Optimistic Scenario (${(optimisticGrowth * 100).toFixed(1)}%/year)`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Comparison chart at 5 and 10 years */}
          <Card>
            <CardHeader>
              <CardTitle>Scenario Comparison at 5 and 10 Years</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="period"
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      className="text-muted-foreground"
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                    />
                    <Tooltip 
                      formatter={formatTooltipValue}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="base" 
                      fill="hsl(var(--primary))" 
                      name={`Base Scenario (${(baseGrowth * 100).toFixed(1)}%/year)`}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="optimistic" 
                      fill="#10b981" 
                      name={`Optimistic Scenario (${(optimisticGrowth * 100).toFixed(1)}%/year)`}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Projection Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-muted-foreground">Initial Value:</p>
                  <p className="text-2xl font-bold">{formatCurrency(initialPrice)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Potential Gain (10 years, optimistic):</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(valeurProjetee(initialPrice, optimisticGrowth, 10) - initialPrice)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChartsDisplay;