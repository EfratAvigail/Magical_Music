"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary">
            <h2>משהו השתבש</h2>
            <p>אירעה שגיאה בטעינת הדף. אנא נסה לרענן את הדף.</p>
            <details>
              <summary>פרטי השגיאה</summary>
              <p>{this.state.error?.toString()}</p>
            </details>
            <button onClick={() => window.location.reload()}>רענן דף</button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
