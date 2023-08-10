import PageLayoutHoc from "../../hocs/PageLayoutHoc";
import { TRouteTypes } from "../../types/index";
import Home from "./container/Home";
const HomePage = PageLayoutHoc(Home);

export const homeRoutes: TRouteTypes[] = [
  {
    path: "/",
    element: <HomePage />,
    key: "home main",
  },
  {
    path: "/home",
    element: <HomePage />,
    key: "home",
  },
  {
    path: "/home/:id",
    element: <HomePage />,
    key: "home detail",
  },
];
