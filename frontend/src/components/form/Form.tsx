import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
<<<<<<< HEAD
=======
import { useTranslation } from 'react-i18next';
>>>>>>> origin/dev
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
<<<<<<< HEAD
                    Veuillez vous connecter pour continuer
=======
                    {t('auth.form.title')}
>>>>>>> origin/dev
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-4">
                <form
                    onSubmit={handleSubmit(submitForm)}
                    className="grid gap-4"
<<<<<<< HEAD
                >
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="exemple@exemple.com"
=======
                    data-testid="form"
                >
                    <div className="space-y-2">
                        <Label htmlFor="email">{t('auth.form.email.label')}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={t('auth.form.email.placeholder')}
>>>>>>> origin/dev
                            {...register('email')}
                        />
                        {errors.email && (
                            <span className="text-sm text-red-500">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
<<<<<<< HEAD
                        <Label htmlFor="password">Mot de passe</Label>
=======
                        <Label htmlFor="password">{t('auth.form.password.label')}</Label>
>>>>>>> origin/dev
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
<<<<<<< HEAD
                                placeholder="Votre mot de passe"
=======
                                placeholder={t('auth.form.password.placeholder')}
>>>>>>> origin/dev
                                className="pr-10"
                                {...register('password')}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
<<<<<<< HEAD
=======
                                data-testid="password-toggle"
>>>>>>> origin/dev
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
<<<<<<< HEAD
                            <span className="text-sm text-red-500">
=======
                            <span className="text-sm text-red-500" data-testid="password-error">
>>>>>>> origin/dev
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
<<<<<<< HEAD
                        {loading ? `${title} ...` : 'Valider'}
=======
                        {loading ? t('auth.form.loading', { action: title }) : t('auth.form.submit')}
>>>>>>> origin/dev
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
