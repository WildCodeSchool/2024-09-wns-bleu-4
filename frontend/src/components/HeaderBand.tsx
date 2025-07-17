import { cn } from '@/lib/utils';

export type HeaderBandType = 'info' | 'warning' | 'error' | 'success';

const HeaderBand = ({ type, text }: { type: HeaderBandType, text: string }) => {
    return (
        <div className={cn(
            'w-full border-2 overflow-hidden inline-flex flex-row [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]',
            {
                'border-blue-600': type === 'info',
                'border-yellow-600': type === 'warning',
                'border-red-600': type === 'error',
                'border-green-600': type === 'success',
            }
        )}>
            <p className="
                text-nowrap p-4 flex items-center justify-center md:justify-start
                animate-[infinite-scroll_25s_linear_infinite]
            ">
                {text}
            </p>
            <p className="
                text-nowrap p-4 flex items-center justify-center md:justify-start
                animate-[infinite-scroll_25s_linear_infinite]
            "
            aria-hidden="true"
            >
                {text}
            </p>
        </div>
    );
};

export default HeaderBand;
