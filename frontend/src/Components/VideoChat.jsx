import { useEffect, useRef } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
import PropTypes from "prop-types";

const VideoChat = ({ ROOM_ID }) => {
  const myVideoRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
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
      })
      .then((stream) => {
        myVideoRef.current.srcObject = stream;

        peerRef.current.on("call", (call) => {
          call.answer(stream); // Answer the call with our stream
          call.on("stream", (userVideoStream) => {
            remoteVideoRef.current.srcObject = userVideoStream;
          });
        });

        socketRef.current.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      });

    peerRef.current.on("open", (id) => {
      socketRef.current.emit("join-room", ROOM_ID, id);
    });

    const connectToNewUser = (userId, stream) => {
      const call = peerRef.current.call(userId, stream);
      call.on("stream", (userVideoStream) => {
        remoteVideoRef.current.srcObject = userVideoStream;
      });
    };

    return () => {
      socketRef.current.disconnect();
      peerRef.current.destroy();
    };
  }, [ROOM_ID]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
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
    </div>
  );
};

VideoChat.propTypes = {
  ROOM_ID: PropTypes.string.isRequired,
};

export default VideoChat;
