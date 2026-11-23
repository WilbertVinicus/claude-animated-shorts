// src/CartoonShort/World.tsx
// Parte 2 do mundo 3D: casas, Parlamento, ponte, o componente World e os
// ajustes prontos para cada cena. As peças da parte 1 vêm de WorldParts.tsx.
// Usa: react, config.ts, InkOutline.tsx e WorldParts.tsx.

import React from "react";
import { COLORS } from "./config";
import type { SceneId } from "./config";
import { InkOutline } from "./InkOutline";
import {
      BRICKS,
        ROOFS,
          MODERN,
            LONG,
              WATER_Y,
                rand,
                  range,
                    pick,
                      clamp01,
                        mixHex,
                          Sky,
                            Clouds,
                              Sun,
                                Waves,
                                  StinkPuffs,
                                    Debris,
                                      DrainPipes,
} from "./WorldParts";
import type { Vec3 } from "./WorldParts";

// As peças avulsas continuam saindo daqui, como combinado:
// os próximos arquivos importam Desk, BrickPile etc. de "./World".
export { mixHex, Desk, BrickPile, BrickTunnelRow, Manhole } from "./WorldParts";

// ---------- Mapa do mundo (unidades 3D) ----------
// Eixo X: ao longo do rio. Eixo Y: para cima. Eixo Z: para a câmera.
// Rio:             z de -16 a 0, água em y = -1
// Margem de cá:    z de 0 a 120 (rua, personagens, mesa, obra)
// Margem de lá:    z menor que -16 (Parlamento, casas)
// Parlamento:      x de -34 a 2, fachada em z = -22.5, torre do relógio em x = 4
// Terraço (deputados): z entre -22.5 e -16
// Ponte:           x = 22, atravessa o rio
// Canos de esgoto: na parede da margem de lá, z = -15.2

// ---------- Poste, casas e torres ----------

const StreetLamp: React.FC<{ position: Vec3 }> = ({ position }) => (
      <group position={position}>
          <InkOutline
                size={[0.25, 4, 0.25]}
                      color="#2f2f3a"
                            position={[0, 2, 0]}
                                  thickness={0.04}
                                      >
                                            <cylinderGeometry args={[0.125, 0.125, 4, 8]} />
                                                </InkOutline>
                                                    <InkOutline
                                                          size={[0.8, 0.9, 0.8]}
                                                                color="#ffe27a"
                                                                      toon={false}
                                                                            position={[0, 4.4, 0]}
                                                                                  thickness={0.05}
                                                                                      >
                                                                                            <boxGeometry args={[0.8, 0.9, 0.8]} />
                                                                                                </InkOutline>
                                                                                                    <InkOutline
                                                                                                          size={[1, 0.3, 1]}
                                                                                                                color="#2f2f3a"
                                                                                                                      position={[0, 5, 0]}
                                                                                                                            thickness={0.04}
                                                                                                                                >
                                                                                                                                      <boxGeometry args={[1, 0.3, 1]} />
                                                                                                                                          </InkOutline>
                                                                                                                                            </group>
);

type HouseProps = {
      position: Vec3;
        size: number;
          height: number;
            facing: 1 | -1;
              wall: string;
                roof: string;
                  chimney: boolean;
};

