import { browser } from "$app/environment";
import { get_half_step_difference, get_octave, get_pitch_index, type Note, type Pitch } from "$lib/music";

// Create the audio context

// Frequencies for piano notes C0 to C1 (all 12 notes)
const frequencies = [ 
    16.35, // C0,  B#0
    17.32, // C#0, Db0
    18.35, // D0
    19.45, // D#0, Eb0
    20.60, // E0,  Fb0
    21.83, // F0,  E#0 
    23.12, // F#0, Gb0  
    24.50, // G0  
    25.96, // G#0, Ab0  
    27.50, // A0  
    29.14, // A#0, 0b0  
    30.87, // B0,  Cb0 
]

// Function to play a note
export function play_note(note: Note, duration = .5) {
    const audioContext = new AudioContext();

    const frequency = get_frequency(note);

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine"; // "square", "triangle", "sawtooth", or "sine"
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start the oscillator
    oscillator.start();

    // Stop the oscillator after the specified duration
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.stop(audioContext.currentTime + duration);
}


function get_frequency(note: Note) {
    const half_step_diff = get_half_step_difference(note, "C0");
    return 16.35 * Math.pow(2, half_step_diff / 12);
}
