import { Plugin, Notice, TFile, EventRef } from "obsidian";
import makeNotice from "./utils/makeNotice";
import goMultiPage from "./goMultiPage";
import goSinglePage from "./goSinglePage";
import goUpSettingTab from "./setting";
import { propertiesType } from "./types/goPage";
import { Telemetry } from "./telemetry";

interface goUpSettings {
	parentProp: string;
	addUpPropertyOnCreate: boolean;
	telemetryEnabled: boolean;
}

const DEFAULT_SETTINGS: goUpSettings = {
	parentProp: "up",
	addUpPropertyOnCreate: true,
	telemetryEnabled: false,
};

export default class goUp extends Plugin {
	#goPage = this.app.workspace.openLinkText.bind(this.app.workspace);
	#activeNotice: Notice | null = null;
	#timeout = 3000;
	settings: goUpSettings;
	createFileEvent: EventRef | null = null;
	telemetry: Telemetry = new Telemetry("go-up", (process.env.PLUGIN_VERSION as string) || "0.0.0");

	async onload() {
		await this.loadSettings();
		this.telemetry.setEnabled(this.settings.telemetryEnabled);

		this.addCommand({
			id: "upper-page",
			name: "Navigate to parent page",
			callback: this.goUp.bind(this),
		});

		this.addSettingTab(new goUpSettingTab(this.app, this));

		this.app.workspace.onLayoutReady(() => {
			this.registerCreateFileEvent();
		});

		this.telemetry.track("plugin_enabled");
	}

	onunload() {
		this.telemetry.shutdown();
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

	insertProperties(currentFile: TFile, properties: propertiesType) {
		void this.app.fileManager.processFrontMatter(currentFile, (frontmatter) => {
			Object.entries(properties).forEach(([property, val]) => {
				frontmatter[property] = val;
			});
		});
	}

	registerCreateFileEvent() {
		this.unregisterCreateFileEvent();

		if (this.settings.addUpPropertyOnCreate) {
			this.createFileEvent = this.app.vault.on(
				"create",
				(file: TFile) => {
					const properties: propertiesType = {};
					const parentPropValue = `[[${file.parent?.name ?? ""}]]`;
					properties[this.settings.parentProp] = [parentPropValue];

					this.insertProperties(file, properties);
				}
			);
			this.registerEvent(this.createFileEvent);
		}
	}

	private unregisterCreateFileEvent() {
		if (this.createFileEvent) {
			this.app.vault.offref(this.createFileEvent);
			this.createFileEvent = null;
		}
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
		window.setTimeout(() => this.switchActiveNotice(null), this.#timeout);
	}

	private alertMustSettingParentProp() {
		if (this.#activeNotice) return;
		this.#activeNotice = makeNotice(
			"Please set your parent property in the settings",
			this.#timeout
		);
		window.setTimeout(() => this.switchActiveNotice(null), this.#timeout);
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
			this.telemetry.track("upper_page_invoked", { mode: "multi" });
			goMultiPage(upProperty, this.#goPage, this.app);
		} else {
			this.telemetry.track("upper_page_invoked", { mode: "single" });
			goSinglePage(upProperty, this.#goPage);
		}
	}
}
