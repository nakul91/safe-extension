import { useMemo, useState } from "react";

export const useSearch = <T,>(arr: Array<T>, field: keyof T | Array<keyof T>) => {
    const [search, setSearch] = useState("");

    const searchResult = useMemo(() => {
        if (!search) return arr;
        const compare = (val: T, field: keyof T) =>
            String(val[field]).toLowerCase().includes(search.toLowerCase());
        const filteredArray = arr.filter((val) =>
            Array.isArray(field)
                ? field.some((item) => compare(val, item))
                : compare(val, field),
        );
        const sortedMatches = filteredArray.sort((a, b) => {
            const aStartsWithSearch = String((a as { name: string }).name)
                ?.toLowerCase()
                .startsWith(search.toLowerCase());
            const bStartsWithSearch = String(a as { name: string })
                ?.toLowerCase()
                .startsWith(search.toLowerCase());

            return (aStartsWithSearch ? -1 : 0) - (bStartsWithSearch ? -1 : 0);
        });
        return sortedMatches;
    }, [arr, search]);

    const isNotFound = useMemo(() => {
        return searchResult.length === 0 && Boolean(search);
    }, [searchResult, search]);

    const isEmpty = useMemo(() => {
        return searchResult.length === 0 && !search;
    }, [searchResult, search]);

    return { search, setSearch, searchResult, isNotFound, isEmpty };
};
