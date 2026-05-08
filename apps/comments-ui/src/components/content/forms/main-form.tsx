import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Form, FormWrapper } from './form';
import { scrollToElement } from '../../../utils/helpers';
import { useAppContext } from '../../../app-context';
import { useEditor } from '../../../utils/hooks';

type Props = {
  commentsCount: number;
};

const MainForm: React.FC<Props> = ({ commentsCount }) => {
  const { postId, dispatchAction, t } = useAppContext();

  const editorConfig = useMemo(
    () => ({
      placeholder: commentsCount === 0 ? t('Start the conversation') : t('Join the discussion'),
      autofocus: false,
    }),
    [commentsCount],
  );

  const { editor, hasContent } = useEditor(editorConfig);
  const { member } = useAppContext();

  const submit = useCallback(
    async ({ html }) => {
      // Send comment to server
      await dispatchAction('addComment', {
        post_id: postId,
        status: 'published',
        html,
      });

      // Keep the stored expertise format in sync with the member's current Plus tier.
      let rawExpertise = member?.expertise;
      const booleanBadge = rawExpertise?.split('||')[0] === '1';
      const textExpertise = rawExpertise?.split('||')[1] || '';
      let hasPlusTier = false;
      if (member?.subscriptions?.length) {
        hasPlusTier = member.subscriptions.some(
          (subscription: any) => subscription.tier && subscription.tier.name?.toLowerCase().includes('守護'),
        );
      }
      if ((hasPlusTier && !booleanBadge) || (!hasPlusTier && booleanBadge)) {
        rawExpertise = `${hasPlusTier ? '1' : '0'}||${textExpertise}`;
      }
      await dispatchAction('updateMember', {
        expertise: rawExpertise,
        name: member?.name,
      });

      editor?.commands.clearContent();
    },
    [postId, dispatchAction, editor, member],
  );

  // C keyboard shortcut to focus main form
  const formEl = useRef<HTMLDivElement>(null);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);

  useEffect(() => {
    if (!editor) {
      return;
    }

    // Add some basic keyboard shortcuts
    // ESC to blur the editor
    const keyDownListener = (event: KeyboardEvent) => {
      if (!editor) {
        return;
      }

      if (event.metaKey || event.ctrlKey) {
        // CMD on MacOS or CTRL
        // Don't do anything
        return;
      }

      let focusedElement = document.activeElement as HTMLElement | null;
      while (focusedElement && focusedElement.tagName === 'IFRAME') {
        if (!(focusedElement as HTMLIFrameElement).contentDocument) {
          // CORS issue
          // disable the C shortcut when we have a focused external iframe
          break;
        }

        focusedElement = ((focusedElement as HTMLIFrameElement).contentDocument?.activeElement ??
          null) as HTMLElement | null;
      }
      const hasInputFocused =
        focusedElement &&
        (focusedElement.tagName === 'INPUT' ||
          focusedElement.tagName === 'TEXTAREA' ||
          focusedElement.tagName === 'IFRAME' ||
          focusedElement.contentEditable === 'true');

      if (event.key === 'c' && !editor?.isFocused && !hasInputFocused) {
        editor?.commands.focus();

        if (formEl.current) {
          scrollToElement(formEl.current);
        }
        return;
      }
    };

    // Note: normally we would need to attach this listener to the window + the iframe window. But we made listener
    // in the Iframe component that passes down all the keydown events to the main window to prevent that
    window.addEventListener('keydown', keyDownListener, { passive: true });

    return () => {
      window.removeEventListener('keydown', keyDownListener);
    };
  }, [editor]);

  const submitProps = {
    submitText: (
      <>
        <span className="hidden sm:inline">{t('Add comment')} </span>
        <span className="sm:hidden">{t('Comment')}</span>
      </>
    ),
    submitSize: 'large' as const,
    submit,
  };

  const isOpen = editor?.isFocused || hasContent || hasFocusWithin;

  const handleBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setHasFocusWithin(false);
    }
  }, []);

  return (
    <div
      ref={formEl}
      className="px-2 pb-2 pt-3"
      data-testid="main-form"
      onBlurCapture={handleBlur}
      onFocusCapture={() => setHasFocusWithin(true)}
    >
      <FormWrapper editor={editor} isOpen={isOpen} reduced={false}>
        <Form editor={editor} isOpen={isOpen} reduced={false} {...submitProps} />
      </FormWrapper>
    </div>
  );
};

export default MainForm;
