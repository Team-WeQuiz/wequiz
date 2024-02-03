import exp from "constants";
import * as styles from "./style/taglabel.css";

type TagStyleMap = {
  [key: string]: string;
};

const tagStyles: TagStyleMap = {
  korean: styles.koreanLabel,
  math: styles.mathLabel,
  english: styles.englishLabel,
  history: styles.historyLabel,
  science: styles.scienceLabel,
  social: styles.socialLabel,
};

const TagLabel = ({
  tagNameKor,
  tagName,
}: {
  tagNameKor: string;
  tagName: string;
}) => {
  const tagStyle = tagStyles[tagName] || "";

  return (
    <div className={`${styles.labelContainer} ${tagStyle}`}>
      <span className={styles.labelText}>{tagNameKor}</span>
    </div>
  );
};

export default TagLabel;
