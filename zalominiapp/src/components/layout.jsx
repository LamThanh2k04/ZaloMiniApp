import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";
import Login from "../pages/Login";
import Home from "../pages/Home";
import EarnPointsPage from "../pages/earn-points";
import MyRewardsPage from "../pages/my-rewards";
import HistoryPage from "../pages/history";
import ProfilePage from "../pages/profile";
import NotificationsPage from "../pages/notifications";
import PartnerRegisterPage from "../pages/parner-register";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme}>
      <SnackbarProvider>
        <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/earn-points" element={<EarnPointsPage />}></Route>
            <Route path="/rewards" element={<MyRewardsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/partner-register" element={<PartnerRegisterPage />} />
          </AnimationRoutes>
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
