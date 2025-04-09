import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
    email: z.string().email('Veuillez saisir une adresse email valide'),
    password: z
        .string()
        .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
        .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
        .regex(/[0-9]/, 'Doit contenir au moins un chiffre')
        .regex(/[^A-Za-z0-9]/, 'Doit contenir au moins un caractère spécial'),
});

type FormData = z.infer<typeof formSchema>;

interface FormProps {
    title: string;
    onSubmit: (email: string, password: string) => Promise<void>;
    loading: boolean;
    error?: string;
    links?: React.ReactNode;
}

const Form = ({ title, onSubmit, loading, links, error }: FormProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
    });

    const submitForm = async (data: FormData) => {
        await onSubmit(data.email, data.password);
        navigate("/");
    };

    return (
        <div className="form-log">
            <b>{title}</b>
            <form onSubmit={handleSubmit(submitForm)}>
                <label className="form-label" htmlFor="email">
                    Email
                    <input
                        type="email"
                        placeholder="exemple@exemple.com"
                        {...register('email')}
                    />
                    {errors.email && (
                        <span className="error-message">
                            {errors.email.message}
                        </span>
                    )}
                </label>
                <label className="form-label" htmlFor="password">
                    Mot de passe
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Votre mot de passe"
                        {...register('password')}
                    />
                    <button
                        type="button"
                        className="show-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff aria-label="Show password" />
                        ) : (
                            <Eye stroke="#FF934F" aria-label="Hide password" />
                        )}
                    </button>
                    {errors.password && (
                        <span className="error-message">
                            {errors.password.message}
                        </span>
                    )}
                </label>
                {error && <div className="form-error">{error}</div>}
                {links && <div className="links-supp">{links}</div>}
                <button disabled={!isValid} type="submit" className="btn">
                    {loading ? `${title} ...` : 'Valider'}
                </button>
            </form>
        </div>
    );
};

export default Form;
