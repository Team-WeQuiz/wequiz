import * as styles from './PercentageCircle.css';

export default function PercentageCircle({
  color,
  percentage,
}: {
  color: string;
  percentage: number;
}) {
  const size = 200;
  const calcDeg = (percentage: number) => {
    return Number((360 * percentage) / 100);
  };

  return (
    <div
      style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}
    >
      <div
        className={styles.CircleBase}
        style={{
          background: `conic-gradient(${color} 0deg ${calcDeg(percentage)}deg, white ${calcDeg(percentage)}deg ${360}deg)`,
        }}
      >
        <div className={styles.CircleFill} />
        <span
          className={styles.Percentage}
          style={{
            color: `${color}`,
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
