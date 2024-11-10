import React, { useState, useCallback } from 'react';
import { Music, Upload, Download } from 'lucide-react';
import { Midi } from '@tonejs/midi';
import { scales } from './utils/scales';
import { ScaleSelector } from './components/ScaleSelector';
import { parseMidiFile, detectKey, transformNotes, createMidiDownload } from './utils/midiUtils';

function App() {
  const [midiFile, setMidiFile] = useState<Midi | null>(null);
  const [sourceScale, setSourceScale] = useState(scales[0]);
  const [targetScale, setTargetScale] = useState(scales[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedKey, setDetectedKey] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const midi = await parseMidiFile(file);
      setMidiFile(midi);
      
      // Detect key from the first track with notes
      const trackWithNotes = midi.tracks.find(track => track.notes.length > 0);
      if (trackWithNotes) {
        const key = detectKey(trackWithNotes.notes.map(note => note.midi));
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        setDetectedKey(noteNames[key]);
      }
    } catch (error) {
      console.error('Error parsing MIDI file:', error);
      alert('Error parsing MIDI file. Please try another file.');
    }
    setIsProcessing(false);
  };

  const handleTransform = useCallback(() => {
    if (!midiFile) return;

    const newMidi = new Midi();
    
    midiFile.tracks.forEach(track => {
      const newTrack = newMidi.addTrack();
      
      // Copy track properties
      newTrack.name = track.name;
      newTrack.instrument = track.instrument;
      
      // Get all notes from the track
      const notes = track.notes.map(note => note.midi);
      
      // Detect key and transform notes
      const key = detectKey(notes);
      const transformedNotes = transformNotes(
        notes,
        sourceScale.pattern,
        targetScale.pattern,
        key
      );
      
      // Create new notes with transformed pitch values
      track.notes.forEach((note, i) => {
        newTrack.addNote({
          midi: transformedNotes[i],
          time: note.time,
          duration: note.duration,
          velocity: note.velocity
        });
      });
    });

    createMidiDownload(newMidi);
  }, [midiFile, sourceScale, targetScale]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <Music className="h-16 w-16 text-indigo-600" />
            </div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900">MIDI Scale Transformer</h1>
            <p className="text-lg text-gray-600">
              Transform your MIDI files between different musical scales
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6">
              <label
                className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition-colors hover:border-indigo-400 hover:bg-gray-100"
                htmlFor="midiInput"
              >
                <Upload className="mb-4 h-8 w-8 text-gray-400" />
                <span className="mb-2 text-lg font-medium text-gray-700">
                  {midiFile ? 'Change MIDI file' : 'Upload MIDI file'}
                </span>
                <span className="text-sm text-gray-500">
                  {midiFile ? midiFile.name : 'Drop your file here or click to browse'}
                </span>
                <input
                  id="midiInput"
                  type="file"
                  accept=".mid,.midi"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                />
              </label>
            </div>

            {detectedKey && (
              <div className="mb-6 text-center">
                <span className="text-sm font-medium text-gray-600">Detected Key: </span>
                <span className="text-lg font-bold text-indigo-600">{detectedKey}</span>
              </div>
            )}

            {midiFile && (
              <div className="space-y-6">
                <ScaleSelector
                  scales={scales}
                  selectedScale={sourceScale}
                  onChange={setSourceScale}
                  label="Source Scale"
                />
                <ScaleSelector
                  scales={scales}
                  selectedScale={targetScale}
                  onChange={setTargetScale}
                  label="Target Scale"
                />
                <button
                  onClick={handleTransform}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Download className="h-5 w-5" />
                  Transform and Download
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;