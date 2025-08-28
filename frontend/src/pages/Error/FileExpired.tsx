import Logo from "@/components/Logo"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

const FileExpired = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-black flex flex-col items-center justify-center h-screen">
        <Logo />
        <h1 className="text-4xl font-bold text-center mt-4">{t('navigation.notFound.title')}</h1>
        <p className="text-lg text-gray-500 mb-4">{t('navigation.notFound.description')}</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700">
            {t('navigation.notFound.backToHome')}
        </Link>
    </div>
  )
}

export default FileExpired