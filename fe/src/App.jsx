import './App.css'
import { Routes, Route, BrowserRouter } from "react-router"
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login/Login'
import DashBoardAdmin from './pages/DashBoardAdmin/DashBoardAdmin';
import DashBoardPartner from './pages/DashBoardPartner/DashBoardPartner';
import UserManager from './pages/DashBoardAdmin/Account/UserManager';
import PartnerManager from './pages/DashBoardAdmin/Account/PartnerManager';
import PartnerRequest from './pages/DashBoardAdmin/Request/PartnerRequest';
import StoreRequest from './pages/DashBoardAdmin/Request/StoreRequest';
import PointCode from './pages/DashBoardAdmin/PointCode/PointCode';
import MemberLevel from './pages/DashBoardAdmin/MemberLevel/MemberLevel';
import UserUsedPointCode from './pages/DashBoardAdmin/PointCode/UserUsedPointCode';
import Reward from './pages/DashBoardAdmin/Reward/Reward';
import Overview from './pages/DashBoardAdmin/Overview/Overview';
import OverView from './pages/DashBoardPartner/OverView/OverView';
import Store from './pages/DashBoardPartner/Store/Store';
import RewardPartner from './pages/DashBoardPartner/Reward/Reward';
import Voucher from './pages/DashBoardPartner/Voucher/Voucher';
function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            fontSize: '18px',
            padding: '16px 24px',
            minWidth: '300px',
            maxWidth: '400px',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/admin/dashboard' element={<DashBoardAdmin />}>
            <Route index element={<Overview />} />
            <Route path='overview' element={<Overview />} />
            <Route path='user' element={<UserManager />} />
            <Route path='partner' element={<PartnerManager />} />
            <Route path='partner-request' element={<PartnerRequest />} />
            <Route path='store-request' element={<StoreRequest />} />
            <Route path='pointcode' element={<PointCode />} />
            <Route path='member-level' element={<MemberLevel />} />
            <Route path='user-pointcode' element={<UserUsedPointCode />} />
            <Route path='reward' element={<Reward />} />
          </Route>
          <Route path='/partner/dashboard' element={<DashBoardPartner />} >
            <Route index element={<OverView />} />
            <Route path='overview' element={<OverView />} />
            <Route path='store' element={<Store />} />
            <Route path='reward-partner' element={<RewardPartner />} />
            <Route path='voucher' element={<Voucher />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
