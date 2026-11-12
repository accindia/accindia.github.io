import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleResetAndGoHome = () => {
    if (typeof window !== 'undefined') {
      try {
        // Clear any potentially corrupted navigation or temporary state
        sessionStorage.clear();
      } catch {}
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f1f2f4] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2874f0] text-[10.5px] font-bold">
                <ShieldCheck className="w-3 h-3 text-[#2874f0]" />
                ACC System Recovery Guard
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-2">
                पेज लोड करने में अस्थायी समस्या आई
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                चिंता न करें, आपका डेटा व खाता 100% सुरक्षित है। कृपया पेज को पुनः लोड करें।
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold mb-1">
                  त्रुटि विवरण (Safe Diagnostic):
                </span>
                <p className="text-[11px] font-mono text-rose-600 break-words leading-tight">
                  {this.state.error.message || 'Unknown Application State'}
                </p>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 bg-[#2874f0] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>पुनः लोड करें (Reload)</span>
              </button>
              <button
                type="button"
                onClick={this.handleResetAndGoHome}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>होम पर जाएं</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
