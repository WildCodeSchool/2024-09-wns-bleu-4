import { getFileTypeInfo } from '@/utils/fileUtils';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PDF from './Icons/PDF';

interface FilePreviewProps {
    context: 'card' | 'dialog';
    fileName: string;
    fileUrl?: string;
    className?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({
    context,
    fileName,
    fileUrl,
    className = context === 'dialog' ? 'h-full flex-shrink-0' : 'h-20 w-20 flex-shrink-0',
}) => {
    const { t } = useTranslation();
    const fileTypeInfo = getFileTypeInfo(fileName);
    const IconComponent = fileTypeInfo.icon;
    const [imageError, setImageError] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [pdfError, setPdfError] = useState(false);

    if (fileTypeInfo.isImage && fileUrl && !imageError) {
        return (
            <div className={`${className} rounded overflow-hidden`}>
                <img
                    src={fileUrl}
                    alt={fileName}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                />
            </div>
        );
    }

    if (fileTypeInfo.isVideo && fileUrl && !videoError) {
        return (
            <div className={`${className} rounded`}>
                {context === 'card' && (
                    <video
                        src={fileUrl}
                        className="w-full h-full object-cover"
                        controls={false}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onError={() => setVideoError(true)}
                    />
                )}

                {context === 'dialog' && (
                    <video
                        src={fileUrl}
                        className="w-full h-full object-cover"
                        controls={true}
                        playsInline
                        preload="metadata"
                        onError={() => setVideoError(true)}
                    />
                )}
            </div>
        );
    }

    if (fileTypeInfo.isPdf && fileUrl && !pdfError) {
        return (
            <div className={`${className} h-full rounded bg-white`}>
                {context === 'card' ? (
                    <PDF className={`${className} ${fileTypeInfo.color}`} />
                ) : (
                    <object
                        data={fileUrl}
                        type="application/pdf"
                        className="w-full h-full"
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                        }}
                        onError={() => setPdfError(true)}
                    >
                        <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                            {t('fileCard.preview.pdf')}
                        </div>
                    </object>
                )}
            </div>
        );
    }

    return <IconComponent className={`${className} ${fileTypeInfo.color}`} />;
};

export default FilePreview;
