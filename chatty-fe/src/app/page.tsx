'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import initMockAPI from './_mocks';
if (process.env.NODE_ENV === 'development') {
	initMockAPI();
}

export default function Home() {
	const navigate = useRouter();
	useEffect(() => {
		navigate.push('/main');
	}, []);
	return <div></div>;
}
