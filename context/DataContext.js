// context/DataContext.js

import React, { createContext, useState, useEffect } from "react";
import { fetchBranches, fetchRanksByBranch } from "../services/MilitaryService";

// Create a context
export const DataContext = createContext();

// Create a provider component
export const DataProvider = ({ children }) => {
  const [branches, setBranches] = useState([]);
  const [ranksByBranch, setRanksByBranch] = useState({});

  // Fetch branches on mount
  useEffect(() => {
    const loadBranches = async () => {
      const branchesData = await fetchBranches();
      setBranches(branchesData);
    };
    loadBranches();
  }, []);

  // Function to fetch ranks for a selected branch
  const loadRanksForBranch = async (branch) => {
    const ranksData = await fetchRanksByBranch(branch);
    setRanksByBranch((prevRanks) => ({ ...prevRanks, [branch]: ranksData }));
  };

  return (
    <DataContext.Provider value={{ branches, ranksByBranch, loadRanksForBranch }}>
      {children}
    </DataContext.Provider>
  );
};
