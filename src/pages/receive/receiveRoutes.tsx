import PageLayoutHoc from "../../hocs/PageLayoutHoc";
import { TRouteTypes } from "../../types/index";
import ReceiverContainer from "./container/ReceiverContainer";
const ReceivePage = PageLayoutHoc(ReceiverContainer);

export const receieveRoutes: TRouteTypes[] = [
  {
    path: "/receive",
    element: <ReceiverContainer />,
    key: "home main",
  },
];