import { style } from "@vanilla-extract/css";
import { globals } from "@/app/globals.css";

export const card = style({
  display: "flex",
  padding: "16px",
  borderRadius: "8px",
  background: globals.color.main_7,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  transition: "box-shadow 0.3s ease-in-out",
  ":hover": {
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  },
  alignItems: "center",
  justifyContent: "center",
});
