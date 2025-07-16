import { MiddlewareFn } from 'type-graphql';
import { User } from '@/entities/User';

export const isAuth: MiddlewareFn<any> = async ({ context }, next) => {
    if (!context.email) {
        throw new Error('Not authenticated');
    }

    const user = await User.findOneBy({ email: context.email });
    if (!user) {
        throw new Error('User not found');
    }

    return next();
}; 