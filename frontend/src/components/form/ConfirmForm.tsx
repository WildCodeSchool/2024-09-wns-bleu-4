import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { useConfirmEmailMutation } from '@/generated/graphql-types';
import { cn } from '@/lib/utils';
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const validateToken = async (token: string): Promise<boolean> => {
    try {
        const response = await fetch('/api/validate-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la validation du token');
        }

        const data = await response.json();
        return data.isValid; // Le back-end retourne si le token est valide
    } catch (error) {
        console.error('Erreur lors de la validation du token :', error);
        return false;
    }
};

export const ConfirmForm: React.FC = () => {
    const [confirmEmail] = useConfirmEmailMutation();
    const navigate = useNavigate();
    const otpInputRef = useRef<HTMLInputElement>(null);

    const handleOtpChange = async () => {
        const otpValue = otpInputRef.current?.value;
        if (otpValue && otpValue.length === 8) {
            try {
                await confirmEmail({ variables: { codeByUser: otpValue } });
                toast.success(
                    'Votre email a bien été confirmé, vous pouvez vous connecter !',
                );
                navigate('/');
            } catch (error) {
                toast.error(
                    "Erreur lors de la confirmation de l'email. Veuillez réessayer.",
                );
                console.error('Email confirmation error:', error);
            }
        }
    };

    const handleTokenVerification = async () => {
        const token = localStorage.getItem('emailVerificationToken');
        if (token) {
            const isValid = await validateToken(token);
            if (isValid) {
                toast.success('Token valide, vous pouvez continuer.');
            } else {
                toast.error('Token invalide ou expiré.');
            }
        } else {
            toast.error('Aucun token trouvé.');
        }
    };

    useEffect(() => {
        handleTokenVerification();
    }, []);

    return (
        <div className={cn('form-log')}>
            <b>Vérification inscription</b>
            <p>
                Veuillez vérifier votre boîte mail afin de finaliser votre
                inscription.
            </p>
            <button className="btn">Renvoyer un email</button>
            <InputOTP
                ref={otpInputRef}
                onChange={handleOtpChange}
                maxLength={8}
                pattern="^[0-9]*$"
            >
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
