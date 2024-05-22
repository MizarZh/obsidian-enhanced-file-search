import { search } from "@codemirror/search";
// import { SearchPanel, searchExtensions } from "./panel";
// import { EditorView } from "@codemirror/view";

// export default [
// 	search({
// 		top: true,
// 		// createPanel: (view: EditorView) => {
// 		// 	return new SearchPanel(view);
// 		// },
// 	}),
// 	// ...searchExtensions,
// ];

export default (top: boolean) => {
	return search({ top });
};
