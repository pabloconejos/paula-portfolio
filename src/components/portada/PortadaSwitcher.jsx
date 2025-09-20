// src/components/PortadaSwitcher.jsx
import { useEffect, useState } from "react";
import Portada from "./portada.jsx";
import PortadaVertical from "./portadaVertical.jsx";

export default function PortadaSwitcher() {
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

  return isPortrait ? <PortadaVertical /> : <Portada />;
}
