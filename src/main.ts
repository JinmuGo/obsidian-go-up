import { Plugin, Notice } from "obsidian";
import makeNotice from "./utils/makeNotice";
import getProperty from "./utils/getProperty";

export default class goUp extends Plugin {
	#activeNotice: Notice | null = null;
	#timeout = 3000;

	onload() {
		this.addCommand({
			id: "goUp",
			name: "Go Up",
			callback: this.goUp.bind(this),
			hotkeys: [
				{
					modifiers: ["Meta", "Shift"],
					key: "u",
				},
			],
		});
	}

	private switchActiveNotice(notice: Notice | null) {
		this.#activeNotice = notice;
	}

	private async goUp() {
		const currentFile = this.app.workspace.getActiveFile();
		if (currentFile === null) return;
		const fileContent: string = await this.app.vault.read(currentFile);
		const property = getProperty(fileContent, "up");

		if (property) {
			this.app.workspace.openLinkText(property, "", false);
		} else {
			if (this.#activeNotice) return;
			this.#activeNotice = makeNotice(
				"There is No Upper Page",
				this.#timeout
			);
			setTimeout(() => this.switchActiveNotice(null), this.#timeout);
		}
	}
}
