import React from "react";
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider } from './contexts/I18nContext';
import { SkipLink } from './utils/accessibility';
import Routes from "./Routes";

function App() {
  return (
    <I18nProvider>
      <HelmetProvider>
        <SkipLink />
        <Routes />
      </HelmetProvider>
    </I18nProvider>
  );
}

export default App;
