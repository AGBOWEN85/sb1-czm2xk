export interface FinancialData {
  revenue: number;
  expenses: number;
  date: string;
}

export interface CashFlowPrediction {
  date: string;
  predictedRevenue: number;
  predictedExpenses: number;
  predictedCashFlow: number;
  confidence: number;
}

export interface ScenarioParams {
  newHires?: number;
  capitalInvestment?: number;
  marketingBudget?: number;
  expansionPlans?: boolean;
}

export interface FinancialMetrics {
  grossMargin: number;
  operatingMargin: number;
  netProfitMargin: number;
  currentRatio: number;
  quickRatio: number;
}