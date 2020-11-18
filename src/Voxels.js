import * as React from "react";
import { BufferGeometry, BufferAttribute } from "three";
import vertex from './vertex.shader'
import fragment from './fragment.shader'
import { shaderMaterial } from "drei"


export const Voxels = ({ voxels }) => {
  const attrib = React.useRef();

  const positions = React.useMemo(() => {
    return new Float32Array(voxels.map((voxel) => voxel.position.toArray()).flat());
  }, [voxels]);

  const colors = React.useMemo(() => {
    return new Float32Array(voxels.map((voxel) => voxel.color).flat());
  }, [voxels]);

  const sizes = React.useMemo(() => {
    return new Float32Array(voxels.map((voxel) => 0.5).flat());
  }, [ voxels ])

  const geometry = React.useMemo(() => {
    let geometry = new BufferGeometry();

    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("color", new BufferAttribute(colors, 3));
    return geometry;

  }, [positions, colors, sizes]);

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
