// src/CartoonShort/Scenes.tsx
// As 7 cenas do curta: cada uma monta o mundo, a câmera e os personagens.
// Tudo isto vai DENTRO do <ThreeCanvas> (o Main.tsx faz isso mais adiante).
// Usa: react, remotion, config.ts, InkOutline, BeanCharacter, CameraRig e World.

import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { SCENES, getSceneDuration } from "./config";
import type { SceneConfig } from "./config";
import { InkOutline } from "./InkOutline";
import { BeanCharacter } from "./BeanCharacter";
import {
      CameraRig,
        TRAVELLING_START_X,
          orbitAngleAt,
            travellingX,
} from "./CameraRig";
import {
      BrickPile,
        BrickTunnelRow,
          Desk,
            Manhole,
              World,
                worldPropsForScene,
} from "./World";

type Vec3 = [number, number, number];
type SceneProps = { scene: SceneConfig };

// ---------- Utilidades ----------

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** Frame local da cena e progresso t de 0 a 1 (0 = início, 1 = fim). */
const useSceneClock = (duration: number) => {
      const frame = useCurrentFrame();
        const t = duration > 1 ? clamp01(frame / (duration - 1)) : 0;
          return { frame, t };
};

/** Escala de 0 a 1 com "quique" (easeOutBack), a partir de `start`. */
const popScale = (frame: number, start: number, length = 14): number => {
      if (frame < start) return 0;
        const u = clamp01((frame - start) / length);
          const c1 = 1.70158;
            const c3 = c1 + 1;
              return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
};

// ---------- Pequenas peças de cena ----------

/** Balde de madeira no chão (cena 2). */
const Bucket: React.FC<{ position: Vec3 }> = ({ position }) => (
      <InkOutline
          size={[0.7, 0.5, 0.7]}
              color="#8a6a3a"
                  position={[position[0], 0.25, position[2]]}
                      thickness={0.04}
                        >
                            <cylinderGeometry args={[0.35, 0.28, 0.5, 12]} />
                              </InkOutline>
);

/** Lâmpada de "ideia" que aparece com um quique (cena 4). */
const IdeaBulb: React.FC<{ position: Vec3; popFrame: number }> = ({
      position,
        popFrame,
}) => {
      const frame = useCurrentFrame();
        const s = popScale(frame, popFrame);
          if (s <= 0) return null;
            const bob = Math.sin(frame * 0.12) * 0.08;
              return (
                    <group
                          position={[position[0], position[1] + bob, position[2]]}
                                scale={s}
                                    >
                                          <InkOutline
                                                  size={[0.9, 0.9, 0.9]}
                                                          color="#ffe27a"
                                                                  toon={false}
                                                                          thickness={0.06}
                                                                                >
                                                                                        <sphereGeometry args={[0.45, 16, 12]} />
                                                                                              </InkOutline>
                                                                                                    <InkOutline
                                                                                                            size={[0.4, 0.3, 0.4]}
                                                                                                                    color="#8c8c96"
                                                                                                                            position={[0, -0.55, 0]}
                                                                                                                                    thickness={0.04}
                                                                                                                                          >
                                                                                                                                                  <cylinderGeometry args={[0.2, 0.2, 0.3, 10]} />
                                                                                                                                                        </InkOutline>
                                                                                                                                                              {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
                                                                                                                                                                        const a = (k * Math.PI) / 4;
                                                                                                                                                                                return (
                                                                                                                                                                                              <mesh
                                                                                                                                                                                                          key={k}
                                                                                                                                                                                                                      position={[Math.cos(a) * 0.8, Math.sin(a) * 0.8, 0]}
                                                                                                                                                                                                                                  rotation={[0, 0, a - Math.PI / 2]}
                                                                                                                                                                                                                                            >
                                                                                                                                                                                                                                                        <boxGeometry args={[0.1, 0.35, 0.05]} />
                                                                                                                                                                                                                                                                    <meshBasicMaterial color="#ffcf3a" />
                                                                                                                                                                                                                                                                              </mesh>
                                                                                                                                                                                );
                                                                                                                                                              })}
                                                                                                                                                                  </group>
              );
};

// ---------- Cena 1: Gancho ----------

