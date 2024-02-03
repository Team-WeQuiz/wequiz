import { style, keyframes } from "@vanilla-extract/css";

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const loadingCircular = style({
  display: "flex",
  width: "100%",
  height: "100%",
  animation: `${spin} 1.5s linear infinite`,
});
