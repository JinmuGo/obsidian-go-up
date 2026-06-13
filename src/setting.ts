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
						await this.applySettings();
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
						await this.applySettings();
					});
			});

		new Setting(containerEl)
			.setName("Send anonymous usage data")
			.setDesc("Help improve the plugin by sending anonymous usage events. No personal data or note content is ever sent.")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.telemetryEnabled)
					.onChange(async (value) => {
						this.plugin.settings.telemetryEnabled = value;
						await this.plugin.saveSettings();
						this.plugin.telemetry.setEnabled(value);
						if (value) this.plugin.telemetry.track("plugin_enabled");
					});
			});
	}

	private async applySettings() {
		await this.plugin.loadSettings();
		this.plugin.registerCreateFileEvent();
	}
}

export default goUpSettingTab;
