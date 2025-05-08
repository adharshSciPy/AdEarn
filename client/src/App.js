import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLogin from './pages/admin/Login/AdminLogin'
import AdminSignup from './pages/admin/Register/AdminSignup'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/adminsignup' element={<AdminSignup />} />
          <Route path='/adminlogin' element={<AdminLogin />} />
          <Route />
        </Routes>
      </BrowserRouter>

    </div >
  );
}

export default App;
