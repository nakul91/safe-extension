import { FC, useState } from "react";
import { useSpring } from "react-spring";
import { animated } from "react-spring";

import { getImage } from "../../../utils";
import { INFTData, INFTsListPropsType } from "../types";
import NFTsListViewItem from "./NFTsListViewItem";

const NFTsList: FC<any> = (props) => {
  const [nftViewsTab, setNftViewsTab] = useState("ListView");
  const [nftCollections, setNftCollections] = useState<Array<INFTData>>([]);
  const optionsListView = useSpring({
    transform: nftViewsTab === "ListView" ? `translateY(0)` : `translateY(50px)`,
    opacity: nftViewsTab === "ListView" ? "1" : "0",
  });

  const handleTabCHange = (tab: string) => {
    setNftViewsTab(tab);
  };

  return (
    <>
      {nftCollections?.length > 0 && (
        <div className="flex justify-center items-center pt-4 pb-4">
          <img
            role={"presentation"}
            src={getImage(`${nftViewsTab === "ListView" ? "list_active" : "list_nft_normal"}.svg`)}
            alt="list"
            className={`cursor-pointer p-2 rounded-l-lg border ${
              nftViewsTab === "ListView"
                ? "bg-primary-50 dark:bg-primaryDark-50  border-primary-100 dark:border-primaryDark-100"
                : "border-neutral-50 dark:border-neutralDark-300 bg-white dark:bg-neutralDark-50"
            }`}
            onClick={() => {
              handleTabCHange("ListView");
            }}
          />
          <img
            role={"presentation"}
            src={getImage(`${nftViewsTab === "GridView" ? "grid_active" : "grid_normal"}.svg`)}
            alt="grid"
            className={`cursor-pointer p-2 rounded-r-lg border ${
              nftViewsTab === "GridView"
                ? "bg-primary-50 dark:bg-primaryDark-50  border-primary-100 dark:border-primaryDark-100"
                : "border-neutral-50 dark:border-neutralDark-300 bg-white dark:bg-neutralDark-50"
            }`}
            onClick={() => handleTabCHange("GridView")}
          />
        </div>
      )}
      <div className="extensionWidth">
        <animated.div style={optionsListView}>
          {nftViewsTab === "ListView" && (
            <div>
              {nftCollections?.map((collection: any, index) => {
                return <NFTsListViewItem collection={collection} key={index} />;
              })}
            </div>
          )}
        </animated.div>
      </div>
    </>
  );
};
export default NFTsList;
