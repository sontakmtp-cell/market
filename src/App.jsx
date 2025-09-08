import React from "react";
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider } from './contexts/I18nContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { SkipLink } from './utils/accessibility';
import Routes from "./Routes";

function App() {
  console.log('App component rendering...');
  return (
    <I18nProvider>
      <SupabaseProvider>
        <HelmetProvider>
          <SkipLink />
          <Routes />
        </HelmetProvider>
      </SupabaseProvider>
    </I18nProvider>
  );
}

export default App;
