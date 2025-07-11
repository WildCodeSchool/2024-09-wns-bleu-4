import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Shield, Activity } from 'lucide-react';

const AdminPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-center mb-4">
                    {t('admin.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                    {t('admin.description')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Statistiques utilisateurs */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('admin.stats.totalUsers')}
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            {t('admin.stats.usersDescription')}
                        </p>
                    </CardContent>
                </Card>

                {/* Statistiques fichiers */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('admin.stats.totalFiles')}
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            {t('admin.stats.filesDescription')}
                        </p>
                    </CardContent>
                </Card>

                {/* Administrateurs */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('admin.stats.admins')}
                        </CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">
                            {t('admin.stats.adminsDescription')}
                        </p>
                    </CardContent>
                </Card>

                {/* Activité */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('admin.stats.activity')}
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            {t('admin.stats.activityDescription')}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gestion des utilisateurs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            {t('admin.users.title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('admin.users.description')}
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    {t('admin.users.viewAll')}
                                </Button>
                                <Button variant="outline" size="sm">
                                    {t('admin.users.manageRoles')}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Gestion des fichiers */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {t('admin.files.title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('admin.files.description')}
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    {t('admin.files.viewAll')}
                                </Button>
                                <Button variant="outline" size="sm">
                                    {t('admin.files.manageStorage')}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Section des actions rapides */}
            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('admin.quickActions.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <Users className="h-5 w-5" />
                                <span className="text-sm">{t('admin.quickActions.addUser')}</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <Shield className="h-5 w-5" />
                                <span className="text-sm">{t('admin.quickActions.manageRoles')}</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2">
                                <Activity className="h-5 w-5" />
                                <span className="text-sm">{t('admin.quickActions.viewLogs')}</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminPage; 