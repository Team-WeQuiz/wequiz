import * as styles from "./style/actionbutton.css";

const Button = ({ content }: { content: string }) => {
  return <button className={styles.button}>{content}</button>;
};

export default Button;
