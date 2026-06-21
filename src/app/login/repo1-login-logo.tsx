'use client';

import type { LoginLogoProps } from 'venky-core/ui';
import { APP_NAME } from '@/lib/common/ui-constants';
import { cn } from '@/lib/utils';

export function Repo1LoginLogo({ className, fill = '#512eff', maxHeight = 58 }: LoginLogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)} style={{ maxHeight }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="h-12 w-12 shrink-0"
      >
        <text
          x="24"
          y="33"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
          fontSize="28"
          fontWeight="700"
          fill={fill}
        >
          R
        </text>
      </svg>
      <span
        className="font-semibold text-3xl text-white tracking-tight"
        style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}
      >
        {APP_NAME}
      </span>
    </div>
  );
}