const House: React.FC<HouseProps> = ({
      position,
        size,
          height,
            facing,
              wall,
                roof,
                  chimney,
}) => {
      const roofR = size / Math.SQRT2;
        const roofH = 2.4;
          const front = facing * (size / 2 + 0.04);
            return (
                    <group position={position}>
                          <InkOutline
                                  size={[size, height, size]}
                                          color={wall}
                                                  position={[0, height / 2, 0]}
                                                        >
                                                                <boxGeometry args={[size, height, size]} />
                                                                      </InkOutline>
                                                                            <InkOutline
                                                                                    size={[roofR * 2, roofH, roofR * 2]}
                                                                                            color={roof}
                                                                                                    position={[0, height + roofH / 2, 0]}
                                                                                                            rotation={[0, Math.PI / 4, 0]}
                                                                                                                  >
                                                                                                                          <coneGeometry args={[roofR, roofH, 4]} />
                                                                                                                                </InkOutline>
                                                                                                                                      <InkOutline
                                                                                                                                              size={[1.1, 1.7, 0.15]}
                                                                                                                                                      color="#5a3a28"
                                                                                                                                                              position={[0, 0.85, front]}
                                                                                                                                                                      thickness={0.03}
                                                                                                                                                                            >
                                                                                                                                                                                    <boxGeometry args={[1.1, 1.7, 0.15]} />
                                                                                                                                                                                          </InkOutline>
                                                                                                                                                                                                {[-1, 1].map((side) => (
                                                                                                                                                                                                            <InkOutline
                                                                                                                                                                                                                      key={side}
                                                                                                                                                                                                                                size={[0.9, 1.1, 0.1]}
                                                                                                                                                                                                                                          color="#ffe9a8"
                                                                                                                                                                                                                                                    toon={false}
                                                                                                                                                                                                                                                              position={[side * size * 0.28, height * 0.62, front]}
                                                                                                                                                                                                                                                                        thickness={0.03}
                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                          <boxGeometry args={[0.9, 1.1, 0.1]} />
                                                                                                                                                                                                                                                                                                  </InkOutline>
                                                                                                                                                                                                ))}
                                                                                                                                                                                                      {chimney ? (
                                                                                                                                                                                                                <InkOutline
                                                                                                                                                                                                                          size={[0.8, 1.8, 0.8]}
                                                                                                                                                                                                                                    color="#7a3b2e"
                                                                                                                                                                                                                                              position={[size * 0.25, height + 1.6, 0]}
                                                                                                                                                                                                                                                        thickness={0.04}
                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                          <boxGeometry args={[0.8, 1.8, 0.8]} />
                                                                                                                                                                                                                                                                                  </InkOutline>
                                                                                                                                                                                                      ) : null}
                                                                                                                                                                                                          </group>
            );
};

type HouseRowProps = {
      xs: number[];
        z: number;
          facing: 1 | -1;
            modern: boolean;
              seed: number;
};

const HouseRow: React.FC<HouseRowProps> = ({ xs, z, facing, modern, seed }) => (
      <>
          {xs.map((x, i) => {
                  const r1 = rand(seed + i);
                        const r2 = rand(seed + i + 40);
                              const r3 = rand(seed + i + 80);
                                    if (modern) {
                                                const w = 5 + r1 * 3;
                                                        const h = 8 + r2 * 18;
                                                                return (
                                                                              <InkOutline
                                                                                          key={i}
                                                                                                      size={[w, h, w]}
                                                                                                                  color={pick(MODERN, r3)}
                                                                                                                              position={[x, h / 2, z]}
                                                                                                                                        >
                                                                                                                                                    <boxGeometry args={[w, h, w]} />
                                                                                                                                                              </InkOutline>
                                                                );
                                    }
                                          return (
                                                    <House
                                                              key={i}
                                                                        position={[x, 0, z]}
                                                                                  size={4.4 + r1 * 1.6}
                                                                                            height={4.5 + r2 * 3}
                                                                                                      facing={facing}
                                                                                                                wall={pick(BRICKS, r3)}
                                                                                                                          roof={pick(ROOFS, r1)}
                                                                                                                                    chimney={r2 > 0.5}
                                                                                                                                            />
                                          );
          })}
            </>
);
// ---------- Parlamento e torre do relógio ----------

