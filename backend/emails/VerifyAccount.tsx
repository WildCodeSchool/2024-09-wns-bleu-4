import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
//@ts-ignore
import React from 'react';

interface VerifyAccountEmailProps {
    validationCode?: string;
    lang: 'fr' | 'en';
}

export const VerifyAccountEmail = ({
    validationCode,
    lang,
}: VerifyAccountEmailProps) => (
    <Tailwind>
        <Html>
            <Head />
            <Body className="bg-white font-sans">
                <Container className="bg-white border border-[#eee] rounded-[5px] shadow-2xl mt-5 max-w-[360px] mx-auto px-0 pt-[68px] pb-[130px]">
                    <div className="flex justify-center">
                        <svg
                            viewBox="0 0 110 85"
                            aria-hidden="true"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="max-w-52"
                        >
                            <path
                                d="M21.9352 72.1313L3.40239 23.5282C1.76031 19.2217 4.94071 14.6053 9.54961 14.6053H11.257C14.0509 14.6053 16.5401 16.3699 17.465 19.0063L24.2599 38.375C26.264 44.0875 34.2685 44.2895 36.5582 38.6854L42.5947 23.9108C44.8409 18.4129 52.6465 18.4706 54.8112 24.001L60.574 38.7233C62.7741 44.3441 70.7495 44.2827 72.8628 38.6287L80.244 18.8808C81.2051 16.3096 83.6616 14.6053 86.4066 14.6053H87.3502C91.9666 14.6053 95.1474 19.2356 93.4911 23.5447L74.9115 71.8803C72.9096 77.0882 65.7411 77.5966 63.0243 72.7233L54.4397 57.3248C51.9571 52.8715 45.5713 52.8127 43.0071 57.2195L33.7687 73.0961C30.987 77.8768 23.9058 77.2995 21.9352 72.1313Z"
                                fill="url(#paint0_linear_10_140)"
                            />
                            <path
                                d="M81.4546 15.0223L73.4361 37.1246C72.9912 38.3507 73.6215 39.7057 74.8458 40.1555L83.3637 43.2845C84.5676 43.7268 85.9048 43.1304 86.3802 41.9392L94.9742 20.4024C95.6257 18.7697 97.8049 18.4634 98.8812 19.8533C100.519 21.9676 103.828 20.0088 102.762 17.5562L96.0897 2.20449C95.5628 0.992294 94.1458 0.445888 92.9415 0.990593L77.3416 8.04653C74.8831 9.15856 76.2154 12.8664 78.8194 12.1593C80.5333 11.6939 82.0602 13.3529 81.4546 15.0223Z"
                                fill="#FF934F"
                            />
                            <defs>
                                <linearGradient
                                    id="paint0_linear_10_140"
                                    x1="62.6316"
                                    y1="32.7632"
                                    x2="0.131575"
                                    y2="97.2368"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#FF934F" />
                                    <stop offset="1" stopColor="#F5ED31" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <Text className="text-[#0a85ea] text-[11px] font-bold h-[16px] leading-[16px] mt-4 mb-2 mx-2 uppercase text-center">
                        {lang === 'fr' ? 'Vérifiez votre email' : 'Verify Your Email'}
                    </Text>
                    <Heading className="text-black text-[20px] font-medium leading-[24px] my-0 text-center max-w-10/12">
                        {lang === 'fr' ? 'Entrez le code suivant sur le site pour terminer la création de votre compte Wild Transfer.' : 'Enter the following code on website to finish the creation of your Wild Transfer account.'}
                    </Heading>
                    <Section className="bg-black/5 rounded w-[280px] my-4 mx-auto align-middle">
                        <Text className="text-black text-[32px] font-bold leading-[40px] tracking-[6px] py-2 m-0 block text-center">
                            {validationCode}
                        </Text>
                    </Section>
                    <Text className="text-[#444] text-[15px] leading-[23px] px-10 m-0 text-center">
                        {lang === 'fr' ? 'Vous ne vous attendiez pas à recevoir ce mail ?' : 'Not expecting this email?'}
                    </Text>
                    <Text className="text-[#444] text-[15px] leading-[23px] px-10 m-0 text-center">
                        Contact{' '}
                        <Link
                            href="mailto:contact@wildtransfer.cloud"
                            className="text-[#444] underline"
                        >
                            contact@wildtransfer.cloud
                        </Link>{' '}
                        {lang === 'fr' ? 'si vous n\'avez pas demandé ce code.' : 'if you did not request this code.'}
                    </Text>
                </Container>
                <Text className="text-black text-[12px] font-extrabold leading-[23px] mt-5 m-0 text-center uppercase">
                    {lang === 'fr' ? 'Sécurisé par WCS.' : 'Securely powered by WCS.'}
                </Text>
            </Body>
        </Html>
    </Tailwind>
);

VerifyAccountEmail.PreviewProps = {
    validationCode: '144833',
} as VerifyAccountEmailProps;

export default VerifyAccountEmail;
