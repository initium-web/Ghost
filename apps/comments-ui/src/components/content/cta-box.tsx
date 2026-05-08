import reactStringReplace from 'react-string-replace';
import { buildCommentPermalink } from '../../utils/helpers';
import { useAppContext } from '../../app-context';

type Props = {
  isFirst: boolean;
  isPaid: boolean;
  // When the CTA was opened by clicking "Reply" on a comment, this is that
  // comment's id — used to return the reader to it after signing in.
  commentId?: string;
};
const CTABox: React.FC<Props> = ({ isFirst, isPaid, commentId }) => {
  const { publication, member, t, commentCount, institutional } = useAppContext();

  if (institutional) {
    return null;
  }

  const buttonStyle = {
    backgroundColor: '#29A6C9',
  };

  const linkStyle = {
    color: '#29A6C9',
  };

  const titleText = commentCount === 0 ? t('Start the conversation') : t('Join the discussion');

  const handleSignUpClick = () => {
    window.location.href = isPaid && member ? '#/portal/account/plans' : '#/portal/signup';
  };

  const handleSignInClick = () => {
    // Ask Portal to return the reader to this comment after signing in. The
    // redirect must be absolute (it is emailed as part of the magic link),
    // so it is built from the live page URL at click time.
    if (commentId) {
      const redirect = new URL(window.location.href);
      redirect.hash = buildCommentPermalink(commentId);
      window.location.href = `#/portal/signin?redirect=${encodeURIComponent(redirect.toString())}`;
      return;
    }
    window.location.href = '#/portal/signin';
  };

  const text = reactStringReplace(
    isPaid
      ? t('Become a paid member of {publication} to start commenting.')
      : t('Become a member of {publication} to start commenting.'),
    '{publication}',
    () => <span className="font-semibold">{publication}</span>,
  );

  return (
    <>
      <div className="flex flex-1 flex-col items-start text-center sm:items-start sm:text-left">
        <h1 className={`mb-2 text-left font-sans text-lg tracking-tight text-black sm:text-xl dark:text-[rgba(255,255,255,0.85)] ${isFirst ? 'font-semibold' : 'font-bold'}`}>
          {titleText}
        </h1>
        <p className="text-md mb-[28px] w-full text-left font-sans font-normal leading-normal tracking-normal text-neutral-500 sm:max-w-screen-sm dark:text-[rgba(255,255,255,0.85)]">
          {text}
        </p>
        <button className="mb-3 inline-block rounded px-5 py-[14px] font-sans text-lg font-medium leading-none tracking-wider text-white transition-all hover:opacity-90" data-testid="signup-button" style={buttonStyle} type="button" onClick={handleSignUpClick}>
          {isPaid && member ? t('Upgrade now') : t('Sign up now')}
        </button>
        {!member && (
          <p className="text-md text-left font-sans text-neutral-500 dark:text-[rgba(255,255,255,0.5)]">
            <span className="text-md mr-1 inline-block">{t('Already a member?')}</span>
            <button className="text-md rounded-md font-semibold transition-all hover:opacity-90" data-testid="signin-button" style={linkStyle} type="button" onClick={handleSignInClick}>
              {t('Sign in')}
            </button>
          </p>
        )}
      </div>
      <img alt="CTA Box Illustration" className="h-40 w-auto sm:h-56" src="/assets/images/bubble.png" />
    </>
  );
};

export default CTABox;
