import Form from '@/components/form/Form';
import { useLoginMutation } from '@/generated/graphql-types';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [login, { loading }] = useLoginMutation();
    const navigate = useNavigate();

    const { authLogin } = useAuth();

    const handleSubmit = async (email: string, password: string) => {
        try {
            const response = await login({
                variables: { data: { email, password } },
            });

            if (response.data?.login) {
                authLogin({
                    email: email,
                    role: 'USER',
                    authToken: response.data.login,
                });
                toast.success('Connexion réussie');
                navigate('/');
            }
        } catch (err) {
            console.error('Erreur de connexion :', err);
            toast.error('Erreur de connexion');
        }
    };

    return (
        <section className="mx-auto w-[80%] mt-10">
            <Form
                title="Connexion"
                onSubmit={handleSubmit}
                loading={loading}
                links={
                    <>
                        <Link to="/forgot-password">Mot de passe oublié ?</Link>
                        <Link to="/sign">Vous avez déjà un compte ?</Link>
                    </>
                }
            />
        </section>
    );
};

export default Login;
