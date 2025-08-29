import { UploadCloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function BlockedFileUploader() {
    const { t } = useTranslation();

    return (
        <div className="">
            {/* Disabled upload area */}
            <div className="relative rounded-2xl p-8 md:p-12 text-center bg-secondary/20 border border-primary/5 shadow-sm opacity-100 group">
                <div className="flex flex-col items-center gap-5">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-zinc-400/10 rounded-full blur-md" />
                        <UploadCloud className="w-16 h-16 md:w-20 md:h-20 text-zinc-400" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl md:text-2xl font-semibold text-zinc-400">
                            {t('upload.page.deposit.dropBox.title')}
                        </h3>
                        <p className="text-zinc-500 md:text-lg max-w-md mx-auto">
                            {t('upload.page.deposit.dropBox.supportedTypes')}
                        </p>
                        <p className="text-sm text-zinc-400">
                            {t('upload.page.deposit.dropBox.notice')}
                        </p>
                    </div>

                    {/* Disabled file input */}
                    <input
                        type="file"
                        hidden
                        disabled
                        className="hidden"
                    />
                </div>

                {/* Glass overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center p-6 max-w-sm">
                        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                            {t('upload.blocked.line1')}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                            {t('upload.blocked.line2')}
                        </p>
                        <Link
                            to="/sign"
                            className="rounded-lg px-4 py-2 text-md font-semibold backdrop-blur-md 
                            bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                            text-black dark:text-white transition-all duration-300 
                            group-hover:-translate-y-0.5 border border-black/30 dark:border-white/30
                            hover:shadow-md dark:hover:shadow-neutral-800/50"
                        >
                            {t('upload.blocked.button')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
