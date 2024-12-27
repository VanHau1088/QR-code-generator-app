// ErrorBoundary.jsx
import  { Component } from 'react';
import { Typography } from 'antd';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error(error)
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Typography.Text type="danger">Something went wrong.</Typography.Text>;
    }
    return this.props.children; 
  }
}

ErrorBoundary.propTypes = { 
    children: PropTypes.node.isRequired, 
}; 

export default ErrorBoundary;
