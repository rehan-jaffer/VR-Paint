import * as React from "react";

export const Voxel = (props) => {
  return (
    <>
      <boxBufferGeometry args={[0.005, 0.005, 0.005]} {...props} />
      <meshStandardMaterial color={props.color} />
    </>
  );
};