const Parliament: React.FC<{ curtains: boolean }> = ({ curtains }) => {
      const windowColor = curtains ? "#efe9c0" : "#3a4a6a";
        const stone = COLORS.stone;
          return (
                <group>
                      {/* Corpo principal */}
                            <InkOutline size={[36, 8, 9]} color={stone} position={[-16, 4, -27]}>
                                    <boxGeometry args={[36, 8, 9]} />
                                          </InkOutline>
                                                <InkOutline
                                                        size={[36.8, 0.8, 9.8]}
                                                                color="#5b7f6e"
                                                                        position={[-16, 8.4, -27]}
                                                                                thickness={0.05}
                                                                                      >
                                                                                              <boxGeometry args={[36.8, 0.8, 9.8]} />
                                                                                                    </InkOutline>

                                                                                                          {/* Janelas (cobertas por cortinas de cal na cena 3) */}
                                                                                                                {[2.4, 5.6].map((y) =>
                                                                                                                        range(-31, -1, 3.4).map((x) => (
                                                                                                                                      <InkOutline
                                                                                                                                                  key={`${y}-${x}`}
                                                                                                                                                              size={[1.5, 2.4, 0.3]}
                                                                                                                                                                          color={windowColor}
                                                                                                                                                                                      toon={false}
                                                                                                                                                                                                  position={[x, y, -22.4]}
                                                                                                                                                                                                              thickness={0.04}
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                    <boxGeometry args={[1.5, 2.4, 0.3]} />
                                                                                                                                                                                                                                              </InkOutline>
                                                                                                                        ))
                                                                                                                )}

                                                                                                                      {/* Pináculos no telhado */}
                                                                                                                            {range(-33, 1, 4.25).map((x) => (
                                                                                                                                        <InkOutline
                                                                                                                                                  key={x}
                                                                                                                                                            size={[1, 2.2, 1]}
                                                                                                                                                                      color={stone}
                                                                                                                                                                                position={[x, 9.9, -22.9]}
                                                                                                                                                                                          thickness={0.04}
                                                                                                                                                                                                  >
                                                                                                                                                                                                            <coneGeometry args={[0.5, 2.2, 8]} />
                                                                                                                                                                                                                    </InkOutline>
                                                                                                                            ))}

                                                                                                                                  {/* Torres laterais */}
                                                                                                                                        {[-34, -18].map((x) => (
                                                                                                                                                    <group key={x}>
                                                                                                                                                              <InkOutline
                                                                                                                                                                          size={[2.8, 10.5, 2.8]}
                                                                                                                                                                                      color={stone}
                                                                                                                                                                                                  position={[x, 5.25, -22.9]}
                                                                                                                                                                                                            >
                                                                                                                                                                                                                        <cylinderGeometry args={[1.4, 1.4, 10.5, 12]} />
                                                                                                                                                                                                                                  </InkOutline>
                                                                                                                                                                                                                                            <InkOutline
                                                                                                                                                                                                                                                        size={[3.4, 3, 3.4]}
                                                                                                                                                                                                                                                                    color="#5b7f6e"
                                                                                                                                                                                                                                                                                position={[x, 12, -22.9]}
                                                                                                                                                                                                                                                                                          >
                                                                                                                                                                                                                                                                                                      <coneGeometry args={[1.7, 3, 12]} />
                                                                                                                                                                                                                                                                                                                </InkOutline>
                                                                                                                                                                                                                                                                                                                        </group>
                                                                                                                                        ))}

                                                                                                                                              {/* Torre do relógio */}
                                                                                                                                                    <InkOutline size={[4.4, 12, 4.4]} color={stone} position={[4, 6, -27]}>
                                                                                                                                                            <boxGeometry args={[4.4, 12, 4.4]} />
                                                                                                                                                                  </InkOutline>
                                                                                                                                                                        <InkOutline
                                                                                                                                                                                size={[5.2, 4.5, 5.2]}
                                                                                                                                                                                        color={stone}
                                                                                                                                                                                                position={[4, 14.25, -27]}
                                                                                                                                                                                                      >
                                                                                                                                                                                                              <boxGeometry args={[5.2, 4.5, 5.2]} />
                                                                                                                                                                                                                    </InkOutline>
                                                                                                                                                                                                                          <mesh position={[4, 14.25, -24.38]}>
                                                                                                                                                                                                                                  <circleGeometry args={[1.8, 32]} />
                                                                                                                                                                                                                                          <meshBasicMaterial color="#fffaf0" />
                                                                                                                                                                                                                                                </mesh>
                                                                                                                                                                                                                                                      <mesh position={[4, 14.25, -24.37]}>
                                                                                                                                                                                                                                                              <ringGeometry args={[1.7, 1.9, 32]} />
                                                                                                                                                                                                                                                                      <meshBasicMaterial color={COLORS.ink} />
                                                                                                                                                                                                                                                                            </mesh>
                                                                                                                                                                                                                                                                                  <mesh position={[4, 14.7, -24.36]}>
                                                                                                                                                                                                                                                                                          <boxGeometry args={[0.15, 1.1, 0.02]} />
                                                                                                                                                                                                                                                                                                  <meshBasicMaterial color={COLORS.ink} />
                                                                                                                                                                                                                                                                                                        </mesh>
                                                                                                                                                                                                                                                                                                              <mesh position={[4.4, 14.25, -24.36]} rotation={[0, 0, Math.PI / 2]}>
                                                                                                                                                                                                                                                                                                                      <boxGeometry args={[0.15, 0.8, 0.02]} />
                                                                                                                                                                                                                                                                                                                              <meshBasicMaterial color={COLORS.ink} />
                                                                                                                                                                                                                                                                                                                                    </mesh>
                                                                                                                                                                                                                                                                                                                                          <InkOutline
                                                                                                                                                                                                                                                                                                                                                  size={[6.4, 6, 6.4]}
                                                                                                                                                                                                                                                                                                                                                          color="#5b7f6e"
                                                                                                                                                                                                                                                                                                                                                                  position={[4, 19.5, -27]}
                                                                                                                                                                                                                                                                                                                                                                          rotation={[0, Math.PI / 4, 0]}
                                                                                                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                                                                                        <coneGeometry args={[3.2, 6, 4]} />
                                                                                                                                                                                                                                                                                                                                                                                              </InkOutline>
                                                                                                                                                                                                                                                                                                                                                                                                  </group>
          );
};

