import type { PaneType, OpenViewState } from "obsidian";

export type goPageType = (
	linktext: string,
	sourcePath: string,
	newLeaf?: PaneType | boolean,
	openViewState?: OpenViewState
) => Promise<void>;

export type propertiesType = {
	[key: string]: string[] | null;
};
