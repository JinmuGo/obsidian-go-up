import { Plugin, Notice } from "obsidian";
import { loadFront } from "yaml-front-matter";
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
		const fileContent: string = await this.app.vault.read(currentFile);
		const pageObj = loadFront(fileContent);
		if (pageObj.up === undefined) {
			this.alertNoUpperPage();
			return;
		}

		Array.isArray(pageObj.up)
			? goMultiPage(pageObj.up, this.#goPage, this.app)
			: goSinglePage(pageObj.up, this.#goPage);
	}
}
