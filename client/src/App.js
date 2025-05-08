import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminSignup from '../pages/admin/Register/AdminSignup';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/adminlogin' element={<AdminSignup />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
