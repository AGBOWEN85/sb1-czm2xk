import { CashFlowPrediction, FinancialData, ScenarioParams } from '../types/financial';

export class PredictionService {
  private static readonly CONFIDENCE_THRESHOLD = 0.8;
  private static readonly REVENUE_GROWTH_RATE = 0.02;
  private static readonly EXPENSE_GROWTH_RATE = 0.015;
  private static readonly NEW_HIRE_REVENUE_MULTIPLIER = 0.07;
  private static readonly NEW_HIRE_EXPENSE_MULTIPLIER = 0.05;
  private static readonly CAPITAL_REVENUE_MULTIPLIER = 0.00015;
  private static readonly CAPITAL_EXPENSE_MULTIPLIER = 0.0001;

  static predictCashFlow(
    historicalData: FinancialData[],
    months: number = 12
  ): CashFlowPrediction[] {
    const revenueData = historicalData.map(d => d.revenue);
    const expenseData = historicalData.map(d => d.expenses);
    
    const revenueGrowthRate = this.calculateGrowthRate(revenueData);
    const expenseGrowthRate = this.calculateGrowthRate(expenseData);

    return Array.from({ length: months }, (_, i) => {
      const baseRevenue = this.calculateTrend(revenueData);
      const baseExpenses = this.calculateTrend(expenseData);
      
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      
      const predictedRevenue = baseRevenue * Math.pow(1 + revenueGrowthRate, i);
      const predictedExpenses = baseExpenses * Math.pow(1 + expenseGrowthRate, i);
      
      return {
        date: date.toISOString(),
        predictedRevenue,
        predictedExpenses,
        predictedCashFlow: predictedRevenue - predictedExpenses,
        confidence: this.calculateConfidence(i, historicalData.length)
      };
    });
  }

  static simulateScenario(
    baselinePredictions: CashFlowPrediction[],
    params: ScenarioParams
  ): CashFlowPrediction[] {
    const multipliers = this.calculateMultipliers(params);

    return baselinePredictions.map(prediction => {
      const predictedRevenue = prediction.predictedRevenue * multipliers.revenue;
      const predictedExpenses = prediction.predictedExpenses * multipliers.expenses;

      return {
        ...prediction,
        predictedRevenue,
        predictedExpenses,
        predictedCashFlow: predictedRevenue - predictedExpenses,
        confidence: prediction.confidence * 0.9
      };
    });
  }

  private static calculateMultipliers(params: ScenarioParams) {
    let revenueMultiplier = 1;
    let expenseMultiplier = 1;

    if (params.newHires) {
      expenseMultiplier += params.newHires * this.NEW_HIRE_EXPENSE_MULTIPLIER;
      revenueMultiplier += params.newHires * this.NEW_HIRE_REVENUE_MULTIPLIER;
    }

    if (params.capitalInvestment) {
      expenseMultiplier += params.capitalInvestment * this.CAPITAL_EXPENSE_MULTIPLIER;
      revenueMultiplier += params.capitalInvestment * this.CAPITAL_REVENUE_MULTIPLIER;
    }

    return { revenue: revenueMultiplier, expenses: expenseMultiplier };
  }

  private static calculateGrowthRate(data: number[]): number {
    if (data.length < 2) return this.REVENUE_GROWTH_RATE;
    const first = data[0];
    const last = data[data.length - 1];
    return Math.pow(last / first, 1 / (data.length - 1)) - 1;
  }

  private static calculateTrend(data: number[]): number {
    if (data.length === 0) return 0;
    
    // Using exponential moving average for better trend prediction
    const alpha = 0.7;
    let ema = data[0];
    
    for (let i = 1; i < data.length; i++) {
      ema = alpha * data[i] + (1 - alpha) * ema;
    }
    
    return ema;
  }

  private static calculateConfidence(
    monthsAhead: number,
    historicalDataPoints: number
  ): number {
    const baseConfidence = 0.95;
    const degradationRate = 0.03;
    const historicalFactor = Math.min(historicalDataPoints / 12, 1);
    
    return Math.max(
      baseConfidence - (monthsAhead * degradationRate),
      0.6
    ) * historicalFactor;
  }
}