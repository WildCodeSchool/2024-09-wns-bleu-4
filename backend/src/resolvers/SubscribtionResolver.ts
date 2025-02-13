import { Subscribtion } from '@/entities/Subscribtion';
import { User } from '@/entities/User';
import { Arg, ID, Mutation, Resolver } from 'type-graphql';

// Need to refactor the calculateEndAt function to calculate the end date of the subscription based on the paid date.
const calculateEndAt = (paidAt: Date): Date =>
    new Date(paidAt.getTime() + 30 * 24 * 60 * 60 * 1000);

@Resolver(Subscribtion)
class SubscribtionResolver {
    @Mutation(() => Subscribtion)
    async createSubscribtion(
        @Arg('userId', () => ID) userId: User['id'],
    ): Promise<Subscribtion> {
        const user = await User.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        const paidAt = new Date();
        const subscribtion = Subscribtion.create({
            paidAt: paidAt.toISOString(),
            endAt: calculateEndAt(paidAt).toISOString(),
        });

        await subscribtion.save();
        user.subscription = subscribtion;
        await user.save();
        return subscribtion;
    }

    @Mutation(() => Boolean)
    async deleteSubscribtion(
        @Arg('userId', () => ID) userId: User['id'],
    ): Promise<boolean> {
        const user = await User.findOneBy({ id: userId });
        if (!user || !user.subscription) {
            throw new Error('User or subscription not found');
        }
        user.subscription = null;
        await user.save();
        return true;
    }
}

export default SubscribtionResolver;
