import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Navbar from './components/Navbar.jsx';
import Mainbody from './components/Mainbody.jsx';
import Footer from './components/Footer.jsx';
import { ThemeContextProvider } from './context/ThemeContext.js'; // Import the ThemeContextProvider
import { onCLS, onFID, onLCP } from 'web-vitals'; // Import new functions
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeContextProvider> 
      <Navbar />
      <Mainbody />
      <Footer />
    </ThemeContextProvider>
  </React.StrictMode>
);

// Measure and log web vitals
onCLS((metric) => {
  console.log('Cumulative Layout Shift:', metric.value);
});

onFID((metric) => {
  console.log('First Input Delay:', metric.value);
});

onLCP((metric) => {
  console.log('Largest Contentful Paint:', metric.value);
});

// Optionally, you can still use reportWebVitals to log or send to an analytics endpoint
reportWebVitals(console.log);
