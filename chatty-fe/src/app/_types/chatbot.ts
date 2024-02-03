export type ChatbotTags = {
  tagList: string[];
  tagListKor: string[];
};

export type ChatbotData = {
  id: number;
  chatbotName: string;
  tags: ChatbotTags;
  isLoading: boolean;
  link: string;
};
