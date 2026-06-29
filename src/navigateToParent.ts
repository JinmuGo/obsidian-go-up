import { App, MarkdownView, WorkspaceLeaf } from "obsidian";
import { goPageType, NavigationMode } from "./types/goPage";
import findOpenLeaf from "./utils/findOpenLeaf";

/** Brings an already-open leaf to the foreground, uncollapsing a sidebar if needed. */
const focusLeaf = (app: App, leaf: WorkspaceLeaf) => {
	app.workspace.setActiveLeaf(leaf, { focus: true });
	void app.workspace.revealLeaf(leaf);
};

/**
 * "Keep current note open" behavior:
 * - parent already open somewhere -> just switch focus to it
 * - parent not open -> open it in a new tab next to the current note
 */
const goKeepOpen = (app: App, goPage: goPageType, pageName: string) => {
	const existing = findOpenLeaf(app, pageName);
	if (existing) {
		focusLeaf(app, existing);
		return;
	}
	void goPage(pageName, "", "tab");
};

/**
 * Navigates to a parent page according to the requested mode.
 *
 * "new-tab"  -> keep the current note open (focus existing parent, else new tab).
 * "replace"  -> close the current note:
 *   - if the current note is pinned, fall back to keep-open behavior;
 *   - if the parent is already open elsewhere, focus it and close the current note;
 *   - otherwise replace the current note in place.
 */
const navigateToParent = (
	app: App,
	goPage: goPageType,
	pageName: string,
	mode: NavigationMode
) => {
	if (mode === "new-tab") {
		goKeepOpen(app, goPage, pageName);
		return;
	}

	// mode === "replace"
	// Capture the current leaf up front: navigation moves focus, so reading the
	// "active" leaf afterwards would no longer point at the note we want to close.
	const currentLeaf =
		app.workspace.getActiveViewOfType(MarkdownView)?.leaf ?? null;
	const isPinned = currentLeaf?.getViewState().pinned === true;

	if (isPinned) {
		goKeepOpen(app, goPage, pageName);
		return;
	}

	const existing = findOpenLeaf(app, pageName);
	if (existing) {
		focusLeaf(app, existing);
		currentLeaf?.detach();
		return;
	}

	void goPage(pageName, "", false);
};

export default navigateToParent;
