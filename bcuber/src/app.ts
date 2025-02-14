// inspired from https://github.com/taylorjg/rubiks-cube
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import * as L from "./logic";
import * as U from "./logic/utils";

const LIGHT_COLOR = 0xffffff;
const LIGHT_INTENSITY = 2;
const LIGHT_DISTANCE = 4;

const COLOR_TABLE = {
  U: new THREE.Color("blue"),
  D: new THREE.Color("green"),
  L: new THREE.Color("red"),
  R: new THREE.Color("darkorange"),
  F: new THREE.Color("yellow"),
  B: new THREE.Color("ghostwhite"),
  "-": new THREE.Color(0x282828),
};

const PIECE_MATERIAL = new THREE.MeshPhysicalMaterial({
  vertexColors: true,
  metalness: 0.5,
  roughness: 0.1,
  clearcoat: 0.1,
  reflectivity: 0.5,
});

export const threeApp = async () => {
  const NUM_RANDOM_MOVES = 20;
  const BEFORE_DELAY = 1000;
  const AFTER_DELAY = 1000;

  const animationSpeed = 700;

  const container = document.getElementById("visualisation-container");
  if (container == null) {
    throw new Error("Container not found");
  }

  const renderer = getRendererFromContainer(container);
  const { scene, camera } = getCameraedScene(
    container.offsetWidth,
    container.offsetHeight
  );
  addLights(scene);

  const puzzleGroup = new THREE.Group();
  const animationGroup = new THREE.Group();
  scene.add(puzzleGroup);
  scene.add(animationGroup);

  const controls = getOrbitControls(camera, renderer);
  controls.enablePan = false;
  const clock = new THREE.Clock();
  const animationMixer = new THREE.AnimationMixer(animationGroup);

  const cubeSize = 3;
  let cube: { [k: any]: any } = L.getSolvedCube(3);
  console.log({ cube });

  const pieceGeometry = await loadGeometry("/cube-bevelled.glb");

  createUiPieces();

  animate();
  scramble();


  window.addEventListener("resize", () => {
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
  });

  function loadGeometry(
    url: string
  ): Promise<THREE.BufferGeometry> {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          const bufferGeometry = gltf.scene.children[0].geometry;
          resolve(bufferGeometry);
        },
        undefined,
        reject
      );
    });
  }
  //@ts-ignore
  function lookupColorForFaceNormal(piece, normalX, normalY, normalZ) {
    //@ts-ignore
    if (U.closeTo(normalY, 1)) return COLOR_TABLE[piece.faces.up];

    //@ts-ignore
    if (U.closeTo(normalY, -1)) return COLOR_TABLE[piece.faces.down];

    //@ts-ignore
    if (U.closeTo(normalX, -1)) return COLOR_TABLE[piece.faces.left];

    //@ts-ignore
    if (U.closeTo(normalX, 1)) return COLOR_TABLE[piece.faces.right];
    //@ts-ignore
    if (U.closeTo(normalZ, 1)) return COLOR_TABLE[piece.faces.front];
    //@ts-ignore
    if (U.closeTo(normalZ, -1)) return COLOR_TABLE[piece.faces.back];
    return COLOR_TABLE["-"];
  }

  function setGeometryVertexColors(piece: any) {
    const pieceGeoemtry = pieceGeometry.clone();
    const normalAttribute = pieceGeoemtry.getAttribute("normal");

    const colors = [];

    for (
      let normalIndex = 0;
      normalIndex < normalAttribute.count;
      normalIndex += 3
    ) {
      let arrayIndex = normalIndex * normalAttribute.itemSize;
      const normalX = normalAttribute.array[arrayIndex++];
      const normalY = normalAttribute.array[arrayIndex++];
      const normalZ = normalAttribute.array[arrayIndex++];

      const color = lookupColorForFaceNormal(piece, normalX, normalY, normalZ);

      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
    }

    pieceGeoemtry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    return pieceGeoemtry;
  }

  function createUiPieces() {
    cube.forEach((piece) => {
      const uiPiece = createUiPiece(piece);
      puzzleGroup.add(uiPiece);
    });
  }

  function createUiPiece(piece) {
    const pieceGeometryWithColors = setGeometryVertexColors(piece);
    //@ts-ignore
    const uiPiece = new THREE.Mesh(pieceGeometryWithColors, PIECE_MATERIAL);
    uiPiece.scale.set(0.5, 0.5, 0.5);
    uiPiece.userData = piece.id;
    resetUiPiece(uiPiece, piece);
    return uiPiece;
  }

  function resetUiPiece(uiPiece: any, piece: any) {
    const isEvenSizedCube = cubeSize % 2 === 0;
    const adjustValue = (v: any) =>
      isEvenSizedCube ? (v < 0 ? v + 0.5 : v - 0.5) : v;
    uiPiece.position.x = adjustValue(piece.x);
    uiPiece.position.y = adjustValue(piece.y);
    uiPiece.position.z = adjustValue(piece.z);
    uiPiece.setRotationFromMatrix(makeRotationMatrix4(piece.accTransform3));
  }

  function findUiPiece(piece: any) {
    return puzzleGroup.children.find((child) => child.userData === piece.id);
  }

  function resetUiPieces(cube: any[]) {
    cube.forEach((piece) => {
      const uiPiece = findUiPiece(piece);
      resetUiPiece(uiPiece, piece);
    });
  }

  function animate() {
    window.requestAnimationFrame(animate);
    controls.update();
    const delta = clock.getDelta() * animationMixer.timeScale;
    animationMixer.update(delta);
    renderer.render(scene, camera);
  }

  function movePiecesBetweenGroups(
    uiPieces: any,
    fromGroup: any,
    toGroup: any
  ) {
    if (uiPieces.length) {
      fromGroup.remove(...uiPieces);
      toGroup.add(...uiPieces);
    }
  }

  function createAnimationClip(move: any) {
    const numTurns = move.numTurns;
    const t0 = 0;
    const t1 = numTurns * (animationSpeed / 1000);
    const times = [t0, t1];
    const values: any[] = [];
    const startQuaternion = new THREE.Quaternion();
    const endQuaternion = new THREE.Quaternion();
    const rotationMatrix3 = move.rotationMatrix3;
    const rotationMatrix4 = makeRotationMatrix4(rotationMatrix3);
    endQuaternion.setFromRotationMatrix(rotationMatrix4);
    startQuaternion.toArray(values, values.length);
    endQuaternion.toArray(values, values.length);
    const duration = -1;
    const tracks = [
      new THREE.QuaternionKeyframeTrack(".quaternion", times, values),
    ];
    return new THREE.AnimationClip(move.id, duration, tracks);
  }

  const animateMoves = (moves: any, nextMoveIndex = 0) => {
    const move = moves[nextMoveIndex];

    if (!move) {
      return setTimeout(scramble, AFTER_DELAY);
    }

    const pieces = L.getPieces(cube, move.coordsList);
    const uiPieces = pieces.map(findUiPiece);
    movePiecesBetweenGroups(uiPieces, puzzleGroup, animationGroup);

    const onFinished = () => {
      animationMixer.removeEventListener("finished", onFinished);
      movePiecesBetweenGroups(uiPieces, animationGroup, puzzleGroup);
      cube = move.makeMove(cube);
      const rotationMatrix3 = move.rotationMatrix3;
      const rotationMatrix4 = makeRotationMatrix4(rotationMatrix3);
      for (const uiPiece of uiPieces) {
        uiPiece.applyMatrix4(rotationMatrix4);
      }
      animateMoves(moves, nextMoveIndex + 1);
    };

    animationMixer.addEventListener("finished", onFinished);

    const animationClip = createAnimationClip(move);
    const clipAction = animationMixer.clipAction(animationClip, animationGroup);
    clipAction.setLoop(THREE.LoopOnce, 1);
    clipAction.play();
  };

  function showSolutionByCheating(randomMoves: any[]) {
    const solutionMoves = randomMoves
      .map((move) => move.oppositeMoveId)
      .map((id) => L.lookupMoveId(cubeSize, id))
      .reverse();
    console.log(
      `solution moves: ${solutionMoves.map((move) => move.id).join(" ")}`
    );
    animateMoves(solutionMoves);
  }

  function scramble() {
    const randomMoves = U.range(NUM_RANDOM_MOVES).map(() =>
      L.getRandomMove(cubeSize)
    );
    L.removeRedundantMoves(randomMoves);
    console.log(
      `random moves: ${randomMoves.map((move: any) => move.id).join(" ")}`
    );
    cube = L.makeMoves(randomMoves, L.getSolvedCube(cubeSize));
    resetUiPieces(cube);
    setTimeout(showSolutionByCheating, BEFORE_DELAY, randomMoves);
  }
};

