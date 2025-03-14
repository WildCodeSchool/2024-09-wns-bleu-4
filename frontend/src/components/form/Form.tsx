import { Eye, EyeOff } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface FormProps {
    title: string;
    onSubmit: (email: string, password: string) => Promise<void>;
    loading: boolean;
    error?: string;
    links?: React.ReactNode;
}

const Form = ({ title, onSubmit, loading, links }: FormProps) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(email, password);
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
            <b>{title}</b>
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
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff /> : <Eye stroke='#FF934F'/>}
                    </button>
                </label>
                {links && <div className="links-supp">{links}</div>}
                <button
                    disabled={password.length < 12 || email === ''}
                    type="submit"
                    className='btn'
                >
                    {loading ? `${title} ...` : 'Valider'}
                </button>
            </form>
        </div>
    );
};

export default Form;
