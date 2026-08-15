"use client";

import { useRef } from "react";
import { useSelector } from "react-redux";

function Page() {
  const { userData } = useSelector((state: RootState) => state.user);
  const containerRef = useRef<HTMLDivElement>(null);

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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div ref={containerRef} className="h-screen">
      <button onClick={() => startCall()}>Click</button>
    </div>
  );
}

export default Page;
