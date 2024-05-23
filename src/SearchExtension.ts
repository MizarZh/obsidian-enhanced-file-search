import { search } from "@codemirror/search";
// import { SearchPanel, searchExtensions } from "./panel";
// import { EditorView } from "@codemirror/view";

// export default (top: boolean) => [
// 	search({
// 		top,
// 		createPanel: (view: EditorView) => {
// 			return new SearchPanel(view);
// 		},
// 	}),
// 	// ...searchExtensions,
// ];

export default (top: boolean) => {
	return search({ top });
};
