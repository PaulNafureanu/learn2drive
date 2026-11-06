import { useSanityQuery } from "../../../hooks/useSanityQuery";
import { NAVBAR_LISTEN_QUERY, NAVBAR_QUERY } from "../queries";
import DesktopNav from "./desktopNav";
import ErrorNav from "./errorNav";
import LogoNav, { type LogoProps } from "./logoNav";
import MobileNav from "./mobileNav";

type SubNavigationItem = {
  _key: string;
  label: string;
  href: string;
};

export type NavigationItem = {
  _key: string;
  label: string;
  href?: string;
  children?: SubNavigationItem[];
};

type NavBarData = {
  navigation: NavigationItem[];
};

type Props = {
  logo: LogoProps;
};

export default function NavBar({ logo }: Props) {
  const { data, error } = useSanityQuery<NavBarData>({
    loadingQuery: NAVBAR_QUERY,
    listeningQuery: NAVBAR_LISTEN_QUERY,
    loadingErrorMsg: "Failed to load navigation",
    listeningErrorMsg: "Navigation listener failed",
  });

  const navigation = data?.navigation ?? [];

  return (
    <header className="relative w-full border-b border-gray-200 bg-white">
      <nav aria-label="Navigare principală" className="mx-auto flex max-w-[90%] items-center justify-between px-6 py-4">
        <LogoNav schoolName={logo.schoolName} logoUrl={logo.logoUrl} />
        <DesktopNav navigation={navigation} />
        <MobileNav navigation={navigation} />
      </nav>
      <ErrorNav error={error && !data} />
    </header>
  );
}
