// src/CartoonShort/audio.ts
// Áudio sintetizado do curta: efeitos sonoros e música de marcha, gerados por código.
// Este arquivo é "puro": usa só o config.ts (não importa React nem Remotion).
// Ele descreve e sintetiza os sons. O makeAudio.mjs grava os .wav em public/audio/
// e o AudioTrack (no Main.tsx) toca os arquivos na hora certa.

import { DURATION_IN_FRAMES, FPS, SCENES } from "./config";
import type { SceneId } from "./config";

export const SAMPLE_RATE = 44100;
export type Samples = Float32Array;
type Wave = "sine" | "square" | "triangle" | "saw";

const TAU = Math.PI * 2;

// ---------- Ferramentas de síntese ----------

/** Números pseudo-aleatórios repetíveis: o áudio sai igual toda vez. */
const makeRng = (seed: number): (() => number) => {
      let a = seed >>> 0;
        return () => {
                a = (a + 0x6d2b79f5) >>> 0;
                    let t = a;
                        t = Math.imul(t ^ (t >>> 15), t | 1);
                            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
                                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
};

const newBuffer = (seconds: number): Samples =>
  new Float32Array(Math.max(1, Math.round(seconds * SAMPLE_RATE)));

  /** Lê buf[i] como número (seguro mesmo com noUncheckedIndexedAccess ligado). */
  const get = (buf: Samples, i: number): number => buf[i] ?? 0;

  function pickAt<T>(items: T[], i: number): T {
      return items[i % items.length] as T;
  }

  /** Soma `source` dentro de `target`, começando em `startSeconds`. */
  const mixInto = (
      target: Samples,
        source: Samples,
          startSeconds: number,
            gain = 1
  ): void => {
      const offset = Math.round(startSeconds * SAMPLE_RATE);
        for (let i = 0; i < source.length; i++) {
                const j = offset + i;
                    if (j >= 0 && j < target.length) {
                              target[j] = get(target, j) + get(source, i) * gain;
                    }
        }
  };

  const osc = (wave: Wave, phase: number): number => {
      const p = phase - Math.floor(phase);
        switch (wave) {
                case "sine":
                      return Math.sin(TAU * p);
                          case "square":
                                return p < 0.5 ? 1 : -1;
                                    case "saw":
                                          return 2 * p - 1;
                                              case "triangle":
                                                    return 4 * Math.abs(p - 0.5) - 1;
        }
  };

  /** Oscilador com altura (Hz) e volume variando no tempo. */
  const synth = (
      seconds: number,
        wave: Wave,
          freq: (t: number) => number,
            amp: (t: number) => number
  ): Samples => {
      const out = newBuffer(seconds);
        let phase = 0;
          for (let i = 0; i < out.length; i++) {
                const t = i / SAMPLE_RATE;
                    phase += freq(t) / SAMPLE_RATE;
                        out[i] = osc(wave, phase) * amp(t);
          }
            return out;
  };

  const noise = (seconds: number, rng: () => number): Samples => {
      const out = newBuffer(seconds);
        for (let i = 0; i < out.length; i++) out[i] = rng() * 2 - 1;
          return out;
  };

  /** Multiplica o som por um envelope de volume. */
  const shape = (input: Samples, amp: (t: number) => number): Samples => {
      const out = new Float32Array(input.length);
        for (let i = 0; i < out.length; i++) {
                out[i] = get(input, i) * amp(i / SAMPLE_RATE);
        }
          return out;
  };

  /** Filtro passa-baixa de um polo, com frequência de corte que pode variar. */
  const lowpassVar = (
      input: Samples,
        cutoffAt: (t: number) => number
  ): Samples => {
      const out = new Float32Array(input.length);
        const dt = 1 / SAMPLE_RATE;
          let prev = 0;
            for (let i = 0; i < input.length; i++) {
                    const rc = 1 / (TAU * cutoffAt(i * dt));
                        const alpha = dt / (rc + dt);
                            prev += alpha * (get(input, i) - prev);
                                out[i] = prev;
            }
              return out;
  };

  const lowpass = (input: Samples, cutoff: number): Samples =>
    lowpassVar(input, () => cutoff);

    const highpass = (input: Samples, cutoff: number): Samples => {
          const low = lowpass(input, cutoff);
            const out = new Float32Array(input.length);
              for (let i = 0; i < out.length; i++) out[i] = get(input, i) - get(low, i);
                return out;
    };

    /** Ajusta o volume para que o pico fique em `peak` (de 0 a 1). */
    const normalize = (buf: Samples, peak = 0.9): Samples => {
          let max = 0;
            for (let i = 0; i < buf.length; i++) max = Math.max(max, Math.abs(get(buf, i)));
              if (max > 0) {
                    const g = peak / max;
                        for (let i = 0; i < buf.length; i++) buf[i] = get(buf, i) * g;
              }
                return buf;
    };

    // ---------- Efeitos sonoros ----------

    export const SFX_SECONDS = {
          whoosh: 1.4, // câmera passando
            bubble: 0.2, // bolha no rio
              splash: 0.5, // esgoto caindo no rio
                buzz: 2, // mosca
                  ding: 0.9, // lâmpada da ideia
                    thud: 0.35, // tubo de tijolo assentando
                      cymbal: 2.5, // prato
                        sparkle: 1, // brilho do bueiro
    } as const;

    export type SfxName = keyof typeof SFX_SECONDS;

    const SFX_MAKERS: Record<SfxName, () => Samples> = {
          whoosh: () => {
                const d = SFX_SECONDS.whoosh;
                    const swept = lowpassVar(
                              noise(d, makeRng(11)),
                                    (t) => 250 + 4200 * Math.pow(Math.sin((Math.PI * t) / d), 2)
                    );
                        return normalize(shape(swept, (t) => Math.sin((Math.PI * t) / d)), 0.8);
          },

            bubble: () =>
                normalize(
                          synth(
                                    SFX_SECONDS.bubble,
                                            "sine",
                                                    (t) => 380 + 5500 * t,
                                                            (t) => Math.exp(-t * 22)
                          ),
                                0.7
                ),

                  splash: () => {
                        const d = SFX_SECONDS.splash;
                            const body = shape(
                                      lowpass(noise(d, makeRng(21)), 1400),
                                            (t) => Math.min(1, t / 0.01) * Math.exp(-t * 9)
                            );
                                const blip = synth(
                                          d,
                                                "sine",
                                                      (t) => 300 + 900 * t,
                                                            (t) => Math.exp(-t * 18) * 0.4
                                );
                                    mixInto(body, blip, 0.05);
                                        return normalize(body, 0.8);
                  },

                    buzz: () => {
                            const d = SFX_SECONDS.buzz;
                                const raw = synth(
                                          d,
                                                "saw",
                                                      (t) => 190 + 28 * Math.sin(TAU * 7 * t) + 10 * Math.sin(TAU * 19 * t),
                                                            (t) =>
                                                                    (0.6 + 0.4 * Math.sin(TAU * 3 * t)) *
                                                                            Math.min(1, t / 0.1, (d - t) / 0.2)
                                );
                                    return normalize(lowpass(raw, 1800), 0.5);
                    },

                      ding: () => {
                            const d = SFX_SECONDS.ding;
                                const out = newBuffer(d);
                                    const chime = (hz: number, start: number): void => {
                                              mixInto(
                                                        out,
                                                                synth(d, "sine", () => hz, (t) => Math.exp(-t * 5)),
                                                                        start
                                              );
                                                    mixInto(
                                                                out,
                                                                        synth(d, "sine", () => hz * 2, (t) => Math.exp(-t * 8) * 0.3),
                                                                                start
                                                    );
                                    };
                                        chime(988, 0);
                                            chime(1480, 0.09);
                                                return normalize(out, 0.7);
                      },

                        thud: () => {
                                const d = SFX_SECONDS.thud;
                                    const body = synth(
                                              d,
                                                    "sine",
                                                          (t) => 55 + 75 * Math.exp(-t * 18),
                                                                (t) => Math.exp(-t * 12)
                                    );
                                        const click = shape(
                                                  lowpass(noise(d, makeRng(31)), 900),
                                                        (t) => Math.exp(-t * 60) * 0.5
                                        );
                                            mixInto(body, click, 0);
                                                return normalize(body, 0.85);
                        },

                          cymbal: () =>
                              normalize(
                                      shape(
                                                highpass(noise(SFX_SECONDS.cymbal, makeRng(41)), 5000),
                                                        (t) => Math.min(1, t / 0.005) * Math.exp(-t * 2.2)
                                      ),
                                            0.6
                              ),

                                sparkle: () => {
                                        const out = newBuffer(SFX_SECONDS.sparkle);
                                            [1318, 1568, 2093, 2637].forEach((hz, i) => {
                                                      mixInto(
                                                                out,
                                                                        synth(0.5, "sine", () => hz, (t) => Math.exp(-t * 7)),
                                                                                i * 0.09
                                                      );
                                            });
                                                return normalize(out, 0.55);
                                },
    };

    // ---------- Música de marcha ----------

    const BPM = 112;
    const BEAT = 60 / BPM;

    const midiToHz = (midi: number): number =>
      440 * Math.pow(2, (midi - 69) / 12);

      type NoteOptions = {
          wave: Wave;
            midi: number;
              seconds: number;
                gain: number;
                  attack?: number;
                    release?: number;
                      cutoff?: number;
      };

      const playNote = (target: Samples, startSeconds: number, o: NoteOptions) => {
          const attack = o.attack ?? 0.01;
            const release = o.release ?? 0.05;
              const hz = midiToHz(o.midi);
                let buf = synth(
                        o.seconds + release,
                            o.wave,
                                () => hz,
                                    (t) => {
                                              const rise = Math.min(1, t / attack);
                                                    const fall =
                                                            t > o.seconds ? Math.max(0, 1 - (t - o.seconds) / release) : 1;
                                                                  return rise * fall;
                                    }
                );
                  if (o.cutoff) buf = lowpass(buf, o.cutoff);
                    mixInto(target, buf, startSeconds, o.gain);
      };

      type Chord = { root: number; notes: number[] };

      // Seção "sorrateira" (cenas 1 a 4): Lá menor, Ré menor, Mi.
      const MINOR: Chord[] = [
          { root: 45, notes: [57, 60, 64] },
            { root: 45, notes: [57, 60, 64] },
              { root: 50, notes: [57, 62, 65] },
                { root: 40, notes: [56, 59, 64] },
      ];

      // Seção de marcha (cenas 5 e 6): Dó, Fá, Sol, Dó.
      const MAJOR: Chord[] = [
          { root: 36, notes: [60, 64, 67] },
            { root: 41, notes: [60, 65, 69] },
              { root: 43, notes: [59, 62, 67] },
                { root: 36, notes: [60, 64, 67] },
      ];

      // Melodia de corneta: [nota MIDI, duração em tempos]. Frase de 4 compassos (8 tempos).
      const MELODY: [number, number][] = [
          [72, 0.5],
            [72, 0.5],
              [76, 1],
                [77, 1],
                  [77, 0.5],
                    [72, 0.5],
                      [74, 1],
                        [71, 1],
                          [76, 0.5],
                            [79, 0.5],
                              [84, 1],
      ];

      const sceneOf = (id: SceneId) => {
          const scene = SCENES.find((s) => s.id === id);
            if (!scene) throw new Error(`Cena "${id}" não existe no config.ts`);
              return scene;
      };

      const sceneStartSeconds = (id: SceneId): number => sceneOf(id).start / FPS;
      const sceneEndSeconds = (id: SceneId): number => (sceneOf(id).end + 1) / FPS;

      type MarchOptions = {
          chords: Chord[];
            /** Transposição em semitons. */
              shift: number;
                drums: "none" | "soft" | "full";
                  melody: boolean;
                    chordGain: number;
                      bassGain: number;
      };

      export const renderMusic = (): Samples => {
          const total = DURATION_IN_FRAMES / FPS;
            const music = newBuffer(total);
              const rng = makeRng(7);

                // Bateria pré-fabricada.
                  const kick = synth(
                        0.28,
                            "sine",
                                (t) => 50 + 110 * Math.exp(-t * 25),
                                    (t) => Math.exp(-t * 11)
                  );
                    const snare = (() => {
                          const hiss = shape(
                                  highpass(noise(0.18, rng), 1800),
                                        (t) => Math.exp(-t * 22)
                          );
                              const tone = synth(
                                      0.18,
                                            "sine",
                                                  () => 200,
                                                        (t) => Math.exp(-t * 30) * 0.6
                              );
                                  mixInto(hiss, tone, 0);
                                      return hiss;
                    })();
                      const hat = shape(
                            highpass(noise(0.06, rng), 7000),
                                (t) => Math.exp(-t * 70)
                      );
                        const cymbal = SFX_MAKERS.cymbal();

                          const march = (from: number, to: number, o: MarchOptions): void => {
                                for (let b = 0; from + b * BEAT < to - 0.01; b++) {
                                        const t = from + b * BEAT;
                                              const bar = Math.floor(b / 2);
                                                    const chord = pickAt(o.chords, bar);
                                                          const root = chord.root + o.shift;
                                                                const full = o.drums === "full";

                                                                      if (b % 2 === 0) {
                                                                                // "oom": baixo e bumbo
                                                                                        playNote(music, t, {
                                                                                                    wave: "saw",
                                                                                                              midi: bar % 2 === 0 ? root : root + 7,
                                                                                                                        seconds: BEAT * 0.8,
                                                                                                                                  gain: o.bassGain,
                                                                                                                                            cutoff: 700,
                                                                                        });
                                                                                                if (o.drums !== "none") mixInto(music, kick, t, full ? 0.55 : 0.3);
                                                                      } else {
                                                                                // "pah": acorde e caixa
                                                                                        chord.notes.forEach((n) => {
                                                                                                    playNote(music, t, {
                                                                                                                  wave: "saw",
                                                                                                                              midi: n + o.shift,
                                                                                                                                          seconds: BEAT * 0.45,
                                                                                                                                                      gain: o.chordGain,
                                                                                                                                                                  cutoff: 2400,
                                                                                                                                                                              attack: 0.015,
                                                                                                                                                                                          release: 0.06,
                                                                                                    });
                                                                                        });
                                                                                                if (o.drums !== "none") mixInto(music, snare, t, full ? 0.4 : 0.2);
                                                                      }

                                                                            if (full) {
                                                                                      mixInto(music, hat, t + BEAT / 2, 0.12);
                                                                                              // virada de caixa no último tempo de cada 4 compassos
                                                                                                      if (b % 8 === 7) {
                                                                                                                  [1, 2, 3].forEach((k) => {
                                                                                                                                mixInto(music, snare, t + (k * BEAT) / 4, 0.25);
                                                                                                                  });
                                                                                                      }
                                                                            }
                                }

                                    if (o.melody) {
                                            const phraseSeconds = 8 * BEAT;
                                                  for (let p = 0; from + p * phraseSeconds < to - 0.01; p++) {
                                                            let beat = 0;
                                                                    MELODY.forEach(([midi, beats]) => {
                                                                                const start = from + p * phraseSeconds + beat * BEAT;
                                                                                          if (start < to - 0.01) {
                                                                                                        playNote(music, start, {
                                                                                                                        wave: "square",
                                                                                                                                      midi: midi + o.shift,
                                                                                                                                                    seconds: beats * BEAT * 0.92,
                                                                                                                                                                  gain: 0.28,
                                                                                                                                                                                cutoff: 3200,
                                                                                                                                                                                              attack: 0.015,
                                                                                                                                                                                                            release: 0.05,
                                                                                                        });
                                                                                          }
                                                                                                    beat += beats;
                                                                    });
                                                  }
                                    }
                          };

                            // Cenas 1 a 3: sorrateira. Cena 4: só baixo e acordes leves.
                              march(sceneStartSeconds("gancho"), sceneStartSeconds("bazalgette"), {
                                    chords: MINOR,
                                        shift: 0,
                                            drums: "soft",
                                                melody: false,
                                                    chordGain: 0.1,
                                                        bassGain: 0.35,
                              });
                                march(sceneStartSeconds("bazalgette"), sceneEndSeconds("bazalgette"), {
                                      chords: MINOR,
                                          shift: 0,
                                              drums: "none",
                                                  melody: false,
                                                      chordGain: 0.05,
                                                          bassGain: 0.25,
                                });

                                  // Cena 5: marcha completa, com corneta.
                                    const obraStart = sceneStartSeconds("obra");
                                      mixInto(music, cymbal, obraStart, 0.35);
                                        march(obraStart, sceneEndSeconds("obra"), {
                                              chords: MAJOR,
                                                  shift: 0,
                                                      drums: "full",
                                                          melody: true,
                                                              chordGain: 0.14,
                                                                  bassGain: 0.45,
                                        });

                                          // Cena 6: a mesma marcha, um tom acima (triunfo).
                                            const resultadoStart = sceneStartSeconds("resultado");
                                              mixInto(music, cymbal, resultadoStart, 0.5);
                                                march(resultadoStart, sceneEndSeconds("resultado"), {
                                                      chords: MAJOR,
                                                          shift: 2,
                                                              drums: "full",
                                                                  melody: true,
                                                                      chordGain: 0.16,
                                                                          bassGain: 0.45,
                                                });

                                                  // Cena 7: acorde longo e um final com prato.
                                                    const twistStart = sceneStartSeconds("twist");
                                                      const end = total;
                                                        [48, 55, 60, 64].forEach((midi) => {
                                                              playNote(music, twistStart, {
                                                                      wave: "saw",
                                                                            midi,
                                                                                  seconds: end - twistStart - 1.2,
                                                                                        gain: 0.12,
                                                                                              attack: 0.4,
                                                                                                    release: 1.5,
                                                                                                          cutoff: 900,
                                                              });
                                                        });
                                                          [60, 64, 67, 72].forEach((midi) => {
                                                                playNote(music, end - 1.6, {
                                                                        wave: "saw",
                                                                              midi,
                                                                                    seconds: 0.9,
                                                                                          gain: 0.2,
                                                                                                attack: 0.02,
                                                                                                      release: 0.6,
                                                                                                            cutoff: 2600,
                                                                });
                                                          });
                                                            mixInto(music, cymbal, end - 1.6, 0.45);

                                                              return normalize(music, 0.7);
      };

      // ---------- Arquivo .wav ----------

      /** Codifica as amostras como WAV de 16 bits, mono. */
      export const encodeWav = (samples: Samples): Uint8Array => {
          const dataBytes = samples.length * 2;
            const view = new DataView(new ArrayBuffer(44 + dataBytes));
              const text = (offset: number, s: string): void => {
                    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
              };
                text(0, "RIFF");
                  view.setUint32(4, 36 + dataBytes, true);
                    text(8, "WAVE");
                      text(12, "fmt ");
                        view.setUint32(16, 16, true);
                          view.setUint16(20, 1, true); // PCM
                            view.setUint16(22, 1, true); // mono
                              view.setUint32(24, SAMPLE_RATE, true);
                                view.setUint32(28, SAMPLE_RATE * 2, true);
                                  view.setUint16(32, 2, true);
                                    view.setUint16(34, 16, true);
                                      text(36, "data");
                                        view.setUint32(40, dataBytes, true);
                                          for (let i = 0; i < samples.length; i++) {
                                                const s = Math.max(-1, Math.min(1, get(samples, i)));
                                                    view.setInt16(44 + i * 2, Math.round(s * 32767), true);
                                          }
                                            return new Uint8Array(view.buffer);
      };

      // ---------- Arquivos e linha do tempo dos efeitos ----------

      /** Caminhos dentro da pasta public/ (use com staticFile). */
      export const MUSIC_FILE = "audio/music.wav";
      export const sfxFilePath = (name: SfxName): string => `audio/sfx-${name}.wav`;

      /** Sintetiza tudo: devolve { caminho dentro de public/: bytes do .wav }. */
      export const renderAllAudio = (): Record<string, Uint8Array> => {
          const files: Record<string, Uint8Array> = {};
            files[MUSIC_FILE] = encodeWav(renderMusic());
              (Object.keys(SFX_SECONDS) as SfxName[]).forEach((name) => {
                    files[sfxFilePath(name)] = encodeWav(SFX_MAKERS[name]());
              });
                return files;
      };

      export type SfxCue = {
          file: SfxName;
            /** Frame do vídeo inteiro em que o som começa. */
              frame: number;
                /** Volume de 0 a 1. */
                  volume: number;
      };

      const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

      /** Frame do vídeo inteiro para o progresso t (0 a 1) dentro de uma cena. */
      const frameAt = (id: SceneId, t: number): number => {
          const scene = sceneOf(id);
            return Math.round(scene.start + clamp01(t) * (scene.end - scene.start));
      };

      const buildCues = (): SfxCue[] => {
          const cues: SfxCue[] = [];
            const add = (file: SfxName, frame: number, volume: number): void => {
                  cues.push({ file, frame, volume });
            };

              // 1. Gancho: câmera descendo, bolhas e uma mosca.
                add("whoosh", frameAt("gancho", 0), 0.55);
                  [0.3, 0.48, 0.7, 0.9].forEach((t) => add("bubble", frameAt("gancho", t), 0.45));
                    add("buzz", frameAt("gancho", 0.55), 0.25);

                      // 2. Causa: um respingo cada vez que um cano passa pelo centro da tela.
                        // A câmera vai de x = -26 a 26 com suavização senoidal (ver CameraRig.tsx);
                          // os canos ficam em x = -60, -51, ... de 9 em 9.
                            [-24, -15, -6, 3, 12, 21].forEach((x) => {
                                  const u = (x + 26) / 52;
                                      const t = Math.acos(1 - 2 * u) / Math.PI;
                                          add("splash", frameAt("causa", t), 0.55);
                            });

                              // 3. Parlamento: mosca e bolhas.
                                add("buzz", frameAt("parlamento", 0.1), 0.3);
                                  [0.35, 0.65].forEach((t) => add("bubble", frameAt("parlamento", t), 0.4));

                                    // 4. Bazalgette: a lâmpada da ideia aparece 110 frames depois do início da cena.
                                      add("whoosh", frameAt("bazalgette", 0), 0.25);
                                        add("ding", sceneOf("bazalgette").start + 110, 0.85);

                                          // 5. Obra: uma batida a cada tubo de tijolo que "cresce".
                                            // Mesmos números do Scenes.tsx: tubos a cada 4,1 unidades, grupo de x = -22 a 22.
                                              for (let i = 0; i < 12; i++) {
                                                    const t = Math.max(0, (4.1 * i - 2) / 44);
                                                        add("thud", frameAt("obra", t), i === 0 ? 0.5 : 0.7);
                                              }

                                                // 6. Resultado: câmera subindo e um brilho.
                                                  add("whoosh", frameAt("resultado", 0), 0.4);
                                                    add("sparkle", frameAt("resultado", 0.5), 0.35);

                                                      // 7. Twist: o bueiro brilha.
                                                        [0.15, 0.4, 0.7].forEach((t) => add("sparkle", frameAt("twist", t), 0.5));

                                                          return cues.sort((a, b) => a.frame - b.frame);
      };

      export const SFX_CUES: SfxCue[] = buildCues();
                                                                                                        }
                                                                                                    }
                                                                                        }
                                                                      }
      
      ]
                                                      )
                    }
  )
        }
}