import Form from '@/components/form/Form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoginMutation } from '@/generated/graphql-types';

const Login = () => {
    const [login, { loading }] = useLoginMutation();

    const handleSubmit = async (email: string, password: string) => {
        try {
            const response = await login({
                variables: { data: { email, password } },
            });

            if (response.data?.login) {
                localStorage.setItem('token', response.data.login);
                toast.success('Connexion réussie');
            }
        } catch (err) {
            console.error('Erreur de connexion :', err);
            toast.error('Erreur de connexion');
        }
    };

    return (
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
    );
};

export default Login;
