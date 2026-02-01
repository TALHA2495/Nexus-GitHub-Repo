import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Peer from 'peerjs';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const VideoCall: React.FC = () => {
    const { meetingId } = useParams<{ meetingId: string }>();

    // Existing refs (DO NOT MODIFY)
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // Existing state (DO NOT MODIFY)
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    // ADDED: Refs for Peer and Socket instances - Line 20-23
    const peerRef = useRef<Peer | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    // ADDED: Main WebRTC setup useEffect - Line 25-120
    useEffect(() => {
        if (!meetingId) return;

        let peer: Peer;
        let socket: Socket;

        const initializeCall = async () => {
            try {
                // Step 1: Initialize Socket.io connection
                socket = io('http://localhost:5000');
                socketRef.current = socket;

                // Step 2: Get local media (camera/mic)
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                localStreamRef.current = stream;

                // Step 3: Set local video srcObject
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Step 4: Initialize PeerJS
                peer = new Peer({
                    host: 'localhost',
                    port: 9000,
                    path: '/'  // Match the npx peer default path
                }); 666666621
                peerRef.current = peer;

                // Step 5: When peer is ready, join the room
                peer.on('open', (userId) => {
                    socket.emit('join-room', meetingId, userId);
                });

                // Step 6: Handle incoming calls (User B receiving from User A)
                peer.on('call', (call) => {
                    // Answer the call with our local stream
                    call.answer(stream);

                    // When we receive the remote stream
                    call.on('stream', (remoteStream) => {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                            setIsConnected(true);
                        }
                    });
                });

                // Step 7: When another user joins, call them (User A calling User B)
                socket.on('user-connected', (userId: string) => {
                    // Small delay to ensure peer is ready
                    setTimeout(() => {
                        const call = peer.call(userId, stream);

                        call.on('stream', (remoteStream) => {
                            if (remoteVideoRef.current) {
                                remoteVideoRef.current.srcObject = remoteStream;
                                setIsConnected(true);
                            }
                        });
                    }, 1000);
                });

                // Step 8: Handle user disconnection
                socket.on('user-disconnected', () => {
                    setIsConnected(false);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = null;
                    }
                });

            } catch (error) {
                console.error('Error initializing call:', error);
                alert('Could not access camera/microphone. Please check permissions.');
            }
        };

        initializeCall();

        // Cleanup function
        return () => {
            localStreamRef.current?.getTracks().forEach(track => track.stop());
            peerRef.current?.destroy();
            socketRef.current?.disconnect();
        };
    }, [meetingId]);

    // ADDED: Toggle mute function - Line 122-130
    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    // ADDED: Toggle video function - Line 132-140
    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    };

    // ADDED: End call function - Line 142-149
    // ADDED: End call function - Line 142-149
    const endCall = async () => {
        try {
            // Mark meeting as completed in database
            const token = localStorage.getItem('token');
            if (meetingId) {
                await axios.patch(
                    `http://localhost:5000/api/meetings/${meetingId}/complete`,
                    {},
                    { headers: { 'x-auth-token': token } }
                );
            }
        } catch (error) {
            console.error('Error completing meeting:', error);
        }

        localStreamRef.current?.getTracks().forEach(track => track.stop());
        peerRef.current?.destroy();
        socketRef.current?.disconnect();
        window.location.href = '/dashboard';
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {/* Remote Video (Other User) */}
                <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    {!isConnected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                            <p className="text-white text-lg">Waiting for other participant...</p>
                        </div>
                    )}
                </div>

                {/* Local Video (You) */}
                <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover mirror"
                    />
                    <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-75 px-3 py-1 rounded-full">
                        <span className="text-white text-sm">You</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 p-6 flex justify-center space-x-4">
                <Button
                    onClick={toggleMute}
                    variant={isMuted ? 'error' : 'secondary'}
                    className="rounded-full w-14 h-14 flex items-center justify-center"
                >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </Button>

                <Button
                    onClick={toggleVideo}
                    variant={isVideoOff ? 'error' : 'secondary'}
                    className="rounded-full w-14 h-14 flex items-center justify-center"
                >
                    {isVideoOff ? <VideoOff size={24} /> : <VideoIcon size={24} />}
                </Button>

                <Button
                    onClick={endCall}
                    variant="error"
                    className="rounded-full w-14 h-14 flex items-center justify-center"
                >
                    <PhoneOff size={24} />
                </Button>
            </div>

            <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
        </div>
    );
};
