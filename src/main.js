import * as BABYLON from "babylonjs";

import { baseCubeBuilder } from "./cubeBuilder";
import { CAMERA_NAME, LIGHT_NAME } from "./utils/constants";
import { resetCube } from "./meshActions/resetActivity";
import { selectFace } from "./meshActions/firstClickActivity";
import { globals } from "./utils/globals";
import { applyExtrusion } from "./meshActions/extudeAction";

// Get canvas, resetButton elements by their Ids
const canvas = document.getElementById("renderCanvas");
const resetButton = document.getElementById("resetButton");

// Create a Babylon engine to enable WebGL rendering
const engine = new BABYLON.Engine(canvas, true);

/**
 * CreateScene function responsible for creating scene with cube mesh with drag behaviour
 * @returns {BABYLON.Scene} The created Babylon.js scene.
 */
const createScene = function () {
  // Create a new Babylon scene with engine
  const scene = new BABYLON.Scene(engine);

  // Create a new Babylon camera and attach camera controls to the canvas so users can interact with the camera
  var camera = new BABYLON.ArcRotateCamera(
    CAMERA_NAME,
    1,
    0.8,
    10,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(canvas, true);

  // Create a new Babylon HemisphericLight
  const light = new BABYLON.HemisphericLight(
    LIGHT_NAME,
    new BABYLON.Vector3(0, 0, 10),
    scene
  );

  // Create a Base Cube
  globals.baseCube = baseCubeBuilder(scene);

  //  Get positions, indices and vertices of the Base Cube
  var positions = globals.baseCube.getVerticesData(
    BABYLON.VertexBuffer.PositionKind
  );
  var indices = globals.baseCube.getIndices();
  var vertices = positions.length / 3;

  // Set the Base Cube with initial color
  globals.colors = [];
  globals.colors = new Array(4 * vertices).fill(1);
  globals.baseCube.setVerticesData(
    BABYLON.VertexBuffer.ColorKind,
    globals.colors
  );

  // Add drag beviour to the Base Cube
  globals.dragBehavior = new BABYLON.PointerDragBehavior({
    dragPlaneNormal: new BABYLON.Vector3(0, 0, 0),
  });
  // Set moveAttached to false to restrict the cube from altering its base position
  globals.dragBehavior.moveAttached = false;
  globals.baseCube.addBehavior(globals.dragBehavior);

  // Highlight the selected face
  var isClicked = false;
  scene.onPointerDown = function (event, pickResult) {
    isClicked = selectFace(scene, indices, pickResult, canvas);
  };

  // Extrusion function that resizes the cube
  applyExtrusion(scene);

  //reset event triggers when user hits the reset button
  // it resets base cube, camera and temporary positions
  resetButton.addEventListener("click", (event) => {
    camera = resetCube(event, camera, scene);
    globals.tempPositions = [];
  });

  return scene;
};

const scene = createScene();
engine.runRenderLoop(function () {
  scene.render();
});
window.addEventListener("resize", function () {
  engine.resize();
});
