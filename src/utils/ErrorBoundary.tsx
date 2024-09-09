import React, { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  // This lifecycle method runs whenever a component throws an error
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // You can log error details to an external service if needed
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  // Reset the error state when the route changes (or any other prop changes)
  public componentDidUpdate(prevProps: Props) {
    if (prevProps.children !== this.props.children) {
      this.setState({ hasError: false, error: null });
    }
  }

  // Render the fallback UI if an error has occurred
  public render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Oops, something went wrong!</h1>
          <p>We're sorry, but an error occurred while loading this section.</p>
          {/* Optional: Provide a link to navigate back to a safe route */}
          <Link to="/tokenHolders">Go back to Home</Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
