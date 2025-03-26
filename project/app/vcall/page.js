"use client";
import { useEffect, useRef, useState } from "react";
import { initializeSendbird, authenticateUser } from "../../utils/sendbird";
import SendBirdCall from "sendbird-calls";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import axios from "axios";

export default function VideoCall() {
    const [calleeId, setCalleeId] = useState("");
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const callRef = useRef(null);
    const email = sessionStorage.getItem("email");
    const router = useRouter();
    const [myId, setMyid] = useState('');

    useEffect(() => {
        initializeSendbird();
        // console.log(email);
        if (!email) {
            router.push('/login');
            return;
        }
        const fetch = async () => {
            const res = await axios.get(`/api/user/${email}`);
            setMyid(res.data._id);
            // console.log(res.data);
            authenticateUser(res.data._id);
        }

        fetch();
        // const userId = myId;
        // console.log(userId);
    }, []);

    useEffect(() => {
        SendBirdCall.addListener("incoming-call-listener", {
            onRinging: (call) => {
                console.log("Incoming call from:", call.caller.userId);
                const acceptParams = {
                    callOption: {
                        localMediaView: document.getElementById('local_video_element_id'),
                        remoteMediaView: document.getElementById('remote_video_element_id'),
                        audioEnabled: true,
                        videoEnabled: true
                    }
                };

                call.onEstablished = () => {
                    console.log("Call established from listener");
                }
                const confirmCall = window.confirm(`Incoming call from ${call.caller.userId}. Accept?`);
                console.log(confirmCall);
                if (confirmCall) {
                    console.log("accepted");
                    call.accept(acceptParams);
                    // call.localVideoView = localVideoRef.current;
                    // call.remoteVideoView = remoteVideoRef.current;
                    // callRef.current = call;
                } else {
                    call.end();
                }
            },
        });

        return () => {
            SendBirdCall.removeListener("incoming-call-listener");
        };
    }, []);


    const startCall = async () => {
        if (!calleeId) return alert("Enter a valid user ID to call");

        const callParams = {
            userId: calleeId,
            isVideoCall: true,
            callOption: {
                localMediaView: document.getElementById('local_video_element_id'),
                remoteMediaView: document.getElementById('remote_video_element_id'),
                audioEnabled: true,
                videoEnabled: true
            }
        };
        // console.log(callParams);
        const call = SendBirdCall.dial(callParams, (call, error) => {
            if (error) {
                console.error("Call failed:", error);
                return;
            }
            console.log("Call started with:", calleeId);
        });

        callRef.current = call;
        // console.log(call);

        call.onEstablished = () => {
            console.log("Call established");
            // call.localVideoView = localVideoRef.current;
            // call.remoteVideoView = remoteVideoRef.current;
        };

        call.onConnected = (call) => {
            console.log("Call connected from sender");
        };

        call.onEnded = () => {
            console.log("Call ended");
            callRef.current = null;
        };

        call.setLocalMediaView(document.getElementById('local_video_element_id'));
        call.setRemoteMediaView(document.getElementById('remote_video_element_id'));
    };

    const endCall = () => {
        if (callRef.current) {
            callRef.current.end();
            console.log("Call ended");
        }
    };

    return (
        <div>
            <h2>Sendbird Video Call</h2>
            <input
                type="text"
                placeholder="Enter user ID to call"
                value={calleeId}
                onChange={(e) => setCalleeId(e.target.value)}
                className="border p-2"
            />
            <div className="flex mt-4">
                <video ref={localVideoRef} autoPlay muted className="w-1/2 border" id="local_video_element_id" />
                <video ref={remoteVideoRef} autoPlay className="w-1/2 border" id="remote_video_element_id" />
            </div>
            <button onClick={startCall} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
                Start Call
            </button>
            <button onClick={endCall} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4">
                End Call
            </button>
        </div>
    );
}
