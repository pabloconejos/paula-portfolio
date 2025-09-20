// src/components/PortadaSwitcher.jsx
import { useEffect, useState } from "react";
import Manifiesto from "./manifiesto.jsx";
import ManifiestoVertical from "./manifiestoVertical.jsx";

export default function ManifiestoSwitcher() {
  const mq = "(orientation: portrait)";
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== "undefined" && window.matchMedia(mq).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(mq);
    const onChange = e => setIsPortrait(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isPortrait ? <ManifiestoVertical /> : <Manifiesto />;
}
