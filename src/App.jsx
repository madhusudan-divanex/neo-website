import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Router from './Router';
import './assets/css/landing.css'
import './assets/css/responsive.css'
import './assets/css/mainResponsive.css'
import './assets/css/main.css'
import { ToastContainer } from 'react-toastify';

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   <Router />
   <ToastContainer/>
   </>
  )
}

export default App
