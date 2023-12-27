import { Notice } from "obsidian";

const makeNotice = (message: string, timeout: number): Notice | null => {
	return new Notice(message, timeout);
};

export default makeNotice;
