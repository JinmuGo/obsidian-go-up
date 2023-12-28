import { App, SuggestModal } from "obsidian";
import { goPageType } from "src/types/goPage";

type pageType = string;

export class MultiPageModal extends SuggestModal<pageType> {
	upPages: pageType[];
	goPage: goPageType;

	constructor(app: App, goPage: goPageType, upPages: pageType[]) {
		super(app);
		this.upPages = upPages;
		this.goPage = goPage;
	}

	// Returns all available suggestions.
	getSuggestions(query: string): pageType[] {
		return this.upPages.filter((page) => {
			return page.toLowerCase().includes(query.toLowerCase());
		});
	}

	// Renders each suggestion item.
	renderSuggestion(page: pageType, el: HTMLElement) {
		el.createEl("div", { text: page ?? undefined });
	}

	// Perform action on the selected suggestion.
	onChooseSuggestion(page: pageType, evt: MouseEvent | KeyboardEvent) {
		this.goPage(page, "", false);
	}
}
