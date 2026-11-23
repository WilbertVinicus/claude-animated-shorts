// src/CartoonShort/BeanCharacter.tsx
// Personagens 2D "cabeça de feijão" com contorno de tinta, desenhados num
// canvas e colocados como cartões planos dentro do mundo 3D.
// Usa: react, remotion (useCurrentFrame), three e o seu config.ts.

import React from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { COLORS, FPS } from "./config";

type Vec3 = [number, number, number];

// ---------- Tipos e personagens prontos ----------

export type BeanMood = "normal" | "enojado" | "feliz";
export type BeanHat = "none" | "cartola" | "bone" | "coco";
export type BeanAccessory = "none" | "lenco-nariz" | "bigode" | "costeletas";

export type BeanLook = {
      skin: string;
        outfit: string;
          pants: string;
            hat: BeanHat;
              hatColor: string;
                accessory: BeanAccessory;
                  mood: BeanMood;
};

export type BeanPresetName =
  | "cidadao"
    | "cidadaoEnjoado"
      | "cidadaoFeliz"
        | "deputado"
          | "bazalgette"
            | "trabalhador";

            export const BEAN_PRESETS: Record<BeanPresetName, BeanLook> = {
                  cidadao: {
                        skin: COLORS.skin,
                            outfit: "#6a8caf",
                                pants: "#3b3b4f",
                                    hat: "coco",
                                        hatColor: "#3d2f2a",
                                            accessory: "none",
                                                mood: "normal",
                  },
                    cidadaoEnjoado: {
                            skin: COLORS.skin,
                                outfit: "#8a6f4e",
                                    pants: "#3b3b4f",
                                        hat: "bone",
                                            hatColor: "#5a4a3a",
                                                accessory: "lenco-nariz",
                                                    mood: "enojado",
                    },
                      cidadaoFeliz: {
                            skin: COLORS.skin,
                                outfit: "#d9805a",
                                    pants: "#3b3b4f",
                                        hat: "coco",
                                            hatColor: "#3d2f2a",
                                                accessory: "none",
                                                    mood: "feliz",
                      },
                        deputado: {
                                skin: COLORS.skin,
                                    outfit: "#2b2b3a",
                                        pants: "#1d1d26",
                                            hat: "cartola",
                                                hatColor: "#1d1d26",
                                                    accessory: "lenco-nariz",
                                                        mood: "enojado",
                        },
                          bazalgette: {
                                skin: COLORS.skin,
                                    outfit: "#3b4a6b",
                                        pants: "#2a2a3a",
                                            hat: "cartola",
                                                hatColor: "#2a2a2a",
                                                    accessory: "costeletas",
                                                        mood: "normal",
                          },
                            trabalhador: {
                                    skin: COLORS.skin,
                                        outfit: "#c9a24a",
                                            pants: "#4a4036",
                                                hat: "bone",
                                                    hatColor: "#5a4a3a",
                                                        accessory: "bigode",
                                                            mood: "normal",
                            },
            };

            // ---------- Desenho no canvas (512 x 768) ----------

            const CW = 512;
            const CH = 768;
            const CLOTH = "#e9e2b8";
            const MOUTH_DARK = "#5b1f1f";
            const SKIN_SHADE = "#e3ac80";

            type Ctx = CanvasRenderingContext2D;

            const setInk = (ctx: Ctx, width = 10) => {
                  ctx.strokeStyle = COLORS.ink;
                    ctx.lineWidth = width;
                      ctx.lineJoin = "round";
                        ctx.lineCap = "round";
            };

            const fillInk = (ctx: Ctx, fill: string, width = 10) => {
                  setInk(ctx, width);
                    ctx.fillStyle = fill;
                      ctx.fill();
                        ctx.stroke();
            };

            const roundRectPath = (
                  ctx: Ctx,
                    x: number,
                      y: number,
                        w: number,
                          h: number,
                            r: number
            ) => {
                  ctx.beginPath();
                    ctx.moveTo(x + r, y);
                      ctx.lineTo(x + w - r, y);
                        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                          ctx.lineTo(x + w, y + h - r);
                            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                              ctx.lineTo(x + r, y + h);
                                ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                                  ctx.lineTo(x, y + r);
                                    ctx.quadraticCurveTo(x, y, x + r, y);
                                      ctx.closePath();
            };

            const ellipsePath = (
                  ctx: Ctx,
                    cx: number,
                      cy: number,
                        rx: number,
                          ry: number
            ) => {
                  ctx.beginPath();
                    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            };

            const drawLegs = (ctx: Ctx, look: BeanLook) => {
                  roundRectPath(ctx, 196, 620, 48, 100, 14);
                    fillInk(ctx, look.pants, 9);
                      roundRectPath(ctx, 268, 620, 48, 100, 14);
                        fillInk(ctx, look.pants, 9);
                          ellipsePath(ctx, 212, 728, 34, 18);
                            fillInk(ctx, "#2a2220", 8);
                              ellipsePath(ctx, 300, 728, 34, 18);
                                fillInk(ctx, "#2a2220", 8);
            };

            const drawBody = (ctx: Ctx, look: BeanLook) => {
                  // Braços (atrás do corpo)
                    roundRectPath(ctx, 104, 420, 56, 170, 28);
                      fillInk(ctx, look.outfit, 9);
                        roundRectPath(ctx, 352, 420, 56, 170, 28);
                          fillInk(ctx, look.outfit, 9);
                            ellipsePath(ctx, 132, 604, 26, 26);
                              fillInk(ctx, look.skin, 8);
                                ellipsePath(ctx, 380, 604, 26, 26);
                                  fillInk(ctx, look.skin, 8);

                                    // Tronco
                                      roundRectPath(ctx, 150, 385, 212, 260, 60);
                                        fillInk(ctx, look.outfit, 10);

                                          // Botões
                                            ctx.fillStyle = "#f1d27a";
                                              [470, 520, 570].forEach((y) => {
                                                    ellipsePath(ctx, 256, y, 9, 9);
                                                        fillInk(ctx, "#f1d27a", 5);
                                              });
            };

            const drawHeadShape = (ctx: Ctx, look: BeanLook) => {
                  // Cabeça em forma de feijão
                    ctx.beginPath();
                      ctx.moveTo(250, 98);
                        ctx.bezierCurveTo(350, 90, 395, 190, 380, 270);
                          ctx.bezierCurveTo(365, 350, 320, 400, 250, 398);
                            ctx.bezierCurveTo(170, 396, 125, 340, 130, 260);
                              ctx.bezierCurveTo(135, 170, 170, 105, 250, 98);
                                ctx.closePath();
                                  fillInk(ctx, look.skin, 11);
            };

            const drawEye = (ctx: Ctx, cx: number, cy: number, blink: boolean) => {
                  if (blink) {
                        setInk(ctx, 8);
                            ctx.beginPath();
                                ctx.moveTo(cx - 24, cy + 4);
                                    ctx.quadraticCurveTo(cx, cy + 16, cx + 24, cy + 4);
                                        ctx.stroke();
                                            return;
                  }
                    ellipsePath(ctx, cx, cy, 24, 30);
                      fillInk(ctx, "#ffffff", 7);
                        ellipsePath(ctx, cx + 4, cy + 6, 10, 10);
                          ctx.fillStyle = COLORS.ink;
                            ctx.fill();
                              ellipsePath(ctx, cx + 8, cy + 1, 3.5, 3.5);
                                ctx.fillStyle = "#ffffff";
                                  ctx.fill();
            };

            const drawBrows = (ctx: Ctx, mood: BeanMood) => {
                  setInk(ctx, 12);
                    const line = (x1: number, y1: number, x2: number, y2: number) => {
                            ctx.beginPath();
                                ctx.moveTo(x1, y1);
                                    ctx.lineTo(x2, y2);
                                        ctx.stroke();
                    };
                      if (mood === "enojado") {
                            line(170, 182, 244, 214);
                                line(342, 182, 268, 214);
                      } else if (mood === "feliz") {
                            line(172, 194, 242, 182);
                                line(270, 182, 340, 194);
                      } else {
                            line(172, 196, 242, 192);
                                line(270, 192, 340, 196);
                      }
            };

            const drawMouth = (ctx: Ctx, mood: BeanMood, open: boolean) => {
                  if (open) {
                        ellipsePath(ctx, 256, 340, 30, 24);
                            fillInk(ctx, MOUTH_DARK, 8);
                                ellipsePath(ctx, 256, 352, 18, 9);
                                    ctx.fillStyle = "#e06a6a";
                                        ctx.fill();
                                            return;
                  }
                    if (mood === "feliz") {
                            ctx.beginPath();
                                ctx.moveTo(200, 322);
                                    ctx.quadraticCurveTo(256, 392, 312, 322);
                                        ctx.closePath();
                                            fillInk(ctx, MOUTH_DARK, 8);
                                                return;
                    }
                      setInk(ctx, 9);
                        ctx.beginPath();
                          if (mood === "enojado") {
                                ctx.moveTo(220, 350);
                                    ctx.quadraticCurveTo(256, 322, 292, 350);
                          } else {
                                ctx.moveTo(226, 338);
                                    ctx.quadraticCurveTo(256, 350, 286, 338);
                          }
                            ctx.stroke();
            };

            const drawFace = (
                  ctx: Ctx,
                    look: BeanLook,
                      mouthOpen: boolean,
                        blink: boolean
            ) => {
                  // Costeletas ficam atrás dos olhos
                    if (look.accessory === "costeletas") {
                            ellipsePath(ctx, 150, 292, 22, 56);
                                fillInk(ctx, "#d6d6d6", 7);
                                    ellipsePath(ctx, 362, 292, 22, 56);
                                        fillInk(ctx, "#d6d6d6", 7);
                    }

                      // Bochechas (só feliz)
                        if (look.mood === "feliz") {
                                ctx.globalAlpha = 0.55;
                                    ellipsePath(ctx, 184, 304, 26, 16);
                                        ctx.fillStyle = "#f08a7a";
                                            ctx.fill();
                                                ellipsePath(ctx, 328, 304, 26, 16);
                                                    ctx.fill();
                                                        ctx.globalAlpha = 1;
                        }

                          drawEye(ctx, 208, 245, blink);
                            drawEye(ctx, 304, 245, blink);
                              drawBrows(ctx, look.mood);

                                // Nariz
                                  ellipsePath(ctx, 256, 284, 20, 24);
                                    fillInk(ctx, SKIN_SHADE, 7);

                                      drawMouth(ctx, look.mood, mouthOpen);

                                        if (look.accessory === "bigode") {
                                                ctx.beginPath();
                                                    ctx.moveTo(256, 314);
                                                        ctx.bezierCurveTo(236, 296, 196, 300, 186, 326);
                                                            ctx.bezierCurveTo(206, 332, 236, 334, 256, 322);
                                                                ctx.bezierCurveTo(276, 334, 306, 332, 326, 326);
                                                                    ctx.bezierCurveTo(316, 300, 276, 296, 256, 314);
                                                                        ctx.closePath();
                                                                            fillInk(ctx, "#4a3426", 7);
                                        }

                                          if (look.accessory === "lenco-nariz") {
                                                ctx.beginPath();
                                                    ctx.moveTo(138, 290);
                                                        ctx.quadraticCurveTo(256, 270, 374, 290);
                                                            ctx.lineTo(352, 340);
                                                                ctx.quadraticCurveTo(256, 415, 160, 340);
                                                                    ctx.closePath();
                                                                        fillInk(ctx, CLOTH, 8);
                                                                            // dobra do pano
                                                                                setInk(ctx, 5);
                                                                                    ctx.beginPath();
                                                                                        ctx.moveTo(172, 322);
                                                                                            ctx.quadraticCurveTo(256, 346, 340, 322);
                                                                                                ctx.stroke();
                                          }
            };

            const drawHat = (ctx: Ctx, look: BeanLook) => {
                  if (look.hat === "cartola") {
                        ellipsePath(ctx, 256, 118, 158, 26);
                            fillInk(ctx, look.hatColor, 9);
                                roundRectPath(ctx, 188, 8, 136, 112, 18);
                                    fillInk(ctx, look.hatColor, 9);
                                        ctx.beginPath();
                                            ctx.rect(190, 86, 132, 22);
                                                fillInk(ctx, "#a23b2a", 6);
                  } else if (look.hat === "bone") {
                        ctx.beginPath();
                            ctx.moveTo(136, 160);
                                ctx.bezierCurveTo(136, 70, 376, 70, 376, 160);
                                    ctx.closePath();
                                        fillInk(ctx, look.hatColor, 9);
                                            ellipsePath(ctx, 330, 162, 62, 16);
                                                fillInk(ctx, "#3a2f26", 8);
                                                    ellipsePath(ctx, 256, 92, 8, 8);
                                                        fillInk(ctx, "#3a2f26", 5);
                  } else if (look.hat === "coco") {
                        ctx.beginPath();
                            ctx.moveTo(160, 150);
                                ctx.bezierCurveTo(160, 50, 352, 50, 352, 150);
                                    ctx.closePath();
                                        fillInk(ctx, look.hatColor, 9);
                                            ellipsePath(ctx, 256, 152, 122, 18);
                                                fillInk(ctx, look.hatColor, 9);
                  } else {
                        // Sem chapéu: três fios de cabelo
                            setInk(ctx, 8);
                                ctx.beginPath();
                                    ctx.moveTo(240, 102);
                                        ctx.quadraticCurveTo(232, 70, 250, 62);
                                            ctx.moveTo(258, 100);
                                                ctx.quadraticCurveTo(262, 66, 282, 68);
                                                    ctx.moveTo(274, 104);
                                                        ctx.quadraticCurveTo(290, 82, 306, 90);
                                                            ctx.stroke();
                  }
            };

            const drawBean = (
                  ctx: Ctx,
                    look: BeanLook,
                      mouthOpen: boolean,
                        blink: boolean
            ) => {
                  ctx.clearRect(0, 0, CW, CH);
                    drawLegs(ctx, look);
                      drawBody(ctx, look);
                        drawHeadShape(ctx, look);
                          drawFace(ctx, look, mouthOpen, blink);
                            drawHat(ctx, look);
            };

            // ---------- Texturas em cache (uma por combinação) ----------

            const textureCache = new Map<string, THREE.CanvasTexture>();

            const getBeanTexture = (
                  look: BeanLook,
                    mouthOpen: boolean,
                      blink: boolean
            ): THREE.CanvasTexture => {
                  const key = JSON.stringify([look, mouthOpen, blink]);
                    const cached = textureCache.get(key);
                      if (cached) return cached;

                        const canvas = document.createElement("canvas");
                          canvas.width = CW;
                            canvas.height = CH;
                              const ctx = canvas.getContext("2d");
                                if (!ctx) {
                                        throw new Error("Canvas 2D indisponível para desenhar o personagem");
                                }
                                  drawBean(ctx, look, mouthOpen, blink);

                                    const texture = new THREE.CanvasTexture(canvas);
                                      texture.colorSpace = THREE.SRGBColorSpace;
                                        texture.anisotropy = 4;
                                          textureCache.set(key, texture);
                                            return texture;
            };

            // ---------- Componente ----------

            export type BeanMotion = "parado" | "respirando" | "marchando";

            export type BeanCharacterProps = {
                  /** Personagem pronto. */
                    preset?: BeanPresetName;
                      /** Ajustes sobre o personagem pronto (ex.: { mood: "feliz" }). */
                        look?: Partial<BeanLook>;
                          /** Altura do personagem em unidades do mundo 3D. */
                            height?: number;
                              /** Posição dos PÉS do personagem (centro, na altura do chão). */
                                position?: Vec3;
                                  /** Giro em torno do eixo vertical, em radianos (o cartão não vira sozinho). */
                                    yaw?: number;
                                      /** Espelha o personagem horizontalmente. */
                                        flip?: boolean;
                                          /** Boca abrindo e fechando. */
                                            talking?: boolean;
                                              motion?: BeanMotion;
                                                /** Deslocamento em frames, para os personagens não se mexerem iguais. */
                                                  phase?: number;
                                                    /** Sombra oval no chão. */
                                                      showShadow?: boolean;
            };

            export const BeanCharacter: React.FC<BeanCharacterProps> = ({
                  preset = "cidadao",
                    look: lookOverride,
                      height = 2.4,
                        position = [0, 0, 0],
                          yaw = 0,
                            flip = false,
                              talking = false,
                                motion = "respirando",
                                  phase = 0,
                                    showShadow = true,
            }) => {
                  const frame = useCurrentFrame();
                    const f = frame + phase;
                      const t = f / FPS;

                        const look: BeanLook = { ...BEAN_PRESETS[preset], ...lookOverride };

                          // Piscar a cada ~3 s e boca em "sílabas" de 4 frames
                            const blink = f % 96 < 4;
                              const mouthOpen = talking && Math.floor(f / 4) % 2 === 0;

                                // Movimento
                                  let bobY = 0;
                                    let tilt = Math.sin(t * 1.2) * 0.01;
                                      let scaleY = 1;
                                        if (motion === "respirando") {
                                                scaleY = 1 + Math.sin(t * Math.PI * 1.4) * 0.018;
                                        } else if (motion === "marchando") {
                                                const s = Math.sin(Math.PI * 1.8 * t);
                                                    bobY = Math.abs(s) * 0.08 * height;
                                                        tilt = s * 0.05;
                                        }

                                          const width = height * (CW / CH);
                                            const texture = getBeanTexture(look, mouthOpen, blink);

                                              return (
                                                    <group position={position} rotation={[0, yaw, 0]}>
                                                          {showShadow ? (
                                                                    <mesh
                                                                              rotation={[-Math.PI / 2, 0, 0]}
                                                                                        position={[0, 0.01, 0]}
                                                                                                  scale={[1, 0.5, 1]}
                                                                                                          >
                                                                                                                    <circleGeometry args={[width * 0.38, 28]} />
                                                                                                                              <meshBasicMaterial
                                                                                                                                          color={COLORS.ink}
                                                                                                                                                      transparent
                                                                                                                                                                  opacity={0.22}
                                                                                                                                                                              depthWrite={false}
                                                                                                                                                                                        />
                                                                                                                                                                                                </mesh>
                                                          ) : null}

                                                                <group
                                                                        position={[0, bobY, 0]}
                                                                                rotation={[0, 0, tilt]}
                                                                                        scale={[flip ? -1 : 1, scaleY, 1]}
                                                                                              >
                                                                                                      <mesh position={[0, height / 2, 0]}>
                                                                                                                <planeGeometry args={[width, height]} />
                                                                                                                          <meshBasicMaterial
                                                                                                                                      map={texture}
                                                                                                                                                  transparent
                                                                                                                                                              alphaTest={0.1}
                                                                                                                                                                          side={THREE.DoubleSide}
                                                                                                                                                                                      toneMapped={false}
                                                                                                                                                                                                />
                                                                                                                                                                                                        </mesh>
                                                                                                                                                                                                              </group>
                                                                                                                                                                                                                  </group>
                                              );
            };
