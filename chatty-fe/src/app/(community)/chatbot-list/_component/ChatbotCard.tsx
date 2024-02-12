'use client';
import ActionButton from './ActionButton';
import ContentCard from './ContentCard';
import * as styles from './style/chatbotcard.css';
import LoadingCircular from './LoadingCircular';
import TagLabel from './TagLabel';
import { ChatbotTags } from '@/app/_types/chatbot';
import { useRouter } from 'next/navigation';
import BotImage from '@/public/images/bot.svg';

type ChatbotCardProps = {
  isLoading: boolean;
  title: string;
  tags: ChatbotTags;
  link: string;
};

const ChabotTitle = ({ title, tags }: { title: string; tags: ChatbotTags }) => {
  return (
    <div className={styles.titleContainer}>
      <h5 className={styles.title}>{title}</h5>
      <div className={styles.tagContainer}>
        {tags &&
          tags.tagList &&
          tags.tagListKor &&
          tags.tagList.length === tags.tagListKor.length &&
          tags.tagList.map((tag, index) => (
            <TagLabel
              key={index}
              tagNameKor={tags.tagListKor[index]}
              tagName={tag}
            />
          ))}
      </div>
    </div>
  );
};

const ContentLoading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.circularContainer}>
        <LoadingCircular />
      </div>
      <span className={styles.loadingText}>챗봇이 생성되고 있어요</span>
    </div>
  );
};

const ChatbotCard = ({ isLoading, title, tags, link }: ChatbotCardProps) => {
  const navigate = useRouter();

  const handleChatbotClick = () => {
    navigate.push(link);
  };

  return (
    <ContentCard
      styleClassName={`${styles.card} ${
        isLoading
          ? styles.loadingCard
          : `${styles.activeCard} ${styles.activeCardShadow}`
      }`}
    >
      <ChabotTitle title={title} tags={tags} />
      {isLoading ? (
        <ContentLoading />
      ) : (
        <div>
          <div className={styles.cardContent}>
            <BotImage />
            <p className={styles.contentText}>챗봇을 사용해보세요!</p>
          </div>
          <div className={styles.buttonArea}>
            <ActionButton content="사용하기" onClick={handleChatbotClick} />
          </div>
        </div>
      )}
    </ContentCard>
  );
};

export default ChatbotCard;
