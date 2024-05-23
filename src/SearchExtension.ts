import { search } from "@codemirror/search";
import { SearchPanel } from "./panel";
import { EditorView } from "@codemirror/view";

export default (top: boolean) =>
	search({
		top,
		createPanel: (view: EditorView) => {
			return new SearchPanel(view, top);
		},
	});
