import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Shield, Activity } from 'lucide-react';
import { GET_USER_STATS } from '@/graphql/User/queries';
import { GET_RESOURCE_STATS } from '@/graphql/Resource/queries';
import { GET_SYSTEM_LOGS } from '@/graphql/SystemLog/queries';

const AdminPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    // Requêtes pour les statistiques
    const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_STATS);
    const { data: resourceData, loading: resourceLoading, error: resourceError } = useQuery(GET_RESOURCE_STATS);
    const { data: logsData, loading: logsLoading, error: logsError } = useQuery(GET_SYSTEM_LOGS, {
        variables: { limit: 10.0, offset: 0.0 }
    });

    // Fonction pour formater la date relative
    const formatRelativeTime = (date: string) => {
        console.log('Date reçue:', date, typeof date);
        const now = new Date();
        
        // Traiter comme un timestamp (millisecondes depuis l'époque Unix)
        const timestamp = parseInt(date);
        if (isNaN(timestamp)) {
            console.log('Timestamp invalide:', date);
            return 'Date inconnue';
        }
        
        const logDate = new Date(timestamp);
        
        // Vérifier si la date est valide
        if (isNaN(logDate.getTime())) {
            console.log('Date invalide après conversion:', date);
            return 'Date inconnue';
        }
        
        const diffInMinutes = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'À l\'instant';
        if (diffInMinutes < 60) return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    };

    // Calcul des statistiques
    const totalUsers = userData?.getAllUsers?.length || 0;
    const totalAdmins = userData?.getAllUsers?.filter((user: any) => user.role === 'ADMIN')?.length || 0;
    const totalFiles = resourceData?.getAllResources?.length || 0;

    if (userLoading || resourceLoading || logsLoading) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-gray-600">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (userError || resourceError || logsError) {
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
                    {t('admin.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                    {t('admin.description')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Statistiques utilisateurs */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('admin.stats.totalUsers')}
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
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
                        <div className="text-2xl font-bold">{totalFiles}</div>
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
                        <div className="text-2xl font-bold">{totalAdmins}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('admin.stats.adminsDescription')}
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
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => navigate('/admin/users')}
                                >
                                    {t('admin.users.viewAll')}
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

            {/* Section des journaux d'événements */}
            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            {t('admin.logs.title')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {logsData?.getSystemLogs?.length === 0 ? (
                                <div className="text-center py-8">
                                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">{t('admin.logs.empty')}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {logsData?.getSystemLogs?.map((log: any) => (
                                        <div
                                            key={log.id}
                                            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className={`w-2 h-2 rounded-full mt-2 ${
                                                log.type === 'error' ? 'bg-red-500' :
                                                log.type === 'warning' ? 'bg-yellow-500' :
                                                log.type === 'success' ? 'bg-green-500' :
                                                'bg-blue-500'
                                            }`} />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium text-sm">{log.message}</p>
                                                    <span className="text-xs text-gray-500">{formatRelativeTime(log.createdAt)}</span>
                                                </div>
                                                {log.details && (
                                                    <p className="text-xs text-gray-600 mt-1">{log.details}</p>
                                                )}
                                                {log.userId && (
                                                    <p className="text-xs text-gray-500 mt-1">Utilisateur: {log.userId}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminPage; 