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
    {
        "moves": [
            "y U' (L' U L)"
        ]
    },
    {
        "moves": [
            "U (R U' R')"
        ]
    },
    {
        "moves": [
            "y U (L' U2 L) U2 (L' U L)",
            "r' U2 R2 U R2' U r"
        ]
    },
    {
        "moves": [
            "U' (R U2 R') U2 (R U' R')",
            "y l U2 L2' U' L2 U' l'"
        ]
    },
    {
        "moves": [
            "U' (R U R') U2 (R U' R')",
            "y U l' U L U' L' U' l"
        ]
    },
    {
        "moves": [
            "y U (L' U' L) U2 (L' U L)",
            "U' r U' R' U R U r'"
        ]
    },
    {
        "moves": [
            "M U (L F' L') U' M'",
            "U' (R' U R) U' (R U R')",
            "y (L' U L) y' U2 (R U R')",
            "y' (R2' F R F' R) U2 (R' U R)",
            "y2 (f' L f) U2 (L U L')"
        ]
    },
    {
        "moves": [
            "y M U' (R' F R) U M'",
            "y U (L U' L') U (L' U' L)",
            "(R U' R') y U2 (L' U' L)",
            "y2 (L2 F' L' F L') U2 (L U' L')",
            "y' (f R' f') U2 R' U' R"
        ]
    },
    {
        "moves": [
            "U (R U R') U2 (R U R')",
            "U' (R U2 R') U (R U R')",
            "y U (L' U L) U2 (L' U L)"
        ]
    },
    {
        "moves": [
            "y U' (L' U' L) U2 (L' U' L)",
            "y U (L' U2 L) U' (L' U' L)",
            "U' R U' R' U2 R U' R'"
        ]
    },
    {
        "moves": [
            "U (F' U' F) U' (R U R')",
            "y U2 (L' U' L) (F' L F L')",
            "y U' M' (U' L' U l) (L' U L)",
            "y U' (L U F' L' F) (L' U L)",
            "y' U2 (R' U' R) y U (R U' R')",
            "y' U2 R' U' M U' R U M'",
            "y2 U (f' L' f) U' (L U L')"
        ]
    },
    {
        "moves": [
            "y U' (F U F') U (L' U' L)",
            "U2 (R U R') (F R' F' R)",
            "U M' (U R U' r') (R U' R')",
            "U (R' U' F R F') (R U' R')",
            "y2 U2 (L U L') y' U' (L' U L)",
            "y2 U2 L U M U L' U' M'",
            "y' U' (f R f') U (R' U' R)"
        ]
    },
    {
        "moves": [
            "(U R U' R') U R U' R' U R U' R'"
        ]
    },
    {
        "moves": [
            "U' (R' F R F') (R U' R')",
            "(R U' R') (F' U2 F)",
            "y' R' U R' F R F' R",
            "y' U' (R' U2 R) (f R f')"
        ]
    },
    {
        "moves": [
            "(R U R') U' (R U R')",
            "y M' (U' L' U L) (U' L' U l)",
            "y L F' L' F L F' L' F"
        ]
    },
    {
        "moves": [
            "y (L' U' L) U (L' U' L)",
            "M' (U R U' R') (U R U' r')",
            "R' F R F' R' F R F'"
        ]
    },
    {
        "moves": [
            "(R U' R') U (R U' R')"
        ]
    },
    {
        "moves": [
            "y(L' U L) U' (L' U L)"
        ]
    },
    {
        "moves": [
            "U' (R' F R F') (R U R')",
            "(R' F' R) (U R U' R') F",
            "U' F' (R U R' U') (R' F R)",
            "y U' (L' U L) (F' L F L')",
            "y2 U' M U L U' M' U L'",
            "y' U' R' U M U' R U M'"
        ]
    },
    {
        "moves": [
            "y U (L F' L' F) (L' U' L)",
            "y (L F L') (U' L' U L) F'",
            "y U F (L' U' L U) (L F' L')",
            "U (R U' R') (F R' F' R)",
            "y' U M U' R' U M' U' R",
            "y2 U L U' M U L' U' M"
        ]
    },
    {
        "moves": [
            "(R U' R') U (R U2 R' U R U' R')",
            "y' (L' U L) U (L' U' L U2' L' U L)"
        ]
    },
    {
        "moves": [
            "y' (L' U L) U' (L' U2' L U' L' U L)",
            "(R U' R') U' (R U R' U2 R U' R')"
        ]
    },
    {
        "moves": [
            "(R U' R') (F' L' U2 L F)",
            "y (F R U2' R' F') (L' U' L)",
            "y2 L2 F U F' U' L' U L'",
            "y' R' U R' U' F' U F R2"
        ]
    },
    {
        "moves": [
            "y (L' U L) (F R U2' R' F')",
            "(F' L' U2 L F) (R U R')",
            "y' R2' F' U' F U R U' R",
            "y2 L U' L U F U' F' L2'"
        ]
    },
    {
        "moves": [
            "R2' U2' F R2 F' U2' R' U R'",
            "y L2 U2 F' L2' F U2 L U' L",
            "y' (f R' f') U (R' U2' R) U (R' U2' R)",
            "y2 (f' L f) U' (L U2 L') U' (L U2 L')"
        ]
    },
    {
        "moves": [
            "U' R' U R2 U' R'"
        ]
    },
    {
        "moves": [
            "yU L U' L2' U L"
        ]
    },
    {
        "moves": [
            "U2 (R' U R) U' (S R S')",
            "y R' F R2 U' R' U2 F'",
            "y2 U2 (L F' L' F) (L U L')"
        ]
    },
    {
        "moves": [
            "y U2 (L U' L') U (S' L' S)",
            "L F' L2' U L U2' F",
            "y' U2 (R' F R F') (R' U' R)"
        ]
    },
    {
        "moves": [
            "U2 L2' u L2 u' L2'",
            "y U2 R2 u' R2' u R2",
            "y' U2 L2' u' L2 u L2'",
            "y2 U2 R2 u R2' u' R2"
        ]
    },
    {
        "moves": [
            "L F' U F L'",
            "y R' F U' F' R",
            "y' (L' u' L) U' (L' u L)",
            "y2 (R u R') U (R u' R')"
        ]
    },
    {
        "moves": [
            "R' U' R2 U R'"
        ]
    },
    {
        "moves": [
            "y L U L2' U' L"
        ]
    },
    {
        "moves": [
            "F D R D' F'",
            "y R (F U F') R'",
            "y2 F (L U L') F'",
            "y' R u R u' R'"
        ]
    },
    {
        "moves": [
            "y F' D' L' D F",
            "L' (F' U' F) L",
            "y' F' (R' U' R) F",
            "y2 L' u' L' u L"
        ]
    },
    {
        "moves": [
            "U' (L' U' L) (R U' R')",
            "y U2 L' U' L2 U L2' U' L"
        ]
    },
    {
        "moves": [
            "U (R U R') (L' U L)",
            "y' U2' R U R2' U' R2 U R'"
        ]
    },
    {
        "moves": [
            "(F U2 F') (R U R')",
            "y L U2 L' F U F'",
            "y' R U2 R' f R f'"
        ]
    },
    {
        "moves": [
            "y(F' U2 F) (L' U' L)",
            "R' U2 R F' U' F",
            "y2L' U2 L f' L' f"
        ]
    },
    {
        "moves": [
            "U (R U R') (L U L')",
            "U' (R U2 R') U' (L U L')",
            "yU (L' U L) (R' U R)"
        ]
    },
    {
        "moves": [
            "yU' (L' U' L) (R' U' R)",
            "yU (L' U2 L) U (R' U' R)",
            "U' (R U' R') (L U' L')"
        ]
    },
    {
        "moves": [
            "U2 F' (L U L') F",
            "y U2 L' (B U B') L",
            "y' U2 R' (F U F') R",
            "y2 f' U L U' f",
            "",
            "y U2' F (R' U' R) F'",
            "U2' R (B' U' B) R'",
            "y2 U2' L (F' U' F) L'",
            "y' f U' R' U f'"
        ]
    },
    {
        "moves": [
            "U (R U' R') (L' U L)"
        ]
    },
    {
        "moves": [
            "y (L' U2 L) U' (L U L')",
            "y U2 (L' U L) U' (L U2 L')"
        ]
    },
    {
        "moves": [
            "U2 (R U' R') U (L' U' L)",
            "y (F' L F L') U' (L U2 L')"
        ]
    },
    {
        "moves": [
            "y U' L' U' L2 U2 L'"
        ]
    },
    {
        "moves": [
            "(R U R') U' (L' U L)",
            "y (S' L S)"
        ]
    },
    {
        "moves": [
            "U' (R U R') (F U F')",
            "y U (L' U L) U (L U L')",
            "y U' (F U F') (L U L')"
        ]
    },
    {
        "moves": [
            "y U' (L' U L) (R U' R')"
        ]
    },
    {
        "moves": [
            "(R U2 R') U (R' U' R)",
            "U2 (R U' R') U (R' U2 R)"
        ]
    },
    {
        "moves": [
            "(F R' F' R) U (R' U2 R)",
            "y U2 (L' U L) U' (R U R')"
        ]
    },
    {
        "moves": [
            "U R U R2' U2 R"
        ]
    },
    {
        "moves": [
            "(S R' S')",
            "y (L' U' L) U (R U' R')"
        ]
    },
    {
        "moves": [
            "U (F U' F') (R' U' R)",
            "U' (R U' R') U' (R' U R)",
            "y U (L' U' L) (F' U' F)"
        ]
    },
    {
        "moves": [
            "U' (F' U F) (L U2 L')",
            "y U' (L' U L) U' (f R' f')"
        ]
    },
    {
        "moves": [
            "U (R U' R') U (f' L f)",
            "y U (F U' F') (R' U2 R)"
        ]
    },
    {
        "moves": [
            "(R U' R') (L U2 L')",
            "y (L' U' L) (f R' f')"
        ]
    },
    {
        "moves": [
            "(R U R') (f' L f)",
            "y (L' U L) (R' U2 R)"
        ]
    },
    {
        "moves": [
            "(R U' R') U (L U L')",
            "y (L F' L' F) (R' U2 R)"
        ]
    },
    {
        "moves": [
            "(R' F R F') (L U2 L')",
            "y (L' U' L) U' (R' U' R)"
        ]
    }

    // Section 3 Advanced F2L
]
