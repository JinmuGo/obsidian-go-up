const getProperty = (fileContent: string, target: string): string | null => {
	return (
		fileContent
			?.split("\n")
			.find((line) => line.startsWith(target))
			?.split(":")[1]
			.trim()
			.match(/\[\[(.*?)\]\]/)?.[1] ?? null
	);
};

export default getProperty;
