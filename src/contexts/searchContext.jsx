import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';

const SearchContext = React.createContext(null);
SearchContext.displayName = "SearchContext";

const SearchProvider = ({ children }) => {
    const [searchText, setSearchText] = useState(""); // Use empty string instead of a space
    const [selectedTags, setSelectedTags] = useState([]);

    return (  
        <SearchContext.Provider
            value={{
                searchText,
                setSearchText,
                selectedTags,
                setSelectedTags
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

SearchProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Custom hook to use context with a safety check
const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearchContext must be used within a SearchProvider");
    }
    return context;
};

export { SearchProvider, useSearchContext };
