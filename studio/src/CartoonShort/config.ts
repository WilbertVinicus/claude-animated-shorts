// src/CartoonShort/config.ts
// Constantes centrais do curta "O Grande Fedor de Londres".
// Não importa nada: é só dados e funções puras.

export const COMPOSITION_ID = "FedorDeLondres";

// Formato vertical, 30 fps, 63 segundos.
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 1890;

export type SceneId =
  | "gancho"
    | "causa"
      | "parlamento"
        | "bazalgette"
          | "obra"
            | "resultado"
              | "twist";

              export type CameraMove =
                | "descida-ceu-rio" // 1. desce do céu até o rio
                  | "panoramica-margem" // 2. panorâmica lateral
                    | "zoom-parlamento" // 3. zoom no prédio, depois nos personagens
                      | "orbita-mesa" // 4. órbita suave em volta da mesa
                        | "travelling-marcha" // 5. segue a marcha dos trabalhadores
                          | "guindaste-abre" // 6. sobe e abre o plano
                            | "zoom-bueiro"; // 7. zoom no bueiro + fade final

                            export type SceneConfig = {
                                  id: SceneId;
                                    title: string;
                                      /** Primeiro frame da cena (inclusivo). */
                                        start: number;
                                          /** Último frame da cena (inclusivo). */
                                            end: number;
                                              camera: CameraMove;
                            };

                            // Divisão das 7 cenas. Soma exata: 1890 frames.
                            export const SCENES: SceneConfig[] = [
                                  { id: "gancho", title: "Gancho", start: 0, end: 179, camera: "descida-ceu-rio" },
                                    { id: "causa", title: "Causa", start: 180, end: 449, camera: "panoramica-margem" },
                                      { id: "parlamento", title: "Parlamento", start: 450, end: 749, camera: "zoom-parlamento" },
                                        { id: "bazalgette", title: "Bazalgette", start: 750, end: 1049, camera: "orbita-mesa" },
                                          { id: "obra", title: "Obra", start: 1050, end: 1409, camera: "travelling-marcha" },
                                            { id: "resultado", title: "Resultado", start: 1410, end: 1709, camera: "guindaste-abre" },
                                              { id: "twist", title: "Twist", start: 1710, end: 1889, camera: "zoom-bueiro" },
                            ];

                            // Paleta: contorno de tinta preto, céu saturado por cena, rio sujo/limpo.
                            export const COLORS = {
                                  ink: "#111111",
                                    paper: "#fff4dc",
                                      skin: "#f6c9a0",
                                        brick: "#c4553a",
                                          stone: "#d9c9a8",
                                            river: {
                                                    dirty: "#8a9a3a", // verde-amarelado, cenas 1 a 4
                                                        clean: "#2f8fe0", // azul vivo, cenas 6 e 7
                                            },
                                              // Gradiente do céu (topo → horizonte) em cada cena.
                                                sky: {
                                                        gancho: { top: "#e8742a", bottom: "#f3c04a" }, // laranja-sujo, sol forte
                                                            causa: { top: "#d98a2b", bottom: "#e9c15a" },
                                                                parlamento: { top: "#b8742e", bottom: "#d9b36a" },
                                                                    bazalgette: { top: "#c98a3a", bottom: "#ecd08a" },
                                                                        obra: { top: "#4a9be0", bottom: "#a9d8f5" },
                                                                            resultado: { top: "#1f7ae8", bottom: "#8fd3ff" }, // azul vivo
                                                                                twist: { top: "#2a86ee", bottom: "#b4e1ff" },
                                                } satisfies Record<SceneId, { top: string; bottom: string }>,
                            } as const;

                            // ---------- Funções auxiliares ----------

                            export const secondsToFrames = (seconds: number): number =>
                              Math.round(seconds * FPS);

                              /** Devolve a cena que está no ar em um determinado frame. */
                              export const getSceneAtFrame = (frame: number): SceneConfig => {
                                  const found = SCENES.find((s) => frame >= s.start && frame <= s.end);
                                    return found ?? SCENES[SCENES.length - 1];
                              };

                              /**
 * Progresso 0..1 do frame dentro da cena.
 */
export const getSceneProgress = (frame: number, scene: SceneConfig): number => {
  const length = scene.end - scene.start;
  if (length <= 0) return 0;
  const p = (frame - scene.start) / length;
  return Math.min(1, Math.max(0, p));
};

/** Quantidade de frames da cena. */
export const getSceneDuration = (scene: SceneConfig): number =>
  scene.end - scene.start + 1;
