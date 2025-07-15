import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const formSchema = z.object({
    email: z.string().email('Veuillez saisir une adresse email valide'),
    password: z
        .string()
        .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
        .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
        .regex(/[0-9]/, 'Doit contenir au moins un chiffre')
        .regex(/[^A-Za-z0-9]/, 'Doit contenir au moins un caractère spécial'),
});

type FormData = z.infer<typeof formSchema>;

interface FormProps {
    title: string;
    onSubmit: (email: string, password: string) => Promise<void>;
    loading: boolean;
    error?: string;
    links?: React.ReactNode;
}

const Form = ({ title, onSubmit, loading, links, error }: FormProps) => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
    });

    const submitForm = async (data: FormData) => {
        await onSubmit(data.email, data.password)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                toast.error(error.message);
                throw new Error(error.message);
            });
    };

    return (
        <Card className="w-auto sm:w-[50%] mx-auto md:my-40  my-6">
            <CardHeader>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardTitle className="text-sm font-normal text-muted-foreground">
                    {t('auth.form.title')}
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-4">
                <form
                    onSubmit={handleSubmit(submitForm)}
                    className="grid gap-4"
                    data-testid="form"
                >
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('auth.form.email.label')}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={t('auth.form.email.placeholder')}
                            {...register('email')}
                        />
                        {errors.email && (
                            <span className="text-sm text-red-500">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">{t('auth.form.password.label')}</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder={t('auth.form.password.placeholder')}
                                className="pr-10"
                                {...register('password')}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                                data-testid="password-toggle"
                            >
                                {showPassword ? (
                                    <EyeOff
                                        className="h-4 w-4"
                                        aria-label="Hide password"
                                    />
                                ) : (
                                    <Eye
                                        className="h-4 w-4"
                                        aria-label="Show password"
                                    />
                                )}
                            </Button>
                        </div>
                        {errors.password && (
                            <span className="text-sm text-red-500" data-testid="password-error">
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    {error && (
                        <div className="text-sm text-red-500">{error}</div>
                    )}

                    <Button
                        disabled={!isValid}
                        type="submit"
                        className="mt-2 cursor-pointer"
                    >
                        {loading ? t('auth.form.loading', { action: title }) : t('auth.form.submit')}
                    </Button>

                    {links && (
                        <div className="mt-2 flex gap-5 text-blue-500">
                            {links}
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export default Form;
