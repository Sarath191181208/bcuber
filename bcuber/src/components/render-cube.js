import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";

export class RubiksCubeComponent {
    constructor(container = document.body, options = {}) {
        this.container = container;
        this.width = options.width || container.clientWidth - 10 || window.innerWidth;
        this.height = options.height || container.clientHeight - 10 || window.innerHeight;

        // ----------------- Setup Scene, Camera, Renderer -----------------
        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color(0x00000000);

        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        // this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // ----------------- Add Controls -----------------
        // Trackball Controls
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = 3.0;
        this.controls.zoomSpeed = 0.8;
        this.controls.panSpeed = 2.0;
        this.controls.dynamicDampingFactor = 0.2;

        // ----------------- Lights -----------------
        const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);

        // ----------------- Create Cube Group & Cubelets -----------------
        this.cubeGroup = new THREE.Group();
        this.scene.add(this.cubeGroup);
        this.cubelets = [];
        this._createCube();

        // ----------------- Move Logic -----------------
        this.moveQueue = [];
        this.moveMapping = {
            "R": { axis: "x", layer: 1, angle: -Math.PI / 2 },
            "R'": { axis: "x", layer: 1, angle: Math.PI / 2 },
            "R2": { axis: "x", layer: 1, angle: -Math.PI },
            "L": { axis: "x", layer: -1, angle: Math.PI / 2 },
            "L'": { axis: "x", layer: -1, angle: -Math.PI / 2 },
            "L2": { axis: "x", layer: -1, angle: Math.PI },
            "U": { axis: "y", layer: 1, angle: -Math.PI / 2 },
            "U'": { axis: "y", layer: 1, angle: Math.PI / 2 },
            "U2": { axis: "y", layer: 1, angle: -Math.PI },
            "D": { axis: "y", layer: -1, angle: Math.PI / 2 },
            "D'": { axis: "y", layer: -1, angle: -Math.PI / 2 },
            "D2": { axis: "y", layer: -1, angle: Math.PI },
            "F": { axis: "z", layer: 1, angle: -Math.PI / 2 },
            "F'": { axis: "z", layer: 1, angle: Math.PI / 2 },
            "F2": { axis: "z", layer: 1, angle: -Math.PI },
            "B": { axis: "z", layer: -1, angle: Math.PI / 2 },
            "B'": { axis: "z", layer: -1, angle: -Math.PI / 2 },
            "B2": { axis: "z", layer: -1, angle: Math.PI }
        };
        this.rotatingFlag = false;
        this.currentGroup = null;
        this.rotationAxis = null;
        this.targetAngle = 0;
        this.rotatedAngle = 0;
        this.rotationSpeed = Math.PI / 100;

        // ----------------- Transform Controls -----------------
        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        // Attach to the cube group.
        this.transformControls.attach(this.cubeGroup);
        // Set mode and a moderate size.
        this.transformControls.setMode("rotate");
        this.scene.add(this.transformControls.getHelper());
        this.gizmosEnabled = true;

        // Smooth snapping variables.
        this.snappingActive = false;
        this.targetQuaternion = new THREE.Quaternion();
        this.transformControls.addEventListener("mouseDown", () => {
            this.snappingActive = false;
            this.controls.enabled = false;
        });
        this.transformControls.addEventListener("mouseUp", () => {
            const currentEuler = new THREE.Euler().setFromQuaternion(this.cubeGroup.quaternion, "XYZ");
            const snapIncrement = THREE.MathUtils.degToRad(15);
            const snappedEuler = new THREE.Euler(
                Math.round(currentEuler.x / snapIncrement) * snapIncrement,
                Math.round(currentEuler.y / snapIncrement) * snapIncrement,
                Math.round(currentEuler.z / snapIncrement) * snapIncrement,
                "XYZ"
            );
            this.targetQuaternion.setFromEuler(snappedEuler);
            this.snappingActive = true;
            this.controls.enabled = true;
        });

