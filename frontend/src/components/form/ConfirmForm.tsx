import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';

// Ajouter la logique de validation de l'OTP ici

// Fait toi plaisir Daniel pour custom c'est vraiment juste une base on pourrait peut etre meme faire un composant plus generique avec Form plus tard
export const ConfirmForm: React.FC = () => {
    return (
        <div className={cn('form-log')}>
            <b>Vérification inscription</b>
            <p>
                veuillez vérifier votre boite mail afin de finaliser
                l’inscription
            </p>
            <button className="">Renvoyer un email</button>
            <InputOTP maxLength={6}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
        </div>
    );
};
