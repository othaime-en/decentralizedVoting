import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [instances, setCampaigns] = useState([]);

  const { address, contract, getUserInstances } = useStateContext();

  const fetchInstances = async () => {
    setIsLoading(true);
    const data = await getUserInstances();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchInstances();
  }, [address, contract]);

  return (
    <DisplayCampaigns 
      title="Your voting Instances"
      isLoading={isLoading}
      campaigns={instances}
    />
  )
}

export default Profile