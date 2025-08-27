import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowLeft } from "lucide-react";
import { useGetUserInfoQuery, useGetUserSubscriptionQuery } from "@/generated/graphql-types";
import { useAuth } from "@/hooks/useAuth";

const SubscriptionSuccess = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();
    const { refetch } = useGetUserInfoQuery();
    const { data: subscriptionData } = useGetUserSubscriptionQuery({
        variables: { userId: user?.id ? user.id.toString() : "" },
        skip: !user?.id,
    });
    const expiration = subscriptionData?.getUserSubscription?.endAt
        ? new Date(subscriptionData.getUserSubscription.endAt).toLocaleDateString()
        : null;

    refetch();

  return (
    <div className="dark:bg-black min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
                {user?.isSubscribed ? (
                    <>
                        <h1 className="text-2xl font-bold">{t('subscription.success.title')}</h1>
                        <p className="text-gray-600 dark:text-muted-foreground">
                            {t('subscription.success.description')}
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">{t('subscription.error.title')}</h1>
                        <p className="text-gray-600 dark:text-muted-foreground">
                            {t('subscription.error.description')}
                        </p>
                    </>
                )}
            </div>
            {user?.isSubscribed && expiration && (
                <div className="text-center mt-4">
                    <p className="text-green-600 dark:text-green-400 font-medium">
                        {t('subscription.success.expiration', { date: expiration })}
                    </p>
                </div>
            )}
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