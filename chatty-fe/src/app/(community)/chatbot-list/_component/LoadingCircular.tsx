import * as styles from './style/loadingcircular.css';
import Progress from '@/public/images/progress.svg';

const LoadingCircular = ({ color }: { color?: string }) => {
  return (
    <div className={styles.loadingCircular}>
      <Progress color={color} />
    </div>
  );
};

export default LoadingCircular;
