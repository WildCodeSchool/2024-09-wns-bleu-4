import { useState } from 'react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
export const OneShotButton = ({
    onClick,
    label,
    labelClicked,
    successToast,
    errorToast,
}: {
    onClick: () => void;
    label: string;
    labelClicked: string;
    successToast?: string;
    errorToast?: string;
}) => {
    const [isClicked, setIsClicked] = useState(false);
    const { t } = useTranslation();
    return (
        <Button
            disabled={isClicked}
            onClick={() => {
                setIsClicked(true);
                onClick();
                if (successToast) {
                    toast.success(t(successToast));
                } else if (errorToast) {
                    toast.error(t(errorToast));
                }
            }}
            className="cursor-pointer w-fit"
        >
            {isClicked ? t(labelClicked) : t(label)}
        </Button>
    );
};