const GanchoScene: React.FC<SceneProps> = ({ scene }) => (
      <>
          <World {...worldPropsForScene("gancho")} />
              <CameraRig move={scene.camera} durationInFrames={getSceneDuration(scene)} />
                  <BeanCharacter preset="cidadaoEnjoado" position={[-2.2, 0, 6]} />
                      <BeanCharacter
                            preset="cidadaoEnjoado"
                                  position={[1.4, 0, 6.6]}
                                        flip
                                              phase={20}
                                                    look={{ outfit: "#6a8caf", hat: "coco", hatColor: "#3d2f2a" }}
                                                        />
                                                            <BeanCharacter
                                                                  preset="cidadao"
                                                                        position={[-5.5, 0, 7.5]}
                                                                              phase={40}
                                                                                    look={{ accessory: "lenco-nariz", mood: "enojado" }}
                                                                                        />
                                                                                          </>
);

// ---------- Cena 2: Causa ----------

const CausaScene: React.FC<SceneProps> = ({ scene }) => (
      <>
          <World {...worldPropsForScene("causa")} />
              <CameraRig move={scene.camera} durationInFrames={getSceneDuration(scene)} />
                  <BeanCharacter preset="cidadao" position={[-14, 0, 3]} />
                      <Bucket position={[-12.6, 0, 1.8]} />
                          <BeanCharacter
                                preset="cidadaoEnjoado"
                                      position={[0, 0, 3.4]}
                                            flip
                                                  phase={25}
                                                      />
                                                          <Bucket position={[1.4, 0, 2]} />
                                                              <BeanCharacter
                                                                    preset="cidadao"
                                                                          position={[13, 0, 3]}
                                                                                phase={50}
                                                                                      look={{ mood: "enojado" }}
                                                                                          />
                                                                                              <Bucket position={[11.6, 0, 1.8]} />
                                                                                                </>
);

// ---------- Cena 3: Parlamento ----------

const DEPUTIES: { x: number; z: number; phase: number; flip: boolean }[] = [
      { x: -16.2, z: -19, phase: 0, flip: false },
        { x: -14.6, z: -18.5, phase: 14, flip: true },
          { x: -13.0, z: -19, phase: 31, flip: false },
            { x: -11.4, z: -18.5, phase: 47, flip: true },
];

const ParlamentoScene: React.FC<SceneProps> = ({ scene }) => (
      <>
          <World {...worldPropsForScene("parlamento")} />
              <CameraRig move={scene.camera} durationInFrames={getSceneDuration(scene)} />
                  {DEPUTIES.map((d) => (
                          <BeanCharacter
                                  key={d.x}
                                          preset="deputado"
                                                  position={[d.x, 0.06, d.z]}
                                                          flip={d.flip}
                                                                  phase={d.phase}
                                                                        />
                  ))}
                    </>
);

// ---------- Cena 4: Bazalgette ----------

const BazalgetteScene: React.FC<SceneProps> = ({ scene }) => {
      const duration = getSceneDuration(scene);
        const { t } = useSceneClock(duration);
          // Os cartões giram junto com a câmera para continuarem de frente para ela.
            const yaw = orbitAngleAt(t);
              return (
                    <>
                          <World {...worldPropsForScene("bazalgette")} />
                                <CameraRig move={scene.camera} durationInFrames={duration} />
                                      <Desk position={[0, 0, 8]} />
                                            <BeanCharacter
                                                    preset="bazalgette"
                                                            position={[0, 0, 6.2]}
                                                                    yaw={yaw}
                                                                            talking
                                                                                  />
                                                                                        <BeanCharacter
                                                                                                preset="trabalhador"
                                                                                                        position={[3.6, 0, 6.8]}
                                                                                                                yaw={yaw}
                                                                                                                        phase={30}
                                                                                                                              />
                                                                                                                                    <BeanCharacter
                                                                                                                                            preset="cidadao"
                                                                                                                                                    position={[-3.6, 0, 6.8]}
                                                                                                                                                            yaw={yaw}
                                                                                                                                                                    flip
                                                                                                                                                                            phase={60}
                                                                                                                                                                                  />
                                                                                                                                                                                        <IdeaBulb position={[0, 3.5, 6.2]} popFrame={110} />
                                                                                                                                                                                            </>
              );
};

// ---------- Cena 5: Obra ----------

const WORKERS_DX = [0.4, 1.9, 3.4, 4.9, 6.4];
const TUNNEL_START_X = TRAVELLING_START_X - 2;
const TUNNEL_SPACING = 4.1;
const TUNNEL_COUNT = 12;

