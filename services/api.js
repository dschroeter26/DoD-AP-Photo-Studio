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
    { display: "Private", value: "Private", abbreviation: "Pvt." },
    { display: "Corporal", value: "Corporal", abbreviation: "Cpl." },
    { display: "Sergeant", value: "Sergeant", abbreviation: "Sgt." },
    {
      display: "Staff Sergeant",
      value: "Staff Sergeant",
      abbreviation: "Staff Sgt.",
    },
    {
      display: "Gunnery Sergeant",
      value: "Gunnery Sergeant",
      abbreviation: "Gunnery Sgt.",
    },
    {
      display: "Master Sergeant",
      value: "Master Sergeant",
      abbreviation: "Master Sgt.",
    },
    {
      display: "Second Lieutenant",
      value: "Second Lieutenant",
      abbreviation: "2nd Lt.",
    },
    {
      display: "First Lieutenant",
      value: "First Lieutenant",
      abbreviation: "1st Lt.",
    },
    { display: "Captain", value: "Captain", abbreviation: "Capt." },
    { display: "Major", value: "Major", abbreviation: "Maj." },
    {
      display: "Lieutenant Colonel",
      value: "Lieutenant Colonel",
      abbreviation: "Lt. Col.",
    },
    { display: "Colonel", value: "Colonel", abbreviation: "Col." },
    { display: "General", value: "General", abbreviation: "Gen." },
    {
      display: "Warrant Officer",
      value: "Warrant Officer",
      abbreviation: "WO",
    },
    {
      display: "Chief Warrant Officer",
      value: "Chief Warrant Officer",
      abbreviation: "CWO",
    },
    {
      display: "Sergeant Major of the Marine Corps",
      value: "Sergeant Major of the Marine Corps",
      abbreviation: "Sgt. Maj. of the Marine Corps",
    },
    {
      display: "Drill Instructor",
      value: "Drill Instructor",
      abbreviation: "Drill Instructor",
    },
  ],
  "U.S. Air Force": [
    { display: "Airman", value: "Airman", abbreviation: "Amn." },
    {
      display: "Staff Sergeant",
      value: "Staff Sergeant",
      abbreviation: "Staff Sgt.",
    },
    {
      display: "Technical Sergeant",
      value: "Technical Sergeant",
      abbreviation: "Tech. Sgt.",
    },
    {
      display: "Master Sergeant",
      value: "Master Sergeant",
      abbreviation: "Master Sgt.",
    },
    {
      display: "Senior Master Sergeant",
      value: "Senior Master Sergeant",
      abbreviation: "Senior Master Sgt.",
    },
    {
      display: "Chief Master Sergeant",
      value: "Chief Master Sergeant",
      abbreviation: "Chief Master Sgt.",
    },
    {
      display: "Second Lieutenant",
      value: "Second Lieutenant",
      abbreviation: "2nd Lt.",
    },
    {
      display: "First Lieutenant",
      value: "First Lieutenant",
      abbreviation: "1st Lt.",
    },
    { display: "Captain", value: "Captain", abbreviation: "Capt." },
    { display: "Major", value: "Major", abbreviation: "Maj." },
    {
      display: "Lieutenant Colonel",
      value: "Lieutenant Colonel",
      abbreviation: "Lt. Col.",
    },
    { display: "Colonel", value: "Colonel", abbreviation: "Col." },
    { display: "General", value: "General", abbreviation: "Gen." },
    {
      display: "Chief Warrant Officer",
      value: "Chief Warrant Officer",
      abbreviation: "CWO",
    },
    {
      display: "Command Chief Master Sergeant",
      value: "Command Chief Master Sergeant",
      abbreviation: "Command Chief Master Sgt.",
    },
    {
      display: "Flight Instructor",
      value: "Flight Instructor",
      abbreviation: "Flight Instructor",
    },
  ],
  "U.S. Army": [
    { display: "Private", value: "Private", abbreviation: "Pvt." },
    { display: "Specialist", value: "Specialist", abbreviation: "Spc." },
    { display: "Sergeant", value: "Sergeant", abbreviation: "Sgt." },
    {
      display: "Staff Sergeant",
      value: "Staff Sergeant",
      abbreviation: "Staff Sgt.",
    },
    {
      display: "Sergeant First Class",
      value: "Sergeant First Class",
      abbreviation: "Sgt. 1st Class",
    },
    {
      display: "Master Sergeant",
      value: "Master Sergeant",
      abbreviation: "Master Sgt.",
    },
    {
      display: "Second Lieutenant",
      value: "Second Lieutenant",
      abbreviation: "2nd Lt.",
    },
    {
      display: "First Lieutenant",
      value: "First Lieutenant",
      abbreviation: "1st Lt.",
    },
    { display: "Captain", value: "Captain", abbreviation: "Capt." },
    { display: "Major", value: "Major", abbreviation: "Maj." },
    {
      display: "Lieutenant Colonel",
      value: "Lieutenant Colonel",
      abbreviation: "Lt. Col.",
    },
    { display: "Colonel", value: "Colonel", abbreviation: "Col." },
    { display: "General", value: "General", abbreviation: "Gen." },
    {
      display: "Warrant Officer",
      value: "Warrant Officer",
      abbreviation: "WO",
    },
    {
      display: "Chief Warrant Officer",
      value: "Chief Warrant Officer",
      abbreviation: "CWO",
    },
    {
      display: "Sergeant Major of the Army",
      value: "Sergeant Major of the Army",
      abbreviation: "Sgt. Maj. of the Army",
    },
    { display: "Ranger", value: "Ranger", abbreviation: "Ranger" },
  ],
  "U.S. Navy": [
    { display: "Seaman", value: "Seaman", abbreviation: "Seaman" },
    {
      display: "Petty Officer Third Class",
      value: "Petty Officer Third Class",
      abbreviation: "Petty Officer 3rd Class",
    },
    {
      display: "Petty Officer Second Class",
      value: "Petty Officer Second Class",
      abbreviation: "Petty Officer 2nd Class",
    },
    {
      display: "Petty Officer First Class",
      value: "Petty Officer First Class",
      abbreviation: "Petty Officer 1st Class",
    },
    {
      display: "Chief Petty Officer",
      value: "Chief Petty Officer",
      abbreviation: "Chief Petty Officer",
    },
    { display: "Ensign", value: "Ensign", abbreviation: "Ens." },
    {
      display: "Lieutenant Junior Grade",
      value: "Lieutenant Junior Grade",
      abbreviation: "Lt. j.g.",
    },
    { display: "Lieutenant", value: "Lieutenant", abbreviation: "Lt." },
    {
      display: "Lieutenant Commander",
      value: "Lieutenant Commander",
      abbreviation: "Lt. Cmdr.",
    },
    { display: "Commander", value: "Commander", abbreviation: "Cmdr." },
    { display: "Captain", value: "Captain", abbreviation: "Capt." },
    { display: "Admiral", value: "Admiral", abbreviation: "Adm." },
    {
      display: "Warrant Officer",
      value: "Warrant Officer",
      abbreviation: "WO",
    },
    {
      display: "Chief Warrant Officer",
      value: "Chief Warrant Officer",
      abbreviation: "CWO",
    },
    {
      display: "Master Chief Petty Officer of the Navy",
      value: "Master Chief Petty Officer of the Navy",
      abbreviation: "Master Chief Petty Officer of the Navy",
    },
    {
      display: "Submarine Officer",
      value: "Submarine Officer",
      abbreviation: "Submarine Officer",
    },
  ],
  "U.S. Space Force": [
    { display: "Specialist", value: "Specialist", abbreviation: "Spec." },
    { display: "Sergeant", value: "Sergeant", abbreviation: "Sgt." },
    {
      display: "Technical Sergeant",
      value: "Technical Sergeant",
      abbreviation: "Tech. Sgt.",
    },
    {
      display: "Master Sergeant",
      value: "Master Sergeant",
      abbreviation: "Master Sgt.",
    },
    {
      display: "Senior Master Sergeant",
      value: "Senior Master Sergeant",
      abbreviation: "Senior Master Sgt.",
    },
    {
      display: "Chief Master Sergeant",
      value: "Chief Master Sergeant",
      abbreviation: "Chief Master Sgt.",
    },
    {
      display: "Second Lieutenant",
      value: "Second Lieutenant",
      abbreviation: "2nd Lt.",
    },
    {
      display: "First Lieutenant",
      value: "First Lieutenant",
      abbreviation: "1st Lt.",
    },
    { display: "Captain", value: "Captain", abbreviation: "Capt." },
    { display: "Major", value: "Major", abbreviation: "Maj." },
    {
      display: "Lieutenant Colonel",
      value: "Lieutenant Colonel",
      abbreviation: "Lt. Col.",
    },
    { display: "Colonel", value: "Colonel", abbreviation: "Col." },
    { display: "General", value: "General", abbreviation: "Gen." },
    {
      display: "Chief Warrant Officer",
      value: "Chief Warrant Officer",
      abbreviation: "CWO",
    },
    {
      display: "Chief Master Sergeant of the Space Force",
      value: "Chief Master Sergeant of the Space Force",
      abbreviation: "Chief Master Sgt. of the Space Force",
    },
    {
      display: "Space Operations Officer",
      value: "Space Operations Officer",
      abbreviation: "Space Operations Officer",
    },
  ],
  "U.S. Coast Guard": [
    { display: "Seaman", value: "Seaman", abbreviation: "Seaman" },
    {
      display: "Petty Officer Third Class",
      value: "Petty Officer Third Class",
      abbreviation: "Petty Officer 3rd Class",
    },
    {
      display: "Petty Officer Second Class",
      value: "Petty Officer Second Class",
      abbreviation: "Petty Officer 2nd Class",
    },
    {
      display: "Petty Officer First Class",
      value: "Petty Officer First Class",
      abbreviation: "Petty Officer 1st Class",
    },
    {
      display: "Chief Petty Officer",
      value: "Chief Petty Officer",
      abbreviation: "Chief Petty Officer",
    },
    { display: "Ensign", value: "Ensign", abbreviation: "Ens." },
    {
      display: "Lieutenant Junior Grade",
      value: "Lieutenant Junior Grade",
      abbreviation: "Lt. j.g.",
    },
    { display: "Lieutenant", value: "Lieutenant", abbreviation: "Lt." },
    {
      display: "Lieutenant Commander",
      value: "Lieutenant Commander",
      abbreviation: "Lt. Cmdr.",
    },
    { display: "Commander", value: "Commander", abbreviation: "Cmdr." },
    { display: "Captain", value: "Captain", abbreviation: "Capt." },
    { display: "Admiral", value: "Admiral", abbreviation: "Adm." },
    {
      display: "Warrant Officer",
      value: "Warrant Officer",
      abbreviation: "WO",
    },
    {
      display: "Chief Warrant Officer",
      value: "Chief Warrant Officer",
      abbreviation: "CWO",
    },
    {
      display: "Master Chief Petty Officer of the Coast Guard",
      value: "Master Chief Petty Officer of the Coast Guard",
      abbreviation: "Master Chief Petty Officer of the Coast Guard",
    },
    {
      display: "Rescue Swimmer",
      value: "Rescue Swimmer",
      abbreviation: "Rescue Swimmer",
    },
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
