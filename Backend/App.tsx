import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Page from './Page';

export default function App() {
  return (
    <AuthProvider>
      <Page />
    </AuthProvider>
  );
} 