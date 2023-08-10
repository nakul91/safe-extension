import PageLayoutHoc from "../../hocs/PageLayoutHoc";
import { TRouteTypes } from "../../types/index";
import Send from "./container/Send";
const SendPage = PageLayoutHoc(Send);

export const sendRoutes: TRouteTypes[] = [
  {
    path: "/send",
    element: <Send />,
    key: "home main",
  },
];