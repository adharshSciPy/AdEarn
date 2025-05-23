
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AdminLogin from './pages/admin/Login/AdminLogin'
import AdminSignup from './pages/admin/Register/AdminSignup'
import AdminHome from './pages/admin/Home/AdminHome';
import AdminAds from './pages/admin/Ads/AdminAds';
import AdminCoupon from './pages/admin/Coupons/AdminCoupon'
import KYCVerify from './pages/admin/KYCVerify/KYCVerify'
import AdminGallery from './pages/admin/Gallery/AdminGallery';
import AdminContest from './pages/admin/Contest/AdminContest';
import AdminReport from './pages/admin/Report/AdminReport';
import AdminSettings from './pages/admin/Settings/AdminSettings';
import VerifyAds from './pages/admin/VerifyAds/VerifyAds';
import VerifyKYC from './pages/admin/VerifyKYC/VerifyKYC';



import LoginUser from './pages/user/Login/LoginUser';
import PhoneLogin from './pages/user/signUp/PhoneLogin';
import PhoneOtp from "./pages/user/signUp/PhoneOtp"
import UserSignUp from './pages/user/signUp/UserSignUp';
import EmailRegistration from './pages/user/signUp/EmailReg'
import ReferalCode from './pages/user/signUp/ReferalCode';
import Form1 from './pages/user/signUp/Form1';
import Form2 from './pages/user/signUp/Form2';
import UserHome from './pages/user/Home/UserHome';
import Adsmanager from './pages/user/Adsmanager/Adsmanager';
import AdTemplateSelector from "./pages/user/AdTemplateSelector/AdTemplateSelector"
import ContestPage from './pages/user/ContextPage/ContestPage';
import WalletPage from './pages/user/WalletPage/WalletPage'
import RefaralPage from './pages/user/ReferalPage/RefaralPage';
import UserProfileEditForm from './pages/user/UserProfileEdit/UserProfileEdit'
import KycVerification from './pages/user/KycForm/KycForm'
import TemplateEditor from './pages/user/adTemplateEditor/TemplateEditor';
import AdForm from './pages/user/AdForm/AdForm'
import ManageAdmin from './pages/superadmin/ManageAdmin/ManageAdmin';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* admin */}

          <Route path='/adminsignup' element={<AdminSignup />} />
          <Route path='/adminlogin' element={<AdminLogin />} />
          <Route path='/Admindashboard' element={<AdminHome />} />
          <Route path='/AdminAds' element={<AdminAds />} />
          <Route path='/AdminCoupon' element={<AdminCoupon />} />
          <Route path='/AdminKYC' element={<KYCVerify />} />
          <Route path='/AdminGallery' element={<AdminGallery />} />
          <Route path='/AdminContest' element={<AdminContest />} />
          <Route path='/AdminReport' element={<AdminReport />} />
          <Route path='/AdminSettings' element={<AdminSettings />} />
          <Route path='/VerifyAds/:adId' element={<VerifyAds />} />
          <Route path='/VerifyKYC/:adId' element={<VerifyKYC />} />






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
          <Route path='/adsmanageruser' element={<Adsmanager />} />
          <Route path='/adstemplate' element={<AdTemplateSelector />} />
          <Route path='/contextpage' element={<ContestPage />} />
          <Route path='/walletpage' element={<WalletPage />} />
          <Route path='/referalpageuser' element={<RefaralPage />} />
          <Route path='/userprofile' element={<UserProfileEditForm />} />
          <Route path='/kycverification' element={<KycVerification />} />
          <Route path='/templateEditor' element={<TemplateEditor />} />
          <Route path='/adform' element={<AdForm />} />




        {/* SuperAdmin */}
        <Route path='/manageadmin' element={<ManageAdmin />} />











        </Routes>
      </BrowserRouter>

    </div >
  );
}

export default App;
