"use client";

import Link from "next/link";
import posthog from "posthog-js";
import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<typeof Link> & {
  ctaLocation: string;
  ctaLabel: string;
};

export function CtaLink({ ctaLocation, ctaLabel, onClick, ...props }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    posthog.capture("cta_clicked", {
      location: ctaLocation,
      button_text: ctaLabel,
    });
    onClick?.(e);
  };

  return <Link {...props} onClick={handleClick} />;
}
