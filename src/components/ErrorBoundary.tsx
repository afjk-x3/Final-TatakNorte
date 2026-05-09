import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  private promiseRejectionHandler = (event: PromiseRejectionEvent) => {
    (this as any).setState({
      hasError: true,
      error: event.reason instanceof Error ? event.reason : new Error(String(event.reason))
    });
  };

  public componentDidMount() {
    window.addEventListener("unhandledrejection", this.promiseRejectionHandler);
  }

  public componentWillUnmount() {
    window.removeEventListener("unhandledrejection", this.promiseRejectionHandler);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = this.state.error?.message || "An unexpected error occurred.";
      let parsedError = null;
      try {
         parsedError = JSON.parse(errorMessage);
         if (parsedError && parsedError.error) {
             errorMessage = parsedError.error;
         }
      } catch (e) {
         // Not JSON
      }

      return (
        <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-lg w-full text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
            <p className="text-slate-600 mb-6">{errorMessage}</p>
            {parsedError && (
              <div className="text-left text-xs bg-red-50 p-4 rounded text-red-800 overflow-auto max-h-40 mb-6 font-mono">
                 <pre>{JSON.stringify(parsedError, null, 2)}</pre>
              </div>
            )}
            <button
              className="bg-brand-blue text-white px-6 py-2 rounded-xl"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
