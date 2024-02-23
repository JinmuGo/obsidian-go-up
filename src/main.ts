import { Plugin, Notice } from "obsidian";
import makeNotice from "./utils/makeNotice";
import goMultiPage from "./goMultiPage";
import goSinglePage from "./goSinglePage";

export default class goUp extends Plugin {
	#goPage = this.app.workspace.openLinkText.bind(this.app.workspace);
	#activeNotice: Notice | null = null;
	#timeout = 3000;

	onload() {
		this.addCommand({
			id: "upper-page",
			name: "Go upper page",
			callback: this.goUp.bind(this),
		});
	}

	private switchActiveNotice(notice: Notice | null) {
		this.#activeNotice = notice;
	}

	private alertNoUpperPage() {
		if (this.#activeNotice) return;
		this.#activeNotice = makeNotice(
			"There is no upper page",
			this.#timeout
		);
		setTimeout(() => this.switchActiveNotice(null), this.#timeout);
	}

	private async goUp() {
		const currentFile = this.app.workspace.getActiveFile();
		if (currentFile === null) return;
		const frontmatter =
			this.app.metadataCache.getFileCache(currentFile)?.frontmatter;

		if (frontmatter?.["up"] === undefined) {
			this.alertNoUpperPage();
			return;
		}
		Array.isArray(frontmatter["up"])
			? goMultiPage(frontmatter["up"], this.#goPage, this.app)
			: goSinglePage(frontmatter["up"], this.#goPage);
	}
}
