import { FC, useEffect, useState } from "react";
import NoState from "../../../ui_components/NoState";
import ActivitiesListItem from "./ActivitiesListItem";
import Shimmer from "./Shimmer";

const ActivitiesList: FC<any> = (props) => {
  const { activityData, selectedAddress, activitiesLoader } = props;
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (activityData?.items?.length) {
      setActivities(activityData.items);
    }
  }, [activityData]);

  return (
    <div className=" pb-6 pt-4 relative">
      {activitiesLoader ? (
        <Shimmer type="activitiesList" />
      ) : activities.length === 0 ? (
        <NoState
        className="h-20 w-35 my-6"
        image={
          "no_state.svg" 
        }
        title={"No Activities yet"}
        titleClassName="label2 text-text-500"
    />
      ) : (
        activities.map((item, key) => <ActivitiesListItem item={item} key={key} fromAddress={selectedAddress} />)
      )}
    </div>
  );
};

export default ActivitiesList;
