import { usePathname } from 'next/navigation';
import useBgmStore from '../_store/useBgmStore';

const useBgm = () => {
  const { setBgm } = useBgmStore();
  const url = usePathname();
  const quizUrl = ['/quiz-room'];
  const mainBgm = '/bgm/main.mp3';
  const quizBgm = '/bgm/quiz.mp3';
  const checkUrlAndChangeBgm = () => {
    if (quizUrl.includes(url)) {
      setBgm(quizBgm);
    } else {
      setBgm(mainBgm);
    }
  };
  return { checkUrlAndChangeBgm, url };
};

export default useBgm;
