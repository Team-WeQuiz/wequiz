import { create } from 'zustand';
import { UserStatus } from '@/app/_types/WaitingStatus';

type WaitingStore = {
  userStatuses: UserStatus[];
  updateUsers: (userStatuses: UserStatus[]) => void; // 접속 유저 업데이트 함수
  setMessage: (userId: number, message: string) => void; // 메시지 설정 함수
};

const useWaitingStore = create<WaitingStore>((set) => ({
  userStatuses: [],
  updateUsers: (userStatuses) => {
    set((state) => {
      const existingUserIds = state.userStatuses.map((user) => user.userId);
      const newUserStatuses = userStatuses.filter(
        (user) => user.userId && !existingUserIds.includes(user.userId),
      );
      // 새로운 유저만 추가
      let updatedUserStatuses = [...state.userStatuses, ...newUserStatuses];

      // 기존 유저 상태 업데이트, 없어진 유저 삭제
      updatedUserStatuses = updatedUserStatuses
        .map((user) => {
          const updatedUser = userStatuses.find(
            (newUser) => newUser.userId === user.userId,
          );
          if (updatedUser) {
            if (updatedUser.isReady !== user.isReady)
              return { ...user, isReady: updatedUser.isReady };
            return user;
          }
          return null;
        })
        .filter(Boolean) as UserStatus[];

      return { userStatuses: updatedUserStatuses };
    });
  },
  setMessage: (userId, message) => {
    set((state) => {
      const index = state.userStatuses.findIndex(
        (user) => user.userId === userId,
      );
      if (index !== -1) {
        const updatedUserStatuses = [...state.userStatuses];
        updatedUserStatuses[index].message = message;
        return { userStatuses: updatedUserStatuses };
      }
      return state;
    });
  },
}));

export default useWaitingStore;
