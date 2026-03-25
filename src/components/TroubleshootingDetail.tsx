import { ArrowLeft, Lightbulb, ExternalLink, Play } from "lucide-react";
import type { Category } from "@/data/troubleshootingData";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/uiTranslations";

interface TroubleshootingDetailProps {
  category: Category;
  onBack: () => void;
  highlightedItemId?: string | null;
}

const TroubleshootingDetail = ({ category, onBack, highlightedItemId }: TroubleshootingDetailProps) => {
  const { language } = useLanguage();

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("detail.back", language)}
      </button>

      <h2 className="text-2xl font-bold text-foreground mb-2">{category.title}</h2>
      <p className="text-muted-foreground mb-8">{category.description}</p>

      <div className="space-y-6">
        {category.items.map((item) => (
          <div key={item.id} id={`item-${item.id}`} className={`bg-card rounded-xl border p-6 transition-all ${highlightedItemId === item.id ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
            <h3 className="font-semibold text-lg text-card-foreground mb-1">{item.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{item.description}</p>

            {item.videoUrl && (
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
              >
                <Play className="h-4 w-4" />
                {t("detail.watch", language)} {item.videoTitle || "Video tutorial"}
              </a>
            )}

            <ol className="space-y-3">
              {item.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-card-foreground leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>

            {item.proTip && (
              <div className="mt-4 flex items-start gap-3 bg-primary/5 border border-primary/10 rounded-lg p-4">
                <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-card-foreground">
                  <span className="font-semibold">{t("detail.proTip", language)}</span> {item.proTip}
                </p>
              </div>
            )}

            {item.sourceUrl && (
              <div className="mt-4 pt-3 border-t border-border">
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  {t("detail.officialArticle", language)}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TroubleshootingDetail;
