import PageLayoutHoc from "../../hocs/PageLayoutHoc";
import { TRouteTypes } from "../../types/index";
import Home from "./container/";

const HomePage = PageLayoutHoc(Home);

export const homeRoutes: TRouteTypes[] = [
  {
    path: "/",
    element: <HomePage />,
    key: "home",
  },
];
