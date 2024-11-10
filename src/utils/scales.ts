export type Scale = {
  name: string;
  pattern: number[];
  example: string;
};

export const scales: Scale[] = [
  {
    name: "Ionian (Major)",
    pattern: [0, 2, 4, 5, 7, 9, 11],
    example: "C D E F G A B C"
  },
  {
    name: "Aeolian (Natural Minor)",
    pattern: [0, 2, 3, 5, 7, 8, 10],
    example: "C D Eb F G Ab Bb C"
  },
  {
    name: "Dorian",
    pattern: [0, 2, 3, 5, 7, 9, 10],
    example: "C D Eb F G A Bb C"
  },
  {
    name: "Phrygian",
    pattern: [0, 1, 3, 5, 7, 8, 10],
    example: "C Db Eb F G Ab Bb C"
  },
  {
    name: "Locrian",
    pattern: [0, 1, 3, 5, 6, 8, 10],
    example: "C Db Eb F Gb Ab Bb C"
  },
  {
    name: "Harmonic Minor",
    pattern: [0, 2, 3, 5, 7, 8, 11],
    example: "C D Eb F G Ab B C"
  },
  {
    name: "Melodic Minor",
    pattern: [0, 2, 3, 5, 7, 9, 11],
    example: "C D Eb F G A B C"
  },
  {
    name: "Pentatonic",
    pattern: [0, 2, 4, 7, 9],
    example: "C D E G A"
  },
  {
    name: "Blues",
    pattern: [0, 3, 5, 6, 7, 10],
    example: "C Eb F F# G Bb"
  },
  {
    name: "Chromatic",
    pattern: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    example: "C C# D D# E F F# G G# A A# B"
  }
];