import { Subscription } from '@/entities/Subscription';
import { User } from '@/entities/User';
import { Arg, ID, Mutation, Resolver } from 'type-graphql';

// Need to refactor the calculateEndAt function to calculate the end date of the subscription based on the paid date.
const calculateEndAt = (paidAt: Date): Date =>
    new Date(paidAt.setMonth(paidAt.getMonth() + 1));

@Resolver(Subscription)
class SubscriptionResolver {
    @Mutation(() => Subscription)
    async createSubscription(
        @Arg('userId', () => ID) userId: User['id'],
    ): Promise<Subscription> {
        const user = await User.findOneBy({ id: userId });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        const paidAt = new Date();

        const subscription = Subscription.create({
            paidAt: paidAt.toISOString(),
            endAt: calculateEndAt(paidAt).toISOString(),
        });
        await subscription.save();
        user.subscription = subscription;
        await user.save();
        return subscription;
    }

    @Mutation(() => String)
    async deleteSubscription(
        @Arg('userId', () => ID) userId: User['id'],
    ): Promise<string> {
        const user = await User.findOneBy({ id: userId });
        if (!user || !user.subscription) {
            throw new Error('Utilisateur ou abonnement non trouvé');
        }
        user.subscription = null;
        await user.save();
        return 'Subscription deleted';
    }
}

export default SubscriptionResolver;
