import './App.css'
import { Routes, Route, BrowserRouter } from "react-router"
import { Toaster } from 'react-hot-toast';
import Login from './pages/login/Login'
import DashBoardAdmin from './pages/dashboard-admin/DashBoardAdmin';
import DashBoardPartner from './pages/dashboard-partner/DashBoardPartner';
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
          <Route path='/admin/dashboard' element={<DashBoardAdmin />} />
          <Route path='/partner/dashboard' element={<DashBoardPartner />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
