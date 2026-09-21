import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    if (isMobile === undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMobile(mql.matches)
    }
    const onChange = () => {
      if (mounted) setIsMobile(mql.matches)
    }
    mql.addEventListener("change", onChange)
    return () => {
      mounted = false;
      mql.removeEventListener("change", onChange)
    }
  }, [isMobile])

  return !!isMobile
}
