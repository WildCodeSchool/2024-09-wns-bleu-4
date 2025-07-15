import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const SubscriptionError = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

  return (
    <div className="dark:bg-black min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold">{t('subscription.error.title')}</h1>
                <p className="text-gray-600 dark:text-muted-foreground">{t('subscription.error.description')}</p>
            </div>
            <div className="mb-6">
                <Button className="w-full" variant="outline" onClick={() => navigate('/subscription')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('common.backToHome')}
                </Button>
            </div>
        </div>
    </div>
  )
}

export default SubscriptionError