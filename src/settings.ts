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
			.setName("Set search hotkey")
			.addButton((cb) => {
				cb.setButtonText("Set hotkey").onClick(() => {
					// unoffical
					// @ts-ignore
					this.app.setting.openTabById("hotkeys");
					// @ts-ignore
					const tab = this.app.setting.activeTab;
					tab.headerComponent.components[1].inputEl.value = `Enhanced file search`;
					tab.updateHotkeyVisibility();
				});
			});

		new Setting(this.containerEl)
			.setName("Search bar at top")
			.setDesc("If the search bar is at the top of the editor")
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.top);
				cb.onChange(async (ev) => {
					this.plugin.settings.top = ev;
					await this.plugin.saveSettings();
					this.plugin.updateEditorExtension();
					this.display();
					new Notice("Toggle search bar position successfully!");
				});
			});
	}
}
