// import  { useState } from "react";
// import PropTypes from "prop-types";

// const JoinMeetingPage = ({ joinMeeting }) => {
//   const [meetingId, setMeetingId] = useState("");
//   const [userName, setUserName] = useState("");

//   const handleJoinClick = () => {
//     if (meetingId.trim() !== "" && userName.trim() !== "") {
//       joinMeeting(meetingId, userName);
//     } else {
//       alert("Please enter Meeting ID and Name.");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-900">
//       <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
//         <input
//           type="text"
//           placeholder="Enter Meeting ID"
//           value={meetingId}
//           onChange={(e) => setMeetingId(e.target.value)}
//           className="w-full mb-4 p-2 border-2 border-gray-300 rounded-md"
//         />
//         <input
//           type="text"
//           placeholder="Your Name"
//           value={userName}
//           onChange={(e) => setUserName(e.target.value)}
//           className="w-full mb-4 p-2 border-2 border-gray-300 rounded-md"
//         />
//         <button
//           onClick={handleJoinClick}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
//         >
//           Join Meeting
//         </button>
//       </div>
//     </div>
//   );
// };

// JoinMeetingPage.propTypes = {
//   joinMeeting: PropTypes.func.isRequired,
// };

// export default JoinMeetingPage;
import { useState } from "react";
import { useMeeting } from "../Providers/MeetingContext";
import PropTypes from "prop-types";

const JoinMeeting = ({ onJoin }) => {
  const { setMeetingID, setUserName } = useMeeting();
  const [localMeetingID, setLocalMeetingID] = useState("");
  const [localUserName, setLocalUserName] = useState("");

  const handleJoinMeeting = (event) => {
    event.preventDefault();
    setMeetingID(localMeetingID);
    setUserName(localUserName);
    onJoin();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleJoinMeeting}
        className="flex flex-col items-center justify-center bg-white w-[400px] h-[400px] rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6">Join a Meeting</h2>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={localMeetingID}
          onChange={(e) => setLocalMeetingID(e.target.value)}
          className="w-[80%] mb-4 p-2 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Your Name"
          value={localUserName}
          onChange={(e) => setLocalUserName(e.target.value)}
          className="w-[80%] mb-4 p-2 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 w-[80%] hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Join Meeting
        </button>
      </form>
    </div>
  );
};
JoinMeeting.propTypes = {
  onJoin: PropTypes.func.isRequired,
};

export default JoinMeeting;
