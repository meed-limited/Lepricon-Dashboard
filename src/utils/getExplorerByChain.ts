import { isProdEnv } from "../data/constant";
import { mumbai, polygon } from "../data/networks";

export const getExplorer = () => {
    if (isProdEnv) {
        return polygon.blockExplorers?.default.url;
    } else return mumbai.blockExplorers?.default.url;
};
