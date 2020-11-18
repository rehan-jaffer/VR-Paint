import React, { useEffect } from "react";
import { COLOUR_LIST, MarkerContext } from "./App";
import { useThree, useFrame } from "react-three-fiber";
import { useController, Hover, Select } from "@react-three/xr";

export const SIZE_LIST = [0.01, 0.02, 0.05, 0.08]

const circleElements = (index, total, radius = 0.2) => {
  let theta = ((Math.PI * 2) / total) * index;
  let x = radius * Math.cos(theta);
  let y = radius * Math.sin(theta);
  return [x, y];
};

export const Menu = () => {

  const ref = React.useRef();
  const [sizeSelected, setSizeSelected] = React.useState(0);
  const [colorSelected, setColorSelected] = React.useState(0);

  const { gl, camera } = useThree();
  const [pos, set] = React.useState({ position: [], rotation: [] });
  const markerContext = React.useContext(MarkerContext);

  const leftController = useController("left");

  useFrame(() => {
    if (leftController) {
      set({
        position: leftController.grip.position.toArray(),
        rotation: leftController.grip.rotation.toArray(),
      });
    }
  });

  if (!leftController) return null;
  if (markerContext.properties.isMenuOpen !== true) return null;

  let row = 0;

  return (
    <group ref={ref} position={pos.position} rotation={pos.rotation}>
      {COLOUR_LIST.map((colour, idx) => {

        const pos = circleElements(idx, COLOUR_LIST.length);

        if (idx % 5 === 0)
          row++;

        return (
          <Select onSelect={() => markerContext.methods.setColor(idx)}>
            <Hover onChange={() => setColorSelected(idx)}>
              <mesh key={colour} position={[((idx % 5)*0.1), row/8, (markerContext.properties.colorIndex === idx) ? -0.05 : 0]}>
                <boxBufferGeometry
                  args={colorSelected === idx ? [0.1, 0.1, 0.1] : [0.08, 0.08, 0.08]}
                />
                <meshBasicMaterial
                  color={colour}
                />
              </mesh>
            </Hover>
          </Select>
        );
      })}
    </group>
  );
};
