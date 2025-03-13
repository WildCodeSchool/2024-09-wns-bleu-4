import Form from '@/components/Form';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { useRegisterMutation } from '@/generated/graphql-types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Sign = () => {
    const [register, { loading }] = useRegisterMutation();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (email: string, password: string) => {
        try {
            const response = await register({
                variables: { data: { email, password } },
            });
            if (response.data?.register) {
                toast.info(
                    'Veuillez vérifier votre email pour confirmer votre compte.',
                );
                setIsSubmitted(true);
            }
        } catch (error) {
            toast.error("Erreur lors de l'inscription");
            console.error("Erreur lors de l'inscription :", error);
        }
    };

    return (
        <>
            {isSubmitted ? (
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
            ) : (
                <Form
                    title="Inscription"
                    onSubmit={handleSubmit}
                    loading={loading}
                    links={
                        <span>
                            En appuyant sur "Valider", vous avez lu et vous
                            acceptez les <Link to="/cgu">CGU</Link> et la{' '}
                            <Link to="/privacy-policy">
                                Politique de Confidentialité
                            </Link>
                            .
                        </span>
                    }
                />
            )}
        </>
    );
};

export default Sign;
