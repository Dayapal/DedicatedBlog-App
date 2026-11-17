import React, { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an uncaught UI error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl border border-white/20 bg-white/10 dark:bg-black/40 backdrop-blur-2xl shadow-2xl text-center relative overflow-hidden">
            {/* Ambient backlight */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#FB2576]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#332FD0]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3F0071] to-[#FB2576] flex items-center justify-center text-white shadow-lg mb-5 animate-pulse">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                An unexpected error occurred while rendering this component. Don't worry, your data is safe.
              </p>

              {/* Dev error preview */}
              {import.meta.env.DEV && this.state.error && (
                <div className="w-full text-left p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl overflow-x-auto text-xs text-red-600 dark:text-red-400 font-mono">
                  {this.state.error.toString()}
                </div>
              )}

              <div className="flex flex-wrap gap-3 w-full justify-center">
                <button
                  onClick={this.handleReload}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#3F0071] to-[#332FD0] hover:shadow-lg hover:shadow-[#332FD0]/25 transition-all active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </button>
                <a
                  href="/"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white/20 dark:bg-white/10 hover:bg-white/30 border border-white/20 transition-all active:scale-95"
                >
                  <Home className="w-4 h-4" />
                  Return Home
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
