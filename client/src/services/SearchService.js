const SearchService = {
    filterItems(searchQuery, items, filterBy) {
        const filteredItems = items.filter((item) => {
            if (filterBy === "id") {
                return item.id.toString().includes(searchQuery);
            } else if (filterBy === "title") {
                return item.title.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return false;
        });
        return filteredItems;
    }
};

export default SearchService;