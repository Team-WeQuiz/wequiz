'use client';

import { useState, useEffect } from 'react';
import UserCard from '../UserCard/UserCard';
import * as styles from './UserList.css';
import { UserStatus } from '@/app/_types/UserStatus';

const UserList = ({ userList }: { userList: UserStatus[] }) => {
  const [updatedUserList, setUpdatedUserList] =
    useState<UserStatus[]>(userList);

  useEffect(() => {
    console.log('new userList:', userList);
    setUpdatedUserList(userList);
  }, [userList]);

  return (
    <div className={styles.mainContainer}>
      {updatedUserList &&
        updatedUserList.map(
          (user) =>
            user.userId && (
              <UserCard
                key={user.userId}
                userId={user.userId}
                message={user.message}
              />
            ),
        )}
    </div>
  );
};

export default UserList;
