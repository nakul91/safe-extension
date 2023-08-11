import { FC, useEffect, useState } from "react";
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
        <p className="text-center">No activities</p>
      ) : (
        activities.map((item, key) => <ActivitiesListItem item={item} key={key} fromAddress={selectedAddress} />)
      )}
    </div>
  );
};

export default ActivitiesList;
