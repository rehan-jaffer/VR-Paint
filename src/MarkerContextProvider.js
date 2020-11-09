import * as React from "react";
import { MarkerContext } from "./App";

export const MARKER_MODE = "MARKER_MODE";
export const ERASER_MODE = "ERASER_MODE";

export const MarkerContextProvider = ({ children }) => {
  const [markerState, setMarkerState] = React.useState({
    colorIndex: 0,
    markerSize: 1,
    mode: MARKER_MODE,
  });

  const setMode = (mode) => setMarkerState({ ...markerState, mode: mode });
  const setColor = (idx) => setMarkerState({ ...markerState, colorIndex: idx })
  const setSize = (idx) => setMarkerState({ ...markerState, sizeIndex: idx })

  return (
    <MarkerContext.Provider
      value={{
        properties: markerState,
        update: setMarkerState,
        methods: { setMode, setColor, setSize },
      }}
    >
      {children}
    </MarkerContext.Provider>
  );
};
