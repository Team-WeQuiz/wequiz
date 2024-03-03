import React from 'react';
import ChatbotCard from './_component/ChatbotCard';
import { ChatbotData } from '@/app/_types/chatbot';
import * as styles from './page.css';

const chatbotData: ChatbotData[] = [
  {
    id: 1,
    chatbotName: '챗봇1',
    tags: {
      tagListKor: ['영어', '내신'],
      tagList: ['english', 'naesin'],
    },
    isLoading: false,
    link: '',
  },
  {
    id: 2,
    chatbotName: '챗봇2',
    tags: {
      tagListKor: ['수학', '수능'],
      tagList: ['math', 'sooneung'],
    },
    isLoading: false,
    link: '',
  },
  {
    id: 3,
    chatbotName: '챗봇3',
    tags: {
      tagListKor: ['영어', '수능'],
      tagList: ['english', 'sooneung'],
    },
    isLoading: false,
    link: '',
  },
  {
    id: 4,
    chatbotName: '챗봇4',
    tags: {
      tagListKor: ['수학', '내신'],
      tagList: ['math', 'naesin'],
    },
    isLoading: true,
    link: '',
  },
  {
    id: 5,
    chatbotName: '챗봇5',
    tags: {
      tagListKor: ['영어', '내신'],
      tagList: ['english', 'naesin'],
    },
    isLoading: false,
    link: '',
  },
  {
    id: 6,
    chatbotName: '챗봇6',
    tags: {
      tagListKor: ['수학', '수능'],
      tagList: ['math', 'sooneung'],
    },
    isLoading: false,
    link: '',
  },
  {
    id: 7,
    chatbotName: '챗봇7',
    tags: {
      tagListKor: ['영어', '수능'],
      tagList: ['english', 'sooneung'],
    },
    isLoading: false,
    link: '',
  },
];

const ChatbotList = () => {
  return (
    <>
      <div className={styles.gridContainer}>
        {chatbotData.map((chatbot, i) => (
          <ChatbotCard
            key={i}
            id={chatbot.id}
            isLoading={chatbot.isLoading}
            title={chatbot.chatbotName}
            tags={chatbot.tags}
            link={chatbot.link}
          />
        ))}
      </div>
    </>
  );
};

export default ChatbotList;
