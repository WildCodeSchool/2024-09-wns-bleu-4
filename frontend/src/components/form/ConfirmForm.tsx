import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { useConfirmEmailMutation } from '@/generated/graphql-types';
import { cn } from '@/lib/utils';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
                    'Le code saisie est incorrect ou a expiré, veuillez réessayer.',
                );
                console.error('Email confirmation error:', error);
            }
        }
    };

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
