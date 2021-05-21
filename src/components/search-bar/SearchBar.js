import "./SearchBar.css";

const SearchBar = ({ onSearch, updateSearchTerm }) => {
  return (
    <div className="SearchBar">
      <input
        placeholder="Enter A Song, Album, or Artist"
        onChange={(e) => updateSearchTerm(e.target.value)}
      />
      <button className="SearchButton" onClick={onSearch}>
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;
