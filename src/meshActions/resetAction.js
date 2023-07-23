import { baseCubeBuilder } from "../cubeBuilder";
import { globals } from "../utils/globals";

/**
 * Resets the Base Cube, camera, and cube colors to their initial values.
 *
 * @param {Event} event - The event that triggers the reset action.
 * @param {BABYLON.ArcRotateCamera} camera - The camera to be reset to its initial position.
 * @param {BABYLON.Scene} scene - The Babylon.js scene in which the cube and camera exist.
 * @returns camera after being reset to its initial position.
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
  return camera;
};
