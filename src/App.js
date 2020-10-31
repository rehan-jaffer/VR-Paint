import * as React from "react";
import { VRCanvas, useController, useXREvent } from "@react-three/xr";
import { useFrame, useThree } from "react-three-fiber";

const COLOUR_LIST = ["black", "red", "blue", "yellow", "purple"];

const Voxels = ({ voxels }) => {

  return (
    <group position={[0, 0, 0]}>
    <mesh>
      {voxels.map((voxel) => {
        return <Voxel {...voxel} />;
      })}
      </mesh>
    </group>
  );
};

const Voxel = (props) => {
  return (
    <>
        <boxBufferGeometry args={[0.005, 0.005, 0.005]} {...props} />
        <meshStandardMaterial color={props.color} />
    </>
  );
};

const Marker = () => {
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
        color={COLOUR_LIST[markerContext.properties.colorIndex]}
      />
      </mesh>
  );
};

const PaintedVoxels = () => {

  const { gl } = useThree();
  const [last, setLast] = React.useState([]);

  gl.setClearColor("#fff");

  const [voxels, set] = React.useState([]);

  const addVoxel = (voxel) => {
    set((voxels) => {
      return voxels.concat(voxel);
    });
  };

  const rightController = useController("right");
  const [active, setActive] = React.useState(false);
  const markerContext = React.useContext(MarkerContext);

  const squeezeStart = React.useCallback(() => {
    setActive(true);
  }, [rightController, active, setActive]);

  const squeezeEnd = React.useCallback(() => {
    setActive(false);
  }, [rightController, active, setActive]);

  const rightSqueeze = React.useCallback(() => {
    markerContext.update((ctx) => {
      return { ...ctx, colorIndex: (ctx.colorIndex + 1) % COLOUR_LIST.length };
    });
  }, [markerContext]);

  useXREvent("squeezestart", squeezeStart, { handedness: "right" });
  useXREvent("squeezeend", squeezeEnd, { handedness: "right" });
  useXREvent("squeeze", rightSqueeze, { handedness: "left" });

  useFrame(() => {
    if (active && rightController) {
      const pos = rightController.controller.position.toArray();

      if (JSON.stringify(pos) !== JSON.stringify(last)) {

        addVoxel({
          position: rightController.controller.position.toArray(),
          color:
            COLOUR_LIST[
              markerContext.properties.colorIndex % COLOUR_LIST.length
            ],
          voxel_id: Date.now(),
        });

        setLast(pos);

      }

    }
  });

  return <Voxels voxels={voxels} />;
};

const MarkerContext = React.createContext({ colorIndex: 0 });

const MarkerContextProvider = ({ children }) => {
  const [markerState, setMarkerState] = React.useState({
    colorIndex: 0,
    markerSize: 1,
  });

  return (
    <MarkerContext.Provider
      value={{ properties: markerState, update: setMarkerState }}
    >
      {children}
    </MarkerContext.Provider>
  );
};

function App() {
  return (
    <VRCanvas>
      <ambientLight />
      <MarkerContextProvider>
        <Marker />
        <PaintedVoxels />
      </MarkerContextProvider>
    </VRCanvas>
  );
}

export default App;
