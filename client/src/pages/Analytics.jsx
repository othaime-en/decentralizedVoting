// Analytics.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { DataTable } from "../components";
import { useStateContext } from "../context";

const Analytics = () => {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const { contract, address, getAllInstances } = useStateContext();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const instancesData = await getAllInstances();
      setInstances(instancesData);
      setLoading(false);
    };

    fetchData();
  }, [contract, address]);

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "instanceId",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "No of Candidates",
        accessor: "candidateCount",
      },
      {
        Header: "No of Voters",
        accessor: "voteCount",
      },
      {
        Header: "Status",
        accessor: "instanceStatus",
      },
      {
        Header: "Start Time",
        accessor: "startTime",
      },
      {
        Header: "End Time",
        accessor: "endTime",
      },
      {
        Header: "PRIVATE",
        accessor: "isPrivate",
      },
      // Define other columns as needed
    ],
    []
  );

  return (
    <div className="bg-[#1c1c24] p-5 rounded-lg">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Voting Analytics</h2>
      </div>
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <DataTable columns={columns} data={instances} />
      )}
    </div>
  );
};

export default Analytics;
