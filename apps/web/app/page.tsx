"use client";

import { categoryIcons, categoryLabels } from "@/lib/tools/tool-icons";
import { APP_VERSION_SHORT } from "@/lib/version";
import type { TablerIcon } from "@tabler/icons-react";

type IconItem = {
  key: string;
  Icon: TablerIcon;
  label: string;
};

function MarqueeItem({ itemKey, Icon, label, isDuplicate = false }: IconItem & { itemKey: string; isDuplicate?: boolean }) {
  return (
    <div
      key={itemKey}
      className="marquee-item group"
      aria-hidden={isDuplicate}
    >
      <Icon size={30} stroke={1.5} className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
    </div>
  );
}

export default function Page() {
  const icons: IconItem[] = Object.entries(categoryIcons).map(([key, Icon]) => ({
    key,
    Icon,
    label: categoryLabels[key] || key,
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 animate-fade-in gap-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-5xl font-bold text-center animate-slide-up">thedev.tools</h1>
        <span className="text-sm text-gray-500 dark:text-gray-500 font-mono">v{APP_VERSION_SHORT}</span>
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-2xl animate-fade-in-delay">
        A comprehensive collection of developer tools and utilities for web development.
        All tools run client-side in your browser - no backend required.
      </p>
      <div className="marquee-wrapper mt-10">
        <div className="marquee-track">
          {icons.map((item) => (
            <MarqueeItem key={item.key} itemKey={item.key} Icon={item.Icon} label={item.label} />
          ))}
          {icons.map((item) => (
            <MarqueeItem key={`${item.key}-dup`} itemKey={`${item.key}-dup`} Icon={item.Icon} label={item.label} isDuplicate />
          ))}
        </div>
      </div>
    </div>
  )
}
