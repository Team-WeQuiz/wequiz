'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import initMockAPI from './_mocks';

if (
	process.env.NODE_ENV === 'development' &&
	process.env.NEXT_PUBLIC_API_MOCKING === 'enable'
) {
	initMockAPI();
}

export default function Home() {
	const navigate = useRouter();
	useEffect(() => {
		navigate.push('/main');
	}, []);
	return <div></div>;
}
