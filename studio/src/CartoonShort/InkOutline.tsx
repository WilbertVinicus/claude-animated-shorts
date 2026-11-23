// src/CartoonShort/InkOutline.tsx
// Objeto 3D "pintado" com contorno preto de tinta.
// Técnica: desenha a forma colorida e, por trás, uma cópia levemente maior
// só com as faces de trás (BackSide) em preto. O que sobra aparece como linha.

import React from "react";
import * as THREE from "three";
import { COLORS } from "./config";

/** Espessura padrão do contorno, em unidades do mundo 3D. */
export const DEFAULT_INK_THICKNESS = 0.06;

type Vec3 = [number, number, number];

export type InkOutlineProps = {
      /** O elemento de geometria, ex.: <boxGeometry args={[2, 3, 2]} /> */
        children: React.ReactNode;
          /**
             * Dimensões da caixa que envolve a geometria (largura, altura, profundidade).
                * Serve para calcular o contorno com espessura uniforme.
                   * Caixa 2×3×2 → size [2, 3, 2]. Esfera de raio r → [2r, 2r, 2r].
                      */
                        size: Vec3;
                          /** Cor da pintura (hex). */
                            color: string;
                              /** Espessura do contorno em unidades do mundo. */
                                thickness?: number;
                                  position?: Vec3;
                                    rotation?: Vec3;
                                      scale?: number | Vec3;
                                        /** true = sombreado em faixas (toon, precisa de luz); false = cor chapada. */
                                          toon?: boolean;
};

// Mapa de degraus do sombreado toon (3 tons), criado uma vez só.
let cachedGradient: THREE.DataTexture | null = null;

const getToonGradient = (): THREE.DataTexture => {
      if (!cachedGradient) {
            const data = new Uint8Array([100, 170, 255]);
                const texture = new THREE.DataTexture(
                          data,
                                data.length,
                                      1,
                                            THREE.RedFormat
                );
                    texture.minFilter = THREE.NearestFilter;
                        texture.magFilter = THREE.NearestFilter;
                            texture.generateMipmaps = false;
                                texture.needsUpdate = true;
                                    cachedGradient = texture;
      }
        return cachedGradient;
};

export const InkOutline: React.FC<InkOutlineProps> = ({
      children,
        size,
          color,
            thickness = DEFAULT_INK_THICKNESS,
              position,
                rotation,
                  scale,
                    toon = true,
}) => {
      // Escala da cópia preta: cresce `thickness` para cada lado em cada eixo.
        const hullScale: Vec3 = [
                1 + (2 * thickness) / Math.max(size[0], 0.0001),
                    1 + (2 * thickness) / Math.max(size[1], 0.0001),
                        1 + (2 * thickness) / Math.max(size[2], 0.0001),
        ];

          return (
                <group position={position} rotation={rotation} scale={scale}>
                      {/* Forma pintada */}
                            <mesh>
                                    {children}
                                            {toon ? (
                                                          <meshToonMaterial color={color} gradientMap={getToonGradient()} />
                                            ) : (
                                                          <meshBasicMaterial color={color} />
                                            )}
                                                  </mesh>

                                                        {/* Contorno de tinta (faces de trás, maior que a forma) */}
                                                              <mesh scale={hullScale}>
                                                                      {children}
                                                                              <meshBasicMaterial color={COLORS.ink} side={THREE.BackSide} />
                                                                                    </mesh>
                                                                                        </group>
          );
};
                                            )
        ]
                )
      }
}