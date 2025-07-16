import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // TODO: Implement password reset functionality
            toast.success(t('auth.forgotPassword.success'));
        } catch {
            toast.error(t('auth.forgotPassword.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="mx-auto w-[80%]">
            <Card className="w-auto sm:w-[50%] mx-auto md:my-40 my-6">
                <CardHeader>
                    <CardTitle className="text-2xl">{t('meta.forgotPassword.title')}</CardTitle>
                    <CardTitle className="text-sm font-normal text-muted-foreground">
                        {t('auth.forgotPassword.description')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('auth.form.email.label')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t('auth.form.email.placeholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !email}
                            className="mt-2 cursor-pointer"
                        >
                            {loading ? t('auth.form.loading', { action: t('meta.forgotPassword.title') }) : t('auth.forgotPassword.submit')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
};

export default ForgotPassword; 