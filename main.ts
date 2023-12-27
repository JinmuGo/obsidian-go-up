import { Plugin, Notice } from "obsidian";

interface Properties {
	up?: string;
	[key: string]: string | undefined;
}

export default class MyCustomPlugin extends Plugin {
	onload() {
		this.addCommand({
			id: "goUp",
			name: "Go Up",
			callback: () => this.goUp(),
			hotkeys: [
				{
					modifiers: ["Meta", "Shift"],
					key: "u",
				},
			],
		});
	}

	async goUp() {
		const currentFile = this.app.workspace.getActiveFile();
		if (currentFile) {
			const fileContent = await this.app.vault.read(currentFile);
			const properties = this.parseProperties(fileContent);

			if (properties.up) {
				const targetPage = properties.up;
				this.app.workspace.openLinkText(targetPage, "", false);
			} else {
				this.displayNotification("There is No Upper Page");
			}
		}
	}

	private displayNotification(message: string, timeout = 3000) {
		new Notice(message, timeout);
	}

	private parseProperties(content: string): Properties {
		const properties: Properties = {};
		const lines = content.split("\n");
		for (const line of lines) {
			if (line.startsWith("up:")) {
				const [key, value] = line.split(":");
				const match = value.trim().match(/\[\[(.*?)\]\]/);
				if (match) properties[key.trim()] = match[1];
				return properties;
			}
		}
		return properties;
	}
}
