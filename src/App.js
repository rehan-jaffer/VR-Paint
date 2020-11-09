import * as React from "react";
import { VRCanvas } from "@react-three/xr";
import { Marker } from "./Marker";
import { PaintCanvas } from "./PaintCanvas";
import { MarkerContextProvider } from "./MarkerContextProvider";
import { Menu } from "./Menu";

export const COLOUR_LIST = [
  "black",
  "red",
  "blue",
  "purple",
  "yellow",
  "orange",
  "pink",
  "green"
];
export const RGB_COLOUR_LIST = [
  [0, 0, 0],
  [1, 0, 0],
  [0, 0, 1],
  [1, 0, 1],
  [0.8980392156862745, 0.8901960784313725, 0.27450980392156865],
  [0.8980392156862745, 0.5764705882352941, 0.27450980392156865],
  [0.8980392156862745, 0.27450980392156865, 0.6],
  [0, 1, 0]
];

export const MarkerContext = React.createContext({ colorIndex: 0 });

function App() {
  return (
    <VRCanvas>
      <ambientLight />
      <MarkerContextProvider>
        <Menu />
        <Marker />
        <PaintCanvas />
      </MarkerContextProvider>
    </VRCanvas>
  );
}

export default App;
