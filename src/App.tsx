import { CashFlowChart } from './components/CashFlowChart';
import { ScenarioSimulator } from './components/ScenarioSimulator';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Financial Forecasting Bot</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CashFlowChart />
          </div>
          
          <div className="lg:col-span-1">
            <ScenarioSimulator />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;