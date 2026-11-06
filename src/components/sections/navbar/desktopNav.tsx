import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { NavigationItem } from "./NavBar";

type Props = {
  navigation: NavigationItem[];
};

export default function DesktopNav({ navigation }: Props) {
  const [desktopDropdown, setDesktopDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  function toggleDesktopDropdown(key: string) {
    setDesktopDropdown((prev) => (prev === key ? null : key));
  }

  function closeDesktopDropdown() {
    setDesktopDropdown(null);
  }

  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeDesktopDropdown();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDesktopDropdown();
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={navRef} className="hidden items-center gap-8 md:flex">
      {navigation.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const isDropdownOpen = desktopDropdown === item._key;

        if (!hasChildren) {
          return (
            <a
              key={item._key}
              href={item.href}
              onClick={closeDesktopDropdown}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
            >
              {item.label}
            </a>
          );
        }

        return (
          <div key={item._key} className="relative">
            {/* Dropdown trigger */}
            <button
              type="button"
              onClick={() => toggleDesktopDropdown(item._key)}
              aria-expanded={isDropdownOpen}
              aria-controls={`desktop-dropdown-${item._key}`}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
            >
              {item.label}

              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 transition-transform duration-200 ease-in-out motion-reduce:transition-none ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Animated desktop dropdown */}
            <div
              id={`desktop-dropdown-${item._key}`}
              inert={!isDropdownOpen}
              className={`absolute top-full left-0 z-50 min-w-48 pt-3
                transition-[opacity,transform,visibility] duration-200 ease-out
                motion-reduce:transition-none
                ${
                  isDropdownOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible pointer-events-none -translate-y-2 opacity-0"
                }`}
            >
              <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                {item.children?.map((child) => (
                  <a
                    key={child._key}
                    href={child.href}
                    onClick={closeDesktopDropdown}
                    className="block rounded-md px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600"
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
