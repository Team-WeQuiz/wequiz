import Image from 'next/image';
import * as styles from './ProfileEditor.css';

const ProfileEditor = ({ profile }: { profile: string }) => {
  return (
    <div className={styles.profileWrapper}>
      <Image
        src={profile ? profile : '/images/Empty_profile.svg'}
        alt="user_profile"
        width={120}
        height={120}
      />
      <button className={styles.editButton}>
        <Image
          src="/images/edit_photo.svg"
          alt="camera_icon"
          width={28}
          height={28}
        />
      </button>
    </div>
  );
};

export default ProfileEditor;
