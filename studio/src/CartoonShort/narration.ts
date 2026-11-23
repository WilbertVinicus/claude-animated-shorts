// src/CartoonShort/narration.ts
// Texto da narração (pt-BR) e marcas de tempo, uma entrada por cena.
// Importa apenas o config.ts que você já criou.

import { FPS, SCENES } from "./config";
import type { SceneId } from "./config";

export type NarrationEntry = {
      sceneId: SceneId;
        /** Texto completo da cena. Use exatamente este texto no TTS. */
          text: string;
            /** Atraso (em frames) entre o início da cena e o início da fala. */
              offsetFrames: number;
                /** Caminho do áudio dentro da pasta public/ (ainda vamos criá-los). */
                  audioFile: string;
};

export const NARRATION: NarrationEntry[] = [
      {
            sceneId: "gancho",
                text: "Em 1858, Londres fedia tanto que o Parlamento quase fugiu da cidade.",
                    offsetFrames: 10,
                        audioFile: "narration/01-gancho.mp3",
      },
        {
                sceneId: "causa",
                    text: "A cidade jogava o esgoto no mesmo rio de onde bebia água. E o calor do verão fez o resto.",
                        offsetFrames: 15,
                            audioFile: "narration/02-causa.mp3",
        },
          {
                sceneId: "parlamento",
                    text: "Os deputados cobriram as janelas com cortinas molhadas de cal. Não adiantou. Então aprovaram, às pressas, dinheiro para resolver.",
                        offsetFrames: 15,
                            audioFile: "narration/03-parlamento.mp3",
          },
            {
                    sceneId: "bazalgette",
                        text: "Um engenheiro, Joseph Bazalgette, teve uma ideia: desviar tudo para longe da cidade.",
                            offsetFrames: 15,
                                audioFile: "narration/04-bazalgette.mp3",
            },
              {
                    sceneId: "obra",
                        text: "Foram 1.800 quilômetros de esgotos nas ruas e mais de 300 milhões de tijolos. Milhares de trabalhadores cavaram tudo à mão.",
                            offsetFrames: 15,
                                audioFile: "narration/05-obra.mp3",
              },
                {
                        sceneId: "resultado",
                            text: "O cólera deixou de varrer a cidade. Londres finalmente respirou.",
                                offsetFrames: 15,
                                    audioFile: "narration/06-resultado.mp3",
                },
                  {
                        sceneId: "twist",
                            text: "E o mais louco: ele ainda funciona, mais de 150 anos depois.",
                                offsetFrames: 15,
                                    audioFile: "narration/07-twist.mp3",
                  },
];

// ---------- Funções auxiliares ----------

export const getNarrationForScene = (id: SceneId): NarrationEntry => {
      const entry = NARRATION.find((n) => n.sceneId === id);
        if (!entry) {
                throw new Error(`Sem narração para a cena "${id}"`);
        }
          return entry;
};

/** Frame absoluto (no vídeo inteiro) em que a fala da cena começa. */
export const getNarrationStartFrame = (entry: NarrationEntry): number => {
      const scene = SCENES.find((s) => s.id === entry.sceneId);
        if (!scene) {
                throw new Error(`Cena "${entry.sceneId}" não existe no config.ts`);
        }
          return scene.start + entry.offsetFrames;
};

// ---------- Estimativa de duração (apenas para conferência) ----------

export const WORDS_PER_SECOND = 2.6;

export const countWords = (text: string): number =>
  text.trim().split(/\s+/).filter(Boolean).length;

  export const estimateSpeechFrames = (text: string): number =>
    Math.ceil((countWords(text) / WORDS_PER_SECOND) * FPS);

    /** Confere se, pela estimativa, cada fala cabe dentro da sua cena. */
    export const checkNarrationFits = () =>
      NARRATION.map((entry) => {
            const scene = SCENES.find((s) => s.id === entry.sceneId);
                const sceneLength = scene ? scene.end - scene.start + 1 : 0;
                    const needed = entry.offsetFrames + estimateSpeechFrames(entry.text);
                        return {
                                  sceneId: entry.sceneId,
                                        framesNeeded: needed,
                                              sceneLength,
                                                    fits: needed <= sceneLength,
                                                        };
                                                          });
        }
]
}