        // ----------------- Handle Window Resize -----------------
        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Start the animation loop.
        this._animate();
    }

    // ----------------- Cube Creation -----------------
    _createCube() {
        const cubeSize = 0.95;
        const gap = 0.1;
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

        // Helper: Create materials for each face based on position.
        const createCubeletMaterials = (x, y, z) => [
            new THREE.MeshBasicMaterial({ color: x === 1 ? 0xE9573F : 0x222222 }), // Right: Red
            new THREE.MeshBasicMaterial({ color: x === -1 ? 0xF2C45F : 0x222222 }), // Left: Orange
            new THREE.MeshBasicMaterial({ color: y === 1 ? 0xF5F5F5 : 0x222222 }),  // Top: White
            new THREE.MeshBasicMaterial({ color: y === -1 ? 0xF8F384 : 0x222222 }), // Bottom: Yellow
            new THREE.MeshBasicMaterial({ color: z === 1 ? 0x48C991 : 0x222222 }),  // Front: Green
            new THREE.MeshBasicMaterial({ color: z === -1 ? 0x5DADE2 : 0x222222 })   // Back: Blue
        ];

        // Create cubelets (skipping the center piece if desired).
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    if (x === 0 && y === 0 && z === 0) continue;
                    const materials = createCubeletMaterials(x, y, z);
                    const cubelet = new THREE.Mesh(geometry, materials);
                    cubelet.position.set(
                        x * (cubeSize + gap),
                        y * (cubeSize + gap),
                        z * (cubeSize + gap)
                    );
                    cubelet.userData.logicalPos = new THREE.Vector3(x, y, z);
                    this.cubeGroup.add(cubelet);
                    this.cubelets.push(cubelet);

                    // Add an outline for better visibility.
                    const edges = new THREE.EdgesGeometry(geometry);
                    const line = new THREE.LineSegments(
                        edges,
                        new THREE.LineBasicMaterial({ color: 0x000000 })
                    );
                    cubelet.add(line);
                }
            }
        }
    }

    // ----------------- Animation Loop -----------------
    _animate = () => {
        requestAnimationFrame(this._animate);
        this.controls.update();

        // Process queued moves.
        if (!this.rotatingFlag && this.moveQueue.length > 0) {
            const nextMove = this.moveQueue.shift();
            this._startMove(nextMove);
        }

        // If a move is in progress, rotate the affected cubelets.
        if (this.rotatingFlag && this.currentGroup) {
            // Increase rotation speed if there are more moves in the queue.
            const speedMultiplier = 2 + this.moveQueue.length * 0.5;
            const effectiveSpeed = this.rotationSpeed * speedMultiplier;

            let deltaAngle = this.targetAngle > 0 ? effectiveSpeed : -effectiveSpeed;
            if (this.targetAngle > 0) {
                if (this.rotatedAngle + deltaAngle > this.targetAngle) {
                    deltaAngle = this.targetAngle - this.rotatedAngle;
                }
            } else {
                if (this.rotatedAngle + deltaAngle < this.targetAngle) {
                    deltaAngle = this.targetAngle - this.rotatedAngle;
                }
            }
            this.rotatedAngle += deltaAngle;
            this.currentGroup.rotation[this.rotationAxis] += deltaAngle;

            if (Math.abs(this.rotatedAngle) >= Math.abs(this.targetAngle) - 0.0001) {
                this.currentGroup.updateMatrixWorld(true);
                const children = this.currentGroup.children.slice();
                for (const cube of children) {
                    this.cubeGroup.attach(cube);
                    cube.userData.logicalPos = this._rotateLogical(
                        cube.userData.logicalPos,
                        this.rotationAxis,
                        this.targetAngle
                    );
                }
                this.cubeGroup.remove(this.currentGroup);
                this.currentGroup = null;
                this.rotatingFlag = false;
            }
        }

        // Smooth snapping interpolation for cubeGroup orientation.
        if (this.snappingActive) {
            this.cubeGroup.quaternion.slerp(this.targetQuaternion, 0.1);
            if (this.cubeGroup.quaternion.angleTo(this.targetQuaternion) < 0.01) {
                this.cubeGroup.quaternion.copy(this.targetQuaternion);
                this.snappingActive = false;
            }
        }

        this.renderer.render(this.scene, this.camera);
    };

    // ----------------- Face Move Helpers -----------------
    _rotateLogical(pos, axis, angle) {
        const axisVec =
            axis === "x"
                ? new THREE.Vector3(1, 0, 0)
                : axis === "y"
                    ? new THREE.Vector3(0, 1, 0)
                    : new THREE.Vector3(0, 0, 1);
        const newPos = pos.clone();
        newPos.applyAxisAngle(axisVec, angle);
        newPos.x = Math.round(newPos.x);
        newPos.y = Math.round(newPos.y);
        newPos.z = Math.round(newPos.z);
        return newPos;
    }

    _startMove(moveObj) {
        this.rotatingFlag = true;
        this.rotationAxis = moveObj.axis;
        this.targetAngle = moveObj.angle;
        this.currentGroup = new THREE.Group();
        this.cubeGroup.add(this.currentGroup);
        const threshold = 0.1;
        const cubesToRotate = [];
        for (const cube of this.cubelets) {
            const pos = cube.userData.logicalPos;
            if (Math.abs(pos[this.rotationAxis] - moveObj.layer) < threshold) {
                cubesToRotate.push(cube);
            }
        }
        for (const cube of cubesToRotate) {
            this.currentGroup.add(cube);
        }
        this.rotatedAngle = 0;
    }

    // ----------------- Public Methods -----------------
    /**
     * Queue a string of moves (e.g., "R U R' U2") to animate.
     */
    addMoves(movesStr) {
        const tokens = movesStr.trim().split(/\s+/);
        for (const token of tokens) {
            if (this.moveMapping[token]) {
                this.moveQueue.push(this.moveMapping[token]);
            }
        }
    }

    /**
     * Toggle the visibility/interactivity of the orientation gizmo.
     */
    toggleGizmos(show) {
        this.gizmosEnabled = show;
        if (!show) {
            this.transformControls.detach();
        } else {
            this.transformControls.attach(this.cubeGroup);
        }
    }

    resetAxes() {
        this.cubeGroup.rotation.set(0, 0, 0);
        this.cubeGroup.quaternion.set(0, 0, 0, 1);
        if (this.gizmosEnabled) {
            this.transformControls.attach(this.cubeGroup);
        }
    }
}
