import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/layout/MobileShell';
import { completeOnboarding } from '../utils/onboarding';

function ZigZag({ className = '' }) {
  return (
    <svg
      className={className}
      width="96"
      height="72"
      viewBox="0 0 96 72"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 18 L20 6 L36 18 L52 6 L68 18 L84 6"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 34 L20 22 L36 34 L52 22 L68 34 L84 22"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 50 L20 38 L36 50 L52 38 L68 50 L84 38"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 66 L20 54 L36 66 L52 54 L68 66 L84 54"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();

  function handleGetStarted() {
    completeOnboarding();
    navigate('/', { replace: true });
  }

  return (
    <MobileShell className="flex h-full flex-col overflow-hidden bg-white">
      <div className="relative min-h-0 flex-[1.55] overflow-hidden bg-brand-500">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border-[18px] border-white/15" />
        <div className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full border-[14px] border-white/10" />
        <ZigZag className="absolute left-6 top-14 text-white/25" />
        <ZigZag className="absolute bottom-10 right-4 text-white/20" />
      </div>

      <div className="flex shrink-0 flex-col bg-white px-7 pb-8 pt-8">
        <h1 className="text-[26px] font-bold leading-tight tracking-[-0.02em] text-ink-900">
          Manage What To Do
        </h1>
        <p className="mt-2.5 max-w-[280px] text-[14px] leading-[1.55] text-ink-500">
          The best way to manage what you have to do, don&apos;t forget your plans
        </p>
        <button type="button" className="primary-btn mt-8" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </MobileShell>
  );
}
