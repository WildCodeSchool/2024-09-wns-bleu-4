import { cn } from "@/utils/globalUtils"

const ScrollBox = ({
    children,
    className = ''
} : { 
    children: React.ReactNode,
    className?: string
}) => {
    return (
        <div className={cn(
            "flex-1 overflow-y-auto space-y-2 p-2 scrollbar-elegant",
            className
        )}>
            {children}
        </div>
    );
};

export default ScrollBox;
