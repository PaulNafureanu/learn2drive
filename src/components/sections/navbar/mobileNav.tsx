import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import type { NavigationItem } from "./NavBar";

type Props = {
  navigation: NavigationItem[];
};

export default function MobileNav({ navigation }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  function toggleMobileDropdown(key: string) {
    setMobileDropdown((prev) => (prev === key ? null : key));
  }

  function closeMobileMenu() {
    setIsOpen(false);
    setMobileDropdown(null);
  }

  function toggleMobileMenu() {
    if (isOpen) {
      closeMobileMenu();
    } else {
      setIsOpen(true);
    }
  }

  return (
    <div
      className="md:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          closeMobileMenu();
        }
      }}
    >
      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={toggleMobileMenu}
        aria-label={isOpen ? "Închide meniul" : "Deschide meniul"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        className="relative flex h-10 w-10 items-center justify-center text-gray-900"
      >
        <Menu
          aria-hidden="true"
          className={`absolute h-6 w-6 transition-all duration-300 motion-reduce:transition-none ${
            isOpen ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />

        <X
          aria-hidden="true"
          className={`absolute h-6 w-6 transition-all duration-300 motion-reduce:transition-none ${
            isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
          }`}
        />
      </button>

      {/* Mobile navigation */}
      <div
        id="mobile-navigation"
        inert={!isOpen}
        className={`absolute top-full left-0 z-50 w-full border-t border-gray-200 bg-white px-6 py-4 shadow-lg
          transition-[opacity,transform,visibility] duration-300 ease-out
          motion-reduce:transition-none
          ${isOpen ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none -translate-y-2 opacity-0"}`}
      >
        <div className="mx-auto flex flex-col gap-4 max-w-[90%]">
          {navigation.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isDropdownOpen = mobileDropdown === item._key;

            if (!hasChildren) {
              return (
                <a
                  key={item._key}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <div key={item._key}>
                {/* Accordion trigger */}
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown(item._key)}
                  aria-expanded={isDropdownOpen}
                  aria-controls={`mobile-dropdown-${item._key}`}
                  className="flex w-full items-center justify-between text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  {item.label}

                  <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 transition-transform duration-200 ease-in-out motion-reduce:transition-none ${
                      isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {/* Animated accordion content */}
                <div
                  id={`mobile-dropdown-${item._key}`}
                  inert={!isDropdownOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
                    isDropdownOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="flex flex-col gap-3 pl-4 pt-3">
                      {item.children?.map((child) => (
                        <a
                          key={child._key}
                          href={child.href}
                          onClick={closeMobileMenu}
                          className="text-sm text-gray-600 transition-colors hover:text-blue-600"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
