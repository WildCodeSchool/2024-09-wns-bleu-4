import { Progress } from '@/components/ui/progress';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useState } from 'react';

const StorageProgress = ({
    bytesUsed,
    percentage,
}: {
    bytesUsed: number;
    percentage: number;
}) => {
    const [progress, setProgress] = useState(percentage);

    useEffect(() => {
        setProgress(percentage);
    }, [percentage]);

    return (
        <Popover>
            <PopoverTrigger>
                <Progress value={progress} className="w-20 h-2" />
            </PopoverTrigger>
            <PopoverContent>
                <p>{progress}%</p>
                <p>{bytesUsed} / 20MB</p>
            </PopoverContent>
        </Popover>
    );
};

export default StorageProgress;
