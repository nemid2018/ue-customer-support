import {
  Tablet, UtensilsCrossed, ShoppingBag, DollarSign,
  Clock, Star, Megaphone, ChevronRight, Printer,
  Monitor, Rocket, Headphones,
} from "lucide-react";
import type { Category } from "@/data/troubleshootingData";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/uiTranslations";

const iconMap: Record<string, React.ElementType> = {
  Tablet, UtensilsCrossed, ShoppingBag, DollarSign,
  Clock, Star, Megaphone, Printer, Monitor, Rocket, Headphones,
};

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  const Icon = iconMap[category.icon] || ShoppingBag;
  const { language } = useLanguage();
  const articleWord = category.items.length !== 1 ? t("articles", language) : t("article", language);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card rounded-xl border border-border p-6 hover:border-primary/40 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground text-lg">{category.title}</h3>
            <p className="text-muted-foreground text-sm mt-1">{category.description}</p>
            <p className="text-muted-foreground text-xs mt-2">{category.items.length} {articleWord}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
      </div>
    </button>
  );
};

export default CategoryCard;
