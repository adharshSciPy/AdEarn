
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AdminLogin from './pages/admin/Login/AdminLogin'
import AdminSignup from './pages/admin/Register/AdminSignup'
import LoginUser from './pages/user/Login/LoginUser';
import UserSignUp from './pages/user/signUp/UserSignUp';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* admin */}

          <Route path='/adminsignup' element={<AdminSignup />} />
          <Route path='/adminlogin' element={<AdminLogin />} />







          {/* user */}
          <Route path='/' element={<LoginUser/>}/>
          <Route path='/usersignup' element={<UserSignUp/>}/>
          <Route path='/phoneLogin' element={<UserSignUp/>}/>

        </Routes>
      </BrowserRouter>

    </div >
  );
}

export default App;
