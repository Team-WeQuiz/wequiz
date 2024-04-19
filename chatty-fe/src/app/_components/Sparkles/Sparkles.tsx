'use client';

import Image from 'next/image';
import * as styles from './Sparkles.css';
import { useState, useEffect } from 'react';

type SparkleValue = {
  size: number;
  top: string;
  left: string;
  typeIndex: number;
  rotate: number;
};

const Sparkles = () => {
  const initialValues = {
    size: 10,
    top: '50%',
    left: '50%',
    typeIndex: 1,
    rotate: 0,
  };
  const [values, setValues] = useState<Array<SparkleValue>>([]);

  const generateRandomValue = () => {
    const distanceWidth = Math.random() * 400;
    const distanceHeight = Math.random() * 200;
    // 중심을 기준으로한 각도를 랜덤하게 생성
    const angle = Math.random() * 2 * Math.PI;
    const left = 650 + distanceWidth * Math.cos(angle);
    const top = 450 + distanceHeight * Math.sin(angle);
    const size = Math.floor(Math.random() * 25) + 1;
    const typeIndex = Math.floor(Math.random() * 4) + 1;
    const rotate = Math.floor(Math.random() * 360);

    const values: SparkleValue = {
      size,
      top: `${top}px`,
      left: `${left}px`,
      typeIndex,
      rotate,
    };
    return values;
  };

  useEffect(() => {
    // 초기에 중앙에 위치한 엘리먼트 생성
    const initialSparkles = Array.from({ length: 50 }, () => initialValues);
    setValues(initialSparkles);

    // 페이지 로드 후 0.2초 후에 각 엘리먼트를 랜덤한 위치로 이동
    setTimeout(() => {
      const randomPositions = Array.from({ length: 50 }, generateRandomValue);
      setValues(randomPositions);
    }, 200);
  }, []);

  return (
    <div className={styles.sparklesContainer}>
      <div className={styles.sparklesWrapper}>
        {values.map((value, index) => (
          <div
            key={index}
            className={`${styles.sparkles} ${value.rotate % 2 === 1 && styles.dropShadow}`}
            style={{
              top: `${value.top}`,
              left: `${value.left}`,
              width: `${value.size}px`,
              height: `${value.size}px`,
              transform: `rotate(${value.rotate}deg)`,
            }}
          >
            <Image
              alt="sparkle"
              src={`/images/sparkle_${value.typeIndex}.svg`}
              width={value.size}
              height={value.size}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sparkles;
