import React from "react";
import {
  AbsoluteFill,
  Composition,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

const MyComp: React.FC = () => {
  const frame = useCurrentFrame();

  const x = interpolate(
    frame,
    [0, 120],
    [100, 1700],
    {
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#101827",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: x,
          top: 460,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "#38bdf8",
          boxShadow: "0 0 60px #38bdf8",
        }}
      />

      <div
        style={{
          color: "white",
          fontSize: 64,
          fontWeight: "bold",
          opacity,
        }}
      >
        Minha primeira animação!
      </div>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComp}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
