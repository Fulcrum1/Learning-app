import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function NavButton({
  label,
  icon: Icon,
  href,
  items,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  items?: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
  }[];
  onClick?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (items) {
    return (
      <div className="flex flex-col">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-800/30 transition-all duration-300 cursor-pointer`}
        >
          <Icon className="w-6 h-6 flex-shrink-0" />
          <span className="font-medium text-base">{label}</span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 ml-auto" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-auto" />
          )}
        </button>
        {isOpen && (
          <div className="ml-6 space-y-2">
            {items.map((subItem) => (
              <Link
                key={subItem.id}
                href={subItem.href}
                className={`flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-800/30 transition-all duration-200`}
              >
                <subItem.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{subItem.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-800/30 transition-all duration-300`}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <span className="font-medium text-base">{label}</span>
    </a>
  );
}
