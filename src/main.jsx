import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { Toaster } from './components/ui/toaster.jsx'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';


const stripePromise = loadStripe('pk_test_51Q4mWnCVVBUQVL8f75sTPLaz713VieoZSRcaZ2WJS5QYDpI3brqrHt9Zme1nx2R71Eer13WrW8GvzNk7MYxTgdpH00praQMUdA');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Elements stripe={stripePromise}>
          <App />
          <Toaster />
        </Elements>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);