import { cn } from "@/utils/globalUtils"

const ScrollBox = ({
    children,
    className = ''
} : { 
    children: React.ReactNode,
    maxHeight?: string,
    className?: string
}) => {
    return (
        <div className={cn(
            "flex-1 space-y-2 overflow-y-auto pr-2 scrollbar-elegant",
            className
        )}>
            {children}
        </div>
    );
};

export default ScrollBox;
