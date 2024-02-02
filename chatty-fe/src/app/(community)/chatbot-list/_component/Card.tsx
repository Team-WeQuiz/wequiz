import React from "react";
import * as styles from "./style/card.css";

type CardProps = {
  children: React.ReactNode;
  styleClassName?: string;
};

const Card = ({ children, styleClassName }: CardProps) => {
  return <div className={`${styles.card} ${styleClassName}`}>{children}</div>;
};

export default Card;
