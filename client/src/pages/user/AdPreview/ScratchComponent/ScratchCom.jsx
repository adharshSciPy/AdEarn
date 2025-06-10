import React, { useRef, useEffect } from "react";
import { ScratchCard, SCRATCH_TYPE } from "scratchcard-js";
import ScratchImg from "./unnamed.jpg"; // Path to the overlay image
 // Optional styling

function ScratchCom({ onComplete, reward }) {
  const containerRef = useRef(null);
  const scratchCardInstance = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sc = new ScratchCard("#scratch-canvas", {
      containerWidth: 320,
      containerHeight: 180,
      imageForwardSrc: ScratchImg,
      scratchType: SCRATCH_TYPE.CIRCLE,
      clearZoneRadius: 30,
      nPoints: 30,
      pointSize: 4,
      percentToFinish: 20,
      callback: () => {
        if (typeof onComplete === "function") {
          onComplete();
        }
      },
    });

    scratchCardInstance.current = sc;

    sc.init().then(() => {
      console.log("ScratchCard loaded");
    });

    return () => {
      // No destroy method in scratchcard-js yet
    };
  }, [onComplete]);

  return (
    <div
      style={{
        width: "320px",
        height: "180px",
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* 🎁 Reward Display - UNDER the scratch layer */}
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#52c41a",
        }}
      >
         +{reward?.starsRewarded || "?"} Stars! ⭐  
      </div>

      {/* 🧽 Scratch Canvas - OVER the reward */}
      <div
        id="scratch-canvas"
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 2,
        }}
      />
    </div>
  );
}

export default ScratchCom;
