import React from 'react';
import AuthCheck from './_components/AuthCheck';
import Header from '../_components/Header';
import { mainContainer } from './layout.css';

export default function GameLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className={mainContainer}>
        <AuthCheck>
          {children}
          {modal}
        </AuthCheck>
      </div>
    </>
  );
}
