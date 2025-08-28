import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from '@apollo/client';
import { RESET_PASSWORD } from '@/graphql/User/mutations';
import { CHECK_USER_EXISTS } from '@/graphql/User/queries';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { decodeJWT } from '@/utils/globalUtils';
import { z } from 'zod';

const newPasswordSchema = z.object({
    password: z
        .string()
        .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
        .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
        .regex(/[0-9]/, 'Doit contenir au moins un chiffre')
        .regex(/[^A-Za-z0-9]/, 'Doit contenir au moins un caractère spécial'),
});

const ResetPassword = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const [resetPassword] = useMutation(RESET_PASSWORD);

    const { data: userExistsData, loading: userCheckLoading, error: userCheckError } = useQuery(CHECK_USER_EXISTS, {
        variables: { email: email || '' },
        skip: !email,
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (!tokenParam) {
            toast.error(t('password.reset.form.invalidLink'));
            navigate('/forgot-password');
            return;
        }

        const decoded = decodeJWT(tokenParam);
        if (!decoded || !decoded.email) {
            toast.error(t('password.reset.form.invalidLink'));
            navigate('/forgot-password');
            return;
        }

        setToken(tokenParam);
        setEmail(decoded.email);
    }, [searchParams, navigate, t]);

    // Check if user exists in database after email is set
    useEffect(() => {
        if (email && userExistsData !== undefined) {
            if (!userExistsData.checkUserExists) {
                toast.error('Recovery code is invalid');
                navigate('/sign');
                return;
            }
        }
    }, [email, userExistsData, navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!token) {
            toast.error(t('password.reset.form.invalidLink'));
            return;
        }

        const validationResult = newPasswordSchema.safeParse({ password: newPassword });
        if (!validationResult.success) {
            setPasswordError(validationResult.error.errors[0].message);
            return;
        }
        setPasswordError(null);

        if (newPassword !== confirmPassword) {
            toast.error(t('password.reset.form.passwordsDoNotMatch'));
            return;
        }

        setIsSubmitting(true);
        try {
            await resetPassword({
                variables: {
                    token,
                    newPassword
                }
            });
            toast.success(t('password.reset.form.success'));
            navigate('/login');
        } catch (error: unknown) {
            console.error('Error resetting password:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error resetting password';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading while checking user existence
    if (!token || !email || userCheckLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        {t('password.reset.form.loading')}
                    </h1>
                </div>
            </div>
        );
    }

    // Handle user check errors
    if (userCheckError) {
        toast.error('Error validating recovery code');
        navigate('/sign');
        return null;
    }

    return (
        <section className="mx-auto w-[80%]">
            <Card className="w-auto sm:w-[50%] mx-auto md:my-40 my-6">
                <CardHeader>
                    <CardTitle className="text-2xl">{t('password.reset.form.title', { email: email })}</CardTitle>
                    <CardTitle className="text-sm font-normal text-muted-foreground">
                        {t('password.reset.form.description')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-y-4">
                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-4"
                        data-testid="reset-password-form"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">{t('password.reset.form.password.label')}</Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setPasswordError(null);
                                }}
                                placeholder={t('password.reset.form.password.placeholder')}
                                required
                                minLength={12}
                            />
                            {passwordError && (
                                <span className="text-sm text-red-500" data-testid="password-error">
                                    {passwordError}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">{t('password.reset.form.confirmPassword.label')}</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={t('password.reset.form.confirmPassword.placeholder')}
                                required
                                minLength={12}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t('common.sending') : t('password.reset.form.submit')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
};

export default ResetPassword;
