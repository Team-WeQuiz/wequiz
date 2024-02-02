import React from "react";
import Header from "@/app/_component/Header";
import * as styles from "./layout.css";

const ChatbotListLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <div className={styles.container}>{children}</div>
    </div>
  );
};

export default ChatbotListLayout;
