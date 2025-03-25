"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export default function VideoCall() {
    const [socket, setSocket] = useState(null);
    const [userId, setUserId] = useState(null);
    const [remoteSocketId, setRemoteSocketId] = useState('6AP6AalmWM-35JoUAAAt');
    const peerRef = useRef(null); // Store the peer connection as a ref
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        const newSocket = io("http://localhost:3001"); // Update backend URL
        setSocket(newSocket);

        newSocket.on("connect", () => {
            setUserId(newSocket.id);
            console.log("Connected with socket ID:", newSocket.id);
        });

        newSocket.on("incoming-call", async ({ from, offer }) => {
            console.log("Incoming call from:", from);
            setRemoteSocketId(from);
            const peer = createPeer();
            peerRef.current = peer;
            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            newSocket.emit("answer-call", { to: from, answer });
        });

        newSocket.on("call-answered", async ({ from, answer }) => {
            console.log("Call answered by:", from);
            if (peerRef.current) {
                await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            } else {
                console.error("Peer connection is null in call-answered.");
            }
        });

        newSocket.on("ice-candidate", async ({ from, candidate }) => {
            if (peerRef.current && candidate) {
                console.log("Adding ICE candidate from:", from);
                await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const startCall = async () => {
        if (!remoteSocketId) {
            console.log("No remote user to call.");
            return;
        }

        console.log("Calling user:", remoteSocketId);
        const peer = createPeer();
        peerRef.current = peer;
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit("call-user", { to: remoteSocketId, offer });
    };

    const createPeer = () => {
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // STUN server for ICE candidates
        });

        peer.ontrack = (event) => {
            console.log("Receiving remote stream...");
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        peer.onicecandidate = (event) => {
            if (event.candidate && socket) {
                console.log("Sending ICE candidate...");
                socket.emit("ice-candidate", { to: remoteSocketId, candidate: event.candidate });
            }
        };

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            stream.getTracks().forEach((track) => peer.addTrack(track, stream));
        });

        return peer;
    };

    return (
        <div>
            <h2>Video Call</h2>
            <div className="flex">
                <video ref={localVideoRef} autoPlay playsInline className="w-1/2 border" />
                <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 border" />
            </div>
            <button onClick={startCall} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
                Start Call
            </button>
        </div>
    );
}
