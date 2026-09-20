import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('LIFE//FORENSICS render error', error);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center px-6">
          <section role="alert" className="max-w-md text-center">
            <h1 className="text-xl font-semibold">Evidence layer unavailable</h1>
            <p className="mt-2 text-sm text-zinc-400">
              The interface hit an unexpected rendering error. Reload to restore the investigation workspace.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-5 px-4 py-2 rounded-lg bg-white text-zinc-950 text-sm font-medium"
            >
              Reload
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
