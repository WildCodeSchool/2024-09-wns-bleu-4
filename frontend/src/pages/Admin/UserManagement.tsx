import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, Search, Shield, User, Trash2, Crown } from 'lucide-react';
import { GET_ALL_USERS } from '@/graphql/User/queries';
import { DELETE_USER, UPDATE_USER_ROLE } from '@/graphql/User/mutations';
import { toast } from 'react-toastify';

interface User {
    id: number;
    email: string;
    role: 'USER' | 'ADMIN';
    subscription?: {
        id: number;
    } | null;
}

const UserManagement: React.FC = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    
    const { data, loading, error } = useQuery(GET_ALL_USERS);
    const [deleteUser, { loading: deleteLoading }] = useMutation(DELETE_USER, {
        refetchQueries: [{ query: GET_ALL_USERS }]
    });
    const [updateUserRole, { loading: roleLoading }] = useMutation(UPDATE_USER_ROLE, {
        refetchQueries: [{ query: GET_ALL_USERS }]
    });

    // Filtrer les utilisateurs selon le terme de recherche
    const filteredUsers = data?.getAllUsers?.filter((user: User) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleDeleteUser = (user: User) => {
        setUserToDelete(user);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        try {
            await deleteUser({
                variables: {
                    id: userToDelete.id
                }
            });
            
            toast.success(t('admin.users.delete.success'));
            setUserToDelete(null);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : t('admin.users.delete.error');
            toast.error(errorMessage);
        }
    };

    const handleRoleChange = async (userId: number, newRole: 'USER' | 'ADMIN') => {
        try {
            await updateUserRole({
                variables: {
                    id: userId,
                    role: newRole
                }
            });
            
            toast.success(t('admin.users.role.success'));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : t('admin.users.role.error');
            toast.error(errorMessage);
        }
    };

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
                    {t('admin.users.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                    {t('admin.users.description')}
                </p>
            </div>

            {/* Barre de recherche */}
            <div className="mb-6">
                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder={t('admin.users.search.placeholder')}
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
                                <p className="text-sm text-gray-600">{t('admin.users.stats.total')}</p>
                                <p className="text-2xl font-bold">{data?.getAllUsers?.length || 0}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{t('admin.users.stats.admins')}</p>
                                <p className="text-2xl font-bold">
                                    {data?.getAllUsers?.filter((user: User) => user.role === 'ADMIN')?.length || 0}
                                </p>
                            </div>
                            <Shield className="h-8 w-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{t('admin.users.stats.users')}</p>
                                <p className="text-2xl font-bold">
                                    {data?.getAllUsers?.filter((user: User) => user.role === 'USER')?.length || 0}
                                </p>
                            </div>
                            <User className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Liste des utilisateurs */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {t('admin.users.list.title')} ({filteredUsers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                                {searchTerm ? t('admin.users.list.noResults') : t('admin.users.list.empty')}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredUsers.map((user: User) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.email}</p>
                                            <p className="text-sm text-gray-500">ID: {user.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                                            {user.role}
                                        </Badge>
                                        {user.subscription && (
                                            <Badge variant="default" className="bg-green-100 text-green-800">
                                                {t('admin.users.subscribed')}
                                            </Badge>
                                        )}
                                        
                                        {/* Sélecteur de rôle */}
                                        <Select
                                            value={user.role}
                                            onValueChange={(value: 'USER' | 'ADMIN') => handleRoleChange(user.id, value)}
                                            disabled={roleLoading}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USER">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        {t('admin.users.roles.user')}
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="ADMIN">
                                                    <div className="flex items-center gap-2">
                                                        <Crown className="h-4 w-4" />
                                                        {t('admin.users.roles.admin')}
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    {t('admin.users.actions.delete')}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        {t('admin.users.delete.title')}
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {t('admin.users.delete.description', { email: user.email })}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        {t('common.cancel')}
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={confirmDelete}
                                                        className="bg-red-600 hover:bg-red-700"
                                                        disabled={deleteLoading}
                                                    >
                                                        {deleteLoading ? t('common.loading') : t('admin.users.delete.confirm')}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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

export default UserManagement; 