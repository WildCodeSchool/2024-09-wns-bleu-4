import { useRef, useState } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Profile = () => {
    const { t } = useTranslation();
    const { user } = useAuthContext();
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Ouvre le sélecteur de fichier
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    // Gère l'upload vers storage-api
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Prévisualisation locale (optionnel)
        if (file.type.startsWith('image/')) {
            setAvatarUrl(URL.createObjectURL(file));
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Remplace l'URL par celle de ton storage-api si besoin
            const response = await axios.post(
                'http://localhost:8000/upload',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                },
            );
            // L'API doit renvoyer l'URL du fichier stocké
            setAvatarUrl(response.data.url);
        } catch (_) {
            alert("Erreur lors de l'upload du fichier");
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
                <CardContent className="flex flex-col gap-2 my-4">
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <div
                        style={{
                            display: 'inline-block',
                            position: 'relative',
                        }}
                    >
                        <Avatar
                            className="cursor-pointer w-16 h-16"
                            onClick={handleAvatarClick}
                        >
                            <AvatarImage
                                src={
                                    avatarUrl || 'https://github.com/shadcn.png'
                                }
                            />
                            <AvatarFallback>PDP</AvatarFallback>
                        </Avatar>
                        <Plus
                            size={24}
                            className="text-black fill-black relative bottom-6 bg-white rounded-full left-10 cursor-pointer"
                            onClick={handleAvatarClick}
                        />
                    </div>
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
