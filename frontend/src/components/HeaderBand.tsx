import { cn } from '@/lib/utils';

export type HeaderBandType = 'info' | 'warning' | 'error' | 'success';

const HeaderBand = ({ type, text, onClick }: { type: HeaderBandType, text: string, onClick: () => void }) => {
    return (
        <button type="button" className={cn(
            'w-full border-2 overflow-hidden inline-flex flex-row [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]',
            'transition-all duration-300 cursor-pointer',
            {
                'border-blue-600 hover:border-blue-500': type === 'info',
                'border-yellow-600 hover:border-yellow-500': type === 'warning',
                'border-red-600 hover:border-red-500': type === 'error',
                'border-green-600 hover:border-green-500': type === 'success',
            }
        )}
            onClick={onClick}
        >
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
        </button>
    );
};

export default HeaderBand;
