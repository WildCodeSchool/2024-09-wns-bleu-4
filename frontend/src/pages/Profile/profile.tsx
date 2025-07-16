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
import { useTranslation } from 'react-i18next';

export const Profile = () => {
    const { t } = useTranslation();
    const { user } = useAuthContext();
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
                <CardContent className="flex flex-col gap-2 my-4">
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
                        <Label>{t('profile.form.password.label')}</Label>
                        <Input type="password" />
                    </div>
                </CardContent>
                <Separator className="" />
                <CardFooter>
                    <Button className="cursor-pointer">
                        {t('profile.actions.save')}
                    </Button>
                </CardFooter>
            </Card>
        </section>
    );
};
