import React from 'react';
import { AppRouter } from './components/system/app-router';
import { DataProvider } from './components/system/data-context';

function App() {
  return (
    <DataProvider>
      <AppRouter />
    </DataProvider>
  );
}

export default App;