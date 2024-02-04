import { style } from "@vanilla-extract/css";

export const card = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  alignItems: "center",
});
