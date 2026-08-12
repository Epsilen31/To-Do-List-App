function padCount(value) {
  return String(value).padStart(2, '0');
}

function CompleteBadge() {
  return (
    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#A3B1FF]">
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
        <rect
          x="2.5"
          y="2.5"
          width="15"
          height="15"
          rx="2.5"
          stroke="#1A1C3D"
          strokeWidth="1.7"
        />
        <path
          d="M6.2 10.2l2.3 2.3 5.1-5.2"
          stroke="#1A1C3D"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function PendingBadge() {
  return (
    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#FFB4BE]">
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
        <rect
          x="2.5"
          y="2.5"
          width="15"
          height="15"
          rx="2.5"
          stroke="#3A1C24"
          strokeWidth="1.7"
        />
        <path
          d="M7 7l6 6M13 7l-6 6"
          stroke="#3A1C24"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export default function StatCards({ completed = 0, pending = 0 }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <article className="rounded-[12px] bg-[#F0F4FF] px-3.5 py-3">
        <div className="flex items-center gap-2">
          <CompleteBadge />
          <p className="text-[13px] font-medium leading-none text-[#1A1C3D]">Task Complete</p>
        </div>
        <p className="mt-2.5 text-[28px] font-bold leading-none tracking-tight text-ink-900">
          {padCount(completed)}
        </p>
        <p className="mt-1.5 text-[11px] text-ink-400">This Week</p>
      </article>

      <article className="rounded-[12px] bg-[#FFEDEE] px-3.5 py-3">
        <div className="flex items-center gap-2">
          <PendingBadge />
          <p className="text-[13px] font-medium leading-none text-[#1A1C3D]">Task Pending</p>
        </div>
        <p className="mt-2.5 text-[28px] font-bold leading-none tracking-tight text-ink-900">
          {padCount(pending)}
        </p>
        <p className="mt-1.5 text-[11px] text-ink-400">This Week</p>
      </article>
    </div>
  );
}
