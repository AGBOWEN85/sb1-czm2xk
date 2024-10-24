import { create } from 'zustand';
import { CashFlowPrediction, FinancialData, ScenarioParams } from '../types/financial';
import { PredictionService } from '../services/predictionService';

interface PredictionState {
  predictions: CashFlowPrediction[];
  historicalData: FinancialData[];
  setPredictions: (predictions: CashFlowPrediction[]) => void;
  simulateScenario: (params: ScenarioParams) => void;
  resetPredictions: () => void;
}

const INITIAL_DATA: FinancialData[] = [
  { revenue: 100000, expenses: 80000, date: '2023-01-01' },
  { revenue: 110000, expenses: 85000, date: '2023-02-01' },
  { revenue: 120000, expenses: 90000, date: '2023-03-01' },
];

export const usePredictionStore = create<PredictionState>((set, get) => ({
  predictions: PredictionService.predictCashFlow(INITIAL_DATA),
  historicalData: INITIAL_DATA,
  setPredictions: (predictions) => set({ predictions }),
  simulateScenario: (params) => {
    const { predictions } = get();
    const newPredictions = PredictionService.simulateScenario(predictions, params);
    set({ predictions: newPredictions });
  },
  resetPredictions: () => {
    const { historicalData } = get();
    set({ predictions: PredictionService.predictCashFlow(historicalData) });
  },
}));