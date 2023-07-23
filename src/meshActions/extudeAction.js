import { tempCubeBuilder } from "../cubeBuilder";
import { globals } from "../utils/globals";

/**
 *
 * @param {*} scene
 */
export function applyExtrusion(scene) {
  let tempCube;

  // Event that handles the start of the drag behavior
  globals.dragBehavior.onDragStartObservable.add(() => {
    // Get the positions, indices of the vertices of the Base Cube
    var positions = globals.baseCube.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );
    var indices = globals.baseCube.getIndices();

    //Iterate through each face of base cube and store the current positions before extrusion action
    globals.currentPositions = [];
    for (let i = 0; i < 6; i++) {
      const currentIndex = indices[3 * globals.face * 2 + i];
      const currentPosition = new BABYLON.Vector3(
        positions[3 * currentIndex],
        positions[3 * currentIndex + 1],
        positions[3 * currentIndex + 2]
      );
      if (
        !globals.currentPositions.some((pos) => pos.equals(currentPosition))
      ) {
        globals.currentPositions.push(currentPosition);
      }
    }
  });

  // onDragObservable handle events that occur during the drag behavior
  globals.dragBehavior.onDragObservable.add((event) => {
    // Calculate the extrude vector based on the drag delta and the clicked face normal
    const delta = event.delta;
    let axis;
    if (globals.faceNormal.x === 1 || globals.faceNormal.x === -1) {
      axis = new BABYLON.Vector3(1, 0, 0);
    } else if (globals.faceNormal.y === 1 || globals.faceNormal.y === -1) {
      axis = new BABYLON.Vector3(0, 1, 0);
    } else if (globals.faceNormal.z === 1 || globals.faceNormal.z === -1) {
      axis = new BABYLON.Vector3(0, 0, 1);
    }
    const sign = Math.sign(delta.x + delta.y + delta.z);
    const extrudeVector = axis.scale(sign * delta.length());

    var positions = globals.baseCube.getVerticesData(
      BABYLON.VertexBuffer.PositionKind
    );
    var indices = globals.baseCube.getIndices();

    // Update the positions of the base cube vertices based on the extrude vector
    let newPositions = positions.slice();
    for (let i = 0; i < 6; i++) {
      const newIndex = indices[3 * globals.face * 2 + i];
      const vertex = new BABYLON.Vector3(
        positions[3 * newIndex],
        positions[3 * newIndex + 1],
        positions[3 * newIndex + 2]
      );
      const newPosition = vertex.add(extrudeVector);
      newPositions[3 * newIndex] = newPosition.x;
      newPositions[3 * newIndex + 1] = newPosition.y;
      newPositions[3 * newIndex + 2] = newPosition.z;
    }

    // Get the new positions of the clicked face vertices
    var newFacePositions = [];
    for (let i = 0; i < 6; i++) {
      const newIndex = indices[3 * globals.face * 2 + i];
      const currentPosition = new BABYLON.Vector3(
        positions[3 * newIndex],
        positions[3 * newIndex + 1],
        positions[3 * newIndex + 2]
      );
      if (!newFacePositions.some((pos) => pos.equals(currentPosition))) {
        newFacePositions.push(currentPosition);
      }
    }

    // Calculate the shared vertices of selected face and rest of the cube
    const sharedVertices = [];
    for (let i = 0; i < positions.length / 3; i++) {
      const currentPosition = new BABYLON.Vector3(
        positions[3 * i],
        positions[3 * i + 1],
        positions[3 * i + 2]
      );
      for (const facePosition of globals.currentPositions) {
        if (currentPosition.equals(facePosition)) {
          sharedVertices.push(currentPosition);
          break;
        }
      }
    }

    // Update the positions of the temporary cube vertices based on the shared vertices and the extrude vector
    globals.tempPositions = positions.slice();
    for (let i = 0; i < globals.currentPositions.length; i++) {
      const currentOldVertex = globals.currentPositions[i];
      const currentNewVertex = newFacePositions[i];
      const delta = currentNewVertex.subtract(currentOldVertex);
      for (let j = 0; j < globals.tempPositions.length / 3; j++) {
        const currentPosition = new BABYLON.Vector3(
          globals.tempPositions[3 * j],
          globals.tempPositions[3 * j + 1],
          globals.tempPositions[3 * j + 2]
        );

        for (const sharedVertex of sharedVertices) {
          if (currentPosition.equals(sharedVertex)) {
            globals.tempPositions[3 * j] += delta.x;
            globals.tempPositions[3 * j + 1] += delta.y;
            globals.tempPositions[3 * j + 2] += delta.z;
            break;
          }
        }
      }
    }

    if (tempCube) {
      tempCube.dispose();
    }
    //Create a temporary cube again and set its colors
    tempCube = tempCubeBuilder(scene);
    tempCube.setVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      globals.tempPositions
    );
    tempCube.setVerticesData(BABYLON.VertexBuffer.ColorKind, globals.colors);

    // Set the base cube position with the new positions
    globals.baseCube.setVerticesData(
      BABYLON.VertexBuffer.PositionKind,
      newPositions
    );
  });

  // Dispose of the temporary cube after drag action is done and Set the base cube position with the new positions
  globals.dragBehavior.onDragEndObservable.add(() => {
    if (tempCube) {
      tempCube.dispose();
    }

    if (globals.tempPositions.length) {
      globals.baseCube.setVerticesData(
        BABYLON.VertexBuffer.PositionKind,
        globals.tempPositions
      );
    }
  });
}
