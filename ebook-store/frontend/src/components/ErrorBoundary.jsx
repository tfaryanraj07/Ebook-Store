import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Plenvi App ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('hengyi_products');
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#241E1C] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#E7DFD5] p-8 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FCEBE8] text-[#B24B3B] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="font-syne text-2xl font-bold text-[#241E1C]">
              Notice
            </h2>
            <p className="text-xs text-[#7A6960] leading-relaxed">
              An unexpected render notice occurred: {this.state.error?.message || 'Storage or payload mismatch'}.
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 rounded-full bg-[#241E1C] hover:bg-[#3D332F] text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Store</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
