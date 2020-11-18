import * as React from "react";
import { useController, useXREvent } from "@react-three/xr";
import { useFrame, useThree } from "react-three-fiber";
import { Voxels } from "./Voxels";
import { MarkerContext, COLOUR_LIST, RGB_COLOUR_LIST } from "./App";
import { MARKER_MODE, ERASER_MODE } from "./MarkerContextProvider";
import { SIZE_LIST } from "./Menu";
import { VoxelOctree } from "./Octree";

const tree = new VoxelOctree();

export const PaintCanvas = () => {
  const { gl } = useThree();

  gl.setClearColor("#fff");

  const rightController = useController("right");

  const [currentlyDrawing, setCurrentlyDrawing] = React.useState(false);
  const markerContext = React.useContext(MarkerContext);
  const [last, setLast] = React.useState([]);
  const [nodes, setNodes] = React.useState([]);

  const squeezeStart = () => setCurrentlyDrawing(true);
  const squeezeEnd = () => setCurrentlyDrawing(false);
  const [squeezeStartTime, setSqueezeStartTime] = React.useState(0)

  const leftSqueezeStart = () => {
    setSqueezeStartTime(Date.now())
  }

  const leftSqueezeEnd = () => {
    const squeezedTime = (Date.now() - squeezeStartTime);
    if (squeezedTime < 2000) {
      markerContext.methods.setMode(
        markerContext.properties.mode === MARKER_MODE ? ERASER_MODE : MARKER_MODE
      );  
    } else {
      markerContext.methods.toggleMenuOpen()
    }
  }

  const leftSqueeze = React.useCallback(() => {
    markerContext.methods.setMode(
      markerContext.properties.mode === MARKER_MODE ? ERASER_MODE : MARKER_MODE
    );
  }, [markerContext]);

  useXREvent("squeezestart", squeezeStart, { handedness: "right" });
  useXREvent("squeezeend", squeezeEnd, { handedness: "right" });

  useXREvent("squeezestart", leftSqueezeStart, { handedness: "left" });
  useXREvent("squeezeend", leftSqueezeEnd, { handedness: "left" });

  const colorFromArray = (idx) => RGB_COLOUR_LIST[idx % RGB_COLOUR_LIST.length];
  const sizeFromArray = (idx) => SIZE_LIST[idx % SIZE_LIST.length];

  const addVoxelToCanvas = (id, position) => {
    const color = colorFromArray(markerContext.properties.colorIndex);
    const size = sizeFromArray(markerContext.properties.sizeIndex);

    const nodes = tree.addNode({ position, id, color, size });
    setNodes(nodes);
  };

  const drawVoxelAtCurrentPosition = () => {
    addVoxelToCanvas(Date.now(), rightController.controller.position.toArray());
  };

  const removeVoxelsAtCurrentPosition = () => {
    const nodes = tree.removeNearbyNodes(
      rightController.controller.position.toArray()
    );
    setNodes(nodes);
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

  return <Voxels voxels={nodes} />;
};
