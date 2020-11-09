import React, { useEffect } from "react";
import { COLOUR_LIST, MarkerContext } from "./App";
import { useThree, useFrame } from "react-three-fiber";
import { useController, Hover, Select } from "@react-three/xr";

const SIZE_LIST = [0.01, 0.02, 0.05, 0.08]

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

  return (
    <group ref={ref} position={pos.position} rotation={pos.rotation}>

      {SIZE_LIST.map((size, idx) => {
        const pos = circleElements(idx, SIZE_LIST.length, 0.4);

        return (<Select onSelect={() => markerContext.methods.setSize(idx)}>
            <Hover onChange={() => setSizeSelected(idx)}>
              <mesh key={size} position={[(idx/10)-0.1, 0, 0.3]}>
                <boxBufferGeometry
                  args={sizeSelected === idx ? [size*1.1, size*1.1, size*1.1] : [size, size, size]}
                />
                <meshBasicMaterial
                  transparent
                  color={"black"}
                  opacity={sizeSelected === idx ? 1.0 : 0.5}
                />
              </mesh>
            </Hover>
          </Select>)

      })}
      {COLOUR_LIST.map((colour, idx) => {
        const pos = circleElements(idx, COLOUR_LIST.length);

        return (
          <Select onSelect={() => markerContext.methods.setColor(idx)}>
            <Hover onChange={() => setColorSelected(idx)}>
              <mesh key={colour} position={[pos[0], 0, pos[1]]}>
                <boxBufferGeometry
                  args={colorSelected === idx ? [0.15, 0.15, 0.15] : [0.1, 0.1, 0.1]}
                />
                <meshBasicMaterial
                  color={colour}
                  transparent
                  opacity={colorSelected === idx ? 1.0 : 0.5}
                />
              </mesh>
            </Hover>
          </Select>
        );
      })}
    </group>
  );
};
