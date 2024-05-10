import * as styles from './PercentageCircle.css';

export default function PercentageCircle({
  percentage,
}: {
  percentage: number;
}) {
  const size = 200;
  const calcDeg = (percentage: number) => {
    return Number((360 * percentage) / 100);
  };
  const selectColor = (percentage: number) => {
    if (percentage <= 30) {
      return '#FF0C0C';
    } else if (percentage <= 60) {
      return '#77F359';
    } else {
      return '#51A8FF';
    }
  };

  return (
    <div
      style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}
    >
      <div
        className={styles.CircleBase}
        style={{
          background: `conic-gradient(${selectColor(percentage)} 0deg ${calcDeg(percentage)}deg, white ${calcDeg(percentage)}deg ${360}deg)`,
        }}
      >
        <div className={styles.CircleFill} />
        <span
          className={styles.Percentage}
          style={{
            color: `${selectColor(percentage)}`,
          }}
        >
          정답률
          <br />
          {percentage}%
        </span>
      </div>
    </div>
  );
}
