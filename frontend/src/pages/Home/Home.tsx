import { BackgroundPaths } from '@/components/ui/background-paths';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    
    return (
        <BackgroundPaths
            title={t('home.title')}
        />
    );
};

export default Home;
