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

export const Profile = () => {
    const { user } = useAuthContext();
    return (
        <section>
            <h1 className="text-2xl font-bold mb-4">Mon profil</h1>
            <Card className="flex flex-col gap-4 ">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Informations personnelles
                        </h2>
                        <Separator orientation="vertical" className="h-6" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Modifiez vos informations personnelles.
                    </p>
                </CardHeader>
                <Separator className="" />
                <CardContent className="flex flex-col gap-2 my-4">
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
                            readOnly
                            className="bg-muted cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            L'adresse e-mail ne peut pas être modifiée
                        </p>
                    </div>
                    <div>
                        <Label>Mot-de-passe</Label>
                        <Input type="password" />
                    </div>
                </CardContent>
                <Separator className="" />
                <CardFooter>
                    <Button className="cursor-pointer">Enregistrer</Button>
                </CardFooter>
            </Card>
        </section>
    );
};
