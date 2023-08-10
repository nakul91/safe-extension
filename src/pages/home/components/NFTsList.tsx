import { FC, useEffect, useState } from "react";
import { useSpring } from "react-spring";
import { animated } from "react-spring";

import { getImage } from "../../../utils";
import { INFTData, INFTsListPropsType } from "../types";
import NFTsListViewItem from "./NFTsListViewItem";
import Shimmer from "./Shimmer";

const NFTsList: FC<any> = (props) => {
  const { walletBalances, loader } = props;
  const [nftViewsTab, setNftViewsTab] = useState("ListView");
  const [nftCollections, setNftCollections] = useState<Array<INFTData>>([]);
  const optionsListView = useSpring({
    transform: nftViewsTab === "ListView" ? `translateY(0)` : `translateY(50px)`,
    opacity: nftViewsTab === "ListView" ? "1" : "0",
  });

  useEffect(() => {
    const parsedData: Array<any> = JSON.parse(JSON.stringify(walletBalances));
    if (parsedData) {
      setNftCollections(parsedData.filter((token) => token.type === "nft"));
    }
  }, [walletBalances]);

  return (
    <>
      <div className="extensionWidth">
        <animated.div style={optionsListView}>
          <div>
            {loader ? (
              <Shimmer type="nftListView" />
            ) : nftCollections?.length === 0 ? (
              <p className="text-center">No nfts</p>
            ) : (
              nftCollections?.map((collection: any, index) => {
                return <NFTsListViewItem collection={collection} key={index} />;
              })
            )}
          </div>
        </animated.div>
      </div>
    </>
  );
};
export default NFTsList;
