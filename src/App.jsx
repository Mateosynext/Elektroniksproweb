import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import Routes from "./Routes";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;