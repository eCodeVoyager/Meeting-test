import VideoChat from "./Components/VideoChat";
import PropTypes from "prop-types";

const ROOM_ID = "1";

const App = () => {
  return (
    <>
      <VideoChat ROOM_ID={ROOM_ID} />
    </>
  );
};


export default App;
