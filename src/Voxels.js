import * as React from "react";
import { BufferGeometry, BufferAttribute } from "three";

export const Voxels = ({ voxels }) => {

  const attrib = React.useRef();

  const positions = React.useMemo(() => {
    return new Float32Array(voxels.map((voxel) => voxel.position).flat());
  }, [voxels]);

  const colors = React.useMemo(() => {
    return new Float32Array(voxels.map((voxel) => voxel.color).flat());
  }, [voxels]);

  const geometry = React.useMemo(() => {
    let geometry = new BufferGeometry();

    geometry.addAttribute("position", new BufferAttribute(positions, 3));
    geometry.addAttribute("color", new BufferAttribute(colors, 3));
    return geometry;

  }, [positions, colors]);

  React.useCallback(() => {
    attrib.current.needsUpdate = true;
  }, [attrib]);

  return (
    <points>
      <primitive attach="geometry" object={geometry} />
      <pointsMaterial attach="material" vertexColors size={0.01} />
    </points>
  );
};
