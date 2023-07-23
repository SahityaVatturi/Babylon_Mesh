import { CUBE_NAME, MATERIAL_NAME } from "./utils/constants";
import { globals } from "./utils/globals";

/**
 * baseCubeBuilder function responsible for creating new cube Mesh
 * @param {BABYLON.Scene} scene Babylon scene
 * @returns Base Cube
 */
export function baseCubeBuilder(scene) {
  globals.baseCube = BABYLON.Mesh.CreateBox(CUBE_NAME, 1.0, scene);
  globals.baseCube.enableEdgesRendering();
  globals.baseCube.edgesColor = new BABYLON.Color4(0, 0, 0, 0.5);
  return globals.baseCube;
}

/**
 * tempCubeBuilder function responsible for creating new temporary Mesh for extrusion
 * set the alpha value of temporary cube to 0.5 so that difference between origin and extruded cube can be seen clearly
 * @param {BABYLON.Scene} scene Babylon scene
 * @returns Temporary Cube
 */
export function tempCubeBuilder(scene) {
  var tempCube = BABYLON.Mesh.CreateBox(CUBE_NAME, {}, scene);
  let tempCubeMaterial = new BABYLON.StandardMaterial(MATERIAL_NAME, scene);
  tempCubeMaterial.alpha = 0.5;
  tempCube.material = tempCubeMaterial;
  return tempCube;
}
