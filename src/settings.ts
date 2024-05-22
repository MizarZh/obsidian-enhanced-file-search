import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import EnhancedFileSearchPlugin from "./main";

export interface EnhancedFileSearchSettings {
	top: boolean;
}

export const DEFAULT_SETTINGS: EnhancedFileSearchSettings = {
	top: false,
};

export class EnhancedFileSearchSettingsTab extends PluginSettingTab {
	plugin: EnhancedFileSearchPlugin;
	constructor(app: App, plugin: EnhancedFileSearchPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		this.containerEl.empty();

		new Setting(this.containerEl)
			.setName("Change top")
			.setDesc("Change top")
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.top);
				cb.onChange(async (ev) => {
					this.plugin.settings.top = ev;
					await this.plugin.saveSettings();
					this.display();
					new Notice("Toggle visibility successfully!");
				});
			});
	}
}
