import { App, PluginSettingTab, Setting } from "obsidian";
import goUp from "./main";

class goUpSettingTab extends PluginSettingTab {
	plugin: goUp;

	constructor(app: App, plugin: goUp) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Parent property")
			.setDesc("Setting your own parent property")
			.addText((text) =>
				text
					.setPlaceholder("Enter your property")
					.setValue(this.plugin.settings.parentProp)
					.onChange(async (value) => {
						this.plugin.settings.parentProp = value;
						await this.plugin.saveSettings();
						this.applySettings();
					})
			);

		new Setting(containerEl)
			.setName("Add parent property on file creation")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.addUpPropertyOnCreate)
					.onChange(async (value) => {
						this.plugin.settings.addUpPropertyOnCreate = value;
						await this.plugin.saveSettings();
						this.applySettings();
					});
			});
	}

	private applySettings() {
		this.plugin.loadSettings();
		this.plugin.registerCreateFileEvent();
	}
}

export default goUpSettingTab;
