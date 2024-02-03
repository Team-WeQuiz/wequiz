"use client";
import * as styles from "./style/actionbutton.css";

const ActionButton = ({
  content,
  onClick,
}: {
  content: string;
  onClick?: () => void;
}) => {
  return (
    <button className={styles.button} onClick={onClick}>
      <span className={styles.content}>{content}</span>
    </button>
  );
};

export default ActionButton;
