const checkAlias = (alias: string) => {
	if (alias.contains("|")) {
		return true;
	} else {
		return false;
	}
};

export default checkAlias;
