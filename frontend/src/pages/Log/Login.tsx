import Form from '@/components/form/Form';
import { useAuthContext } from '@/context/useAuthContext';
import { useLoginMutation } from '@/generated/graphql-types';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
    const [login, { loading }] = useLoginMutation();
    const navigate = useNavigate();
    const { refreshAuth } = useAuthContext();

    const handleSubmit = async (email: string, password: string) => {
        try {
            const response = await login({
                variables: { data: { email, password } },
            });

            if (response.data?.login) {
                await refreshAuth();
                toast.success(t('auth.login.success'));
                navigate('/');
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error(t('auth.login.error'));
        }
    };

    return (
        <section className="mx-auto w-[80%]">
            <Form
                title={t('auth.login.title')}
                onSubmit={handleSubmit}
                loading={loading}
                links={
                    <>
                        <Link to="/forgot-password">{t('auth.login.links.forgotPassword')}</Link>
                        <Link to="/sign">{t('auth.login.links.createAccount')}</Link>
                    </>
                }
            />
        </section>
    );
};

export default Login;
