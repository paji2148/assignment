import React from 'react';
import { createRoot } from 'react-dom/client';
// import { Route, BrowserRouter as Router } from 'react-router-dom';
import InsuranceApplication from './components/InsuranceApplication';

createRoot(document.getElementById('root')).render(
    <InsuranceApplication />
);
