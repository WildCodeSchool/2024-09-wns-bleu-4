import FileCard from '@/components/File/FileCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Contact } from '@/generated/graphql-types';
import { LucideIcon, Plus } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type Resource = {
    id: number;
    name: string;
    description: string;
    path: string;
    url: string;
    user?: {
        id: number;
        email: string;
    };
};

interface FileSectionProps {
    title: string;
    icon: LucideIcon;
    files: Resource[];
    emptyTitle: string;
    emptyDescription: string;
    isShared?: boolean;
    onFileDeleted?: () => void;
    myContacts?: Contact[];
    showUploadButton?: boolean;
}

const FileSection: React.FC<FileSectionProps> = ({
    title,
    icon: Icon,
    files,
    emptyTitle,
    emptyDescription,
    isShared = false,
    onFileDeleted,
    myContacts,
    showUploadButton = false,
}) => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {title}
                    <Badge variant="secondary">{files.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {files.length === 0 ? (
                    <div className="text-center py-8">
                        <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">
                            {emptyTitle}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                            {emptyDescription}
                        </p>
                        {showUploadButton && (
                            <Button asChild size="sm">
                                <Link to="/upload">
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('files.actions.addFiles')}
                                </Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {files.map((file: Resource) => (
                            <FileCard
                                key={file.id}
                                id={file.id}
                                name={file.name}
                                url={file.url}
                                description={file.description}
                                isShared={isShared}
                                owner={file.user}
                                onFileDeleted={onFileDeleted}
                                myContacts={myContacts}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default FileSection;
