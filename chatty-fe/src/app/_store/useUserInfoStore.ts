import { create } from 'zustand';

type UserInfoState = {
  id: number | undefined;
  email: string;
  profileImage: string;
  loginType: string;
  isValid: boolean;
};

type UserInfoActions = {
  setUserInfo: (userInfo: UserInfoState) => void;
  deleteUserInfo: () => void;
};

const useUserInfoStore = create<UserInfoState & UserInfoActions>((set) => ({
  id: undefined,
  email: '',
  profileImage: '',
  loginType: '',
  isValid: false,
  setUserInfo: (userInfo: UserInfoState) => set(userInfo),
  deleteUserInfo: () =>
    set({
      id: undefined,
      email: '',
      profileImage: '',
      loginType: '',
      isValid: false,
    }),
}));

export default useUserInfoStore;
