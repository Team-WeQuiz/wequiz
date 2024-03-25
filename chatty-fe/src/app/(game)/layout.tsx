import React from 'react';
import AuthCheck from './_components/AuthCheck';

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthCheck>{children}</AuthCheck>;
}
