
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AdminLogin from './pages/admin/Login/AdminOTP'
import AdminSignup from './pages/admin/Register/AdminSignup'
import AdminHome from './pages/admin/Home/AdminHome';
import AdminAds from './pages/admin/Ads/AdminAds';
import AdminCoupon from './pages/admin/Coupons/AdminCoupon'
import KYCVerify from './pages/admin/KYCVerify/KYCVerify'
import AdminContest from './pages/admin/Contest/AdminContest';
import AdminReport from './pages/admin/Report/AdminReport';
import AdminSettings from './pages/admin/Settings/AdminSettings';
import VerifyAds from './pages/admin/VerifyAds/VerifyAds';
import VerifyKYC from './pages/admin/VerifyKYC/VerifyKYC';
import ContestForm from './pages/admin/ContestForm/ContestForm';
import Adminemailregister from "./pages/admin/Emailregister/Adminemailregister"



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
import UserReport from "./pages/user/ReportPage/ReportPageUser"
import SurveyAds from "./pages/user/SurveyAds/Surveyads"





import SuperadminDash from './pages/superadmin/Dashboard/SuperadminDash';
import ManageAdmin from './pages/superadmin/ManageAdmin/ManageAdmin';
import SuperAdminAdUser from './pages/superadmin/AdsUser/SuperAdminAdsUser';
import Superadminotp from './pages/superadmin/Superadminotp/Superadminotp';
import CompanyAccounts from './pages/superadmin/CompanyAccounts/CompanyAccounts';
import StarDistributionPage from './pages/superadmin/StarDistributionPage/StarDistributionPage'
import SuperAdminUserAccount from './pages/superadmin/UserAccount/UserAccount'
import SuperAdminAdminAccount from './pages/superadmin/AdminAccount/AdminAccount'
import WelcomeBonus from './pages/superadmin/WelcomeBonus/WelcomeBonus';
import ContestPageAccount from './pages/superadmin/ContestAccount/ContestAccount';
import Userstars from './pages/superadmin/Userstars/Userstars';
import AdsDistribution from './pages/superadmin/AdsDistribution/AdsDistribution';
import StarDistributiongraph from './pages/superadmin/StarDistributiongraph/StarDistributiongraph'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* admin */}

          <Route path='/adminphoneregister' element={<AdminSignup />} />
          <Route path='/adminotp' element={<AdminLogin />} />
          <Route path='/adminemail' element={<Adminemailregister />} />

          <Route path='/Admindashboard' element={<AdminHome />} />
          <Route path='/AdminAds' element={<AdminAds />} />
          <Route path='/AdminCoupon' element={<AdminCoupon />} />
          <Route path='/AdminKYC' element={<KYCVerify />} />
          <Route path='/AdminContest' element={<AdminContest />} />
          <Route path='/AdminReport' element={<AdminReport />} />
          <Route path='/AdminSettings' element={<AdminSettings />} />
          <Route path='/VerifyAds/:adId' element={<VerifyAds />} />
          <Route path='/VerifyKYC/:adId' element={<VerifyKYC />} />
          <Route path='/ContestForm' element={<ContestForm />} />






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
          <Route path='/adreportuser' element={<UserReport />} />
          <Route path='/surveyaduser' element={<SurveyAds />} />



          {/* SuperAdmin */}
          <Route path='/SuperadminDash' element={<SuperadminDash />} />
          <Route path='/manageadmin' element={<ManageAdmin />} />
          <Route path='/superadminadsuser' element={<SuperAdminAdUser />} />
          <Route path='/Superadminotp' element={<Superadminotp />} />
          <Route path='/Companyaccounts' element={<CompanyAccounts />} />
          <Route path='/StarDistribution' element={<StarDistributionPage />} />
          <Route path='/superadminuseraccount' element={<SuperAdminUserAccount />} />
          <Route path='/superadminadminaccount' element={<SuperAdminAdminAccount />} />
          <Route path='/superadminwelcomebonus' element={<WelcomeBonus />} />
          <Route path='/superadmincontestaccount' element={<ContestPageAccount />} />
          <Route path='/Userstar' element={<Userstars />} />
          <Route path='/AdsDistribution' element={<AdsDistribution />} />
          <Route path='/StarDistributiongraph' element={<StarDistributiongraph />} />
















        </Routes>
      </BrowserRouter>

    </div >
  );
}

export default App;
