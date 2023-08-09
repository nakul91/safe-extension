import PageLayoutHoc from "../../hocs/PageLayoutHoc";
import { TRouteTypes } from "../../types/index";
import Onboarding from "./container/Onboarding";

const OnboardingPage = PageLayoutHoc(Onboarding);

export const onboardingRoutes: TRouteTypes[] = [
  {
    path: "/signin",
    element: <OnboardingPage />,
    key: "signin",
  },
];