function getOrbitControls(camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 5.0;
  controls.maxDistance = 40.0;
  controls.enableDamping = true;
  controls.dampingFactor = 0.9;
  return controls;
}

function addLights(scene: THREE.Scene) {
  const light1 = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
  light1.position.set(0, 0, LIGHT_DISTANCE);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
  light2.position.set(0, 0, -LIGHT_DISTANCE);
  scene.add(light2);

  const light3 = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
  light3.position.set(0, LIGHT_DISTANCE, 0);
  scene.add(light3);

  const light4 = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
  light4.position.set(0, -LIGHT_DISTANCE, 0);
  scene.add(light4);

  const light5 = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
  light5.position.set(LIGHT_DISTANCE, 0, 0);
  scene.add(light5);

  const light6 = new THREE.DirectionalLight(LIGHT_COLOR, LIGHT_INTENSITY);
  light6.position.set(-LIGHT_DISTANCE, 0, 0);
  scene.add(light6);
}

function getCameraedScene(w: number, h: number) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(34, w / h, 1, 100);
  camera.position.set(3, 3, 12);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(camera);

  return { scene, camera };
}

function getRendererFromContainer(container: HTMLElement) {
  const w = container.offsetWidth;
  const h = container.offsetHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);
  return renderer;
}

function makeRotationMatrix4(rotationMatrix3: any): THREE.Matrix4 {
  const n11 = rotationMatrix3.get([0, 0]);
  const n12 = rotationMatrix3.get([1, 0]);
  const n13 = rotationMatrix3.get([2, 0]);
  const n21 = rotationMatrix3.get([0, 1]);
  const n22 = rotationMatrix3.get([1, 1]);
  const n23 = rotationMatrix3.get([2, 1]);
  const n31 = rotationMatrix3.get([0, 2]);
  const n32 = rotationMatrix3.get([1, 2]);
  const n33 = rotationMatrix3.get([2, 2]);
  return new THREE.Matrix4().set(
    n11,
    n12,
    n13,
    0,
    n21,
    n22,
    n23,
    0,
    n31,
    n32,
    n33,
    0,
    0,
    0,
    0,
    1
  );
}

export default threeApp;