// ---------- Ponte ----------

const Bridge: React.FC = () => (
      <group>
          <InkOutline
                size={[8, 0.4, 16.4]}
                      color="#bfae8a"
                            position={[22, -0.15, -8]}
                                >
                                      <boxGeometry args={[8, 0.4, 16.4]} />
                                          </InkOutline>
                                              {[-4, -8, -12].map((z) => (
                                                      <InkOutline
                                                              key={z}
                                                                      size={[6.5, 1.7, 1.4]}
                                                                              color={COLORS.stone}
                                                                                      position={[22, -1.2, z]}
                                                                                            >
                                                                                                    <boxGeometry args={[6.5, 1.7, 1.4]} />
                                                                                                          </InkOutline>
                                              ))}
                                                  {[18.2, 25.8].map((x) => (
                                                          <InkOutline
                                                                  key={x}
                                                                          size={[0.4, 1, 16.4]}
                                                                                  color="#a8987a"
                                                                                          position={[x, 0.7, -8]}
                                                                                                  thickness={0.04}
                                                                                                        >
                                                                                                                <boxGeometry args={[0.4, 1, 16.4]} />
                                                                                                                      </InkOutline>
                                                  ))}
                                                      {[-1.5, -8, -14.5].map((z) => (
                                                              <StreetLamp key={z} position={[22, 0, z]} />
                                                      ))}
                                                        </group>
);

// ---------- Componente principal ----------

