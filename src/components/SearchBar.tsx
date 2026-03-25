import { useState, useRef, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { searchArticles, type SearchResult } from "@/lib/fuzzySearch";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/uiTranslations";
import { getTranslatedContent } from "@/data/contentTranslations";
import { categories } from "@/data/troubleshootingData";
import type { Category } from "@/data/troubleshootingData";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSelectResult?: (categoryId: string, itemId: string) => void;
}

const SearchBar = ({ value, onChange, onSelectResult }: SearchBarProps) => {
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Build translated categories for search display
  const translatedCategories = useMemo(() => {
    const translations = getTranslatedContent(language);
    if (!translations) return categories;
    return categories.map((cat) => {
      const catT = translations[cat.id];
      if (!catT) return cat;
      return {
        ...cat,
        title: catT.title,
        description: catT.description,
        items: cat.items.map((item) => {
          const itemT = catT.items?.[item.id];
          if (!itemT) return item;
          return { ...item, title: itemT.title, description: itemT.description, steps: itemT.steps, proTip: itemT.proTip ?? item.proTip };
        }),
      };
    });
  }, [language]);

  // Search always uses English data for matching, but display translated titles
  const results = useMemo(() => searchArticles(value, 6), [value]);

  // Map results to translated versions for display
  const displayResults = useMemo(() => results.map((r) => {
    const cat = translatedCategories.find((c) => c.id === r.categoryId);
    const item = cat?.items.find((i) => i.id === r.item.id);
    return {
      ...r,
      categoryTitle: cat?.title ?? r.categoryTitle,
      item: item ?? r.item,
    };
  }), [results, translatedCategories]);

  const showDropdown = focused && value.trim().length > 0 && displayResults.length > 0;

  useEffect(() => {
    setActiveIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    onSelectResult?.(result.categoryId, result.item.id);
    onChange("");
    setFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, displayResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setFocused(false);
    }
  };

  const handleSearch = () => {
    if (results.length > 0) {
      handleSelect(results[0]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
      <input
        type="text"
        placeholder={t("search.placeholder", language)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && activeIndex < 0 && results.length > 0) {
            e.preventDefault();
            handleSearch();
          } else {
            handleKeyDown(e);
          }
        }}
        className="w-full pl-12 pr-14 py-3.5 bg-card rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-base"
      />
      {value.trim().length > 0 && (
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors z-10"
        >
          {t("search.button", language)}
        </button>
      )}

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          {displayResults.map((result, i) => (
            <button
              key={result.item.id}
              onMouseDown={() => handleSelect(results[i])}
              onMouseEnter={() => setActiveIndex(i)}
              className={`w-full text-left px-4 py-3 flex flex-col gap-0.5 transition-colors ${
                i === activeIndex ? "bg-primary/10" : "hover:bg-muted/50"
              } ${i > 0 ? "border-t border-border/50" : ""}`}
            >
              <span className="text-sm font-medium text-foreground leading-snug">
                {result.item.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {result.categoryTitle}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
