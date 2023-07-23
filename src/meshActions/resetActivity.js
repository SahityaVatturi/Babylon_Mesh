import { baseCubeBuilder } from "../cubeBuilder";
import { globals } from "../utils/globals";

/**
 * resetCube function resets Base Cube, camera and cube colors to its initial value
 * @param {*} event
 * @param {*} camera
 * @param {*} scene
 * @returns camera after resetting to its initial position
 */
export const resetCube = (event, camera, scene) => {
  // Dispose the Base Cube when user hits the reset button
  globals.baseCube.dispose();
  // Set the camera's position to its initial position
  camera.alpha = 1;
  camera.beta = 0.8;
  camera.radius = 10;

  // Create the Base cube again after disposing it
  globals.baseCube = baseCubeBuilder(scene);
  var positions = globals.baseCube.getVerticesData(
    BABYLON.VertexBuffer.PositionKind
  );
  // var indices = globals.baseCube.getIndices();
  // Set the colors to its initial values
  var vertices = positions.length / 3;
  globals.colorscolors = [];
  globals.colors = new Array(4 * vertices).fill(1);

  // Set the Base cube with its initial color and add drag behaviour to it
  globals.baseCube.setVerticesData(
    BABYLON.VertexBuffer.ColorKind,
    globals.colors
  );
  globals.baseCube.addBehavior(globals.dragBehavior);
  // globals.colors = colors;
  return camera;
};
