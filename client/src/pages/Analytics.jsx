// Analytics.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import {
  DataTable,
  PDFDownloadButton,
  BarChartComponent,
  PieChartComponent,
} from "../components";
import { useStateContext } from "../context";

const Analytics = () => {
  const [instances, setInstances] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { contract, address, getAllInstances, getCandidates } =
    useStateContext();

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
        Header: "Organization",
        accessor: "organizationName",
      },
      {
        Header: "Candidates",
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

  const voterParticipationData = instances; // Replace this with actual data
  const voterByOrgData = instances; // Replace this with actual data

  // Analytics.js or wherever this component is used
  return (
    <div className="bg-[#1c1c24] p-5 rounded-lg space-y-6">
      <h2 className="text-xl font-bold text-white">Voting Analytics</h2>
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        // Content-1: DataTable
        <div>
          <h3 className="text-lg font-bold text-white mb-2">
            Instance Details
          </h3>
          <DataTable columns={columns} data={instances} />
        </div>
      )}

      {/* Content-2: BarChartComponent */}
      <div>
        <h3 align="center" className="text-lg font-bold text-white mb-2">
          Voter Participation per Instance
        </h3>
        <div className="rounded-lg p-5" style={{ height: "400px" }}>
          <BarChartComponent data={voterParticipationData} />
        </div>
      </div>

      {/* Content-3: PieChartComponent */}
      <div>
        <h3 align="center" className="text-lg font-bold text-white mb-2">
          Voter Participation by Organization
        </h3>
        <div
          className="rounded-lg p-5"
          style={{ height: "400px", position: "relative" }}
        >
          <PieChartComponent data={voterByOrgData} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
