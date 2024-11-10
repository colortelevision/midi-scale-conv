import { Midi } from '@tonejs/midi';

// Major scale pattern for key detection
const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const detectKey = (notes: number[]): number => {
  // Count occurrences of each note and weight by duration and position
  const noteWeights = new Array(12).fill(0);
  
  notes.forEach(note => {
    const pitchClass = note % 12;
    noteWeights[pitchClass] += 1;
    
    // Give extra weight to notes that appear at strong metric positions
    if (note === notes[0] || note === notes[notes.length - 1]) {
      noteWeights[pitchClass] += 2;
    }
  });

  // Calculate key strength for each possible key
  let maxScore = -1;
  let detectedKey = 0;

  for (let key = 0; key < 12; key++) {
    let score = 0;
    
    // Weight notes that belong to the major scale of this key
    for (let i = 0; i < 12; i++) {
      const scaleDegree = (i - key + 12) % 12;
      if (MAJOR_SCALE.includes(scaleDegree)) {
        score += noteWeights[i] * 2;
      } else {
        score += noteWeights[i];
      }
    }
    
    // Give extra weight to the tonic and dominant
    score += noteWeights[key] * 3; // Tonic
    score += noteWeights[(key + 7) % 12] * 2; // Dominant
    
    if (score > maxScore) {
      maxScore = score;
      detectedKey = key;
    }
  }

  console.log(`Detected key: ${NOTE_NAMES[detectedKey]}`);
  return detectedKey;
};

export const transformNotes = (
  originalNotes: number[],
  sourceScale: number[],
  targetScale: number[],
  key: number
): number[] => {
  return originalNotes.map(note => {
    const noteInScale = note % 12;
    const octave = Math.floor(note / 12);
    
    // Find the position of the note in the source scale relative to the detected key
    const position = sourceScale.indexOf((noteInScale - key + 12) % 12);
    
    if (position === -1) {
      // If note isn't in the scale, find the closest scale degree
      const distances = sourceScale.map(scale => 
        Math.min(
          Math.abs((noteInScale - key - scale + 12) % 12),
          Math.abs((noteInScale - key - scale - 12) % 12)
        )
      );
      const closestIndex = distances.indexOf(Math.min(...distances));
      const newNote = (targetScale[closestIndex] + key) % 12;
      return newNote + (octave * 12);
    }
    
    // Map to the corresponding note in the target scale
    const newNote = (targetScale[position % targetScale.length] + key) % 12;
    return newNote + (octave * 12);
  });
};

export const parseMidiFile = async (file: File): Promise<Midi> => {
  const arrayBuffer = await file.arrayBuffer();
  return new Midi(arrayBuffer);
};

export const createMidiDownload = (midi: Midi): void => {
  const blob = new Blob([midi.toArray()], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transformed.mid';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};