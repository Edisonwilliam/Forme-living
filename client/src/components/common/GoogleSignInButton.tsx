/**
 * FORME Living — Google Sign-In Component
 * Uses Google Identity Services (GIS) to securely sign in or register
 * without transmitting passwords or exposing client secrets.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => Promise<void>;
  onError?: (error: string) => void;
  disabled?: boolean;
  buttonText?: 'signin_with' | 'signup_with' | 'continue_with';
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
              locale?: string;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

// ─── Module-level state: survives component remounts ────────────────────────
// Tracks which client ID (if any) the GIS library was initialized for.
let gsiInitializedFor: string | null = null;

// The one-and-only callback we hand to Google. It dispatches to whichever
// component instance is currently mounted.
let currentCredentialHandler: ((credential: string) => void) | null = null;

const stableCredentialCallback = (response: { credential: string }) => {
  if (response?.credential) {
    currentCredentialHandler?.(response.credential);
  }
};

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  disabled = false,
  buttonText = 'continue_with',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [configMissing, setConfigMissing] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  // Keep latest callbacks in refs so the GIS effect never needs them as deps.
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // Effect 1: register the credential handler for this instance.
  useEffect(() => {
    currentCredentialHandler = async (credential: string) => {
      setIsLoading(true);
      try {
        await onSuccessRef.current(credential);
      } catch (err: any) {
        onErrorRef.current?.(
          err?.response?.data?.message ||
          err?.message ||
          'Google authentication failed. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    return () => {
      // Only clear if this instance still owns the handler.
      if (currentCredentialHandler) currentCredentialHandler = null;
    };
  }, []);

  // Effect 2: load GIS script + initialize + render button.
  // Deps are only [clientId, buttonText] — callbacks are read from refs.
  useEffect(() => {
    if (!clientId) {
      setConfigMissing(true);
      return;
    }
    setConfigMissing(false);

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const tryRender = (): boolean => {
      if (cancelled) return true;
      if (!window.google?.accounts?.id) return false;
      if (!containerRef.current) return false;

      // Initialize exactly once per client ID for the whole page.
      if (gsiInitializedFor !== clientId) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: stableCredentialCallback,
            cancel_on_tap_outside: true,
          });
          gsiInitializedFor = clientId;
        } catch (e) {
          // If initialize throws, don't mark as initialized so we can retry.
          console.warn('GIS initialize failed:', e);
          return false;
        }
      }

      // renderButton is safe to call repeatedly — it just repaints the iframe.
      containerRef.current.innerHTML = '';
      const availableWidth = containerRef.current.parentElement?.clientWidth || 380;
      const buttonWidth = Math.max(200, Math.min(380, Math.floor(availableWidth)));
      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: buttonText,
        shape: 'rectangular',
        width: buttonWidth,
        logo_alignment: 'center',
      });
      return true;
    };

    if (!tryRender()) {
      // Poll until the GIS script finishes loading.
      intervalId = setInterval(() => {
        if (tryRender() && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }, 300);
    }

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [clientId, buttonText]);

  const handleManualClick = () => {
    if (configMissing) {
      onErrorRef.current?.(
        'Google OAuth Client ID is not configured. Please add VITE_GOOGLE_CLIENT_ID to client/.env and GOOGLE_CLIENT_ID to server/.env.'
      );
      return;
    }
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      onErrorRef.current?.(
        'Google Identity Services library is still loading. Please try again in a moment.'
      );
    }
  };

  return (
    <div className="w-full space-y-2">
      <div
        ref={containerRef}
        className={`w-full flex justify-center min-h-[44px] ${configMissing ? 'hidden' : ''
          } ${disabled || isLoading ? 'pointer-events-none opacity-60' : ''}`}
      />

      {configMissing && (
        <button
          type="button"
          onClick={handleManualClick}
          disabled={disabled || isLoading}
          className="w-full py-2.5 px-4 border border-forme-cream bg-white hover:bg-forme-ivory/50 transition-colors flex items-center justify-center space-x-3 text-xs font-medium text-forme-charcoal rounded-sm shadow-xs group"
          title="Google Client ID needs configuration in .env"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-forme-terracotta" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>
      )}

      {configMissing && (
        <div className="flex items-start space-x-1.5 text-[11px] text-amber-800 bg-amber-50 p-2 border border-amber-200/80 rounded-xs">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600" />
          <span>
            Google Sign-In ready. To enable live Google popups, set{' '}
            <code className="font-mono text-[10px] bg-amber-100 px-1 py-0.5 rounded-xs">
              VITE_GOOGLE_CLIENT_ID
            </code>{' '}
            in <code className="font-mono text-[10px]">client/.env</code>.
          </span>
        </div>
      )}
    </div>
  );
};