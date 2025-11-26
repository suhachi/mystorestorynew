import { AppRouter } from './components/system/app-router';
import { DataProvider } from './components/system/data-context';
import ErrorBoundary from './components/system/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <AppRouter />
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;
