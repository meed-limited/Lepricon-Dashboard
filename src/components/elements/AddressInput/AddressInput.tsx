import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input, InputRef } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Jazzicons from "./Jazzicons";
import { getEllipsisTxt } from "../../../utils/format";
import { fetchEnsAddress, FetchEnsAddressResult, fetchEnsResolver } from "@wagmi/core";
import { utils } from "ethers";
import { useUserData } from "../../../context/UserContextProvider";
import { isProdEnv } from "../../../data/constant";

const AddressInput: React.FC<any> = (props: any) => {
    const input = useRef<InputRef>(null);
    const { chainId } = useUserData();
    const [address, setAddress] = useState<string>("");
    const [validatedAddress, setValidatedAddress] = useState<FetchEnsAddressResult | string>("");
    const [isDomain, setIsDomain] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (validatedAddress) props.onChange(isDomain ? validatedAddress : address);
        return;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, validatedAddress, isDomain, address]);

    const updateAddress = useCallback(async (value: string) => {
        setError("");
        setAddress(value);

        if (isSupportedDomain(value)) {
            if (isProdEnv) {
                const processPromise = function (promise: Promise<FetchEnsAddressResult> | Promise<string | null>) {
                    promise
                        .then((addr: FetchEnsAddressResult | string) => {
                            if (addr !== null && isAddress(addr)) {
                                setValidatedAddress(addr);
                                setIsDomain(true);
                            }
                        })
                        .catch(() => {
                            setValidatedAddress("");
                        });
                };
                if (value.endsWith(".eth")) {
                    processPromise(fetchEnsAddress({ name: value }));
                } else {
                    processPromise(
                        fetchEnsResolver({ name: value }).then((resolver) =>
                            resolver?.address ? resolver?.address : ""
                        )
                    );
                }
            } else setError("ENS not supported on this network. Are you connected on a testnet?");
        } else if (value.length === 42) {
            if (isAddress(value)) {
                setValidatedAddress(getEllipsisTxt(value, 10));
                setIsDomain(false);
            }
        } else {
            setValidatedAddress("");
            setIsDomain(false);
            setError("Invalid address. Please check your input.");
        }
    }, []);

    const Cross = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 22 22"
            strokeWidth="2"
            stroke="#E33132"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={() => {
                setAddress("");
                setValidatedAddress("");
                setIsDomain(false);
                setError("");
                setTimeout(() => {
                    if (input.current !== null) {
                        input.current.focus();
                    }
                });
            }}
            style={{ cursor: "pointer" }}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );

    return (
        <>
            <Input
                ref={input}
                placeholder={props.placeholder ? props.placeholder : "Public address"}
                prefix={
                    isDomain || address.length === 42 ? (
                        <Jazzicons seed={(isDomain && validatedAddress ? validatedAddress : address).toLowerCase()} />
                    ) : (
                        <SearchOutlined />
                    )
                }
                suffix={validatedAddress && <Cross />}
                autoFocus={props.autoFocus}
                value={isDomain && validatedAddress ? `${address} (${getEllipsisTxt(validatedAddress)})` : address}
                onChange={(e) => {
                    updateAddress(e.target.value);
                }}
                disabled={validatedAddress !== "" ? true : false}
                style={
                    validatedAddress ? { ...props?.style, border: "1px solid rgb(33, 191, 150)" } : { ...props?.style }
                }
            />
            {error && <p style={{ color: "red", marginBlock: "-15px 15px", fontSize: "12px" }}>{error}</p>}
        </>
    );
};

function isSupportedDomain(domain: string) {
    return [".eth", ".crypto", ".coin", ".wallet", ".bitcoin", ".x", ".888", ".nft", ".dao", ".blockchain"].some(
        (tld) => domain.endsWith(tld)
    );
}

// returns the checksummed address if the address is valid, otherwise returns false
function isAddress(value: any): string | false {
    try {
        // Alphabetical letters must be made lowercase for getAddress to work.
        // See documentation here: https://docs.ethers.io/v5/api/utils/address/
        return utils.getAddress(value.toLowerCase());
    } catch {
        return false;
    }
}

export default AddressInput;
