import { App, MarkdownView, WorkspaceLeaf } from "obsidian";

/**
 * Finds an already-open markdown leaf showing the given page.
 *
 * Resolves the link target to a concrete TFile and matches on full path so
 * that two notes sharing a basename in different folders are not confused.
 * Falls back to basename matching only when the link cannot be resolved.
 */
const findOpenLeaf = (app: App, pageName: string): WorkspaceLeaf | null => {
	const target = app.metadataCache.getFirstLinkpathDest(pageName, "");
	const leaves = app.workspace.getLeavesOfType("markdown");

	for (const leaf of leaves) {
		const view = leaf.view as MarkdownView;
		const file = view.file;
		if (file === null || file === undefined) {
			continue;
		}
		if (target) {
			if (file.path === target.path) {
				return leaf;
			}
		} else if (file.basename === pageName) {
			return leaf;
		}
	}
	return null;
};

export default findOpenLeaf;
