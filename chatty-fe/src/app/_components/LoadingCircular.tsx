import * as styles from './LoadingCircular.css';
import Progress from '@/public/images/progress.svg';

const LoadingCircular = ({ color }: { color?: string }) => {
  return <Progress color={color} className={styles.loadingCircular} />;
};

export default LoadingCircular;
