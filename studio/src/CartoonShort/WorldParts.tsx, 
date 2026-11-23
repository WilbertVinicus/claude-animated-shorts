// src/CartoonShort/WorldParts.tsx
// Parte 1 do mundo 3D: utilidades, céu, nuvens, sol, água, fedor, lixo,
// canos de esgoto e peças avulsas (Desk, BrickPile, BrickTunnelRow, Manhole).
// Usa: react, remotion (useCurrentFrame), three, config.ts e InkOutline.tsx.

import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { COLORS } from "./config";
import { InkOutline } from "./InkOutline";

export type Vec3 = [number, number, number];

// Comprimento das margens e do rio (eixo X) e altura da água.
export const LONG = 400;
export const WATER_Y = -1;

// ---------- Utilidades ----------

export const rand = (seed: number): number => {
      const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
        return x - Math.floor(x);
};

export const range = (from: number, to: number, step: number): number[] => {
      const out: number[] = [];
        for (let x = from; x <= to + 1e-6; x += step) out.push(x);
          return out;
};

export function pick<T>(items: readonly T[], r: number): T {
      return items[Math.floor(r * items.length) % items.length];
}

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** Mistura duas cores hex. k = 0 devolve a, k = 1 devolve b. */
export const mixHex = (a: string, b: string, k: number): string => {
      const c = new THREE.Color(a).lerp(new THREE.Color(b), clamp01(k));
        return `#${c.getHexString()}`;
};

export const BRICKS = ["#c4553a", "#d9805a", "#b8704a", "#a9573e", "#e0b070"];
export const ROOFS = ["#4a4a63", "#6b4a3a", "#3f5a6b", "#7a3b2e"];
export const MODERN = ["#7fb5e6", "#9ad0f0", "#c8d4e8", "#a6c4e0"];

// ---------- Céu (gradiente pintado na esfera) ----------

