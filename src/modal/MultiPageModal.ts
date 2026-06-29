import { App, SuggestModal } from "obsidian";
import { goPageType, NavigationMode } from "src/types/goPage";
import navigateToParent from "src/navigateToParent";

type pageType = string;

export class MultiPageModal extends SuggestModal<pageType> {
	upPages: pageType[];
	goPage: goPageType;
	mode: NavigationMode;

	constructor(
		app: App,
		goPage: goPageType,
		upPages: pageType[],
		mode: NavigationMode
	) {
		super(app);
		this.upPages = upPages;
		this.goPage = goPage;
		this.mode = mode;
	}

	getSuggestions(query: string): pageType[] {
		return this.upPages.filter((page) => {
			return page.toLowerCase().includes(query.toLowerCase());
		});
	}

	renderSuggestion(page: pageType, el: HTMLElement) {
		el.createDiv({ text: page ?? undefined });
	}

	onChooseSuggestion(page: pageType, _evt: MouseEvent | KeyboardEvent) {
		navigateToParent(this.app, this.goPage, page, this.mode);
	}
}
