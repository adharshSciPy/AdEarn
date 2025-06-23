
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
import ViewKYC from './pages/admin/VerifyKYC/ViewKYC';



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
import AdsPreview from "./pages/user/AdPreview/Adpreview"
import VideoAdForm from './pages/user/VideoAdForm/VideoAdForm';
import Adspage from './pages/user/AdsPage/Adspage';
import AdEdit from './pages/user/AdEdit/AdEdit'
import VideoAdEdit from './pages/user/VideoAdsEdit/VideoAdEdit';


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
import CouponAccount from './pages/superadmin/CouponAccount/CouponAccount';
import SubscriptionAccount from './pages/superadmin/SubscriptionAccount/SubscriptionAccount';
import AdsAccount from './pages/superadmin/AdsAccount/AdsAccount'
import Userstars from './pages/superadmin/Userstars/Userstars';
import AdsDistribution from './pages/superadmin/AdsDistribution/AdsDistribution';
import StarDistributiongraph from './pages/superadmin/StarDistributiongraph/StarDistributiongraph'
import CouponGeneration from './pages/superadmin/CouponGeneration/CouponGeneration';
import AddAdmin from './pages/superadmin/AdminManage/AddAdmin';
import SubscritionPlan from './pages/superadmin/Subscription/SubscritionPlan';
import WelcomeBonusDistribution from './pages/superadmin/WelcomeBonusDistribution/WelcomeBonusDistribution';
import SuperAdminReport from './pages/superadmin/Report/Report'
import Notification from './pages/superadmin/Notifications/Notification';
import SuperAdminContestPage from './pages/superadmin/SuperAdminContestPage/SuperAdminContestPage';
import AdminStar from './pages/superadmin/StarDistribution/AdminStar/AdminStar'
import Adstar from './pages/superadmin/StarDistribution/AdStar/AdStar'
import CompanyStar from './pages/superadmin/StarDistribution/CompanyStar/CompanyStar'
import ContestStar from './pages/superadmin/StarDistribution/ContestStar/ContestStar'
import CouponStar from './pages/superadmin/StarDistribution/CouponStar/CouponStar'
import ReferealStar from './pages/superadmin/StarDistribution/ReferalStar/ReferalStar'
import SubScriptionStar from './pages/superadmin/StarDistribution/SubscriptionStar/SubscriptionStar'
import Userstar from './pages/superadmin/StarDistribution/UserStar/UserStar';
import WelcomeStar from './pages/superadmin/StarDistribution/WelcomeStar/WelcomeStar'
import Contest from './pages/superadmin/Contest/Contest';
import ContestWinner from './pages/superadmin/ContestWinner/ContestWinner';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* admin */}

          <Route path='/adminregister' element={<AdminSignup />} />
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
          <Route path='/VerifyKYC/:id' element={<VerifyKYC />} />
          <Route path='/ContestForm' element={<ContestForm />} />
          <Route path='/ViewKYC/:id' element={<ViewKYC />} />







          {/* user */}
          <Route path='/' element={<LoginUser />} />
          <Route path='/usersignup' element={<UserSignUp />} />
          <Route path='/phonesignup' element={<PhoneLogin />} />
          <Route path='/phoneotp' element={<PhoneOtp />} />
          <Route path='/emailRegistration' element={<EmailRegistration />} />
          <Route path='/referalPage' element={<ReferalCode />} />
          <Route path='/form1' element={<Form1 />} />
          <Route path='/form2' element={<Form2 />} />
          <Route path='/userhome/:id' element={<UserHome />} />
          <Route path='/adsmanageruser/:id' element={<Adsmanager />} />
          <Route path='/adstemplate' element={<AdTemplateSelector />} />
          <Route path='/contextpage' element={<ContestPage />} />
          <Route path='/walletpage/:id' element={<WalletPage />} />
          <Route path='/referalpageuser' element={<RefaralPage />} />
          <Route path='/userprofile' element={<UserProfileEditForm />} />
          <Route path='/kycverification' element={<KycVerification />} />
          <Route path='/templateEditor' element={<TemplateEditor />} />
          <Route path='/adform/:id' element={<AdForm />} />
          <Route path='/videoform/:id' element={<VideoAdForm />} />

          <Route path='/adreportuser' element={<UserReport />} />
          <Route path='/surveyaduser/:id' element={<SurveyAds />} />
          <Route path='/adspreview/:id/:adId' element={<AdsPreview />} />
          <Route path='/ads/:type' element={<Adspage />} />
          <Route path='/adedit/:id' element={<AdEdit />} />
          <Route path='/videoadedit/:id' element={<VideoAdEdit />} />






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
          <Route path='/superadmincouponaccount' element={<CouponAccount />} />
          <Route path='/superadminsubscriptionaccount' element={<SubscriptionAccount />} />
          <Route path='/superadminadsaccount' element={<AdsAccount />} />
          <Route path='/Userstar' element={<Userstars />} />
          <Route path='/AdsDistribution' element={<AdsDistribution />} />
          <Route path='/StarDistributiongraph' element={<StarDistributiongraph />} />
          <Route path='/superadmincoupongeneration' element={<CouponGeneration />} />
          <Route path='/superadminaddadmin' element={<AddAdmin />} />
          <Route path='/superadminsubscritionplan' element={<SubscritionPlan />} />
          <Route path='/superadminwelcomedistribution' element={<WelcomeBonusDistribution />} />
          <Route path='/superadminreport' element={<SuperAdminReport />} />
          <Route path='/superadminNotification' element={<Notification />} />
          <Route path='/superadmincontestpage' element={<SuperAdminContestPage />} />
          <Route path='/superadminadminstar' element={<AdminStar />} />
          <Route path='/superadminadstar' element={<Adstar />} />
          <Route path='/superadmincompanystar' element={<CompanyStar />} />
          <Route path='/superadminconteststar' element={<ContestStar />} />
          <Route path='/superadmincouponstar' element={<CouponStar />} />
          <Route path='/superadminreferalstar' element={<ReferealStar />} />
          <Route path='/superadminsubscriptionstar' element={<SubScriptionStar />} />
          <Route path='/superadminuserstar' element={<Userstar />} />
          <Route path='/superadminwelcomestar' element={<WelcomeStar />} />
          <Route path='/superadmincontest' element={<Contest />} />
          <Route path='/superadmincontestwinner' element={<ContestWinner />} />
































        </Routes>
      </BrowserRouter>

    </div >
  );
}

export default App;
