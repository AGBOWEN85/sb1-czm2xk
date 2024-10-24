import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ScenarioParams } from '../types/financial';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePredictionStore } from '../store/predictionStore';

const scenarioSchema = z.object({
  newHires: z.number().min(0).optional(),
  capitalInvestment: z.number().min(0).optional(),
  marketingBudget: z.number().min(0).optional(),
  expansionPlans: z.boolean().optional(),
});

export const ScenarioSimulator = () => {
  const simulateScenario = usePredictionStore((state) => state.simulateScenario);
  const resetPredictions = usePredictionStore((state) => state.resetPredictions);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ScenarioParams>({
    resolver: zodResolver(scenarioSchema),
    defaultValues: {
      newHires: 0,
      capitalInvestment: 0,
      marketingBudget: 0,
    },
  });

  const onSubmit = useCallback(async (data: ScenarioParams) => {
    simulateScenario(data);
  }, [simulateScenario]);

  const handleReset = useCallback(() => {
    reset();
    resetPredictions();
  }, [reset, resetPredictions]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Scenario Simulator</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Hires
            <input
              type="number"
              {...register('newHires', { valueAsNumber: true })}
              className={`mt-1 block w-full rounded-md shadow-sm
                ${errors.newHires ? 'border-red-500' : 'border-gray-300'}`}
              min="0"
            />
          </label>
          {errors.newHires && (
            <p className="text-red-500 text-sm mt-1">{errors.newHires.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Capital Investment ($)
            <input
              type="number"
              {...register('capitalInvestment', { valueAsNumber: true })}
              className={`mt-1 block w-full rounded-md shadow-sm
                ${errors.capitalInvestment ? 'border-red-500' : 'border-gray-300'}`}
              min="0"
            />
          </label>
          {errors.capitalInvestment && (
            <p className="text-red-500 text-sm mt-1">{errors.capitalInvestment.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Marketing Budget ($)
            <input
              type="number"
              {...register('marketingBudget', { valueAsNumber: true })}
              className={`mt-1 block w-full rounded-md shadow-sm
                ${errors.marketingBudget ? 'border-red-500' : 'border-gray-300'}`}
              min="0"
            />
          </label>
          {errors.marketingBudget && (
            <p className="text-red-500 text-sm mt-1">{errors.marketingBudget.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 
              transition-colors duration-200"
          >
            Run Simulation
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 
              transition-colors duration-200"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};