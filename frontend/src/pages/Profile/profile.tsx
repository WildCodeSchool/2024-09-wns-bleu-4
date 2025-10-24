import { AvatarUploader } from '@/components/AvatarUploader';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/context/useAuthContext';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD_SEND_CODE } from '@/graphql/User/mutations';
import { toast } from 'react-toastify';

export const Profile = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuthContext();
    const [isMailSent, setIsMailSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [resetPasswordSendCode] = useMutation(RESET_PASSWORD_SEND_CODE);

    const handleChangePassword = async () => {
        if (!user?.email) {
            toast.error('User email not found');
            return;
        }

        setIsSubmitting(true);
        try {
            await resetPasswordSendCode({
                variables: {
                    email: user.email,
                    lang: i18n.language,
                },
            });
            toast.success(t('profile.actions.changePassword.mailSent'));
            setIsMailSent(true);
        } catch (error: unknown) {
            console.error('Error sending reset code:', error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Error sending reset link';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section>
            <h1 className="text-2xl font-bold mb-4">{t('profile.title')}</h1>
            <Card className="flex flex-col gap-4 ">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            {t('profile.personalInfo.title')}
                        </h2>
                        <Separator orientation="vertical" className="h-6" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t('profile.personalInfo.description')}
                    </p>
                </CardHeader>
                <Separator className="" />
                <CardContent className="flex flex-col gap-4 my-4">
                    <AvatarUploader
                        user={{
                            email: user?.email,
                            profilePicture: user?.profilePicture,
                            id: user?.id,
                        }}
                        size="lg"
                    />
                    <div>
                        <Label htmlFor="email">
                            {t('profile.form.email.label')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={user?.email ?? ''}
                            placeholder={t('profile.form.email.placeholder')}
                            readOnly
                            className="bg-muted cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            {t('profile.form.email.readonly')}
                        </p>
                    </div>
                    <div>
                        <Button
                            disabled={isSubmitting || isMailSent}
                            onClick={handleChangePassword}
                            className="cursor-pointer w-fit"
                        >
                            {isSubmitting
                                ? t('common.sending')
                                : t('profile.actions.changePassword.label')}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t('profile.actions.changePassword.description')}
                        </p>
                    </div>
                </CardContent>
                <Separator className="" />
                <CardFooter></CardFooter>
            </Card>
        </section>
    );
};
