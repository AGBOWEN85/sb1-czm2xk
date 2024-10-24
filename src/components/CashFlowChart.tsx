import { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CashFlowPrediction } from '../types/financial';
import { format } from 'date-fns';
import { usePredictionStore } from '../store/predictionStore';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const CustomTooltip = memo(({ active, payload, label }: any) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white p-4 rounded shadow-lg border border-gray-200">
      <p className="font-bold mb-2">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
      <p className="text-sm text-gray-500 mt-2">
        Confidence: {(payload[0]?.payload?.confidence * 100).toFixed(1)}%
      </p>
    </div>
  );
});

CustomTooltip.displayName = 'CustomTooltip';

export const CashFlowChart = memo(() => {
  const predictions = usePredictionStore((state) => state.predictions);

  const formattedData = predictions.map(pred => ({
    ...pred,
    date: format(new Date(pred.date), 'MMM yyyy'),
  }));

  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Cash Flow Forecast</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="predictedRevenue" 
            stroke="#4CAF50"
            name="Revenue"
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="predictedExpenses" 
            stroke="#f44336"
            name="Expenses"
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="predictedCashFlow" 
            stroke="#2196F3"
            name="Cash Flow"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});