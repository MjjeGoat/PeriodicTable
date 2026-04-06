import type {Element} from "./types.ts";

export const elements: Element[] = [
    {
        atomicNumber: 1,
        symbol: "H",
        name: "Hydrogen",
        atomicMass: 1.008,
        group: 1,
        period: 1,
        category: "nonmetal",
    },
    {
        atomicNumber: 2,
        symbol: "He",
        name: "Helium",
        atomicMass: 4.0026,
        group: 18,
        period: 1,
        category: "noble gas",
    },
    {
        atomicNumber: 6,
        symbol: "C",
        name: "Carbon",
        atomicMass: 12.011,
        group: 14,
        period: 2,
        category: "nonmetal",
    },
    {
        atomicNumber: 26,
        symbol: "Fe",
        name: "Iron",
        atomicMass: 55.845,
        group: 8,
        period: 4,
        category: "transition metal",
    },
    {
        atomicNumber: 92,
        symbol: "U",
        name: "Uranium",
        atomicMass: 238.0289,
        group:  0, // pokud není přesně definovaná skupina
    period: 7,
    category: "actinide",
    halfLife: "4.5 billion years",
},
];