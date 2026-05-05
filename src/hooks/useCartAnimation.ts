import { useState } from "react";

export function useCartAnimation() {
  const [flying, setFlying] = useState(false);

  const triggerFly = () => {
    setFlying(true);
    setTimeout(() => setFlying(false), 600);
  };

  return { flying, triggerFly };
}