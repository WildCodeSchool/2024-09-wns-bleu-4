import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { useConfirmEmailMutation, useResendConfirmationEmailMutation } from '@/generated/graphql-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { OneShotButton } from '../OneShotButton';

interface ConfirmFormProps {
    email?: string;
}

export const ConfirmForm: React.FC<ConfirmFormProps> = ({ email }) => {
    const { t, i18n } = useTranslation();
    const [confirmEmail] = useConfirmEmailMutation();
    const [resendConfirmationEmail] = useResendConfirmationEmailMutation();
    const navigate = useNavigate();
    const [otpValue, setOtpValue] = useState<string>('');

    const handleOtpChange = async (value: string) => {
        setOtpValue(value);
        if (value && value.length === 8) {
            try {
                await confirmEmail({ variables: { codeByUser: value } });
                toast.success(t('auth.confirm.success'));
                navigate('/');
            } catch (error: unknown) {
                toast.error(t('auth.confirm.error'));
                console.error('Email confirmation error:', error);
                setOtpValue('');
            }
        }
    };

    const handleResendEmail = async () => {
        if (!email) {
            toast.error(t('auth.confirm.emailRequired'));
            return;
        }

        try {
            await resendConfirmationEmail({
                variables: {
                    email: email,
                    lang: i18n.language as 'fr' | 'en'
                }
            });
            toast.success(t('auth.confirm.emailResent'));
            setOtpValue('');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(errorMessage);
            console.error('Resend confirmation email error:', error);
            setOtpValue('');
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
                <InputOTP
                    value={otpValue}
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
            <CardFooter>
                <OneShotButton
                    onClick={handleResendEmail}
                    label="auth.confirm.resendEmail"
                    labelClicked="common.sent"
                />
            </CardFooter>
        </Card>
    );
};
