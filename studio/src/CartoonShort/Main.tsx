// src/CartoonShort/Main.tsx
// Composição principal do curta "O Grande Fedor de Londres".
// Junta o mundo 3D com as 7 cenas (dentro do ThreeCanvas), o áudio
// (música, efeitos e, quando existir, a narração) e o fade de entrada e saída.
// Usa: react, remotion, @remotion/three e os arquivos do CartoonShort.

import React from "react";
import {
  AbsoluteFill,
    Audio,
      Sequence,
        interpolate,
          staticFile,
            useCurrentFrame,
            } from "remotion";
            import { ThreeCanvas } from "@remotion/three";
            import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./config";
            import { NARRATION, getNarrationStartFrame } from "./narration";
            import { MUSIC_FILE, SFX_CUES, SFX_SECONDS, sfxFilePath } from "./audio";
            import { Scenes } from "./Scenes";

            /**
             * Narração: deixe false até gerar os 7 arquivos .mp3 e colocá-los em
              * public/narration/ (os nomes estão em narration.ts).
               * Com true e arquivos faltando, o render falha.
                */
                export const USE_NARRATION = false;

                const MUSIC_VOLUME = 0.55;
                const SFX_VOLUME = 0.8;
                const NARRATION_VOLUME = 1;
                const FADE_IN_FRAMES = 12;
                const FADE_OUT_FRAMES = 30;

                /** Opacidade da cortina preta: começa fechada, abre rápido e fecha no final. */
                export const getFadeOpacity = (frame: number): number => {
                  const fadeIn = interpolate(frame, [0, FADE_IN_FRAMES], [1, 0], {
                      extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                            });
                              const fadeOut = interpolate(
                                  frame,
                                      [DURATION_IN_FRAMES - FADE_OUT_FRAMES, DURATION_IN_FRAMES - 1],
                                          [0, 1],
                                              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                                                );
                                                  return Math.max(fadeIn, fadeOut);
                                                  };

                                                  /** Música, efeitos sonoros (na linha do tempo do audio.ts) e narração opcional. */
                                                  export const AudioTrack: React.FC<{ narration: boolean }> = ({ narration }) => (
                                                    <>
                                                        <Audio src={staticFile(MUSIC_FILE)} volume={MUSIC_VOLUME} />
                                                            {SFX_CUES.map((cue, i) => (
                                                                  <Sequence
                                                                          key={`${cue.file}-${cue.frame}-${i}`}
                                                                                  from={cue.frame}
                                                                                          durationInFrames={Math.ceil(SFX_SECONDS[cue.file] * FPS) + 1}
                                                                                                  layout="none"
                                                                                                        >
                                                                                                                <Audio
                                                                                                                          src={staticFile(sfxFilePath(cue.file))}
                                                                                                                                    volume={cue.volume * SFX_VOLUME}
                                                                                                                                            />
                                                                                                                                                  </Sequence>
                                                                                                                                                      ))}
                                                                                                                                                          {narration
                                                                                                                                                                ? NARRATION.map((entry) => (
                                                                                                                                                                          <Sequence
                                                                                                                                                                                      key={entry.sceneId}
                                                                                                                                                                                                  from={getNarrationStartFrame(entry)}
                                                                                                                                                                                                              layout="none"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                    <Audio
                                                                                                                                                                                                                                                  src={staticFile(entry.audioFile)}
                                                                                                                                                                                                                                                                volume={NARRATION_VOLUME}
                                                                                                                                                                                                                                                                            />
                                                                                                                                                                                                                                                                                      </Sequence>
                                                                                                                                                                                                                                                                                              ))
                                                                                                                                                                                                                                                                                                    : null}
                                                                                                                                                                                                                                                                                                      </>
                                                                                                                                                                                                                                                                                                      );

                                                                                                                                                                                                                                                                                                      export const CartoonShort: React.FC = () => {
                                                                                                                                                                                                                                                                                                        const frame = useCurrentFrame();
                                                                                                                                                                                                                                                                                                          return (
                                                                                                                                                                                                                                                                                                              <AbsoluteFill style={{ backgroundColor: "#000000" }}>
                                                                                                                                                                                                                                                                                                                    <ThreeCanvas
                                                                                                                                                                                                                                                                                                                            width={WIDTH}
                                                                                                                                                                                                                                                                                                                                    height={HEIGHT}
                                                                                                                                                                                                                                                                                                                                            camera={{ fov: 50, near: 0.1, far: 2000, position: [0, 10, 40] }}
                                                                                                                                                                                                                                                                                                                                                  >
                                                                                                                                                                                                                                                                                                                                                          <Scenes />
                                                                                                                                                                                                                                                                                                                                                                </ThreeCanvas>
                                                                                                                                                                                                                                                                                                                                                                      <AudioTrack narration={USE_NARRATION} />
                                                                                                                                                                                                                                                                                                                                                                            <AbsoluteFill
                                                                                                                                                                                                                                                                                                                                                                                    style={{
                                                                                                                                                                                                                                                                                                                                                                                              backgroundColor: "#000000",
                                                                                                                                                                                                                                                                                                                                                                                                        opacity: getFadeOpacity(frame),
                                                                                                                                                                                                                                                                                                                                                                                                                  pointerEvents: "none",
                                                                                                                                                                                                                                                                                                                                                                                                                          }}
                                                                                                                                                                                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                                                                                                                                                                                    </AbsoluteFill>
                                                                                                                                                                                                                                                                                                                                                                                                                                      );
                                                                                                                                                                                                                                                                                                                                                                                                                                      };