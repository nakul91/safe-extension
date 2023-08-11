import { FC, useEffect, useState } from "react";
import ActivitiesListItem from "./ActivitiesListItem";

const ActivitiesList: FC<any> = (props) => {
  const { activityData } = props;
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (activityData.items.length) {
      setActivities(activityData.items);
    }
  }, [activityData]);

  return (
    <div className=" pb-6 pt-4 relative">
      {activities.map((item, key) => (
        <ActivitiesListItem item={item} key={key} />
      ))}
    </div>
  );
};

export default ActivitiesList;
