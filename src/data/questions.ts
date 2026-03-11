export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Which logic gate produces an output of 1 only when all its inputs are 1?",
    options: ["OR gate", "AND gate", "NAND gate", "XOR gate"],
    correct: 1,
  },
  {
    id: 2,
    question: "What is the decimal equivalent of the binary number 1011?",
    options: ["9", "10", "11", "13"],
    correct: 2,
  },
  {
    id: 3,
    question: "In a BJT transistor, the relationship between collector current (Ic) and base current (Ib) is given by which parameter?",
    options: ["Transconductance (gm)", "Current gain (β)", "Threshold voltage (Vt)", "Early voltage (VA)"],
    correct: 1,
  },
  {
    id: 4,
    question: "Which modulation technique is used in FM radio broadcasting?",
    options: ["Amplitude Modulation", "Phase Modulation", "Frequency Modulation", "Pulse Code Modulation"],
    correct: 2,
  },
  {
    id: 5,
    question: "The Nyquist sampling theorem states that a signal must be sampled at a rate of at least _____ the highest frequency component.",
    options: ["Equal to", "Half of", "Twice", "Four times"],
    correct: 2,
  },
  {
    id: 6,
    question: "What is the unit of electric field intensity?",
    options: ["Tesla (T)", "Weber (Wb)", "Volt per metre (V/m)", "Coulomb (C)"],
    correct: 2,
  },
  {
    id: 7,
    question: "In a CMOS inverter, when the input is HIGH, which transistor is ON?",
    options: ["PMOS only", "NMOS only", "Both PMOS and NMOS", "Neither transistor"],
    correct: 1,
  },
  {
    id: 8,
    question: "The Fourier transform of a rectangular pulse in time domain is a _____ in frequency domain.",
    options: ["Gaussian function", "Triangular pulse", "Sinc function", "Exponential function"],
    correct: 2,
  },
  {
    id: 9,
    question: "Which microprocessor introduced by Intel in 1978 had a 16-bit architecture?",
    options: ["Intel 4004", "Intel 8085", "Intel 8086", "Intel 80286"],
    correct: 2,
  },
  {
    id: 10,
    question: "In a feedback control system, the gain margin is defined at the frequency where the phase shift is:",
    options: ["0°", "-90°", "-180°", "-270°"],
    correct: 2,
  },
  {
    id: 11,
    question: "Which semiconductor device is used as a voltage-controlled variable capacitor?",
    options: ["Zener diode", "Varactor diode", "Schottky diode", "PIN diode"],
    correct: 1,
  },
  {
    id: 12,
    question: "The bandwidth of an AM signal with a modulating frequency of 5 kHz is:",
    options: ["5 kHz", "10 kHz", "15 kHz", "20 kHz"],
    correct: 1,
  },
  {
    id: 13,
    question: "In a 2's complement representation using 8 bits, what is the range of integers that can be represented?",
    options: ["-128 to 127", "-127 to 128", "-256 to 255", "0 to 255"],
    correct: 0,
  },
  {
    id: 14,
    question: "Which flip-flop has the characteristic equation Q(t+1) = D?",
    options: ["SR flip-flop", "JK flip-flop", "D flip-flop", "T flip-flop"],
    correct: 2,
  },
  {
    id: 15,
    question: "The cut-off frequency of a first-order RC low-pass filter is given by:",
    options: ["1 / (2πRC)", "2πRC", "RC / 2π", "2π / RC"],
    correct: 0,
  },
  {
    id: 16,
    question: "In OFDM (Orthogonal Frequency Division Multiplexing), subcarriers are made orthogonal to each other to:",
    options: [
      "Increase the carrier frequency",
      "Eliminate inter-symbol interference (ISI)",
      "Reduce the number of antennas",
      "Increase transmitter power",
    ],
    correct: 1,
  },
  {
    id: 17,
    question: "Which parameter of an op-amp represents the ratio of differential gain to common-mode gain?",
    options: ["Slew rate", "CMRR", "PSRR", "Offset voltage"],
    correct: 1,
  },
  {
    id: 18,
    question: "The wave equation in electromagnetics is derived from which set of equations?",
    options: ["Kirchhoff's laws", "Maxwell's equations", "Ohm's law", "Faraday's law alone"],
    correct: 1,
  },
  {
    id: 19,
    question: "In digital communications, what does BER stand for?",
    options: ["Bit Error Rate", "Binary Encoding Rate", "Bandwidth Efficiency Ratio", "Baseband Error Reduction"],
    correct: 0,
  },
  {
    id: 20,
    question: "Which memory type loses its data when power is removed?",
    options: ["ROM", "Flash memory", "EEPROM", "SRAM"],
    correct: 3,
  },
];

export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
