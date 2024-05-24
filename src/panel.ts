import elt from "crelt";
import {
	EditorView,
	ViewUpdate,
	runScopeHandlers,
	Panel,
} from "@codemirror/view";
import {
	SearchQuery,
	getSearchQuery,
	setSearchQuery,
	findNext,
	findPrevious,
	selectMatches,
	replaceNext,
	replaceAll,
	closeSearchPanel,
	SearchCursor,
} from "@codemirror/search";

// from https://github.com/codemirror/search/blob/main/src/search.ts
export class SearchPanel implements Panel {
	searchField: HTMLInputElement;
	replaceField: HTMLInputElement;
	caseField: HTMLInputElement;
	reField: HTMLInputElement;
	wordField: HTMLInputElement;
	wordCount: HTMLDivElement;
	dom: HTMLElement;
	query: SearchQuery;
	view: EditorView;
	top: boolean;

	constructor(view: EditorView, top: boolean) {
		this.top = top;
		this.view = view;

		const query = (this.query = getSearchQuery(view.state));
		this.commit = this.commit.bind(this);

		this.searchField = elt("input", {
			value: query.search,
			placeholder: phrase(view, "Find"),
			"aria-label": phrase(view, "Find"),
			class: "cm-textfield",
			name: "search",
			form: "",
			"main-field": "true",
			onchange: this.commit,
			onkeyup: this.commit,
		}) as HTMLInputElement;
		this.replaceField = elt("input", {
			value: query.replace,
			placeholder: phrase(view, "Replace"),
			"aria-label": phrase(view, "Replace"),
			class: "cm-textfield",
			name: "replace",
			form: "",
			onchange: this.commit,
			onkeyup: this.commit,
		}) as HTMLInputElement;
		this.caseField = elt("input", {
			type: "checkbox",
			name: "case",
			form: "",
			checked: query.caseSensitive,
			onchange: this.commit,
		}) as HTMLInputElement;
		this.reField = elt("input", {
			type: "checkbox",
			name: "re",
			form: "",
			checked: query.regexp,
			onchange: this.commit,
		}) as HTMLInputElement;
		this.wordField = elt("input", {
			type: "checkbox",
			name: "word",
			form: "",
			checked: query.wholeWord,
			onchange: this.commit,
		}) as HTMLInputElement;
		this.wordCount = elt("div", {
			class: "hits-display",
		}) as HTMLDivElement;

		function button(
			name: string,
			onclick: () => void,
			content: (Node | string)[]
		) {
			return elt(
				"button",
				{ class: "cm-button", name, onclick, type: "button" },
				content
			);
		}
		this.dom = elt(
			"div",
			{
				onkeydown: (e: KeyboardEvent) => this.keydown(e),
				class: "cm-search",
			},
			[
				this.searchField,
				button("next", () => findNext(view), [phrase(view, "next")]),
				button("prev", () => findPrevious(view), [
					phrase(view, "previous"),
				]),
				// button("select", () => selectMatches(view), [
				// 	phrase(view, "all"),
				// ]),
				elt("label", null, [
					this.caseField,
					phrase(view, "match case"),
				]),
				elt("label", null, [this.reField, phrase(view, "regexp")]),
				elt("label", null, [this.wordField, phrase(view, "by word")]),
				this.wordCount,
				...(view.state.readOnly
					? []
					: [
							elt("br"),
							this.replaceField,
							button("replace", () => replaceNext(view), [
								phrase(view, "replace"),
							]),
							button("replaceAll", () => replaceAll(view), [
								phrase(view, "replace all"),
							]),
					  ]),
				elt(
					"button",
					{
						name: "close",
						onclick: () => closeSearchPanel(view),
						"aria-label": phrase(view, "close"),
						type: "button",
					},
					["×"]
				),
			]
		);
	}

	commit() {
		const query = new SearchQuery({
			search: this.searchField.value,
			caseSensitive: this.caseField.checked,
			regexp: this.reField.checked,
			wholeWord: this.wordField.checked,
			replace: this.replaceField.value,
		});
		if (!query.eq(this.query)) {
			this.query = query;
			this.view.dispatch({ effects: setSearchQuery.of(query) });
			this.updateWordCount();
		}
	}

	keydown(e: KeyboardEvent) {
		if (runScopeHandlers(this.view, e, "search-panel")) {
			e.preventDefault();
		} else if (e.key == "Enter" && e.target == this.searchField) {
			e.preventDefault();
			(e.shiftKey ? findPrevious : findNext)(this.view);
		} else if (e.key == "Enter" && e.target == this.replaceField) {
			e.preventDefault();
			replaceNext(this.view);
		}
	}

	update(update: ViewUpdate) {
		for (const tr of update.transactions)
			for (const effect of tr.effects) {
				if (effect.is(setSearchQuery) && !effect.value.eq(this.query))
					this.setQuery(effect.value);
			}
		this.updateWordCount();
	}

	setQuery(query: SearchQuery) {
		this.query = query;
		this.searchField.value = query.search;
		this.replaceField.value = query.replace;
		this.caseField.checked = query.caseSensitive;
		this.reField.checked = query.regexp;
		this.wordField.checked = query.wholeWord;
	}

	mount() {
		this.searchField.select();
	}

	updateWordCount() {
		const cursor = this.query.getCursor(this.view.state) as SearchCursor;
		let matchesCount = 0,
			currentPos = -1;
		// @ts-ignore
		for (const selection of cursor) {
			if (
				currentPos === -1 &&
				this.view.state.selection.ranges &&
				this.view.state.selection.ranges[0].from === selection.from &&
				this.view.state.selection.ranges[0].to === selection.to
			) {
				currentPos = matchesCount;
			}
			matchesCount++;
		}
		this.wordCount.textContent = `Hits: ${
			currentPos === -1 ? "?" : currentPos + 1
		}/${matchesCount}`;
	}

	get pos() {
		return 80;
	}
}

function phrase(view: EditorView, phrase: string) {
	return view.state.phrase(phrase);
}
