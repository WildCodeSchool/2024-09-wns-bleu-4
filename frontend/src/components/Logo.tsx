import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <Link
            to="/"
            className="logo flex-shrink-0"
            aria-label="Retourner a la page d\'accueil"
        >
            <svg
                width="66"
                height="50"
                viewBox="0 0 66 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M46.7738 23.3161L51.7062 9.72034C52.0981 8.64012 51.1101 7.56663 50.0011 7.86777C48.3162 8.32533 47.4541 5.92613 49.0449 5.20658L59.1389 0.640971C59.9182 0.288515 60.8351 0.642071 61.176 1.42644L65.4932 11.3599C66.183 12.9469 64.0418 14.2143 62.9823 12.8462C62.2858 11.9469 60.8758 12.1451 60.4542 13.2016L55.5868 25.3994L47.4719 46.5108C46.1765 49.8806 41.5381 50.2096 39.7801 47.0563L34.2254 37.0925C32.619 34.211 28.487 34.1729 26.8278 37.0244L20.8501 47.2975C19.0501 50.3909 14.4682 50.0173 13.1931 46.6732L1.20126 15.2241C0.138738 12.4376 2.19665 9.45046 5.17887 9.45046H6.28367C8.0915 9.45046 9.70216 10.5923 10.3006 12.2982L14.6973 24.8309C15.9941 28.5272 21.1734 28.6579 22.655 25.0317L26.561 15.4717C28.0144 11.9142 33.0651 11.9516 34.4658 15.5301L38.1946 25.0563C39.6183 28.6933 44.7788 28.6535 46.1463 24.995L46.7738 23.3161Z"
                    fill="currentColor"
                    className="text-foreground"
                />
                <defs>
                    <linearGradient
                        id="paint0_linear_191_307"
                        x1="20"
                        y1="46"
                        x2="69.8562"
                        y2="-1.80752"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#202020" />
                        <stop offset="1" stopColor="#878787" />
                    </linearGradient>
                </defs>
            </svg>
        </Link>
    );
};

export default Logo;
