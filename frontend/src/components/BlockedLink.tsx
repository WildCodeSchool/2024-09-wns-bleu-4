import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const BlockedLink = ({ label }: { label: string }) => {
    const location = useLocation();
    return (
        <Link
            to="/login"
            className="p-2 rounded-md text-gray-500 flex items-center"
            onClick={() => {
                if (location.pathname !== '/login') {
                    toast.info("Vous devez être connecté pour accéder à cette page");
                };
            }}
        >
            <Lock className="w-4 h-4 mr-2" /> {label}
        </Link>
    );
};

export default BlockedLink;
