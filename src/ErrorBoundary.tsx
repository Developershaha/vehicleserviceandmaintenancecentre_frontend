import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  navigate: (path: string) => void;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleGoHome = () => {
    window.location.href = "/";
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl">⚠️</span>
            </div>

            <h2 className="text-xl font-semibold text-slate-800">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              We ran into an unexpected error.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={this.handleGoHome}
                className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
              >
                Go Home
              </button>

              <button
                onClick={() => this.setState({ hasError: false })}
                className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
