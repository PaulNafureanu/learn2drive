import ComingSoon from "./pages/ComingSoon";
import Website from "./pages/Website";

export default function App() {
  const isPreview = import.meta.env.VITE_SITE_MODE === "preview";

  return isPreview ? <Website /> : <ComingSoon />;
}
