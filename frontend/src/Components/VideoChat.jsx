// import { useEffect, useRef } from "react";
// import io from "socket.io-client";
// import Peer from "peerjs";
// import PropTypes from "prop-types";

// const VideoChat = ({ ROOM_ID }) => {
//   const myVideoRef = useRef(null);
//   const peerRef = useRef(null);
//   const socketRef = useRef(null);
//   const remoteVideoRef = useRef(null);

//   useEffect(() => {
//     // Initialize socket connection
//     socketRef.current = io("http://localhost:3000", {
//       cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//       },
//     });

//     // Initialize PeerJS
//     peerRef.current = new Peer(undefined, {
//       host: "/",
//       port: "3002",
//     });

//     // Get user's media
//     navigator.mediaDevices
//       .getUserMedia({
//         audio: true,
//         video: true,
//       })
//       .then((stream) => {
//         myVideoRef.current.srcObject = stream;

//         peerRef.current.on("call", (call) => {
//           call.answer(stream); // Answer the call with our stream
//           call.on("stream", (userVideoStream) => {
//             remoteVideoRef.current.srcObject = userVideoStream;
//           });
//         });

//         socketRef.current.on("user-connected", (userId) => {
//           connectToNewUser(userId, stream);
//         });
//       });

//     peerRef.current.on("open", (id) => {
//       socketRef.current.emit("join-room", ROOM_ID, id);
//     });

//     const connectToNewUser = (userId, stream) => {
//       const call = peerRef.current.call(userId, stream);
//       call.on("stream", (userVideoStream) => {
//         remoteVideoRef.current.srcObject = userVideoStream;
//       });
//     };

//     return () => {
//       socketRef.current.disconnect();
//       peerRef.current.destroy();
//     };
//   }, [ROOM_ID]);

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-900">
//       <div className="flex flex-col items-center">
//         <video
//           ref={myVideoRef}
//           autoPlay
//           muted
//           className="w-1/2 mb-4 border-2 border-gray-300 rounded-md"
//         />
//         <video
//           ref={remoteVideoRef}
//           autoPlay
//           className="w-1/2 border-2 border-gray-300 rounded-md"
//         />
//       </div>
//     </div>
//   );
// };

// VideoChat.propTypes = {
//   ROOM_ID: PropTypes.string.isRequired,
// };

// export default VideoChat;


import  { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
import PropTypes from "prop-types";

const VideoChat = () => {
  const [roomID, setRoomID] = useState("");
  const [userName, setUserName] = useState("");
  const [inMeeting, setInMeeting] = useState(false);
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (inMeeting) {
      // Initialize socket connection
      socketRef.current = io("http://localhost:3000", {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      });

      // Initialize PeerJS
      peerRef.current = new Peer(undefined, {
        host: "/",
        port: "3002",
      });

      // Get user's media
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: true,
        })
        .then((stream) => {
          // Display local video
          myVideoRef.current.srcObject = stream;

          // Handle incoming calls
          peerRef.current.on("call", (call) => {
            call.answer(stream); // Answer the call with our stream
            call.on("stream", (userVideoStream) => {
              remoteVideoRef.current.srcObject = userVideoStream;
            });
          });

          // Listen for user-connected events
          socketRef.current.on("user-connected", (userId) => {
            connectToNewUser(userId, stream);
          });
        });

      // Handle PeerJS connection opening
      peerRef.current.on("open", (id) => {
        socketRef.current.emit("join-room", roomID, id, userName);
      });

      // Function to connect to a new user
      const connectToNewUser = (userId, stream) => {
        const call = peerRef.current.call(userId, stream);
        call.on("stream", (userVideoStream) => {
          remoteVideoRef.current.srcObject = userVideoStream;
        });
      };

      // Clean up function
      return () => {
        socketRef.current.disconnect();
        peerRef.current.destroy();
      };
    }
  }, [inMeeting, roomID, userName]);

  const handleJoinMeeting = (event) => {
    event.preventDefault();
    setInMeeting(true);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      {!inMeeting ? (
        <form onSubmit={handleJoinMeeting} className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            className="w-1/2 mb-4 p-2 rounded-md border-2 border-gray-300"
            required
          />
          <input
            type="text"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-1/2 mb-4 p-2 rounded-md border-2 border-gray-300"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Join Meeting
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center">
          <video
            ref={myVideoRef}
            autoPlay
            muted
            className="w-1/2 mb-4 border-2 border-gray-300 rounded-md"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-1/2 border-2 border-gray-300 rounded-md"
          />
        </div>
      )}
    </div>
  );
};

VideoChat.propTypes = {
  ROOM_ID: PropTypes.string.isRequired,
};

export default VideoChat;