export const Sky: React.FC<{ top: string; bottom: string }> = ({
      top,
        bottom,
        }) => {
              const geometry = useMemo(() => {
                    const radius = 300;
                        const g = new THREE.SphereGeometry(radius, 32, 24);
                            const topColor = new THREE.Color(top);
                                const bottomColor = new THREE.Color(bottom);
                                    const position = g.attributes.position;
                                        const colors = new Float32Array(position.count * 3);
                                            const c = new THREE.Color();
                                                for (let i = 0; i < position.count; i++) {
                                                          const k = clamp01((position.getY(i) / radius) * 1.6 + 0.05);
                                                                c.copy(bottomColor).lerp(topColor, k);
                                                                      colors[i * 3] = c.r;
                                                                            colors[i * 3 + 1] = c.g;
                                                                                  colors[i * 3 + 2] = c.b;
                                                }
                                                    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
                                                        return g;
              }, [top, bottom]);

                return (
                        <mesh geometry={geometry} renderOrder={-1}>
                              <meshBasicMaterial
                                      vertexColors
                                              side={THREE.BackSide}
                                                      depthWrite={false}
                                                              fog={false}
                                                                      toneMapped={false}
                                                                            />
                                                                                </mesh>
                );
        };

        // ---------- Nuvens e sol ----------

        const CLOUD_PARTS: [number, number, number, number][] = [
              [0, 0, 0, 1.6],
                [1.7, -0.25, 0.2, 1.2],
                  [-1.7, -0.3, 0, 1.2],
                    [0.5, 0.7, 0.1, 1.3],
        ];

        const Cloud: React.FC<{ position: Vec3; scale: number; color: string }> = ({
              position,
                scale,
                  color,
        }) => (
              <group position={position} scale={scale}>
                  {CLOUD_PARTS.map(([x, y, z, r], i) => (
                          <InkOutline
                                  key={i}
                                          size={[2 * r, 2 * r, 2 * r]}
                                                  color={color}
                                                          toon={false}
                                                                  position={[x, y, z]}
                                                                          thickness={0.08}
                                                                                >
                                                                                        <sphereGeometry args={[r, 16, 12]} />
                                                                                              </InkOutline>
                  ))}
                    </group>
        );

        export const Clouds: React.FC<{ color: string }> = ({ color }) => {
              const frame = useCurrentFrame();
                return (
                        <>
                              {range(0, 7, 1).map((i) => (
                                        <Cloud
                                                  key={i}
                                                            position={[
                                                                            -140 + i * 40 + frame * 0.03,
                                                                                        26 + rand(i + 1) * 16,
                                                                                                    -60 - rand(i + 9) * 60,
                                                            ]}
                                                                      scale={3 + rand(i + 5) * 2}
                                                                                color={color}
                                                                                        />
                              ))}
                                  </>
                );
        };

        export const Sun: React.FC<{ color: string }> = ({ color }) => (
              <InkOutline
                  size={[14, 14, 14]}
                      color={color}
                          toon={false}
                              position={[-35, 38, -130]}
                                  thickness={0.5}
                                    >
                                        <sphereGeometry args={[7, 24, 16]} />
                                          </InkOutline>
        );

        // ---------- Água, ondas, fedor e lixo flutuante ----------

        export const Waves: React.FC<{ color: string }> = ({ color }) => {
              const frame = useCurrentFrame();
                const stripe = mixHex(color, "#ffffff", 0.35);
                  return (
                        <>
                              {range(0, 39, 1).map((i) => {
                                        const speed = 0.04 + rand(i) * 0.06;
                                                const base = rand(i + 7) * 140;
                                                        const x = ((((base + frame * speed) % 140) + 140) % 140) - 70;
                                                                const z = -2 - rand(i + 3) * 12;
                                                                        const w = 2 + rand(i + 11) * 3;
                                                                                return (
                                                                                              <mesh key={i} position={[x, WATER_Y + 0.01, z]}>
                                                                                                          <boxGeometry args={[w, 0.02, 0.16]} />
                                                                                                                      <meshBasicMaterial color={stripe} />
                                                                                                                                </mesh>
                                                                                );
                              })}
                                  </>
                  );
        };

        export const StinkPuffs: React.FC<{ amount: number }> = ({ amount }) => {
              const frame = useCurrentFrame();
                const count = Math.round(14 * clamp01(amount));
                  return (
                        <>
                              {range(0, count - 1, 1).map((i) => {
                                        const life = ((frame + i * 17) % 120) / 120;
                                                const x = -45 + rand(i + 2) * 90;
                                                        const z = -3 - rand(i + 6) * 11;
                                                                const y = WATER_Y + 0.3 + life * 9;
                                                                        const s = 0.8 + life * 2.6;
                                                                                const opacity = 0.55 * (1 - life) * Math.min(1, life * 6);
                                                                                        return (
                                                                                                      <mesh key={i} position={[x, y, z]} scale={s}>
                                                                                                                  <sphereGeometry args={[1, 12, 10]} />
                                                                                                                              <meshBasicMaterial
                                                                                                                                            color="#a8c43a"
                                                                                                                                                          transparent
                                                                                                                                                                        opacity={opacity}
                                                                                                                                                                                      depthWrite={false}
                                                                                                                                                                                                  />
                                                                                                                                                                                                            </mesh>
                                                                                        );
                              })}
                                  </>
                  );
        };

        export const Debris: React.FC<{ amount: number }> = ({ amount }) => {
              const frame = useCurrentFrame();
                const count = Math.round(18 * clamp01(amount));
                  return (
                        <>
                              {range(0, count - 1, 1).map((i) => {
                                        const x = -50 + rand(i + 21) * 100;
                                                const z = -3 - rand(i + 33) * 10;
                                                        const y = WATER_Y + 0.08 + Math.sin(frame * 0.07 + i * 1.7) * 0.08;
                                                                return (
                                                                              <InkOutline
                                                                                          key={i}
                                                                                                      size={[0.9, 0.4, 0.7]}
                                                                                                                  color="#5a4a2a"
                                                                                                                              position={[x, y, z]}
                                                                                                                                          thickness={0.04}
                                                                                                                                                    >
                                                                                                                                                                <sphereGeometry args={[0.45, 10, 8]} />
                                                                                                                                                                          </InkOutline>
                                                                );
                              })}
                                  </>
                  );
        };

        /** Canos despejando esgoto no rio (parede da margem de lá, de frente para a câmera). */
        export const DrainPipes: React.FC = () => {
              const frame = useCurrentFrame();
                return (
                        <>
                              {range(-60, 60, 9).map((x, i) => {
                                        const pulse = 0.85 + 0.15 * Math.sin(frame * 0.2 + i);
                                                return (
                                                              <group key={i}>
                                                                          <InkOutline
                                                                                        size={[1, 1.2, 1]}
                                                                                                      color="#5a5a66"
                                                                                                                    position={[x, -0.45, -14.7]}
                                                                                                                                  rotation={[Math.PI / 2, 0, 0]}
                                                                                                                                                thickness={0.05}
                                                                                                                                                            >
                                                                                                                                                                          <cylinderGeometry args={[0.5, 0.5, 1.2, 12]} />
                                                                                                                                                                                      </InkOutline>
                                                                                                                                                                                                  <mesh position={[x, -0.75, -14.25]} scale={[1, pulse, 1]}>
                                                                                                                                                                                                                <boxGeometry args={[0.55, 0.6, 0.55]} />
                                                                                                                                                                                                                              <meshBasicMaterial color="#7c9a2c" />
                                                                                                                                                                                                                                          </mesh>
                                                                                                                                                                                                                                                      <mesh
                                                                                                                                                                                                                                                                    position={[x, WATER_Y + 0.02, -14.25]}
                                                                                                                                                                                                                                                                                  rotation={[-Math.PI / 2, 0, 0]}
                                                                                                                                                                                                                                                                                                scale={[1, 1, 1]}
                                                                                                                                                                                                                                                                                                            >
                                                                                                                                                                                                                                                                                                                          <ringGeometry args={[0.4, 0.4 + 0.35 * pulse, 20]} />
                                                                                                                                                                                                                                                                                                                                        <meshBasicMaterial color="#9bb23a" side={THREE.DoubleSide} />
                                                                                                                                                                                                                                                                                                                                                    </mesh>
                                                                                                                                                                                                                                                                                                                                                              </group>
                                                );
                              })}
                                  </>
                );
        };

        // ---------- Peças avulsas para as cenas ----------

        /** Mesa de Bazalgette com a planta aberta. Origem no chão, no centro. */
        export const Desk: React.FC<{ position?: Vec3; yaw?: number }> = ({
              position = [0, 0, 0],
                yaw = 0,
        }) => (
              <group position={position} rotation={[0, yaw, 0]}>
                  <InkOutline size={[5, 0.3, 2.6]} color="#8a5a3a" position={[0, 1.5, 0]}>
                        <boxGeometry args={[5, 0.3, 2.6]} />
                            </InkOutline>
                                {[-2.2, 2.2].map((x) =>
                                      [-1.05, 1.05].map((z) => (
                                                <InkOutline
                                                          key={`${x}${z}`}
                                                                    size={[0.3, 1.5, 0.3]}
                                                                              color="#6b4429"
                                                                                        position={[x, 0.75, z]}
                                                                                                  thickness={0.04}
                                                                                                          >
                                                                                                                    <boxGeometry args={[0.3, 1.5, 0.3]} />
                                                                                                                            </InkOutline>
                                      ))
                                )}
                                    <InkOutline
                                          size={[3, 0.06, 1.8]}
                                                color={COLORS.paper}
                                                      toon={false}
                                                            position={[-0.3, 1.68, 0]}
                                                                  rotation={[0, 0.1, 0]}
                                                                        thickness={0.03}
                                                                            >
                                                                                  <boxGeometry args={[3, 0.06, 1.8]} />
                                                                                      </InkOutline>
                                                                                          {[-0.5, 0, 0.5].map((z) => (
                                                                                                  <mesh key={z} position={[-0.3, 1.72, z]} rotation={[0, 0.1, 0]}>
                                                                                                          <boxGeometry args={[2.4, 0.01, 0.05]} />
                                                                                                                  <meshBasicMaterial color="#3b5a9a" />
                                                                                                                        </mesh>
                                                                                          ))}
                                                                                              <InkOutline
                                                                                                    size={[0.44, 1.4, 0.44]}
                                                                                                          color={COLORS.paper}
                                                                                                                toon={false}
                                                                                                                      position={[1.5, 1.8, 0.4]}
                                                                                                                            rotation={[0, 0, Math.PI / 2]}
                                                                                                                                  thickness={0.03}
                                                                                                                                      >
                                                                                                                                            <cylinderGeometry args={[0.22, 0.22, 1.4, 12]} />
                                                                                                                                                </InkOutline>
                                                                                                                                                  </group>
        );

        /** Montinho de tijolos. Origem no chão. */
        export const BrickPile: React.FC<{ position?: Vec3 }> = ({
              position = [0, 0, 0],
        }) => {
              const rows: number[][] = [[-0.95, 0, 0.95], [-0.475, 0.475], [0]];
                return (
                        <group position={position}>
                              {rows.map((xs, r) =>
                                      xs.map((x) => (
                                                  <InkOutline
                                                              key={`${r}${x}`}
                                                                          size={[0.9, 0.45, 0.45]}
                                                                                      color={COLORS.brick}
                                                                                                  position={[x, 0.225 + r * 0.45, 0]}
                                                                                                              thickness={0.03}
                                                                                                                        >
                                                                                                                                    <boxGeometry args={[0.9, 0.45, 0.45]} />
                                                                                                                                              </InkOutline>
                                      ))
                              )}
                                  </group>
                );
        };

        /**
         * Fileira de tubos de tijolo ao longo do eixo X.
          * `built` vai de 0 a `count`: cada tubo "cresce" quando built passa pelo seu número.
           */
           export const BrickTunnelRow: React.FC<{
              position?: Vec3;
                count?: number;
                  spacing?: number;
                    built: number;
           }> = ({ position = [0, 0, 0], count = 8, spacing = 4.1, built }) => (
              <group position={position}>
                  {range(0, count - 1, 1).map((i) => {
                          const k = clamp01(built - i);
                                if (k <= 0) return null;
                                      return (
                                                <group key={i} position={[i * spacing, 0, 0]} scale={[1, k, k]}>
                                                          <InkOutline
                                                                      size={[3.2, 4, 3.2]}
                                                                                  color={COLORS.brick}
                                                                                              position={[0, 1.6, 0]}
                                                                                                          rotation={[0, 0, Math.PI / 2]}
                                                                                                                    >
                                                                                                                                <cylinderGeometry args={[1.6, 1.6, 4, 24]} />
                                                                                                                                          </InkOutline>
                                                                                                                                                    <mesh position={[0, 1.6, 0]} rotation={[0, Math.PI / 2, 0]}>
                                                                                                                                                                <torusGeometry args={[1.62, 0.07, 6, 24]} />
                                                                                                                                                                            <meshBasicMaterial color="#8f3a28" />
                                                                                                                                                                                      </mesh>
                                                                                                                                                                                              </group>
                                      );
                  })}
                    </group>
           );

           /** Tampa de bueiro moderna com brilho (cena final). Origem no chão. */
           export const Manhole: React.FC<{ position?: Vec3; glow?: number }> = ({
              position = [0, 0, 0],
                glow = 1,
           }) => {
              const frame = useCurrentFrame();
                const pulse = 1 + Math.sin(frame * 0.15) * 0.08;
                  return (
                        <group position={position}>
                              <InkOutline
                                      size={[7, 0.06, 7]}
                                              color="#4d4f57"
                                                      position={[0, 0.03, 0]}
                                                              thickness={0.04}
                                                                    >
                                                                            <boxGeometry args={[7, 0.06, 7]} />
                                                                                  </InkOutline>
                                                                                        <InkOutline
                                                                                                size={[2.4, 0.12, 2.4]}
                                                                                                        color="#2f3138"
                                                                                                                position={[0, 0.1, 0]}
                                                                                                                        thickness={0.04}
                                                                                                                              >
                                                                                                                                      <cylinderGeometry args={[1.2, 1.2, 0.12, 32]} />
                                                                                                                                            </InkOutline>
                                                                                                                                                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.165, 0]}>
                                                                                                                                                          <ringGeometry args={[0.55, 0.7, 32]} />
                                                                                                                                                                  <meshBasicMaterial color={COLORS.ink} />
                                                                                                                                                                        </mesh>
                                                                                                                                                                              {[0, Math.PI / 2].map((r) => (
                                                                                                                                                                                        <mesh key={r} position={[0, 0.17, 0]} rotation={[0, r, 0]}>
                                                                                                                                                                                                  <boxGeometry args={[1.7, 0.02, 0.1]} />
                                                                                                                                                                                                            <meshBasicMaterial color={COLORS.ink} />
                                                                                                                                                                                                                    </mesh>
                                                                                                                                                                              ))}
                                                                                                                                                                                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
                                                                                                                                                                                            <ringGeometry args={[1.3 * pulse, 2.2 * pulse, 40]} />
                                                                                                                                                                                                    <meshBasicMaterial
                                                                                                                                                                                                              color="#fff6b0"
                                                                                                                                                                                                                        transparent
                                                                                                                                                                                                                                  opacity={0.55 * clamp01(glow)}
                                                                                                                                                                                                                                            depthWrite={false}
                                                                                                                                                                                                                                                      side={THREE.DoubleSide}
                                                                                                                                                                                                                                                              />
                                                                                                                                                                                                                                                                    </mesh>
                                                                                                                                                                                                                                                                          {[0, 1, 2, 3].map((i) => {
                                                                                                                                                                                                                                                                                    const a = frame * 0.04 + (i * Math.PI) / 2;
                                                                                                                                                                                                                                                                                            return (
                                                                                                                                                                                                                                                                                                          <mesh
                                                                                                                                                                                                                                                                                                                      key={i}
                                                                                                                                                                                                                                                                                                                                  position={[
                                                                                                                                                                                                                                                                                                                                                  Math.cos(a) * 1.9,
                                                                                                                                                                                                                                                                                                                                                                0.5 + 0.15 * Math.sin(frame * 0.1 + i),
                                                                                                                                                                                                                                                                                                                                                                              Math.sin(a) * 1.9,
                                                                                                                                                                                                                                                                                                                                  ]}
                                                                                                                                                                                                                                                                                                                                            >
                                                                                                                                                                                                                                                                                                                                                        <sphereGeometry args={[0.09, 8, 6]} />
                                                                                                                                                                                                                                                                                                                                                                    <meshBasicMaterial color="#ffffff" />
                                                                                                                                                                                                                                                                                                                                                                              </mesh>
                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                          })}
                                                                                                                                                                                                                                                                              </group>
                  );
           };
                                      )
                  ))
        ]
                                                }
              })
}