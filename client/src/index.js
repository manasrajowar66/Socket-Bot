import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
const keys = JSON.parse(process.env.React_App_CREDS);
root.render(
  <GoogleOAuthProvider clientId={keys.client_id}>
    <App />
  </GoogleOAuthProvider>
);

