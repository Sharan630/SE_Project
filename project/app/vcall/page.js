"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Phone, PhoneOff, User, WindArrowDown, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { initializeSendbird, authenticateUser } from "../../utils/sendbird";
import SendBirdCall from "sendbird-calls";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

export default function VideoCallInterface() {
    const [calleeId, setCalleeId] = useState("");
    const [callStatus, setCallStatus] = useState("idle"); // idle, calling, connected, incoming
    const [incomingCaller, setIncomingCaller] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const callRef = useRef(null);
    const email = sessionStorage.getItem("email");
    const router = useRouter();
    const [myId, setMyId] = useState('');
    const [incomingCall, setIncomingCall] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);

    useEffect(() => {
        initializeSendbird();
        if (!email) {
            router.push('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const res = await axios.get(`/api/user/${email}`);
                setMyId(res.data._id);
                authenticateUser(res.data._id);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };

        fetchUserData();

        SendBirdCall.addListener("incoming-call-listener", {
            onRinging: (call) => {
                setCallStatus("incoming");
                setIncomingCaller(call.caller.userId);
                setIncomingCall(call);

                call.onEstablished = () => {
                    setCallStatus("connected");
                };
                call.onEnded = () => {
                    setCallStatus("idle");
                    setIncomingCaller(null);
                }
            },
        });

        return () => {
            SendBirdCall.removeListener("incoming-call-listener");
        };
    }, []);

    const startCall = async () => {
        if (!calleeId) {
            return;
        }

        setCallStatus("calling");

        const res = await axios.get(`/api/user/${calleeId}`);
        const id = res.data._id;

        const callParams = {
            userId: id,
            isVideoCall: true,
            callOption: {
                localMediaView: document.getElementById('local_video_element_id'),
                remoteMediaView: document.getElementById('remote_video_element_id'),
                audioEnabled: true,
                videoEnabled: true
            }
        };

        const call = SendBirdCall.dial(callParams, (call, error) => {
            if (error) {
                setCallStatus("idle");
                console.error("Call failed:", error);
                return;
            }
        });

        callRef.current = call;

        call.onEstablished = () => {
            setCallStatus("connected");
        };

        call.onEnded = () => {
            setCallStatus("idle");
            callRef.current = null;
        };

        call.setLocalMediaView(document.getElementById('local_video_element_id'));
        call.setRemoteMediaView(document.getElementById('remote_video_element_id'));
    };

    const handleCallAction = () => {
        switch (callStatus) {
            case "incoming":
                acceptIncomingCall();
                break;
            case "calling":
            case "connected":
                endCall();
                break;
            default:
                startCall();
        }
    };

    const acceptIncomingCall = () => {
        // const call = SendBirdCall.getActiveCall();
        if (incomingCall) {
            const acceptParams = {
                callOption: {
                    localMediaView: document.getElementById('local_video_element_id'),
                    remoteMediaView: document.getElementById('remote_video_element_id'),
                    audioEnabled: true,
                    videoEnabled: true
                }
            };

            incomingCall.accept(acceptParams);
            setCallStatus("connected");
            callRef.current = incomingCall;
        }
        // if (call) {
        // }
    };

    const endCall = () => {
        if (callRef.current) {
            callRef.current.end();
            setCallStatus("idle");
            callRef.current = null;
        }
    };

    const getCallStatusMessage = () => {
        switch (callStatus) {
            case "calling": return "Calling...";
            case "connected": return "Connected";
            case "incoming": return `Incoming call from ${incomingCaller}`;
            default: return "Ready to call";
        }
    };
    const toggleMute = () => {
        if (callRef && callRef.current) {
            if (isMuted) {
                callRef.current.unmuteMicrophone();
            } else {
                callRef.current.muteMicrophone();
            }
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (callRef && callRef.current) {
            if (isVideoOn) {
                callRef.current.stopVideo();
            } else {
                callRef.current.startVideo();
            }
            setIsVideoOn(!isVideoOn);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader className="bg-blue-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center">
                        <User className="mr-2" /> Sendbird Video Call
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    {/* Call Status Alert */}
                    <Alert variant={callStatus === "connected" ? "default" : "destructive"}>
                        <User className="h-4 w-4" />
                        <AlertTitle>{getCallStatusMessage()}</AlertTitle>
                        {callStatus === "incoming" && (
                            <AlertDescription>
                                Someone is trying to connect with you.
                            </AlertDescription>
                        )}
                    </Alert>

                    {/* Video Containers */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-200 rounded-lg overflow-hidden">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                id="local_video_element_id"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="bg-gray-200 rounded-lg overflow-hidden">
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                id="remote_video_element_id"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Call Controls */}
                    <div className="flex space-x-4">
                        <Input
                            type="text"
                            placeholder="Enter user ID to call"
                            value={calleeId}
                            onChange={(e) => setCalleeId(e.target.value)}
                            disabled={callStatus !== "idle"}
                            className="flex-grow"
                        />
                        <Button
                            onClick={handleCallAction}
                            variant={callStatus === "incoming" ? "default" : callStatus === "connected" ? "destructive" : "primary"}
                            className="w-36"
                        >
                            {callStatus === "incoming" ? (
                                <>Accept Call</>
                            ) : callStatus === "connected" ? (
                                <>
                                    <PhoneOff className="mr-2 h-4 w-4" /> End Call
                                </>
                            ) : (
                                <>
                                    <Phone className="mr-2 h-4 w-4" /> Start Call
                                </>
                            )}
                        </Button>

                        {/* Mute/Unmute Button */}
                        <Button
                            onClick={toggleMute}
                            variant={isMuted ? "outline" : "default"}
                            className="w-24"
                        >
                            {isMuted ? (
                                <>
                                    <MicOff className="mr-2 h-4 w-4" /> Unmute
                                </>
                            ) : (
                                <>
                                    <Mic className="mr-2 h-4 w-4" /> Mute
                                </>
                            )}
                        </Button>

                        {/* Video On/Off Button */}
                        <Button
                            onClick={toggleVideo}
                            variant={isVideoOn ? "default" : "outline"}
                            className="w-24"
                        >
                            {isVideoOn ? (
                                <>
                                    <Video className="mr-2 h-4 w-4" /> Stop Video
                                </>
                            ) : (
                                <>
                                    <VideoOff className="mr-2 h-4 w-4" /> Start Video
                                </>
                            )}
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}