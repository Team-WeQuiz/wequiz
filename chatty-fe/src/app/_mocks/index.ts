const initMockAPI = async (): Promise<void> => {
	if (typeof window !== 'undefined') {
		const { worker } = await import('./brower');
		worker.start();
	}
};

export default initMockAPI;