const ObraScene: React.FC<SceneProps> = ({ scene }) => {
      const duration = getSceneDuration(scene);
        const { t } = useSceneClock(duration);
          // O grupo marcha na mesma velocidade da câmera (travelling).
            const x = travellingX(t);
              // Os tubos "crescem" alguns passos atrás do grupo.
                const built = (x - 4 - TUNNEL_START_X) / TUNNEL_SPACING;
                  return (
                        <>
                              <World {...worldPropsForScene("obra", t)} />
                                    <CameraRig move={scene.camera} durationInFrames={duration} />
                                          <BrickTunnelRow
                                                  position={[TUNNEL_START_X, 0, 2.2]}
                                                          count={TUNNEL_COUNT}
                                                                  spacing={TUNNEL_SPACING}
                                                                          built={built}
                                                                                />
                                                                                      <BrickPile position={[-12, 0, 9.4]} />
                                                                                            <BrickPile position={[3, 0, 9.4]} />
                                                                                                  <BrickPile position={[15, 0, 9.4]} />
                                                                                                        {WORKERS_DX.map((dx, i) => (
                                                                                                                    <BeanCharacter
                                                                                                                              key={dx}
                                                                                                                                        preset="trabalhador"
                                                                                                                                                  position={[x + dx, 0, i % 2 === 0 ? 6 : 6.9]}
                                                                                                                                                            motion="marchando"
                                                                                                                                                                      height={2.3 + (i % 3) * 0.1}
                                                                                                                                                                                look={i % 2 === 1 ? { outfit: "#7a8a4a" } : undefined}
                                                                                                                                                                                        />
                                                                                                        ))}
                                                                                                            </>
                  );
};

// ---------- Cena 6: Resultado ----------

const CELEBRANTS: { x: number; phase: number; hop: boolean }[] = [
      { x: -2.6, phase: 0, hop: true },
        { x: -0.9, phase: 10, hop: false },
          { x: 0.8, phase: 5, hop: true },
            { x: 2.5, phase: 18, hop: false },
];

const ResultadoScene: React.FC<SceneProps> = ({ scene }) => (
      <>
          <World {...worldPropsForScene("resultado")} />
              <CameraRig move={scene.camera} durationInFrames={getSceneDuration(scene)} />
                  {CELEBRANTS.map((c) => (
                          <BeanCharacter
                                  key={c.x}
                                          preset="cidadaoFeliz"
                                                  position={[c.x, 0, 3.2]}
                                                          motion={c.hop ? "marchando" : "respirando"}
                                                                  phase={c.phase}
                                                                        />
                  ))}
                    </>
);

// ---------- Cena 7: Twist ----------

const TwistScene: React.FC<SceneProps> = ({ scene }) => {
      const duration = getSceneDuration(scene);
        const { t } = useSceneClock(duration);
          return (
                <>
                      <World {...worldPropsForScene("twist")} />
                            <CameraRig move={scene.camera} durationInFrames={duration} />
                                  <Manhole position={[0, 0, 8]} glow={clamp01(t * 1.6)} />
                                        <BeanCharacter
                                                preset="cidadaoFeliz"
                                                        position={[-3, 0, 8.6]}
                                                                look={{ hat: "none", outfit: "#e05a7a", pants: "#2b2b3a" }}
                                                                      />
                                                                            <BeanCharacter
                                                                                    preset="cidadaoFeliz"
                                                                                            position={[3.1, 0, 9]}
                                                                                                    flip
                                                                                                            phase={35}
                                                                                                                    look={{ hat: "bone", hatColor: "#2a6fb5", outfit: "#3aa0e0" }}
                                                                                                                          />
                                                                                                                              </>
          );
};

// ---------- Escolha da cena e componente exportado ----------

const SceneContent: React.FC<SceneProps> = ({ scene }) => {
      switch (scene.id) {
            case "gancho":
                  return <GanchoScene scene={scene} />;
                      case "causa":
                            return <CausaScene scene={scene} />;
                                case "parlamento":
                                      return <ParlamentoScene scene={scene} />;
                                          case "bazalgette":
                                                return <BazalgetteScene scene={scene} />;
                                                    case "obra":
                                                          return <ObraScene scene={scene} />;
                                                              case "resultado":
                                                                    return <ResultadoScene scene={scene} />;
                                                                        case "twist":
                                                                              return <TwistScene scene={scene} />;
      }
};

/**
 * Monta as 7 cenas em sequência, cada uma no seu intervalo de frames.
  * Deve ser colocado dentro do <ThreeCanvas>.
   */
   export const Scenes: React.FC = () => (
      <>
          {SCENES.map((scene) => (
                  <Sequence
                          key={scene.id}
                                  from={scene.start}
                                          durationInFrames={getSceneDuration(scene)}
                                                  layout="none"
                                                        >
                                                                <SceneContent scene={scene} />
                                                                      </Sequence>
          ))}
            </>
   )
]
                                                                                                                                                                                )
                                                                                                                                                              })}
)
}