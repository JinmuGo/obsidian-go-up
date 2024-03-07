import { goPageType } from "./types/goPage";
import checkAlias from "./utils/checkAlias";
import getPageName from "./utils/getPageName";
import getPageNameInAlias from "./utils/getPageNameInAlias";

const goSinglePage = (upPage: string, goPage: goPageType) => {
	let upPageName = getPageName(upPage);

	if (upPageName === null) {
		return;
	}
	if (checkAlias(upPageName)) {
		upPageName = getPageNameInAlias(upPageName);
	}
	goPage(upPageName, "", false);
};

export default goSinglePage;
