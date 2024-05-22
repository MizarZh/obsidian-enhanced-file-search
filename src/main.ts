import { App, Editor, MarkdownView, Modal, Notice, Plugin } from "obsidian";
import searchEditorExtension from "./SearchExtension";
import { openSearchPanel } from "@codemirror/search";
import {
	EnhancedFileSearchSettings,
	DEFAULT_SETTINGS,
	EnhancedFileSearchSettingsTab,
} from "./settings";

// Remember to rename these classes and interfaces!

export default class EnhancedFileSearchPlugin extends Plugin {
	settings: EnhancedFileSearchSettings;

	async onload() {
		await this.loadSettings();

		this.registerEditorExtension(searchEditorExtension);

		this.addSettingTab(new EnhancedFileSearchSettingsTab(this.app, this));

		this.addCommand({
			id: "open-sample-modal-simple",
			name: "ASDF",
			editorCallback(editor, view) {
				// @ts-expect-error, not typed
				const editorView = view.editor.cm as EditorView;
				openSearchPanel(editorView);
				document.querySelectorAll(".cm-textfield").forEach((elem) => {
					elem.removeClass("cm-textfield");
				});

				document.querySelectorAll(".cm-button").forEach((elem) => {
					elem.removeClass("cm-button");
				});
			},
		});
	}
	onunload() {}

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
}
