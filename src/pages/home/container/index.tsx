import { useContext } from "react";
import { GlobalContext } from "../../../context/GlobalContext";

export default function Home() {
  const {
    state: { safeAddress },
  } = useContext(GlobalContext);

  return <div>Safe smart account : {safeAddress}</div>;
}
