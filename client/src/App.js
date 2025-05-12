
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AdminLogin from './pages/admin/Login/AdminLogin'
import AdminSignup from './pages/admin/Register/AdminSignup'
import AdminHome from './pages/admin/Home/AdminHome';



import LoginUser from './pages/user/Login/LoginUser';
import PhoneLogin from './pages/user/signUp/PhoneLogin';
import PhoneOtp from "./pages/user/signUp/PhoneOtp"
import UserSignUp from './pages/user/signUp/UserSignUp';
import EmailRegistration from './pages/user/signUp/EmailReg'
import ReferalCode from './pages/user/signUp/ReferalCode';
import Form1 from './pages/user/signUp/Form1';
import Form2 from './pages/user/signUp/Form2';
import UserHome from './pages/user/Home/UserHome';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* admin */}

          <Route path='/adminsignup' element={<AdminSignup />} />
          <Route path='/adminlogin' element={<AdminLogin />} />
          <Route path='/Admindashboard' element={<AdminHome />} />







          {/* user */}
          <Route path='/' element={<LoginUser />} />
          <Route path='/usersignup' element={<UserSignUp />} />
          <Route path='/phonesignup' element={<PhoneLogin />} />
          <Route path='/phoneotp' element={<PhoneOtp />} />
          <Route path='/emailRegistration' element={<EmailRegistration />} />
          <Route path='/referalPage' element={<ReferalCode />} />
          <Route path='/form1' element={<Form1 />} />
          <Route path='/form2' element={<Form2 />} />
          <Route path='/userhome' element={<UserHome />} />





          


        </Routes>
      </BrowserRouter>

    </div >
  );
}

export default App;
