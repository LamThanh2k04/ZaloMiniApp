import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";
import Login from "../pages/Login";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme}>
      <SnackbarProvider>
        <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<Login />}></Route>
          </AnimationRoutes>
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
