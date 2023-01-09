import { useRouter } from "next/router";
import { URL } from "../data/constant";

export const useCurrentUrl = () => {
    const { asPath } = useRouter();

    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
    const currentUrl = `${origin}${asPath}`;
    const isHome = currentUrl === URL;

    return { currentUrl, isHome };
};
