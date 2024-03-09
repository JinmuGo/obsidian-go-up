import { Plugin, Notice } from "obsidian";
import makeNotice from "./utils/makeNotice";
import goMultiPage from "./goMultiPage";
import goSinglePage from "./goSinglePage";
import goUpSettingTab from "./setting";

interface goUpSettings {
	parentProp: string;
}

const DEFAULT_SETTINGS: goUpSettings = {
	parentProp: "up",
};

export default class goUp extends Plugin {
	#goPage = this.app.workspace.openLinkText.bind(this.app.workspace);
	#activeNotice: Notice | null = null;
	#timeout = 3000;
	settings: goUpSettings;

	async onload() {
		await this.loadSettings();
		this.addCommand({
			id: "upper-page",
			name: "Go upper page",
			callback: this.goUp.bind(this),
		});

		this.addSettingTab(new goUpSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private switchActiveNotice(notice: Notice | null) {
		this.#activeNotice = notice;
	}

	private alertNoUpperPage() {
		if (this.#activeNotice) return;
		this.#activeNotice = makeNotice(
			`There is no upper page in "${this.settings.parentProp}" property`,
			this.#timeout
		);
		setTimeout(() => this.switchActiveNotice(null), this.#timeout);
	}

	private alertMustSettingParentProp() {
		if (this.#activeNotice) return;
		this.#activeNotice = makeNotice(
			"Please set your parent property in the settings",
			this.#timeout
		);
		setTimeout(() => this.switchActiveNotice(null), this.#timeout);
	}

	private async goUp() {
		if (
			this.settings.parentProp === "" ||
			this.settings.parentProp === null
		) {
			this.alertMustSettingParentProp();
			return;
		}
		const currentFile = this.app.workspace.getActiveFile();
		if (currentFile === null) return;
		const frontmatter =
			this.app.metadataCache.getFileCache(currentFile)?.frontmatter;
		const upProperty = frontmatter?.[this.settings.parentProp];

		if (upProperty === undefined) {
			this.alertNoUpperPage();
			return;
		}

		if (Array.isArray(upProperty)) {
			goMultiPage(upProperty, this.#goPage, this.app);
		} else {
			goSinglePage(upProperty, this.#goPage);
		}
	}
}
