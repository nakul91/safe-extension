import "react-lazy-load-image-component/src/effects/blur.css";
import { FC } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { capitalizeWords, getImage, nftURLFormatter } from "../../../utils";

import { INFTListType } from "../types";

type TListViewItemProps = {
  collection: INFTListType;
};

const NFTsListViewItem: FC<TListViewItemProps> = (props) => {
  const { collection } = props;
  const {
    nft_data: nftData,
    name,
    medium_username: mediumUserName,
    twitter_username: twitterUserName,
    slug,
    safelist_request_status: safelistRequestStatus,
  } = collection;

  return (
    <>
      <div className="nftListCard p-6 border border-neutral-100 dark:border-neutralDark-300 rounded-xl mx-4 mb-4 h-48 relative overflow-hidden cursor-pointer">
        <>
          <div className="nftCards">
            {nftData?.slice(0, 3)?.map((nft, key) => (
              <div className="card smallCard" key={key}>
                <div className="cardImageWrapper">
                  <LazyLoadImage
                    role={"presentation"}
                    effect="blur"
                    src={nftURLFormatter(nft)}
                    placeholderSrc={getImage("placeholder_nft_shimmer.png")}
                    alt={nft.name}
                    className="cardImage"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="nftCards secondRow">
            {nftData?.slice(3, 6)?.map((nft, key) => (
              <div className="card smallCard" key={key}>
                <div className="cardImageWrapper">
                  <img src={nftURLFormatter(nft)} alt="bg" className="cardImage" />
                </div>
              </div>
            ))}
          </div>
        </>
        <div className="pb-20 z-10">
          <p className="cardName sub-title text-text-900 dark:text-textDark-900 pb-2">{capitalizeWords(name)}</p>
          {(mediumUserName || twitterUserName) && (
            <p className="cardUser flex gap-2 items-center paragraph2 text-text-500">
              by {mediumUserName || twitterUserName}
              {safelistRequestStatus && (
                <>
                  <img src={getImage("verified_blue.svg")} alt="verified" className="verifiedImgDefault" />
                  <img src={getImage("verified_white.svg")} alt="verified" className="verifiedImgHovered" />
                </>
              )}
            </p>
          )}
        </div>
        <img src={getImage("arrow_back_white.svg")} alt="arrow" className="arrowIcon" />
        <div className="bottomOverlay"></div>
      </div>
    </>
  );
};

export default NFTsListViewItem;
