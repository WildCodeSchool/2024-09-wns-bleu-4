import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
//@ts-ignore
import React from 'react';

interface ResetPasswordEmailProps {
    userEmail: string;
    resetPasswordLink: string;
}

export const ResetPasswordEmail = ({
    userEmail,
    resetPasswordLink,
}: ResetPasswordEmailProps) => {
    return (
        <Tailwind>
            <Html>
                <Head />
                <Body className="bg-[#f6f9fc] py-2 font-sans">
                    <Preview>Wild Transfer reset your password</Preview>
                    <Container className="bg-white border border-[#f0f0f0] p-[45px]">
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
                        <Section>
                            <Text className="text-[#404040] text-[16px] font-light leading-[26px]">
                                Hi {userEmail},
                            </Text>
                            <Text className="text-[#404040] text-[16px] font-light leading-[26px]">
                                Someone recently requested a password change for
                                your Wild Transfer account. If this was you, you
                                can set a new password here:
                            </Text>
                            <Button
                                href={resetPasswordLink}
                                className="bg-[#007ee6] text-white text-[15px] font-normal text-center no-underline rounded w-[210px] py-[14px] px-[7px] block mt-4"
                            >
                                Reset password
                            </Button>
                            <Text className="text-[#404040] text-[16px] font-light leading-[26px] mt-4">
                                If you don't want to change your password or
                                didn't request this, just ignore and delete this
                                message.
                            </Text>
                            <Text className="text-[#404040] text-[16px] font-light leading-[26px] mt-4">
                                To keep your account secure, please don't
                                forward this email to anyone. See{' '}
                                <Link
                                    href="https://it.ucsb.edu/general-security-resources/password-best-practices"
                                    className="underline text-[#404040]"
                                >
                                    this page
                                </Link>
                                {' '}for more security tips.
                            </Text>
                            <Text className="text-[#404040] text-[16px] font-light leading-[26px] mt-4">
                                See you on the website!
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Html>
        </Tailwind>
    );
};

ResetPasswordEmail.PreviewProps = {
    userEmail: 'alan@mail.com',
    resetPasswordLink: 'https://www.wildtransfer.cloud',
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;
