import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD_SEND_CODE } from '@/graphql/User/mutations';
import { toast } from 'react-toastify';
import { useState } from 'react';

const ForgotPasswordForm = () => {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [resetPasswordSendCode] = useMutation(RESET_PASSWORD_SEND_CODE);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error(t('common.error'));
            return;
        }

        setIsSubmitting(true);
        try {
            await resetPasswordSendCode({
                variables: {
                    email: email.trim(),
                    lang: i18n.language
                }
            });
            toast.success('A password reset link has been sent to your email address');
            setEmail('');
        } catch (error: unknown) {
            console.error('Error sending reset code:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error sending reset link';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-auto sm:w-[50%] mx-auto md:my-40  my-6">
            <CardHeader>
                <CardTitle className="text-2xl">{t('password.forgot.form.title')}</CardTitle>
                <CardTitle className="text-sm font-normal text-muted-foreground">
                    {t('password.forgot.form.description')}
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-4">
                <form
                    onSubmit={handleSubmit}
                    className="grid gap-4"
                    data-testid="form"
                >
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('password.forgot.form.email.label')}</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('password.forgot.form.email.placeholder')}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 cursor-pointer"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('common.sending') : t('password.forgot.form.submit')}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ForgotPasswordForm;
