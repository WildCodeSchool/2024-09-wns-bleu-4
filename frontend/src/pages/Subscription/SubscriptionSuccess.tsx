import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowLeft } from "lucide-react";

const SubscriptionSuccess = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

  return (
    <div className="dark:bg-black min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold">{t('subscription.success.title')}</h1>
                <p className="text-gray-600 dark:text-muted-foreground">{t('subscription.success.description')}</p>
            </div>
            <div className="mb-6">
                <Button className="w-full mt-6" variant="outline" onClick={() => navigate('/')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('common.backToHome')}
                </Button>
            </div>
        </div>
    </div>
  )
}

export default SubscriptionSuccess