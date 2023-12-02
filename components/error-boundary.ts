import React, { Component, ErrorInfo } from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error: ', error, errorInfo)
    {
      localStorage.clear()
      sessionStorage.clear()
      // TODO: send Sentry error report
    }
    this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) {
      return 'Something went wrong. Please refresh the cache and try again.'
    }
    return this.props.children
  }
}

export default ErrorBoundary
