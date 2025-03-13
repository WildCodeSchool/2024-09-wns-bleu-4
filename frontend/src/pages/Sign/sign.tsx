import { useRegisterMutation } from '@/generated/graphql-types';
import { Eye, EyeOff } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Sign = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const [register, { loading }] = useRegisterMutation();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await register({
                variables: { data: { email, password } },
            });
            if (response.data?.register) {
                toast.info(
                    'Veuillez vérifier votre email pour confirmer votre compte.',
                );
                navigate(`/verification?email=${encodeURIComponent(email)}`);
            }
        } catch (error) {
            toast.error("Erreur lors de l'inscription");
            console.error("Erreur lors de l'inscription :", error);
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
            <b>Inscription</b>
            <form action="" onSubmit={handleSubmit}>
                <label className="form-label" htmlFor="email">
                    Email
                    <input
                        type="email"
                        placeholder="exemple@exemple.com"
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
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                </label>
                <div className="links-supp">
                    <span>
                        En appuyant sur "Valider", vous avez lu et vous acceptez
                        les <Link to="/cgu">CGU</Link> et la{' '}
                        <Link to="/privacy-policy">
                            Politique de Confidentialité
                        </Link>
                        .
                    </span>
                </div>
                <button
                    disabled={password.length < 12 || email === ''}
                    type="submit"
                >
                    {loading ? 'Inscription ...' : 'Valider'}
                </button>
            </form>
        </div>
    );
};

export default Sign;
