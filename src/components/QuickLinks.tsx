import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/uiTranslations";

const QuickLinks = () => {
  const { language } = useLanguage();

  const links = [
    { label: t("quickLinks.uem", language), url: "https://merchants.ubereats.com", desc: t("quickLinks.uemDesc", language) },
    { label: t("quickLinks.help", language), url: "https://help.uber.com/restaurants", desc: t("quickLinks.helpDesc", language) },
    { label: t("quickLinks.calc", language), url: "https://ubereatscalculator.com", desc: t("quickLinks.calcDesc", language) },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-semibold text-lg text-card-foreground mb-4">{t("quickLinks.title", language)}</h3>
      <div className="space-y-3">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
          >
            <div>
              <p className="text-sm font-medium text-card-foreground">{link.label}</p>
              <p className="text-xs text-muted-foreground">{link.desc}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
