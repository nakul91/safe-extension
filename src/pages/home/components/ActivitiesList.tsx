import { FC, useState } from "react";
import { IActivitiesListTypes } from "../types";
import ActivitiesListItem from "./ActivitiesListItem";

const ActivitiesList: FC<IActivitiesListTypes> = (props) => {
  const [activities, setActivities] = useState([]);
  return (
    <div className=" pb-6 pt-4 relative">
      {activities.map((item, key) => (
        <ActivitiesListItem />
      ))}
    </div>
  );
};

export default ActivitiesList;
