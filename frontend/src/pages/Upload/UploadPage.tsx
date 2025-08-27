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
            {isAuth ? (
                <section className="">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                            {t('upload.title')}
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Upload a file to share it with your contacts
                        </p>
                    </div>

                    <FileUploader acceptedFileTypes={acceptedFileTypes} />
                </section>
            ) : (
                <section>
                    <h1 className="text-2xl font-bold my-8">
                        {t('upload.title')}
                    </h1>
                    <BlockedFileUploader />
                </section>
            )}

            {/* Temporary Link Generator */}
            <section>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
                        Generate a temporary link
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Upload a file to generate a temporary link that expires in 24 hours
                    </p>
                </div>
                <TempLinkGenerator />
            </section>
        </div>
    );
};

export default UploadPage;
