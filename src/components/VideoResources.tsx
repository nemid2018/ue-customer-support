import { Play, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/data/uiTranslations";

const PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLxvcjzLfMrGKwO8PGOTTrYU3ZhconxOdt";

const VideoResources = () => {
  const { language } = useLanguage();

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
          <Play className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-lg text-card-foreground">{t("video.title", language)}</h3>
      </div>
      <p className="text-muted-foreground text-sm mb-4">
        {t("video.desc", language)}
      </p>
      <a
        href={PLAYLIST_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
      >
        {t("video.button", language)}
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
};

export default VideoResources;
