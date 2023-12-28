const getPageName = (property: string | null): string | null => {
	return property?.trim().match(/\[\[(.*?)\]\]/)?.[1] ?? null;
};

export default getPageName;