export type WorldProps = {
      skyTop: string;
        skyBottom: string;
          riverColor: string;
            /** 0..1: quantidade de fumaça verde fedida e lixo no rio. */
              stink?: number;
                /** Cortinas de cal nas janelas do Parlamento (cena 3). */
                  curtains?: boolean;
                    /** Troca as casas por prédios modernos (cena 7). */
                      modern?: boolean;
                        showSun?: boolean;
                          sunColor?: string;
                            cloudColor?: string;
                              lightColor?: string;
                                /** Multiplica a intensidade das luzes. Ajuste se a cena ficar clara/escura. */
                                  lightIntensity?: number;
                                    /** Canos despejando esgoto no rio (cena 2). */
                                      showDrainPipes?: boolean;
};
   export const World: React.FC<WorldProps> = ({
      skyTop,
        skyBottom,
          riverColor,
            stink = 0,
              curtains = false,
                modern = false,
                  showSun = true,
                    sunColor = "#fff3b0",
                      cloudColor = "#ffffff",
                        lightColor = "#fff1d6",
                          lightIntensity = 1,
                            showDrainPipes = false,
                            }) => {
                                  return (
                                        <>
                                              <Sky top={skyTop} bottom={skyBottom} />
                                                    <fog attach="fog" args={[skyBottom, 100, 480]} />

                                                          <ambientLight intensity={1.0 * lightIntensity} color="#ffffff" />
                                                                <directionalLight
                                                                        position={[-20, 40, 30]}
                                                                                intensity={2.2 * lightIntensity}
                                                                                        color={lightColor}
                                                                                              />

                                                                                                    {showSun ? <Sun color={sunColor} /> : null}
                                                                                                          <Clouds color={cloudColor} />

                                                                                                                {/* Terreno distante */}
                                                                                                                      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
                                                                                                                              <planeGeometry args={[1600, 1600]} />
                                                                                                                                      <meshBasicMaterial color="#8fa860" />
                                                                                                                                            </mesh>

                                                                                                                                                  {/* Margem de cá (rua) */}
                                                                                                                                                        <InkOutline
                                                                                                                                                                size={[LONG, 0.5, 120]}
                                                                                                                                                                        color="#cdb98f"
                                                                                                                                                                                position={[0, -0.25, 60]}
                                                                                                                                                                                        thickness={0.04}
                                                                                                                                                                                              >
                                                                                                                                                                                                      <boxGeometry args={[LONG, 0.5, 120]} />
                                                                                                                                                                                                            </InkOutline>
                                                                                                                                                                                                                  {[6, 12].map((z) => (
                                                                                                                                                                                                                            <mesh key={z} position={[0, 0.015, z]}>
                                                                                                                                                                                                                                      <boxGeometry args={[LONG, 0.02, 0.25]} />
                                                                                                                                                                                                                                                <meshBasicMaterial color="#b59f73" />
                                                                                                                                                                                                                                                        </mesh>
                                                                                                                                                                                                                  ))}

                                                                                                                                                                                                                        {/* Margem de lá */}
                                                                                                                                                                                                                              <InkOutline
                                                                                                                                                                                                                                      size={[LONG, 0.5, 184]}
                                                                                                                                                                                                                                              color="#a9bb6a"
                                                                                                                                                                                                                                                      position={[0, -0.25, -108]}
                                                                                                                                                                                                                                                              thickness={0.04}
                                                                                                                                                                                                                                                                    >
                                                                                                                                                                                                                                                                            <boxGeometry args={[LONG, 0.5, 184]} />
                                                                                                                                                                                                                                                                                  </InkOutline>
                                                                                                                                                                                                                                                                                        <InkOutline
                                                                                                                                                                                                                                                                                                size={[90, 0.12, 6.5]}
                                                                                                                                                                                                                                                                                                        color={COLORS.stone}
                                                                                                                                                                                                                                                                                                                position={[-16, 0, -19.25]}
                                                                                                                                                                                                                                                                                                                        thickness={0.03}
                                                                                                                                                                                                                                                                                                                              >
                                                                                                                                                                                                                                                                                                                                      <boxGeometry args={[90, 0.12, 6.5]} />
                                                                                                                                                                                                                                                                                                                                            </InkOutline>

                                                                                                                                                                                                                                                                                                                                                  {/* Muros de pedra do rio */}
                                                                                                                                                                                                                                                                                                                                                        <InkOutline
                                                                                                                                                                                                                                                                                                                                                                size={[LONG, 1.8, 0.8]}
                                                                                                                                                                                                                                                                                                                                                                        color={COLORS.stone}
                                                                                                                                                                                                                                                                                                                                                                                position={[0, -0.9, -0.4]}
                                                                                                                                                                                                                                                                                                                                                                                        thickness={0.04}
                                                                                                                                                                                                                                                                                                                                                                                              >
                                                                                                                                                                                                                                                                                                                                                                                                      <boxGeometry args={[LONG, 1.8, 0.8]} />
                                                                                                                                                                                                                                                                                                                                                                                                            </InkOutline>
                                                                                                                                                                                                                                                                                                                                                                                                                  <InkOutline
                                                                                                                                                                                                                                                                                                                                                                                                                          size={[LONG, 1.8, 0.8]}
                                                                                                                                                                                                                                                                                                                                                                                                                                  color={COLORS.stone}
                                                                                                                                                                                                                                                                                                                                                                                                                                          position={[0, -0.9, -15.6]}
                                                                                                                                                                                                                                                                                                                                                                                                                                                  thickness={0.04}
                                                                                                                                                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                                                                                                                                                <boxGeometry args={[LONG, 1.8, 0.8]} />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                      </InkOutline>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                            {/* Rio */}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, WATER_Y, -8]}>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          <planeGeometry args={[LONG, 15.2]} />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <meshBasicMaterial color={riverColor} />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </mesh>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              <Waves color={riverColor} />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <Debris amount={stink} />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          <StinkPuffs amount={stink} />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                {showDrainPipes ? <DrainPipes /> : null}

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      {/* Construções */}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <Parliament curtains={curtains} />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <Bridge />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <HouseRow
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                xs={range(-52, 52, 8.5)}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        z={26}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                facing={-1}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        modern={modern}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                seed={100}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <HouseRow
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    xs={[...range(-104, -44, 8), ...range(14, 104, 8.5)]}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            z={-27}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    facing={1}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            modern={modern}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    seed={300}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          />

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                {/* Postes da rua */}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      {range(-48, 48, 12).map((x) => (
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <StreetLamp key={x} position={[x, 0, 1.8]} />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ))}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          </>
                                  );
                            };

                            // ---------- Ajustes prontos para cada cena ----------

                            /** Mundo pronto para cada uma das 7 cenas. `progress` (0..1) só afeta a cena "obra". */
                            export const worldPropsForScene = (id: SceneId, progresscd /workspaces/claude-animated-shorts/studio
                            npx tsc --noEmit
                            
                                                                                                                                                       )
                                                                                                                                                                                                ))}
)
}