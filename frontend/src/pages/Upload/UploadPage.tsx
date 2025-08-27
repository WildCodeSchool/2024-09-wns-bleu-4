import BlockedFileUploader from '@/components/FileUploader/BlockedFileUploader';
import FileUploader from '@/components/FileUploader/FileUploader';
import TempLinkGenerator from '@/components/FileUploader/TempLinkGenerator';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

const UploadPage = () => {
    const { t } = useTranslation();
    const { isAuth } = useAuth();

    const acceptedFileTypes = {
        'application/pdf': ['.pdf'],
        'image/*': ['.png', '.jpg', '.jpeg'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            ['.docx'],
        'audio/*': ['.mp3', '.wav'],
        'video/*': ['.mp4', '.mov'],
    };

    return (
        <div className="mx-auto grid grid-cols-2 gap-8 items-start">
            {/* Persistent Uploader */}
            <section className="col-span-2 md:col-span-1">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                        {t('upload.page.deposit.title')}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        {t('upload.page.deposit.description')}
                    </p>
                </div>
                {isAuth ? (
                    <FileUploader acceptedFileTypes={acceptedFileTypes} />
                ) : (
                    <BlockedFileUploader />
                )}
            </section>

            {/* Temporary Link Generator */}
            <section>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                        {t('upload.page.tempLink.title')}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        {t('upload.page.tempLink.description')}
                    </p>
                </div>
                <TempLinkGenerator />
            </section>
        </div>
    );
};

export default UploadPage;
