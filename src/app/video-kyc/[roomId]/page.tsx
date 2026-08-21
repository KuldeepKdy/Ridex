"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Video, VideoOff } from "lucide-react";

function Page() {
  const { userData } = useSelector((state: RootState) => state.user);
  const containerRef = useRef<HTMLDivElement>(null);
  const [joined, setJoined] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  useEffect(() => {
    if (joined) return;
    let localStream: MediaStream | null = null;
    const init = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(localStream);
        if (previewRef.current) {
          previewRef.current.srcObject = localStream;
        }
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);

  const toggleCamera = async () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((track) => (track.enabled = !isCameraOn));
    setIsCameraOn(!isCameraOn);
  };
  const toggleMic = async () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => (track.enabled = !isMicOn));
    setIsMicOn(!isMicOn);
  };

  const startCall = async () => {
    console.log("user data", userData);
    if (!containerRef) console.log("no ref");
    try {
      const { ZegoUIKitPrebuilt } =
        await import("@zegocloud/zego-uikit-prebuilt");
      const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret!,
        "efefegdv",
        userData?._id?.toString(),
        "kuldeep",
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: containerRef.current,

        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
        showPreJoinView: false,
      });
      setJoined(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Image src="/logo.png" alt="logo" width={44} height={44} priority />
          <p className="text-sm font-semibold">
            {userData.role == "admin"
              ? "Admin Verification"
              : "Partner Video KYC"}
          </p>
        </div>
      </div>
      <div className="flex-1 relative">
        {!joined && (
          <div className="h-full flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <video ref={previewRef} autoPlay playsInline />
                {!isCameraOn && (
                  <div>
                    <VideoOff size={24} />
                  </div>
                )}
              </div>
              <div className="space-y-8 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Secure Video KYC
                </h1>
                <div className="flex justify-center lg:justify-start gap-6">
                  <button
                    onClick={toggleCamera}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isCameraOn ? "bg-white text-black" : "bg-white/10 border border-white/20"}`}
                  >
                    {isCameraOn ? <Video /> : <VideoOff />} Camera
                  </button>
                  <button
                    onClick={toggleMic}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isMicOn ? "bg-white text-black" : "bg-white/10 border border-white/20"}`}
                  >
                    {isMicOn ? <Video /> : <VideoOff />} Mic
                  </button>
                </div>
                <button className="w-full h-14 rounded-2xl bg-black text-white font-semibold ">

                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
