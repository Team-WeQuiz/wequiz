'use client';

import { useEffect, useRef } from 'react';
import { menuContainer, ulList } from './DropdownMenu.css';

const DropdownMenu = ({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('click', onClick);
    }
    return () => window.removeEventListener('click', onClick);
  }, [isOpen, menuRef]);

  return (
    <>
      <div ref={menuRef} className={menuContainer}>
        {isOpen && <ul className={ulList}>{children}</ul>}
      </div>
    </>
  );
};

export default DropdownMenu;
