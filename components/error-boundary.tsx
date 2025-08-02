"use client";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 text-center">
            <p className="text-red-600">Something went wrong loading posts.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
