
export const OLL_ALGS = [
  {
    "name": "OLL 1",
    "setup": "F R' F' R U2' F R' F' R2' U2' R'",
    "subgroup": "Dot Case",
    "moves": [
      "R U2 R2 F R F' U2 R' F R F'",
      "y R U' R2 D' r U' r' D R2 U R'",
      "f R U R' U' R f' U' r' U' R U M'",
      "R' U' F R' F' R2 U R f' U' f"
    ]
  },
  {
    "name": "OLL 2",
    "setup": "f U R U' R' f' F U R U' R' F'",
    "subgroup": "Dot Case",
    "moves": [
      "y' R U' R2 D' r U r' D R2 U R'",
      "F R U R' U' S R U R' U' f'",
      "F R U R' U' F' f R U R' U' f'",
      "y r U r' U2 R U2 R' U2 r U' r'"
    ]
  },
  {
    "name": "OLL 3",
    "setup": "F U R U' R' F' U f U R U' R' f' y",
    "subgroup": "Dot Case",
    "moves": [
      "y R' F2 R2 U2 R' F R U2 R2 F2 R",
      "y' f R U R' U' f' U' F R U R' U' F'",
      "r' R2 U R' U r U2 r' U M'",
      "M R U R' U r U2 r' U M'"
    ]
  },
  {
    "name": "OLL 4",
    "setup": "F U R U' R' F' U' f U R U' R' f' y",
    "subgroup": "Dot Case",
    "moves": [
      "y' R' F2 R2 U2 R' F' R U2 R2 F2 R",
      "y' f R U R' U' f' U F R U R' U' F'",
      "R' F R F' U' S R' U' R U R S'",
      "y F U R U' R' F' U' F R U R' U' F'"
    ]
  },
  {
    "name": "OLL 5",
    "setup": "r' U' R U' R' U2' r",
    "subgroup": "Square Shapes",
    "moves": [
      "r' U2 R U R' U r",
      "y2 l' U2 L U L' U l",
      "y2 R' F2 r U r' F R",
      "y2 R' F R' F' R2 y U' R U' R'"
    ]
  },
  {
    "name": "OLL 6",
    "setup": "r U R' U R U2' r'",
    "subgroup": "Square Shapes",
    "moves": [
      "r U2 R' U' R U' r'",
      "F U' R2 D R' U' R D' R2 U F'",
      "y2 l U2 L' U' L U' l'",
      "L F2 l' U' l F' L'"
    ]
  },
  {
    "name": "OLL 7",
    "setup": "r U2' R' U' R U' r'",
    "subgroup": "Lightning Shapes",
    "moves": [
      "r U R' U R U2 r'",
      "L' U2 L U2 L F' L' F",
      "y2 l U L' U L U2 l'",
      "r U r' U R U' R' r U' r'"
    ]
  },
  {
    "name": "OLL 8",
    "setup": "r' U2' R U R' U r y2'",
    "subgroup": "Lightning Shapes",
    "moves": [
      "y2 r' U' R U' R' U2 r",
      "l' U' L U' L' U2 l",
      "R U2 R' U2 R' F R F'",
      "R' F' r U' r' F2 R"
    ]
  },
  {
    "name": "OLL 9",
    "setup": "F U R U' R2' F' R U R U' R' y'",
    "subgroup": "Fish Shapes",
    "moves": [
      "y R U R' U' R' F R2 U R' U' F'",
      "R U2 R' U' S' R U' R' S",
      "y2 F' U' F r U' r' U r U r'",
      "y' L' U' L U' L F' L' F L' U2 L"
    ]
  },
  {
    "name": "OLL 10",
    "setup": "R U2' R' F R' F' R U' R U' R'",
    "subgroup": "Fish Shapes",
    "moves": [
      "R U R' U R' F R F' R U2 R'",
      "y F U F' R' F R U' R' F' R",
      "y M' R' U2 R U R' U R U M",
      "y2 L' U' L U L F' L2 U' L U F"
    ]
  },
  {
    "name": "OLL 11",
    "setup": "M U' R U2' R' U' R U' R2' r",
    "subgroup": "Lightning Shapes",
    "moves": [
      "r' R2 U R' U R U2 R' U M'",
      "y2 r U R' U R' F R F' R U2 r'",
      "S R U R' U R U2 R' U2 S'",
      "y2 S' U2 R U R' U R U2 R' S"
    ]
  },
  {
    "name": "OLL 12",
    "setup": "F U R U' R' F' U' F U R U' R' F'",
    "subgroup": "Lightning Shapes",
    "moves": [
      "y' M' R' U' R U' R' U2 R U' M",
      "F R U R' U' F' U F R U R' U' F'",
      "y' S R' U' R U' R' U2 R U2 S'",
      "y l L2 U' L U' L' U2 L U' M'"
    ]
  },
  {
    "name": "OLL 13",
    "setup": "F' U' F r U' r' U r U r'",
    "subgroup": "Knight Move Shapes",
    "moves": [
      "F U R U2 R' U' R U R' F'",
      "F U R U' R2 F' R U R U' R'",
      "r U' r' U' r U r' F' U F",
      "r U' r' U' r U r' y L' U L"
    ]
  },
  {
    "name": "OLL 14",
    "setup": "F U F' R' F R U' R' F' R",
    "subgroup": "Knight Move Shapes",
    "moves": [
      "R' F R U R' F' R F U' F'",
      "r U R' U' r' F R2 U R' U' F'",
      "F' U' L' U L2 F L' U' L' U L",
      "l' U l U l' U' l F U' F'"
    ]
  },
  {
    "name": "OLL 15",
    "setup": "r' U' r U' R' U R r' U r",
    "subgroup": "Knight Move Shapes",
    "moves": [
      "r' U' r R' U' R U r' U r",
      "y2 l' U' l L' U' L U l' U l",
      "y2 R' F' R L' U' L U R' F R",
      "r' U' M' U' R U r' U r"
    ]
  },
  {
    "name": "OLL 16",
    "setup": "r U r' U R U' R' r U' r'",
    "subgroup": "Knight Move Shapes",
    "moves": [
      "r U r' R U R' U' r U' r'",
      "r U M U R' U' r U' r'",
      "y2 R' F R U R' U' F' R U' R' U2 R",
      "y2 l U l' L U L' U' l U' l'"
    ]
  },
  {
    "name": "OLL 17",
    "setup": "F R' F' R U2' F R' F' R U' R U' R'",
    "subgroup": "Dot Case",
    "moves": [
      "R U R' U R' F R F' U2 R' F R F'",
      "y2 F R' F' R U S' R U' R' S",
      "y2 F R' F' R2 r' U R U' R' U' M'",
      "y' F' r U r' U' S r' F r S'"
    ]
  },
  {
    "name": "OLL 18",
    "setup": "r' U2' R U R' U r2' U2' R' U' R U' r'",
    "subgroup": "Dot Case",
    "moves": [
      "y R U2 R2 F R F' U2 M' U R U' r'",
      "y F S' R U' R' S R U2 R' U' F'",
      "r U R' U R U2 r2 U' R U' R' U2 r",
      "R D r' U' r D' R' U' R2 F R F' R"
    ]
  },
  {
    "name": "OLL 19",
    "setup": "F R' F' R M U R U' R' U' M'",
    "subgroup": "Dot Case",
    "moves": [
      "y S' R U R' S U' R' F R F'",
      "M U R U R' U' M' R' F R F'",
      "R' U2 F R U R' U' F2 U2 F R",
      "r' R U R U R' U' r R2 F R F'"
    ]
  },
  {
    "name": "OLL 20",
    "setup": "r U R' U' M2' U R U' R' U' M'",
    "subgroup": "Dot Case",
    "moves": [
      "r U R' U' M2 U R U' R' U' M'",
      "M' U2 M U2 M' U M U2 M' U2 M",
      "S' R U R' S U' M' U R U' r'",
      "S R' U' R U R U R U' R' S'"
    ]
  },
  {
    "name": "OLL 21",
    "setup": "R U R' U R U' R' U R U2' R' y'",
    "subgroup": "OCLL",
    "moves": [
      "R U R' U R U' R' U R U2 R'",
      "y R U2 R' U' R U R' U' R U' R'",
      "y F R U R' U' R U R' U' R U R' U' F'",
      "R' U' R U' R' U R U' R' U2 R"
    ]
  },
  {
    "name": "OLL 22",
    "setup": "R' U2' R2' U R2' U R2' U2' R'",
    "subgroup": "OCLL",
    "moves": [
      "R U2 R2 U' R2 U' R2 U2 R",
      "R' U2 R2 U R2 U R2 U2 R'",
      "f R U R' U' S' R U R' U' F'",
      "f R U R' U' f' F R U R' U' F'"
    ]
  },
  {
    "name": "OLL 23",
    "setup": "R U2' R D R' U2' R D' R2'",
    "subgroup": "OCLL",
    "moves": [
      "R2 D R' U2 R D' R' U2 R'",
      "y2 R2 D' R U2 R' D R U2 R",
      "R U R' U R U2 R2 U' R U' R' U2 R",
      "y' R U2 R' U' R U' R' L' U2 L U L' U L"
    ]
  },
  {
    "name": "OLL 24",
    "setup": "F R' F' r U R U' r'",
    "subgroup": "OCLL",
    "moves": [
      "r U R' U' r' F R F'",
      "y' x' R U R' D R U' R' D' x",
      "y R U R D R' U' R D' R2",
      "L F R' F' L' F R F'"
    ]
  },
  {
    "name": "OLL 25",
    "setup": "R' F' r U R U' r' F y'",
    "subgroup": "OCLL",
    "moves": [
      "R U2 R D R' U2 R D' R2",
      "y F' r U R' U' r' F R",
      "F R' F' r U R U' r'",
      "x R' U R D' R' U' R D x'"
    ]
  },
  {
    "name": "OLL 26",
    "setup": "R U R' U R U2' R' y'",
    "subgroup": "OCLL",
    "moves": [
      "y R U2 R' U' R U' R'",
      "R' U' R U' R' U2 R",
      "y2 L' U' L U' L' U2 L",
      "y2 L' U R U' L U R'"
    ]
  },
  {
    "name": "OLL 27",
    "setup": "R U2' R' U' R U' R'",
    "subgroup": "OCLL",
    "moves": [
      "R U R' U R U2 R'",
      "y' R' U2 R U R' U R",
      "y L' U2 L U L' U L",
      "y2 L U L' U L U2 L'"
    ]
  },
  {
    "name": "OLL 28",
    "setup": "R U R' U' M' U R U' r'",
    "subgroup": "All Corners Oriented",
    "moves": [
      "r U R' U' M U R U' R'",
      "R' F R S R' F' R S'",
      "r U R' U' r' R U R U' R'",
      "y2 M' U M U2 M' U M"
    ]
  },
  {
    "name": "OLL 29",
    "setup": "M F R' F' R U R U' R' U' M'",
    "subgroup": "Awkward Shapes",
    "moves": [
      "r2 D' r U r' D r2 U' r' U' r",
      "y R U R' U' R U' R' F' U' F R U R'",
      "y S' R U R' U' R' F R F' U S",
      "M U R U R' U' R' F R F' M'"
    ]
  },
  {
    "name": "OLL 30",
    "setup": "F U R U2' R' U R U2' R' U' F' y2'",
    "subgroup": "Awkward Shapes",
    "moves": [
      "y' r' D' r U' r' D r2 U' r' U r U r'",
      "y2 F U R U2 R' U' R U2 R' U' F'",
      "y2 F R' F R2 U' R' U' R U R' F2",
      "y S' R' U' R f R' U R U' F'"
    ]
  },
  {
    "name": "OLL 31",
    "setup": "R' F R U R' U' F' U R",
    "subgroup": "P Shapes",
    "moves": [
      "R' U' F U R U' R' F' R",
      "y2 S' L' U' L U L F' L' f",
      "y S R U R' U' f' U' F",
      "y2 S' r' F' r U r U' r' f"
    ]
  },
  {
    "name": "OLL 32",
    "setup": "f R' F' R U R U' R' S'",
    "subgroup": "P Shapes",
    "moves": [
      "S R U R' U' R' F R f'",
      "y2 L U F' U' L' U L F L'",
      "R U B' U' R' U R B R'",
      "y' R' F R F' U' r U' r' U r U r'"
    ]
  },
  {
    "name": "OLL 33",
    "setup": "F R' F' R U R U' R'",
    "subgroup": "T Shapes",
    "moves": [
      "R U R' U' R' F R F'",
      "y2 L' U' L U L F' L' F",
      "y2 r' F' r U r U' r' F",
      "R U R' F' U' F R U' R'"
    ]
  },
  {
    "name": "OLL 34",
    "setup": "F U R' U' R' F' R U R2' U' R' y2'",
    "subgroup": "C Shapes",
    "moves": [
      "y f R f' U' r' U' R U M'",
      "y2 R U R2 U' R' F R U R U' F'",
      "F R U R' U' R' F' r U R U' r'",
      "y2 R U R' U' B' R' F R F' B"
    ]
  },
  {
    "name": "OLL 35",
    "setup": "R U2' R' F R' F' R2' U2' R'",
    "subgroup": "Fish Shapes",
    "moves": [
      "R U2 R2 F R F' R U2 R'",
      "f R U R' U' f' R U R' U R U2 R'",
      "y2 R2 F R F' R U2 R' U R U2 R' U' R",
      "y L' U2 L2 F' L' F L' U2 L"
    ]
  },
  {
    "name": "OLL 36",
    "setup": "F' L F L' U' L' U' L U L' U L y2'",
    "subgroup": "W Shapes",
    "moves": [
      "y2 L' U' L U' L' U L U L F' L' F",
      "y R U R2 F' U' F U R2 U2 R'",
      "y2 R U R' F' R U R' U' R' F R U' R' F R F'",
      "y2 R' F' U' F2 U R U' R' F' R"
    ]
  },
  {
    "name": "OLL 37",
    "setup": "F R U' R' U R U R' F'",
    "subgroup": "Fish Shapes",
    "moves": [
      "F R' F' R U R U' R'",
      "F R U' R' U' R U R' F'",
      "y F' r U r' U' r' F r",
      "y2 r2 D' r U' r' D r U r"
    ]
  },
  {
    "name": "OLL 38",
    "setup": "F R' F' R U R U R' U' R U' R'",
    "subgroup": "W Shapes",
    "moves": [
      "R U R' U R U' R' U' R' F R F'",
      "y F R U' R' S U' R U R' f'",
      "y2 L' U2 l' D' l U2 l' D l L",
      "R' U2 r' D' r U2 r' D R r"
    ]
  },
  {
    "name": "OLL 39",
    "setup": "L U F' U' L' U L F L' y'",
    "subgroup": "Lightning Shapes",
    "moves": [
      "y' f' r U r' U' r' F r S",
      "y' R U R' F' U' F U R U2 R'",
      "y L F' L' U' L U F U' L'",
      "y' f' L F L' U' L' U L S"
    ]
  },
  {
    "name": "OLL 40",
    "setup": "R' U' F U R U' R' F' R y'",
    "subgroup": "Lightning Shapes",
    "moves": [
      "y R' F R U R' U' F' U R",
      "y' f R' F' R U R U' R' S'",
      "R r D r' U r D' r' U' R'",
      "y' L' U' L F U F' U' L' U2 L"
    ]
  },
  {
    "name": "OLL 41",
    "setup": "F U R U' R' F' R U2' R' U' R U' R' y2'",
    "subgroup": "Awkward Shapes",
    "moves": [
      "y2 R U R' U R U2 R' F R U R' U' F'",
      "y2 F U R2 D R' U' R D' R2 F'",
      "y' S U' R' F' U' F U R S'",
      "y2 R' F' U' F R S' R' U R S"
    ]
  },
  {
    "name": "OLL 42",
    "setup": "F U R U' R' F' R' U2' R U R' U R",
    "subgroup": "Awkward Shapes",
    "moves": [
      "R' U' R U' R' U2 R F R U R' U' F'",
      "y F S' R U R' U' F' U S",
      "y R' F R F' R' F R F' R U R' U' R U R'",
      "y R' U' F2 u' R U R' D R2 B"
    ]
  },
  {
    "name": "OLL 43",
    "setup": "f' U' L' U L f",
    "subgroup": "P Shapes",
    "moves": [
      "y R' U' F' U F R",
      "y2 F' U' L' U L F",
      "f' L' U' L U f",
      "y' r' F' U' F U r"
    ]
  },
  {
    "name": "OLL 44",
    "setup": "f U R U' R' f'",
    "subgroup": "P Shapes",
    "moves": [
      "y2 F U R U' R' F'",
      "f R U R' U' f'",
      "y R U B U' B' R'",
      "y' L U F U' F' L'"
    ]
  },
  {
    "name": "OLL 45",
    "setup": "F U R U' R' F'",
    "subgroup": "T Shapes",
    "moves": [
      "F R U R' U' F'",
      "y R' F' U' F U R",
      "y2 f U R U' R' f'",
      "y2 F' L' U' L U F"
    ]
  },
  {
    "name": "OLL 46",
    "setup": "R' U' F R' F' R U R",
    "subgroup": "C Shapes",
    "moves": [
      "R' U' R' F R F' U R",
      "R' F' U' F R U' R' U2 R",
      "y F R U R' U' F' U' R U R' U R U2 R'",
      "l' U2 L2 F' L' F U L' U l"
    ]
  },
  {
    "name": "OLL 47",
    "setup": "F' U' L' U L U' L' U L F",
    "subgroup": "L Shapes",
    "moves": [
      "y' F R' F' R U2 R U' R' U R U2 R'",
      "F' L' U' L U L' U' L U F",
      "R' U' R' F R F' R' F R F' U R",
      "y' R' F' U' F U F' U' F U R"
    ]
  },
  {
    "name": "OLL 48",
    "setup": "F U R U' R' U R U' R' F'",
    "subgroup": "L Shapes",
    "moves": [
      "F R U R' U' R U R' U' F'",
      "y2 f U R U' R' U R U' R' f'",
      "R U2 R' U' R U R' U2 R' F R F'",
      "F R' F' U2 R U R' U R2 U2 R'"
    ]
  },
  {
    "name": "OLL 49",
    "setup": "r' U r2' U' r2' U' r2' U r' y2'",
    "subgroup": "L Shapes",
    "moves": [
      "y2 r U' r2 U r2 U r2 U' r",
      "l U' l2 U l2 U l2 U' l",
      "R B' R2 F R2 B R2 F' R",
      "y2 R' F R' F' R2 U2 B' R B R'"
    ]
  },
  {
    "name": "OLL 50",
    "setup": "r U' r2' U r2' U r2' U' r",
    "subgroup": "L Shapes",
    "moves": [
      "r' U r2 U' r2 U' r2 U r'",
      "y2 R' F R2 B' R2 F' R2 B R'",
      "y' R U2 R' U' R U' R' F R U R' U' F'",
      "y2 l' U l2 U' l2 U' l2 U l'"
    ]
  },
  {
    "name": "OLL 51",
    "setup": "f U R U' R' U R U' R' f'",
    "subgroup": "Line Shapes",
    "moves": [
      "y2 F U R U' R' U R U' R' F'",
      "f R U R' U' R U R' U' f'",
      "y' R' U' R' F R F' R U' R' U2 R",
      "y r' F' U' F U F' U' F U r"
    ]
  },
  {
    "name": "OLL 52",
    "setup": "F R U R' d R' U' R U' R'",
    "subgroup": "Line Shapes",
    "moves": [
      "y2 R' F' U' F U' R U R' U R",
      "R U R' U R U' B U' B' R'",
      "R U R' U R d' R U' R' F'",
      "R U R' U R U' y R U' R' F'"
    ]
  },
  {
    "name": "OLL 53",
    "setup": "r' U2' R U R' U' R U R' U r",
    "subgroup": "L Shapes",
    "moves": [
      "r' U' R U' R' U R U' R' U2 r",
      "y2 l' U' L U' L' U L U' L' U2 l",
      "y r' U2 R U R' U' R U R' U r",
      "y' l' U2 L U L' U' L U L' U l"
    ]
  },
  {
    "name": "OLL 54",
    "setup": "r U2' R' U' R U R' U' R U' r'",
    "subgroup": "L Shapes",
    "moves": [
      "r U R' U R U' R' U R U2 r'",
      "y' r U2 R' U' R U R' U' R U' r'",
      "y2 l U L' U L U' L' U L U2 l'",
      "y' r U r' R U R' U' R U R' U' r U' r'"
    ]
  },
  {
    "name": "OLL 55",
    "setup": "F R' F' U2' R U R' U R2' U2' R'",
    "subgroup": "Line Shapes",
    "moves": [
      "y R' F U R U' R2 F' R2 U R' U' R",
      "R U2 R2 U' R U' R' U2 F R F'",
      "y R' F R U R U' R2 F' R2 U' R' U R U R'",
      "r U2 R2 F R F' U2 r' F R F'"
    ]
  },
  {
    "name": "OLL 56",
    "setup": "r U r' R U R' U' R U R' U' r U' r'",
    "subgroup": "Line Shapes",
    "moves": [
      "r U r' U R U' R' U R U' R' r U' r'",
      "r U r' U R U' R' M' U R U2 r'",
      "F R U R' U' R F' r U R' U' r'",
      "r' U' r U' R' U R U' R' U R r' U r"
    ]
  },
  {
    "name": "OLL 57",
    "setup": "r U R' U' M U R U' R'",
    "subgroup": "All Corners Oriented",
    "moves": [
      "R U R' U' M' U R U' r'",
      "y R U' R' S' R U R' S",
      "y R U R' S' R U' R' S",
      "R U R' U' R' r U R U' r'"
    ]
  }
]