import { Eye, EyeOff } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '@/generated/graphql-types';

const Login = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');

    const [login, { loading, error }] = useLoginMutation();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('email', email);
        try {
            const response = await login({
                variables: { data: { email, password } },
            });

            if (response.data?.login) {
                localStorage.setItem('token', response.data.login);
            }
        } catch (err) {
            console.error('Erreur de connexion :', err);
        }
    };

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPassword(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    return (
        <div className="form-log">
            <b>Connexion</b>
            <form onSubmit={handleSubmit}>
                <label className="form-label" htmlFor="email">
                    Email
                    <input
                        type="email"
                        placeholder="exemple@exemple.com"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </label>
                <label className="form-label" htmlFor="password">
                    Mot de passe
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Votre mot de passe"
                        required
                    />
                    <button
                        type="button"
                        className="show-password"
                        value={password}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                </label>
                <div className="links-supp">
                    <Link to="/forgot-password">Mot de passe oublié ?</Link>
                    <Link to="/sign">
                        Pas encore de compte ? Inscrivez-vous !
                    </Link>
                </div>
                <button
                    disabled={password.length < 12 || email === ''}
                    type="submit"
                >
                    {loading ? 'Connexion ...' : 'Valider'}
                </button>
                {error && (
                    <p style={{ color: 'red' }}>
                        Une erreur est survenue lors de la connexion
                    </p>
                )}
            </form>
        </div>
    );
};

export default Login;
