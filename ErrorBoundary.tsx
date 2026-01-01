import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.group("%c💥 React Render Error", "color:red;font-weight:bold;");
    console.error("Error:", error);
    console.error("Component stack:", info.componentStack);
    console.groupEnd();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-400 text-center mt-10">
          <h2>💥 Erro de renderização capturado</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
