import { FC, Fragment } from "react";
import { Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import GlobalContextProvider from "./context/GlobalContext";
import { WalletHoc } from "./hocs/WalletHoc";
import { onboardingRoutes } from "./pages/onboarding/onboardingRoutes";
import { homeRoutes } from "./pages/home/homeRoutes";
import PrivateRoute from "./hocs/PrivateRoute";
import { sendRoutes } from "./pages/send/sendRoutes";
import { receieveRoutes } from "./pages/receive/receiveRoutes";
import { approvalsRoutes } from "./pages/approvals/approvalsRoutes";

const App: FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isFullscreen = searchParams.get("fullscreen");
  const isOnboardingScreen = location.pathname.includes("/welcome");

  return (
    <div className={`extensionView ${isFullscreen ? "h-screen" : "h-150"}`}>
      <GlobalContextProvider>
        <WalletHoc>
          <>
            <Routes>
            {[...onboardingRoutes, ...sendRoutes, ...receieveRoutes].map(
                ({ path, element, key }, index) => (
                  <Fragment key={index}>
                    <Route path={path} element={element} key={key} />
                  </Fragment>
                )
              )}
              {[...homeRoutes, ...approvalsRoutes].map(({ path, element, key }, index) => (
                <Fragment key={index}>
                  <Route
                    element={<PrivateRoute path={path}>{element}</PrivateRoute>}
                  >
                    <Route
                      path={path}
                      element={
                        <PrivateRoute path={path}>{element}</PrivateRoute>
                      }
                      key={key}
                    />
                  </Route>
                </Fragment>
              ))}
            </Routes>
          </>
        </WalletHoc>
      </GlobalContextProvider>
    </div>
  );
};

export default App;
