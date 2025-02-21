export const F2L_ALGS = [
    { moves: ["U2 (R U R') U (R U' R')", "y F R U2 R' F'"] },
    { moves: ["y U2 (L' U' L) U' (L' U L)", "F' L' U2 L F"] },
    { moves: ["U (R U2 R') U (R U' R') "] },
    { moves: ["y U' (L' U2 L) U' (L' U L)"] },
    {
        moves: [
            "U (R U' R') U' (R U' R' U R U' R')",
            "U (F R' F' R) U (R U R')",
            "U2(L F' L' F)(R U R')",
            "y U L' U'(L2 F' L' F)(L' U L)",
            "y F' (U' L' U L) F (L' U L)",
            "y' U2 R U' R' U' S R' S'",
        ]
    },
    {
        moves: [
            "U (R U' R') U' (R U' R' U R U' R')",
            "U (F R' F' R) U (R U R')",
            "U2(L F' L' F)(R U R')",
            "y U L' U'(L2 F' L' F)(L' U L)",
            "y F' (U' L' U L) F (L' U L)",
            "y' U2 R U' R' U' S R' S'",
        ]
    },
    { moves: ["(R U2 R') U' (R U R')"] },
    { moves: ["y (L' U2 L) U (L' U' L)"] },
    { moves: ["(R U R')"] },
    { moves: ["y (L' U' L)"] },
    { moves: ["U' (R U R') U (R U R')", "U2 (R U' R') U' (R U R')", "R' U R2 U R'"] },
    { moves: ["U' (R U R') U (R U R')", "U2 (R U' R') U' (R U R')", "R' U R2 U R'"] },
    {
        moves: [
            "R' U2 R2 U R2' U R",
            "(R U' R') U (R U' R') U2 (R U' R')",
            "R' U2 R2 U R'",
            "y U L' U2 L U' y' R U R'",
        ]
    },
    {
        moves: [
            "y L U2 L2' U' L2 U' L'",
            "y (L' U L) U' (L' U L) U2 (L' U L)",
            "y L U2 L2' U' L",
            "U' (R U2 R') U y (L' U' L)",
        ]
    },
    { moves: ["U' (R U' R') U (R U R')"] },
    { moves: ["y U (L' U L) U' (L' U' L)"] },
    { moves: ["y U' (L' U L)"] },
    { moves: ["U (R U' R')"] },
    { moves: [] },
    { moves: ["y U (L' U2 L) U2 (L' U L)", "r' U2 R2 U R2' U r"] },
    { moves: ["U' (R U2 R') U2 (R U' R')", "y l U2 L2' U' L2 U' l'"] },
    { moves: ["U' (R U R') U2 (R U' R')", "y U l' U L U' L' U' l"] },
    { moves: ["y U (L' U' L) U2 (L' U L)", "U' r U' R' U R U r'"] },
    {
        moves: [
            "M U (L F' L') U' M'",
            "U' (R' U R) U' (R U R')",
            "y (L' U L) y' U2 (R U R')",
            "y' (R2' F R F' R) U2 (R' U R)",
            "y2 (f' L f) U2 (L U L')",
        ]
    },
    {
        moves: [
            "y M U' (R' F R) U M'",
            "y U (L U' L') U (L' U' L)",
            "(R U' R') y U2 (L' U' L)",
            "y2 (L2 F' L' F L') U2 (L U' L')",
            "y' (f R' f') U2 R' U' R",
        ]
    },
    {
        moves: [
            "U (R U R') U2 (R U R')",
            "U' (R U2 R') U (R U R')",
            "y U (L' U L) U2 (L' U L)",
        ]
    },
    {
        moves: [
            "y U' (L' U' L) U2 (L' U' L)",
            "y U (L' U2 L) U' (L' U' L)",
            "U' R U' R' U2 R U' R'",
        ]
    },
    {
        moves: [
            "U (F' U' F) U' (R U R')",
            "y U2 (L' U' L) (F' L F L')",
            "y U' M' (U' L' U l) (L' U L)",
            "y U' (L U F' L' F) (L' U L)",
            "y' U2 (R' U' R) y U (R U' R')",
            "y' U2 R' U' M U' R U M'",
            "y2 U (f' L' f) U' (L U L')",
        ]
    },
    {
        moves: [
            "y U' (F U F') U (L' U' L)",
            "U2 (R U R') (F R' F' R)",
            "U M' (U R U' r') (R U' R')",
            "U (R' U' F R F') (R U' R')",
            "y2 U2 (L U L') y' U' (L' U L)",
            "y2 U2 L U M U L' U' M'",
            "y' U' (f R f') U (R' U' R)",
        ]
    },
    { moves: ["U R U' R' U R U' R' U R U' R'"] },
    {
        moves: [
            "U' (R' F R F') (R U' R')",
            "(R U' R') (F' U2 F)",
            "y' R' U R' F R F' R",
            "y' U' (R' U2 R) (f R f')",
        ]
    },
    { moves: ["(R U R') U' (R U R')", "y M' (U' L' U L) (U' L' U l)", "y (L F' L' F)2"] },
    { moves: ["y (L' U' L) U (L' U' L)", "M' (U R U' R') (U R U' r')", "(R' F R F')2"] },
    { moves: ["(R U' R') U (R U' R')"] },
    { moves: ["y (L' U L) U' (L' U L)"] },
    {
        moves: [
            "U' (R' F R F') (R U R')",
            "(R' F' R) (U R U' R') F",
            "U' F' (R U R' U') (R' F R)",
            "y U' (L' U L) (F' L F L')",
            "y2 U' M U L U' M' U L'",
            "y' U' R' U M U' R U M'",
        ]
    },
    {
        moves: [
            "y U (L F' L' F) (L' U' L)",
            "y (L F L') (U' L' U L) F'",
            "y U F (L' U' L U) (L F' L')",
            "U (R U' R') (F R' F' R)",
            "y' U M U' R' U M' U' R",
            "y2 U L U' M U L' U' M'",
        ]
    },
    { moves: ["(R U' R') U (R U2 R' U R U' R')", "y' (L' U L) U (L' U' L U2' L' U L)"] },
    { moves: ["y' (L' U L) U' (L' U2' L U' L' U L)", "(R U' R') U' (R U R' U2 R U' R')"] },
    {
        moves: [
            "(R U' R') (F' L' U2 L F)",
            "y (F R U2' R' F') (L' U' L)",
            "y2 L2 F U F' U' L' U L'",
            "y' R' U R' U' F' U F R2",
        ]
    },
    {
        moves: [
            "y (L' U L) (F R U2' R' F')",
            "(F' L' U2 L F) (R U R')",
            "y' R2' F' U' F U R U' R",
            "y2 L U' L U F U' F' L2'",
        ]
    },
    {
        moves: [
            "R2' U2' F R2 F' U2' R' U R'",
            "y L2 U2 F' L2' F U2 L U' L",
            "y' (f R' f') U (R' U2' R) U (R' U2' R)",
            "y2 (f' L f) U' (L U2 L') U' (L U2 L')",
        ]
    },
    { moves: ["U' R' U R2 U' R'"] },
    { moves: ["y U L U' L2' U L"] },
    {
        moves: [
            "U2 (R' U R) U' (S R S')",
            "y R' F R2 U' R' U2 F'",
            "y2 U2 (L F' L' F) (L U L')",
        ]
    },
    {
        moves: [
            "y U2 (L U' L') U (S' L' S)",
            "L F' L2' U L U2' F",
            "y' U2 (R' F R F') (R' U' R)",
        ]
    },
    {
        moves: [
            "U2 L2' u L2 u' L2'",
            "y U2 R2 u' R2' u R2",
            "y' U2 L2' u' L2 u L2'",
            "y2 U2 R2 u R2' u' R2",
        ]
    },
    {
        moves: [
            "L F' U F L'",
            "y R' F U' F' R",
            "y' (L' u' L) U' (L' u L)",
            "y2 (R u R') U (R u' R')",
        ]
    },
// [0] white sticker faces side/front
]
