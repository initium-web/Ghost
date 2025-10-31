import reactStringReplace from 'react-string-replace';
import {useAppContext} from '../../AppContext';

type Props = {
    isFirst: boolean,
    isPaid: boolean
};
const CTABox: React.FC<Props> = ({isFirst, isPaid}) => {

    const {publication, member, t, commentCount, institutional} = useAppContext();
        
    if (institutional) {
        return null;
    }

    const buttonStyle = {
        backgroundColor: "#29A6C9"
    };

    const linkStyle = {
        color: "#29A6C9"
    };

    const titleText = (commentCount === 0 ? t('Start the conversation') : t('Join the discussion'));

    const handleSignUpClick = () => {
        window.location.href = (isPaid && member) ? '#/portal/account/plans' : '#/portal/signup';
    };

    const handleSignInClick = () => {
        window.location.href = '#/portal/signin';
    };

    const text = reactStringReplace(isPaid ? t('Become a paid member of {publication} to start commenting.') : t('Become a member of {publication} to start commenting.'), '{publication}', () => (
        <span className="font-semibold">{publication}</span>
    ));

    return (
        <>
            <div className="flex flex-col items-start sm:items-start flex-1 text-center sm:text-left">
                <h1 className={`mb-2 text-left font-sans text-lg sm:text-xl tracking-tight  text-black dark:text-[rgba(255,255,255,0.85)] ${isFirst ? 'font-semibold' : 'font-bold'}`}>
                    {titleText}
                </h1>
                <p className="mb-[28px] w-full text-left font-sans text-md leading-normal font-normal tracking-normal text-neutral-500 sm:max-w-screen-sm dark:text-[rgba(255,255,255,0.85)]">
                    {text}
                </p>
                <button className="text-lg mb-3 inline-block rounded px-5 py-[14px] font-sans tracking-wider font-medium leading-none text-white transition-all hover:opacity-90" data-testid="signup-button" style={buttonStyle} type="button" onClick={handleSignUpClick}>
                    {(isPaid && member) ? t('Upgrade now') : t('Sign up now')}
                </button>
                {!member && (<p className="text-md text-left font-sans text-neutral-500 dark:text-[rgba(255,255,255,0.5)]">
                    <span className='mr-1 inline-block text-md'>{t('Already a member?')}</span>
                    <button className="rounded-md text-md font-semibold transition-all hover:opacity-90" data-testid="signin-button" style={linkStyle} type="button" onClick={handleSignInClick}>{t('Sign in')}</button>
                </p>)}
            </div>
            <img src="/assets/images/bubble.png" alt="CTA Box Illustration" className="h-40 sm:h-56 w-auto" />
        </>
    );
};

export default CTABox;
