import { App, Editor, MarkdownView, Modal, Notice, Plugin } from "obsidian";
import searchEditorExtension from "./SearchExtension";
import { openSearchPanel } from "@codemirror/search";
import {
	EnhancedFileSearchSettings,
	DEFAULT_SETTINGS,
	EnhancedFileSearchSettingsTab,
} from "./settings";
import { Extension } from "@codemirror/state";

// Remember to rename these classes and interfaces!

export default class EnhancedFileSearchPlugin extends Plugin {
	private editorExtension: Extension[] = [];
	settings: EnhancedFileSearchSettings;

	async onload() {
		await this.loadSettings();

		this.updateEditorExtension();
		this.registerEditorExtension(this.editorExtension);

		this.addSettingTab(new EnhancedFileSearchSettingsTab(this.app, this));

		this.addCommand({
			id: "enhanced-file-search",
			name: "Enhanced file search",
			editorCallback(editor, view) {
				// @ts-expect-error, not typed
				const editorView = view.editor.cm as EditorView;
				openSearchPanel(editorView);
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

	createEditorExtension() {
		return searchEditorExtension(this.settings.top);
	}

	updateEditorExtension() {
		this.editorExtension.length = 0;
		const newExtension = this.createEditorExtension();
		this.editorExtension.push(newExtension);
		this.app.workspace.updateOptions();
	}
}
