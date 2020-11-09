import * as React from "react";
import { useController, useXREvent } from "@react-three/xr";
import { useFrame, useThree } from "react-three-fiber";
import { Voxels } from "./Voxels";
import { MarkerContext, COLOUR_LIST, RGB_COLOUR_LIST } from "./App";
import { MARKER_MODE, ERASER_MODE } from "./MarkerContextProvider";
import { CubeTexture } from "three";
import { VoxelOctree } from "./Octree";

const tree = new VoxelOctree();

export const PaintCanvas = () => {
  const { gl } = useThree();
  gl.setClearColor("#fff");

  const [voxels, set] = React.useState([]);
  const rightController = useController("right");

  const [currentlyDrawing, setCurrentlyDrawing] = React.useState(false);
  const markerContext = React.useContext(MarkerContext);
  const [last, setLast] = React.useState([]);

  const addVoxel = (voxel) => {
    set((voxels) => {
      return voxels.concat(voxel);
    });
  };

  const squeezeStart = React.useCallback(() => setCurrentlyDrawing(true), [
    rightController,
    currentlyDrawing,
    setCurrentlyDrawing,
  ]);
  const squeezeEnd = React.useCallback(() => setCurrentlyDrawing(false), [
    rightController,
    currentlyDrawing,
    setCurrentlyDrawing,
  ]);

  const leftSqueeze = React.useCallback(() => {
    markerContext.methods.setMode(
      markerContext.properties.mode === MARKER_MODE ? ERASER_MODE : MARKER_MODE
    );
    /*    if (markerContext.colorIndex === COLOUR_LIST.length-1) {
     markerContext.colorIndex = 0;
    } else {
      markerContext.methods.setMode(MARKER_MODE)
      markerContext.update((ctx) => {
        return { ...ctx, colorIndex: (ctx.colorIndex + 1) % COLOUR_LIST.length };
      });
    } */
  }, [markerContext]);

  useXREvent("squeezestart", squeezeStart, { handedness: "right" });
  useXREvent("squeezeend", squeezeEnd, { handedness: "right" });
  useXREvent("squeeze", leftSqueeze, { handedness: "left" });

  const drawVoxelAtCurrentPosition = () => {
    let id = Date.now();
    let position = rightController.controller.position.toArray();

    addVoxel({
      position: rightController.controller.position.toArray(),
      color:
        RGB_COLOUR_LIST[
          markerContext.properties.colorIndex % RGB_COLOUR_LIST.length
        ],
      voxel_id: id,
    });

    tree.addNode(position, id);
  };

  const removeVoxelsAtCurrentPosition = () => {
    const id_list = tree.nearbyNodes(
      rightController.controller.position.toArray()
    );
    set((voxels) =>
      voxels.filter((voxel) => !id_list.includes(voxel.voxel_id))
    );
  };

  useFrame(() => {
    if (currentlyDrawing && rightController) {
      const pos = rightController.controller.position.toArray();

      if (JSON.stringify(pos) !== JSON.stringify(last)) {
        switch (markerContext.properties.mode) {
          case MARKER_MODE:
            drawVoxelAtCurrentPosition();
            break;
          case ERASER_MODE:
            removeVoxelsAtCurrentPosition();
            break;
          default:
          // do nothing. How did we get here?
        }
        setLast(pos);
      }
    }
  });

  return <Voxels voxels={voxels} />;
};
