import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Flag, Search, Clock, User, FileText, AlertCircle } from 'lucide-react';
import { useGetAllReportsQuery } from '@/generated/graphql-types';
import { Loader } from '@/components/Loader';

interface Report {
    id: string;
    reason: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        email: string;
    };
    resource: {
        id: string;
        name: string;
        url: string;
        user: {
            id: string;
            email: string;
        };
    };
}

const ReportManagement: React.FC = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    
    const { data, loading, error } = useGetAllReportsQuery();
    
    // Debug logs
    console.log('ReportManagement - loading:', loading);
    console.log('ReportManagement - error:', error);
    console.log('ReportManagement - data:', data);
    
    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <Loader size={50} />
                </div>
            </div>
        );
    }
    
    if (error) {
        console.error('ReportManagement - GraphQL error:', error);
        return (
            <div className="container mx-auto py-8">
                <div className="text-center text-red-600">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                    <p>{t('common.error')}</p>
                    <p className="text-sm mt-2">{error.message}</p>
                </div>
            </div>
        );
    }
    
    const reports: Report[] = data?.getAllReports || [];
    
    const filteredReports = reports.filter(report => {
        const query = searchQuery.toLowerCase();
        return (
            report.user.email.toLowerCase().includes(query) ||
            report.resource.name.toLowerCase().includes(query) ||
            report.resource.user.email.toLowerCase().includes(query) ||
            report.reason.toLowerCase().includes(query)
        );
    });
    
    const getReasonLabel = (reason: string) => {
        const reasonMap: { [key: string]: string } = {
            CORRUPTED: t('fileCard.report.reasons.corrupted'),
            DISPLAY: t('fileCard.report.reasons.display'),
            INNAPROPRIATE: t('fileCard.report.reasons.inappropriate'),
            HARASSMENT: t('fileCard.report.reasons.harassment'),
            SPAM: t('fileCard.report.reasons.spam'),
            OTHER: t('fileCard.report.reasons.other'),
        };
        return reasonMap[reason] || reason;
    };
    
    const getReasonColor = (reason: string) => {
        const colorMap: { [key: string]: string } = {
            CORRUPTED: 'bg-orange-100 text-orange-800',
            DISPLAY: 'bg-blue-100 text-blue-800',
            INNAPROPRIATE: 'bg-red-100 text-red-800',
            HARASSMENT: 'bg-purple-100 text-purple-800',
            SPAM: 'bg-yellow-100 text-yellow-800',
            OTHER: 'bg-gray-100 text-gray-800',
        };
        return colorMap[reason] || 'bg-gray-100 text-gray-800';
    };
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-center mb-4">
                    {t('admin.reports.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                    {t('admin.reports.description')}
                </p>
            </div>
            
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('admin.reports.stats.total')}
                        </CardTitle>
                        <Flag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reports.length}</div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Signalements techniques
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {reports.filter(r => r.reason === 'CORRUPTED' || r.reason === 'DISPLAY').length}
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Signalements de contenu
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {reports.filter(r => r.reason === 'INNAPROPRIATE' || r.reason === 'HARASSMENT' || r.reason === 'SPAM').length}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Barre de recherche */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder={t('admin.reports.search.placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
            
            {/* Liste des rapports */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Flag className="h-5 w-5" />
                        {t('admin.reports.list.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredReports.length === 0 ? (
                        <div className="text-center py-8">
                            <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                                {searchQuery ? t('admin.reports.list.noResults') : t('admin.reports.list.empty')}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredReports.map((report) => (
                                <div
                                    key={report.id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Badge className={getReasonColor(report.reason)}>
                                                {getReasonLabel(report.reason)}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Clock className="h-3 w-3" />
                                                {formatDate(report.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium text-sm">
                                                    {t('admin.reports.details.reporter')}:
                                                </span>
                                                <span className="text-sm text-blue-600 dark:text-blue-400">
                                                    {report.user.email}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium text-sm">
                                                    {t('admin.reports.details.fileName')}:
                                                </span>
                                                <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                                    {report.resource.name}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium text-sm">
                                                    {t('admin.reports.details.fileOwner')}:
                                                </span>
                                                <span className="text-sm text-green-600 dark:text-green-400">
                                                    {report.resource.user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {report.content && (
                                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                                            <span className="font-medium text-sm">
                                                {t('admin.reports.details.content')}:
                                            </span>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                {report.content}
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className="flex gap-2 mt-4">
                                        <Button variant="outline" size="sm">
                                            {t('admin.reports.actions.resolve')}
                                        </Button>
                                        <Button variant="destructive" size="sm">
                                            {t('admin.reports.actions.delete')}
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

export default ReportManagement;