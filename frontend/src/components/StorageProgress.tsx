import { Progress } from '@/components/ui/progress';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/globalUtils';

const StorageProgress = ({
    bytesUsed,
    percentage,
}: {
    bytesUsed: string;
    percentage: number;
}) => {
    const [progress, setProgress] = useState(percentage);

    useEffect(() => {
        setProgress(percentage);
    }, [percentage]);

    return (
        <Popover>
            <PopoverTrigger className={cn(
                        "group relative",
                        "cursor-pointer p-2",
                    )}>
                <p className={cn(
                        "opacity-0 absolute group-hover:opacity-50 transition-opacity duration-300 ease-in-out bottom-4 left-1/2 -translate-x-1/2",
                    )}>{progress}%</p>
                <Progress value={progress} className={cn(
                        "w-20 h-2",
                        "group-hover:text-green-500 dark:group-hover:text-green-300",
                        "group-hover:drop-shadow-green-700 group-hover:drop-shadow-lg dark:group-hover:drop-shadow-green-500",
                        "transition-all duration-300 ease-in-out",
                    )} />
            </PopoverTrigger>
            <PopoverContent side="left" align="center" className={cn(
                        "w-fit p-3",
                        "bg-green-100 dark:bg-green-900 dark:text-white",
                    )}>
                <p>{bytesUsed} / 20MB</p>
            </PopoverContent>
        </Popover>
    );
};

export default StorageProgress;
