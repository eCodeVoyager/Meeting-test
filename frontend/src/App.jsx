import { useState } from "react";
import { MeetingProvider } from "./Providers/MeetingContext";
import JoinMeeting from "./Components/JoinMeetingPage";
import VideoChat from "./Components/VideoChat";

const App = () => {
  const [inMeeting, setInMeeting] = useState(false);

  return (
    <MeetingProvider>
      <VideoChat />
    </MeetingProvider>
  );
};

export default App;
