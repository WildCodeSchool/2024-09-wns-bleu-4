import { BackgroundPaths } from '@/components/ui/background-paths';
<<<<<<< HEAD

const Home = () => {
    return (
        <BackgroundPaths
            title="La solution simple et rapide pour tous vos
                transferts de fichiers"
        />
    );
=======
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();

    return <BackgroundPaths title={t('home.title')} />;
>>>>>>> origin/dev
};

export default Home;
