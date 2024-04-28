'use client';

import { useState, useEffect } from 'react';
import GameCard from '../GameCard/GameCard';
import Paginator from '../Paginator/Paginator';
import * as styles from './GameListGrid.css';
import stompClient from '@/app/(game)/_utils/stomp';
import useAuthStore from '@/app/_store/useAuthStore';
import { StompSubscription } from '@stomp/stompjs';

export type RoomInfo = {
  roomId: number;
  name: string;
  description: string;
  currentPlayers: number;
  maxPlayers: number;
};

const DATA_LENGTH = 10;

const GameListGrid = () => {
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageData, setPageData] = useState<RoomInfo[]>([]);
  const { accessToken } = useAuthStore();
  const [subscription, setSubscription] = useState<StompSubscription | null>(
    null,
  );

  const handlePagePrev = () => {
    if (pageNum > 1) {
      setPageNum(pageNum - 1);
    }
  };

  const handlePageNext = () => {
    setPageNum(pageNum + 1);
  };

  const subscribePage = (pageNumber: number) => {
    if (!stompClient.connected) return;
    const sub = stompClient.subscribe(
      `/sub/rooms?page=${pageNumber}`,
      (message) => {
        const pageData = JSON.parse(message.body);
        if (pageNumber !== pageData.currentPage) {
          console.error('Page number mismatch');
          return;
        }
        setTotalPages(pageData.totalPages);
        setPageData(pageData.rooms);
      },
    );
    setSubscription(sub);
  };

  const getPage = (pageNumber: number) => {
    if (!stompClient.connected) return;
    stompClient.publish({
      destination: `/pub/rooms?page=${pageNumber}`,
    });
  };

  useEffect(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
    subscribePage(pageNum);
    getPage(pageNum);
  }, [pageNum]);

  useEffect(() => {
    stompClient.beforeConnect = () => {
      console.log('Connecting to WebSocket');
      stompClient.configure({
        connectHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    };

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      subscribePage(pageNum);
      getPage(pageNum);
    };

    if (accessToken) stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [accessToken]);

  return (
    <>
      <div className={styles.gameListContainer}>
        <div className={styles.gameListGrid}>
          {pageData &&
            pageData
              .map((room, index) => (
                <GameCard
                  key={index}
                  roomId={room.roomId}
                  name={room.name}
                  description={room.description}
                  currentPlayers={room.currentPlayers}
                  maxPlayers={room.maxPlayers}
                />
              ))
              .concat(
                Array.from({ length: DATA_LENGTH - pageData.length }).map(
                  (_, index) => (
                    <div
                      key={index + pageData.length}
                      className={styles.emptyCard}
                    />
                  ),
                ),
              )}
        </div>
        <div className={styles.paginatorWrapper}>
          <Paginator
            currentPage={pageNum}
            totalPages={totalPages}
            handlePagePrev={handlePagePrev}
            handlePageNext={handlePageNext}
          />
        </div>
      </div>
    </>
  );
};

export default GameListGrid;
