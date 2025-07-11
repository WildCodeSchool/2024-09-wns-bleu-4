import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Search, User, Download, Trash2 } from 'lucide-react';
import { GET_ALL_RESOURCES } from '@/graphql/Resource/queries';

interface Resource {
    id: number;
    name: string;
    description: string;
    path: string;
    url: string;
    user?: {
        id: number;
        email: string;
    };
}

const FileManagement: React.FC = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    
    const { data, loading, error } = useQuery(GET_ALL_RESOURCES);

    // Filtrer les fichiers selon le terme de recherche
    const filteredFiles = data?.getAllResources?.filter((file: Resource) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-gray-600">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center text-red-600">
                    <p>{t('common.error')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-center mb-4">
                    {t('admin.files.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                    {t('admin.files.description')}
                </p>
            </div>

            {/* Barre de recherche */}
            <div className="mb-6">
                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder={t('admin.files.search.placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{t('admin.files.stats.total')}</p>
                                <p className="text-2xl font-bold">{data?.getAllResources?.length || 0}</p>
                            </div>
                            <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{t('admin.files.stats.users')}</p>
                                <p className="text-2xl font-bold">
                                    {new Set(data?.getAllResources?.map((file: Resource) => file.user?.email).filter(Boolean)).size || 0}
                                </p>
                            </div>
                            <User className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{t('admin.files.stats.size')}</p>
                                <p className="text-2xl font-bold">
                                    {data?.getAllResources?.length || 0} MB
                                </p>
                            </div>
                            <Download className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Liste des fichiers */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {t('admin.files.list.title')} ({filteredFiles.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredFiles.length === 0 ? (
                        <div className="text-center py-8">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                                {searchTerm ? t('admin.files.list.noResults') : t('admin.files.list.empty')}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFiles.map((file: Resource) => (
                                <div
                                    key={file.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{file.name}</p>
                                            <p className="text-sm text-gray-500">{file.description}</p>
                                            {file.user && (
                                                <p className="text-xs text-gray-400">
                                                    {t('admin.files.sharedBy')} {file.user.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">
                                            {file.path.split('.').pop()?.toUpperCase() || 'FILE'}
                                        </Badge>
                                        <Button variant="outline" size="sm">
                                            <Download className="h-4 w-4 mr-1" />
                                            {t('admin.files.actions.download')}
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            {t('admin.files.actions.delete')}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FileManagement; 