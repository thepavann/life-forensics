import { ErrorBoundary } from './components/ErrorBoundary';
import { AppShell } from './app/AppShell';

export function App() {
  return (
    <ErrorBoundary>
      <AppShell />
    </ErrorBoundary>
  );
}

export default App;
