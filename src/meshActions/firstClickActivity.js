import { VertexBuffer, Vector3, Color4, Color3 } from "babylonjs";
import { CUBE_NAME } from "../utils/constants";
import { globals } from "../utils/globals";

/**
 * Selects a face on the cube and changes the cursor style during selection.
 *
 * @param {BABYLON.Scene} scene - The Babylon.js scene in which the cube exists.
 * @param {number[]} indices - The indices of the face that is selected.
 * @param {BABYLON.PickingInfo} pickResult - The result of the picking operation for the selected face.
 * @param {HTMLCanvasElement} canvas - The HTML canvas element where the scene is rendered.
 */
export function selectFace(scene, indices, pickResult, canvas) {
  if (pickResult.hit && pickResult.pickedMesh.name === CUBE_NAME) {
    // Change cursor while selecting / clicking the face
    canvas.style.cursor = "pointer";
    // Get the selected/ clicked face of the cube
    var face = Math.floor(pickResult.faceId / 2);
    // Set the highlight and reset colors of the cube
    const highlightColor = new Color4(0, 128, 128, 1);
    const resetColor = new Color3(1, 1, 1);

    // Get the face normal for the selected face
    var normal = pickResult.getNormal(true);
    normal = new Vector3(normal.x, normal.y, normal.z);
    // Color the selected face of the cube
    for (let i = 0; i < 6; i++) {
      const facet = 2 * Math.floor(i);
      const currentColor = i === face ? highlightColor : resetColor;
      for (let j = 0; j < 6; j++) {
        const vertex = indices[3 * facet + j];
        globals.colors[4 * vertex] = currentColor.r;
        globals.colors[4 * vertex + 1] = currentColor.g;
        globals.colors[4 * vertex + 2] = currentColor.b;
        globals.colors[4 * vertex + 3] = currentColor.a;
      }
    }
    globals.baseCube.setVerticesData(VertexBuffer.ColorKind, globals.colors);
    let faceVector = new Vector3(normal.x, normal.y, normal.z);
    globals.dragBehavior.options.dragAxis = faceVector;
    // Assign face, normal values to globals
    globals.face = face;
    globals.faceNormal = normal;
  }
}
