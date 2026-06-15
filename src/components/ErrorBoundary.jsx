import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚠</span>
            </div>
            <h1 className="text-2xl font-sora font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-white/40 text-sm mb-6">
              {this.state.error.message}
            </p>
            <button
              onClick={() => { this.setState({ error: null }); window.location.href = '/'; }}
              className="px-6 py-3 rounded-xl bg-gold-500/20 text-gold-500 hover:bg-gold-500/30 transition-colors font-medium text-sm"
            >
              Go home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
