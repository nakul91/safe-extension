import { ComponentType } from "react";

export default function PageLayoutHoc(HocComponent: ComponentType) {
    function PageLayoutHoc(props: any) {
        return (
            <div>
                <HocComponent {...props} />
            </div>
        );
    }
    return PageLayoutHoc;
}
