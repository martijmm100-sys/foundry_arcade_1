import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional reset hook, e.g. to return to the lobby. */
  onReset?: () => void;
  label?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

// Catches render/runtime errors so a single game fault shows a recovery
// panel instead of a blank screen.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Surface for local debugging; nothing leaves the device.
    console.error("Arcade error boundary:", error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, message: "" });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="error-panel" role="alert">
        <h2>Cabinet jammed</h2>
        <p>{this.props.label ?? "Something went wrong while running this cabinet."}</p>
        {this.state.message && <pre className="error-detail">{this.state.message}</pre>}
        <button className="btn btn-primary" onClick={this.handleReset}>
          Reset cabinet
        </button>
      </div>
    );
  }
}
