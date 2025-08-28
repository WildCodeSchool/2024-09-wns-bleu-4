import { cn } from "@/utils/globalUtils";
import { Crown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@apollo/client";
import { GET_USER_SUBSCRIPTION } from "@/graphql/Subscription/queries";
import { GET_USER_INFO } from "@/graphql/User/queries";

const SubscribedLogo = () => {
    const { data: userData } = useQuery(GET_USER_INFO);
    const { data: subscriptionData, loading: subscriptionLoading } = useQuery(
        GET_USER_SUBSCRIPTION,
        {
            variables: {
                userId: userData?.getUserInfo?.id,
            },
        },
    );

    const subscriptionEndAt =
        subscriptionData?.getUserSubscription?.endAt ?? null;
    const formattedSubscriptionEndAt = subscriptionEndAt
        ? new Date(subscriptionEndAt).toLocaleDateString()
        : '';

    return (
        <Popover>
            <PopoverTrigger>
                <Crown
                    className={cn(
                        'cursor-pointer p-2 text-cyan-700 dark:text-cyan-500',
                        'hover:text-cyan-500 hover:scale-110 dark:hover:text-cyan-300',
                        'drop-shadow-cyan-700 hover:drop-shadow-lg dark:drop-shadow-cyan-500',
                        'transition-all duration-300 ease-in-out',
                    )}
                    size={40}
                    strokeWidth={2}
                />
            </PopoverTrigger>
            <PopoverContent
                side="left"
                align="center"
                className="w-fit p-3 bg-cyan-100 dark:bg-cyan-800 dark:text-white"
            >
                <div>
                    {subscriptionLoading ? (
                        <p>Chargement...</p>
                    ) : (
                        <p>Expiration : {formattedSubscriptionEndAt}</p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default SubscribedLogo;
