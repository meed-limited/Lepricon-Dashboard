import CoolLepricat from "public/nft/CoolLepricat.png";
import LuckyLepricat from "public/nft/LuckyLepricat.png";
import MerryMollyNakamoto from "public/nft/MerryMollyNakamoto.gif";
import potOgold from "public/nft/potOgold.png";
import SneakyLuckleaf from "public/nft/SneakyLuckleaf.gif";
import WittyKingPatrick from "public/nft/WittyKingPatrick.gif";

export const getBoostAttributes = (nft: Nft) => {
    const attributes = nft.metadata.attributes;

    if (Array.isArray(attributes)) {
        const boost = attributes.filter((item) => item.trait_type === "APY booster");
        if (boost && boost.length > 0) {
            return `${boost[0].value}%`;
        } else {
            const isMaxBoost = attributes.some((item) => item.trait_type === "77.7% APY Fixed");
            return isMaxBoost && nft.name === "Pot o' Gold" ? "10%" : "0%";
        }
    }
    return 0;
};

export const getTierAttributes = (nft: Nft) => {
    const attributes = nft.metadata.attributes;

    if (Array.isArray(attributes)) {
        const rarity = attributes.filter((item) => item.trait_type === "Tier");
        return rarity[0].value;
    }
    return undefined;
};

export const getSeriesAttributes = (nft: Nft) => {
    const attributes = nft.metadata.attributes;

    if (Array.isArray(attributes)) {
        const serie = attributes.filter((item) => item.trait_type === "Series");
        return serie[0].value;
    }
    return undefined;
};

export const getEditionAttributes = (nft: Nft) => {
    const attributes = nft.metadata.attributes;

    if (Array.isArray(attributes)) {
        const edition = attributes.filter((item) => item.trait_type === "Edition");
        return edition[0].value;
    }
    return undefined;
};

export const getNftImage = (nft: Nft) => {
    const name = nft.name;
    if (name.includes("Cool Lepricat")) {
        return CoolLepricat;
    } else if (name.includes("Lucky Lepricat")) {
        return LuckyLepricat;
    } else if (name.includes("Sneaky Luckleaf")) {
        return SneakyLuckleaf;
    } else if (name.includes("Merry Molly")) {
        return MerryMollyNakamoto;
    } else if (name.includes("King Patrick")) {
        return WittyKingPatrick;
    } else if (name.includes("Pot")) {
        return potOgold;
    }
};
