import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { useConfirmEmailMutation } from '@/generated/graphql-types';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export const ConfirmForm: React.FC = () => {
    const { t } = useTranslation();
    const [confirmEmail] = useConfirmEmailMutation();
    const navigate = useNavigate();
    const otpInputRef = useRef<HTMLInputElement>(null);

    const handleOtpChange = async () => {
        const otpValue = otpInputRef.current?.value;
        if (otpValue && otpValue.length === 8) {
            try {
                await confirmEmail({ variables: { codeByUser: otpValue } });
                toast.success(t('auth.confirm.success'));
                navigate('/');
            } catch (error) {
                toast.error(t('auth.confirm.error'));
                console.error('Email confirmation error:', error);
            }
        }
    };

    return (
        <Card className="w-full sm:w-[50%] mx-auto">
            <CardHeader>
                <CardTitle>{t('auth.confirm.title')}</CardTitle>
                <CardDescription>
                    {t('auth.confirm.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <button className="btn py-2">{t('auth.confirm.resendEmail')}</button>
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
            </CardContent>
        </Card>
    );
};
