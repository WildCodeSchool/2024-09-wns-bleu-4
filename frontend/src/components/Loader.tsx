import { cn } from '@/utils/globalUtils';
import { Loader as LucideLoader } from 'lucide-react';

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    className?: string;
}

export const Loader = ({ size = 24, className, ...props }: ISVGProps) => {
    return (
        <LucideLoader
            className={cn('animate-spin', className)}
            width={size}
            height={size}
            {...props}
        />
    );
};
