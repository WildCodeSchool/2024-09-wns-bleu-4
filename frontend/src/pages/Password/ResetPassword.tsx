import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD } from '@/graphql/User/mutations';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Simple JWT decode function (without verification - just for display)
const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

const ResetPassword = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    const [resetPassword] = useMutation(RESET_PASSWORD);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (!tokenParam) {
            toast.error('Invalid reset link');
            navigate('/forgot-password');
            return;
        }

        // Decode the JWT token to get the email
        const decoded = decodeJWT(tokenParam);
        if (!decoded || !decoded.email) {
            toast.error('Invalid reset link');
            navigate('/forgot-password');
            return;
        }

        setToken(tokenParam);
        setEmail(decoded.email);
    }, [searchParams, navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!token) {
            toast.error('Invalid reset link');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (newPassword.length < 12) {
            toast.error('Password must be at least 12 characters long');
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
            toast.success('Password has been reset successfully!');
            navigate('/login');
        } catch (error: unknown) {
            console.error('Error resetting password:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error resetting password';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token || !email) {
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
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder={t('password.reset.form.password.placeholder')}
                                required
                                minLength={12}
                            />
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
