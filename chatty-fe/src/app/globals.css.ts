import { createGlobalTheme, globalStyle } from "@vanilla-extract/css";
import { globalAgent } from "http";

export const globals = createGlobalTheme(":root", {
  color: {
    main: "#FFA800",
    main_2: "#FFBA33",
    main_3: "#FFCB66",
    main_4: "#FFDC99",
    main_5: "#FFEECC",
    main_6: "#FFF6E6",
    main_7: "#FFFCF7",
  },
  fontColor: {
    main: "#111111",
  },
  subjectColor: {
    korean: "#FF6969",
    math: "#A281FF",
    english: "#FD84FF",
    history: "#74DDFF",
    social: "#75FF7A",
    science: "#3E2DA9",
  },
});

globalStyle("*", {
  boxSizing: "border-box",
});

globalStyle("html, body", {
  width: "100%",
  height: "100%",
  margin: 0,
  padding: 0,
  overflowX: "hidden",
});

globalStyle("button", {
  outline: "none",
  border: "none",
  background: "none",
});
