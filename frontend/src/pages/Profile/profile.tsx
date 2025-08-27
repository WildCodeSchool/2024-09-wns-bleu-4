<<<<<<< HEAD
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
=======
import { AvatarUploader } from '@/components/AvatarUploader';
>>>>>>> origin/dev
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
<<<<<<< HEAD
import { Plus } from 'lucide-react';

export const Profile = () => {
    const { user } = useAuthContext();
    return (
        <section>
            <h1 className="text-2xl font-bold mb-4">Mon profil</h1>
=======
import { useTranslation } from 'react-i18next';

export const Profile = () => {
    const { t } = useTranslation();
    const { user } = useAuthContext();
    return (
        <section>
            <h1 className="text-2xl font-bold mb-4">{t('profile.title')}</h1>
>>>>>>> origin/dev
            <Card className="flex flex-col gap-4 ">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
<<<<<<< HEAD
                            Informations personnelles
=======
                            {t('profile.personalInfo.title')}
>>>>>>> origin/dev
                        </h2>
                        <Separator orientation="vertical" className="h-6" />
                    </div>
                    <p className="text-sm text-muted-foreground">
<<<<<<< HEAD
                        Modifiez vos informations personnelles.
=======
                        {t('profile.personalInfo.description')}
>>>>>>> origin/dev
                    </p>
                </CardHeader>
                <Separator className="" />
                <CardContent className="flex flex-col gap-2 my-4">
<<<<<<< HEAD
                    <div>
                        <Avatar className="cursor-pointer w-16 h-16">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>PDP</AvatarFallback>
                        </Avatar>
                        <Plus
                            size={24}
                            className="text-black fill-black relative bottom-6 bg-white rounded-full left-10 cursor-pointer"
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            value={user?.email || ''}
                            placeholder="Votre adresse e-mail"
=======
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
>>>>>>> origin/dev
                            readOnly
                            className="bg-muted cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
<<<<<<< HEAD
                            L'adresse e-mail ne peut pas être modifiée
                        </p>
                    </div>
                    <div>
                        <Label>Mot-de-passe</Label>
=======
                            {t('profile.form.email.readonly')}
                        </p>
                    </div>
                    <div>
                        <Label>{t('profile.form.password.label')}</Label>
>>>>>>> origin/dev
                        <Input type="password" />
                    </div>
                </CardContent>
                <Separator className="" />
                <CardFooter>
<<<<<<< HEAD
                    <Button className="cursor-pointer">Enregistrer</Button>
=======
                    <Button className="cursor-pointer">
                        {t('profile.actions.save')}
                    </Button>
>>>>>>> origin/dev
                </CardFooter>
            </Card>
        </section>
    );
};
