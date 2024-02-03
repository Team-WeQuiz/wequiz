import { style } from "@vanilla-extract/css";
import { globals } from "@/app/globals.css";

export const button = style({
  display: "inline-flex",
  padding: "10px 24px",
  borderRadius: "16px",
  backgroundColor: globals.color.main,
  boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.0)",
  transition:
    "background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out, transform 0.2s ease",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  ":hover": {
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  ":active": {
    transform: "scale(0.98)",
  },
});
