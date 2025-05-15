import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);

        const handleChange = () => {
            setMatches(media.matches);
        };

        // Set initial value
        handleChange();

        // Écoute les changements
        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, [query]);

    return matches;
}
