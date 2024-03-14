import React, { useState, useEffect } from "react";

import { DisplayUserInstances } from "../components";
import { useStateContext } from "../context";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [instances, setInstances] = useState([]);

  const { address, contract, getUserInstances } = useStateContext();

  const fetchInstances = async () => {
    setIsLoading(true);
    const data = await getUserInstances();
    setInstances(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchInstances();
  }, [address, contract]);

  return (
    <DisplayUserInstances
      title="Your voting Instances"
      isLoading={isLoading}
      instances={instances}
    />
  );
};

export default Profile;
