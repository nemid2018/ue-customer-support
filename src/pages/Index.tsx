import { useState, useMemo, useEffect } from "react";
import { Globe } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import TroubleshootingDetail from "@/components/TroubleshootingDetail";
import VideoResources from "@/components/VideoResources";
import QuickLinks from "@/components/QuickLinks";
import { categories } from "@/data/troubleshootingData";
import { useLanguage, languageLabels, type Language } from "@/contexts/LanguageContext";
import { t } from "@/data/uiTranslations";
import { getTranslatedContent } from "@/data/contentTranslations";
import type { Category } from "@/data/troubleshootingData";

const useTranslatedCategories = (language: Language): Category[] => {
  return useMemo(() => {
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
          return {
            ...item,
            title: itemT.title,
            description: itemT.description,
            steps: itemT.steps,
            proTip: itemT.proTip ?? item.proTip,
          };
        }),
      };
    });
  }, [language]);
};

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const translatedCategories = useTranslatedCategories(language);

  const handleSelectResult = (categoryId: string, itemId: string) => {
    setSelectedCategoryId(categoryId);
    setHighlightedItemId(itemId);
    setSearch("");
  };

  useEffect(() => {
    if (!highlightedItemId) return;
    const el = document.getElementById(`item-${highlightedItemId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightedItemId, selectedCategoryId]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return translatedCategories;
    const q = search.toLowerCase();
    return translatedCategories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.steps.some((s) => s.toLowerCase().includes(q))
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [search, translatedCategories]);

  const selectedCategory = selectedCategoryId
    ? translatedCategories.find((c) => c.id === selectedCategoryId) || null
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => { setSelectedCategoryId(null); setHighlightedItemId(null); setSearch(""); }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-xl font-bold text-foreground">{t("header.title", language)}</span>
            <span className="text-xl font-normal text-foreground">{t("header.subtitle", language)}</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-sm font-medium text-foreground"
            >
              <Globe className="h-4 w-4 text-muted-foreground" />
              {t("language.choose", language)}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 min-w-[140px]">
                {(Object.keys(languageLabels) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      lang === language ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {languageLabels[lang]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 pt-24">
        {!selectedCategory ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t("hero.title", language)}
              </h1>
              <p className="text-muted-foreground mb-6">
                {t("hero.subtitle", language)}
              </p>
              <SearchBar value={search} onChange={setSearch} onSelectResult={handleSelectResult} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              {filteredCategories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setSearch("");
                  }}
                />
              ))}
            </div>

            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t("search.noResults", language)}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <VideoResources />
              <QuickLinks />
            </div>
          </>
        ) : (
          <TroubleshootingDetail
            category={selectedCategory}
            onBack={() => { setSelectedCategoryId(null); setHighlightedItemId(null); }}
            highlightedItemId={highlightedItemId}
          />
        )}
      </main>

      <footer className="border-t border-border bg-card mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>© 2026 Uber Technologies Inc.</span>
          <a href="https://www.uber.com/legal/privacy/users/en/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="https://www.uber.com/legal/terms/us/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Terms</a>
          <a href="https://help.uber.com/restaurants" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Help</a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
