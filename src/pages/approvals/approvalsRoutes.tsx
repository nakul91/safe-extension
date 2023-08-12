import PageLayoutHoc from "../../hocs/PageLayoutHoc";
import { TRouteTypes } from "../../types/index";
import Approval from ".";
const ApprovalPage = PageLayoutHoc(Approval);

export const approvalsRoutes: TRouteTypes[] = [
    {
        path: "/approval",
        element: <ApprovalPage />,
        key: "approval",
    },
];
