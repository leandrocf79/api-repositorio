
import React from 'react';
import Routes from './routes';
import GlobalStyle from './styles/global'; //Usar dentro de um fragment <></>

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <>
    <ToastContainer autoClose={3000}/>
    <GlobalStyle/>
    <Routes/>
    </>
  );
}

export default App;
