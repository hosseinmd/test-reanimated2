import React from "react";
import { View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler } from "react-native-reanimated";
import "./App.css";

function App() {
  const gestureHandler = useAnimatedGestureHandler(
    {
      onStart: (_) => {
        console.log(_);
      },
      onActive: (event) => {
        console.log(event);
      },
      onEnd: (_) => {
        console.log(_);
      },
    },
    []
  );

  return (
    <View
      style={{
        backgroundColor: "yellow",
        overflow: "hidden",
      }}
    >
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={{
            backgroundColor: "blue",
            height: 100,
            width: 200,
            margin: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        ></Animated.View>
      </PanGestureHandler>
    </View>
  );
}

export default App;
