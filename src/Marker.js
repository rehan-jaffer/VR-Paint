import * as React from "react";
import { useController } from "@react-three/xr";
import { useFrame } from "react-three-fiber";
import { MarkerContext, COLOUR_LIST } from "./App";
import { MARKER_MODE, ERASER_MODE } from './MarkerContextProvider'

export const Marker = () => {
  const controller = useController("right");
  const [markerPos, setMarkerPos] = React.useState({});

  useFrame(() => {
    if (controller)
      setMarkerPos({
        position: controller.grip.position.toArray(),
        rotation: controller.grip.rotation.toArray(),
      });
  });

  const markerContext = React.useContext(MarkerContext);

  if (!controller) return null;

  return (
    <mesh {...markerPos}>
      <boxBufferGeometry args={[0.01, 0.01, 0.05]} />
      <meshStandardMaterial
        color={COLOUR_LIST[markerContext.properties.colorIndex]} wireframe={markerContext.properties.mode == ERASER_MODE}
      />
    </mesh>
  );
};
