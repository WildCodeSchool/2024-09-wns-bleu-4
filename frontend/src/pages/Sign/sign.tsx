import { ConfirmForm } from '@/components/form/ConfirmForm';
import Form from '@/components/form/Form';
import { useRegisterMutation } from '@/generated/graphql-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Sign = () => {
    const [register, { loading}] = useRegisterMutation();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (email: string, password: string) => {
        try {
            const response = await register({
                variables: { data: { email, password } },
            });
            if (response.data?.register) {
                toast.info(
                    'Veuillez vérifier votre email pour confirmer votre compte.',
                );
                setIsSubmitted(true);
            }
        } catch (error) {
            toast.error("Erreur lors de l'inscription");
            console.error("Erreur lors de l'inscription :", error);
        }
    };

    return isSubmitted ? (
        <ConfirmForm />
    ) : (
        <Form
            title="Inscription"
            onSubmit={handleSubmit}
            loading={loading}
            links={
                <span>
                    En appuyant sur "Valider", vous avez lu et vous acceptez les{' '}
                    <Link to="/cgu">CGU</Link> et la{' '}
                    <Link to="/privacy-policy">
                        Politique de Confidentialité
                    </Link>
                    .
                </span>
            }
        />
    );
};

export default Sign;
