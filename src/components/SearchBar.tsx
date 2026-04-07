import type {SearchBarProps} from '../data/types.ts';

const SearchBar = ({ search, setSearch }: SearchBarProps) => {
    return (
        <input
            type="text"
            placeholder="Search by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
    );
};

export default SearchBar;