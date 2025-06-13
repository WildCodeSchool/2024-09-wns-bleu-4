import { ConfirmForm } from '@/components/form/ConfirmForm';
import Form from '@/components/form/Form';
import { useRegisterMutation } from '@/generated/graphql-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Sign = () => {
    const { t } = useTranslation();
    const [register, { loading }] = useRegisterMutation();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (email: string, password: string) => {
        try {
            const response = await register({
                variables: { data: { email, password } },
            });
            if (response.data?.register) {
                toast.info(t('auth.signup.success'));
                setIsSubmitted(true);
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error(t('auth.signup.error'));
            }
        }
    };

    return isSubmitted ? (
        <ConfirmForm />
    ) : (
        <Form
            title={t('auth.signup.title')}
            onSubmit={handleSubmit}
            loading={loading}
            links={
                <span>
                    {t('auth.signup.links.terms')}{' '}
                    <Link to="/cgu">{t('auth.signup.links.termsLink')}</Link>{' '}
                    {t('auth.signup.links.and')}{' '}
                    <Link to="/privacy-policy">
                        {t('auth.signup.links.privacyLink')}
                    </Link>
                    .
                </span>
            }
        />
    );
};

export default Sign;
