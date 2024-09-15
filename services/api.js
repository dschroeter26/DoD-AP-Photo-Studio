// services/api.js

// Mock data for branches and ranks
const branches = [
  "U.S. Marine Corps",
  "U.S. Air Force",
  "U.S. Army",
  "U.S. Navy",
  "U.S. Space Force",
  "U.S. Coast Guard",
];

const ranksByBranch = {
  "U.S. Marine Corps": [
    { display: "Private", value: "Pvt." },
    { display: "Corporal", value: "Cpl." },
    { display: "Sergeant", value: "Sgt." },
    { display: "Staff Sergeant", value: "Staff Sgt." },
    { display: "Gunnery Sergeant", value: "Gunnery Sgt." },
    { display: "Master Sergeant", value: "Master Sgt." },
    { display: "Second Lieutenant", value: "2nd Lt." },
    { display: "First Lieutenant", value: "1st Lt." },
    { display: "Captain", value: "Capt." },
    { display: "Major", value: "Maj." },
    { display: "Lieutenant Colonel", value: "Lt. Col." },
    { display: "Colonel", value: "Col." },
    { display: "General", value: "Gen." },
    { display: "Warrant Officer", value: "WO" },
    { display: "Chief Warrant Officer", value: "CWO" },
    {
      display: "Sergeant Major of the Marine Corps",
      value: "Sgt. Maj. of the Marine Corps",
    },
    { display: "Drill Instructor", value: "Drill Instructor" },
  ],
  "U.S. Air Force": [
    { display: "Airman", value: "Amn." },
    { display: "Staff Sergeant", value: "Staff Sgt." },
    { display: "Technical Sergeant", value: "Tech. Sgt." },
    { display: "Master Sergeant", value: "Master Sgt." },
    { display: "Senior Master Sergeant", value: "Senior Master Sgt." },
    { display: "Chief Master Sergeant", value: "Chief Master Sgt." },
    { display: "Second Lieutenant", value: "2nd Lt." },
    { display: "First Lieutenant", value: "1st Lt." },
    { display: "Captain", value: "Capt." },
    { display: "Major", value: "Maj." },
    { display: "Lieutenant Colonel", value: "Lt. Col." },
    { display: "Colonel", value: "Col." },
    { display: "General", value: "Gen." },
    { display: "Chief Warrant Officer", value: "CWO" },
    {
      display: "Command Chief Master Sergeant",
      value: "Command Chief Master Sgt.",
    },
    { display: "Flight Instructor", value: "Flight Instructor" },
  ],
  "U.S. Army": [
    { display: "Private", value: "Pvt." },
    { display: "Specialist", value: "Spc." },
    { display: "Sergeant", value: "Sgt." },
    { display: "Staff Sergeant", value: "Staff Sgt." },
    { display: "Sergeant First Class", value: "Sgt. 1st Class" },
    { display: "Master Sergeant", value: "Master Sgt." },
    { display: "Second Lieutenant", value: "2nd Lt." },
    { display: "First Lieutenant", value: "1st Lt." },
    { display: "Captain", value: "Capt." },
    { display: "Major", value: "Maj." },
    { display: "Lieutenant Colonel", value: "Lt. Col." },
    { display: "Colonel", value: "Col." },
    { display: "General", value: "Gen." },
    { display: "Warrant Officer", value: "WO" },
    { display: "Chief Warrant Officer", value: "CWO" },
    {
      display: "Sergeant Major of the Army",
      value: "Sgt. Maj. of the Army",
    },
    { display: "Ranger", value: "Ranger" },
  ],
  "U.S. Navy": [
    { display: "Seaman", value: "Seaman" },
    {
      display: "Petty Officer Third Class",
      value: "Petty Officer 3rd Class",
    },
    {
      display: "Petty Officer Second Class",
      value: "Petty Officer 2nd Class",
    },
    {
      display: "Petty Officer First Class",
      value: "Petty Officer 1st Class",
    },
    { display: "Chief Petty Officer", value: "Chief Petty Officer" },
    { display: "Ensign", value: "Ens." },
    { display: "Lieutenant Junior Grade", value: "Lt. j.g." },
    { display: "Lieutenant", value: "Lt." },
    { display: "Lieutenant Commander", value: "Lt. Cmdr." },
    { display: "Commander", value: "Cmdr." },
    { display: "Captain", value: "Capt." },
    { display: "Admiral", value: "Adm." },
    { display: "Warrant Officer", value: "WO" },
    { display: "Chief Warrant Officer", value: "CWO" },
    {
      display: "Master Chief Petty Officer of the Navy",
      value: "Master Chief Petty Officer of the Navy",
    },
    { display: "Submarine Officer", value: "Submarine Officer" },
  ],
  "U.S. Space Force": [
    { display: "Specialist", value: "Spec." },
    { display: "Sergeant", value: "Sgt." },
    { display: "Technical Sergeant", value: "Tech. Sgt." },
    { display: "Master Sergeant", value: "Master Sgt." },
    { display: "Senior Master Sergeant", value: "Senior Master Sgt." },
    { display: "Chief Master Sergeant", value: "Chief Master Sgt." },
    { display: "Second Lieutenant", value: "2nd Lt." },
    { display: "First Lieutenant", value: "1st Lt." },
    { display: "Captain", value: "Capt." },
    { display: "Major", value: "Maj." },
    { display: "Lieutenant Colonel", value: "Lt. Col." },
    { display: "Colonel", value: "Col." },
    { display: "General", value: "Gen." },
    { display: "Chief Warrant Officer", value: "CWO" },
    {
      display: "Chief Master Sergeant of the Space Force",
      value: "Chief Master Sgt. of the Space Force",
    },
    {
      display: "Space Operations Officer",
      value: "Space Operations Officer",
    },
  ],
  "U.S. Coast Guard": [
    { display: "Seaman", value: "Seaman" },
    {
      display: "Petty Officer Third Class",
      value: "Petty Officer 3rd Class",
    },
    {
      display: "Petty Officer Second Class",
      value: "Petty Officer 2nd Class",
    },
    {
      display: "Petty Officer First Class",
      value: "Petty Officer 1st Class",
    },
    { display: "Chief Petty Officer", value: "Chief Petty Officer" },
    { display: "Ensign", value: "Ens." },
    { display: "Lieutenant Junior Grade", value: "Lt. j.g." },
    { display: "Lieutenant", value: "Lt." },
    { display: "Lieutenant Commander", value: "Lt. Cmdr." },
    { display: "Commander", value: "Cmdr." },
    { display: "Captain", value: "Capt." },
    { display: "Admiral", value: "Adm." },
    { display: "Warrant Officer", value: "WO" },
    { display: "Chief Warrant Officer", value: "CWO" },
    {
      display: "Master Chief Petty Officer of the Coast Guard",
      value: "Master Chief Petty Officer of the Coast Guard",
    },
    { display: "Rescue Swimmer", value: "Rescue Swimmer" },
  ],
};

// Mock API call to fetch branches
export const fetchBranches = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(branches);
    }, 500); // Simulate a 500ms network delay
  });
};

// Mock API call to fetch ranks by branch
export const fetchRanksByBranch = (branch) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ranksByBranch[branch] || []);
    }, 500); // Simulate a 500ms network delay
  });
};
