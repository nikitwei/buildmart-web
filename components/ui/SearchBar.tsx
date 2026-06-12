"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setQuery, addRecentSearch, fetchSearchResults } from "@/redux/slices/search-slice";

export default function SearchBar() {
  const [focused, setFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  const dispatch = useAppDispatch();
  const { recentSearches } = useAppSelector((s) => s.search);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = localQuery.trim();
    if (!q) return;
    dispatch(setQuery(q));
    dispatch(addRecentSearch(q));
    dispatch(fetchSearchResults({ query: q, sortBy: "relevance", page: 1, pageSize: 12 }));
    router.push(`/search?q=${encodeURIComponent(q)}`);
    inputRef.current?.blur();
    setFocused(false);
  }

  function handleRecentClick(q: string) {
    setLocalQuery(q);
    dispatch(setQuery(q));
    dispatch(addRecentSearch(q));
    dispatch(fetchSearchResults({ query: q, sortBy: "relevance", page: 1, pageSize: 12 }));
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setFocused(false);
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-2xl">
      <form onSubmit={handleSubmit} className="flex">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search products, brands..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-border rounded-l-lg focus:outline-none focus:border-primary text-sm bg-bg-card"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-r-lg hover:bg-primary-hover transition-colors"
        >
          Search
        </button>
      </form>

      {focused && recentSearches.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-bg-card border border-border rounded-lg shadow-modal z-50 py-2">
          <p className="px-4 py-1 text-xs font-semibold text-text-secondary uppercase tracking-wide">
            Recent Searches
          </p>
          {recentSearches.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleRecentClick(q)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-primary-light flex items-center gap-2 transition-colors"
            >
              <Search className="h-3.5 w-3.5 text-text-secondary flex-shrink-0" />
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
