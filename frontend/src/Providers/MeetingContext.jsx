import { createContext, useState, useContext } from "react";

const MeetingContext = createContext();

export const useMeeting = () => useContext(MeetingContext);

export const MeetingProvider = ({ children }) => {
  const [meetingID, setMeetingID] = useState("");
  const [userName, setUserName] = useState("");

  return (
    <MeetingContext.Provider
      value={{ meetingID, setMeetingID, userName, setUserName }}
    >
      {children}
    </MeetingContext.Provider>
  );
};
