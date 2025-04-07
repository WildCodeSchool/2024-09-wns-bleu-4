import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { useConfirmEmailMutation } from '@/generated/graphql-types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Fait toi plaisir Daniel pour custom c'est vraiment juste une base on pourrait peut etre meme faire un composant plus generique avec Form plus tard
export const ConfirmForm: React.FC = () => {

    const [formCode, setFormCode] = useState('');
    const [confirmEmail] = useConfirmEmailMutation();

    const handleSubmit = async () => {
        try {
            await confirmEmail({
                variables: { codeByUser: formCode },
            });
            toast.success('Votre compte a été confirmé');
            return <Navigate to="/login" />;
        } catch (error) {
            toast.error('Erreur lors de la confirmation du compte');
            console.error('Erreur lors de la confirmation du compte :', error);
        }
    };

    console.log('formCode', formCode);
    

    return (
        <div className={cn('form-log')}>
            <b>Vérification inscription</b>
            <p>
                Veuillez vérifier votre boîte mail afin de finaliser votre inscription.
            </p>
            <button className="btn">Renvoyer un email</button>
            <InputOTP maxLength={8} onChange={setFormCode} value={formCode} onSubmit={handleSubmit}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                </InputOTPGroup>
            </InputOTP>
        </div>
    );
};
