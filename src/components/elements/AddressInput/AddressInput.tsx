import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input, InputRef } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Jazzicons from "./Jazzicons";
import { getEllipsisTxt } from "../../../utils/format";

const AddressInput: React.FC<any> = (props: any) => {
    const input = useRef<InputRef>(null);
    const [address, setAddress] = useState("");
    const [validatedAddress, setValidatedAddress] = useState("");
    const [isDomain, setIsDomain] = useState(false);

    useEffect(() => {
        if (validatedAddress) props.onChange(isDomain ? validatedAddress : address);
        return;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, validatedAddress, isDomain, address]);

    const updateAddress = useCallback(
        async (value: any) => {
            setAddress(value);
            if (isSupportedDomain(value)) {
                const processPromise = function (promise: any) {
                    promise
                        .then((addr: any) => {
                            setValidatedAddress(addr);
                            setIsDomain(true);
                        })
                        .catch(() => {
                            setValidatedAddress("");
                        });
                };
                if (value.endsWith(".eth")) {
                    const resolver = await web3?.getResolver(value);
                    if (resolver) {
                        processPromise(resolver.address);
                    }
                } else {
                    processPromise(
                        resolveDomain({
                            domain: value,
                        }).then((r: { address: any }) => r?.address)
                    );
                }
            } else if (value.length === 42) {
                setValidatedAddress(getEllipsisTxt(value, 10));
                setIsDomain(false);
            } else {
                setValidatedAddress("");
                setIsDomain(false);
            }
        },
        [resolveDomain, web3?.getResolver]
    );

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
                setValidatedAddress("");
                setIsDomain(false);
                setTimeout(function () {
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
        <Input
            ref={input}
            placeholder={props.placeholder ? props.placeholder : "Public address"}
            prefix={
                isDomain || address.length === 42 ? (
                    <Jazzicons seed={(isDomain ? validatedAddress : address).toLowerCase()} />
                ) : (
                    <SearchOutlined />
                )
            }
            suffix={validatedAddress && <Cross />}
            autoFocus={props.autoFocus}
            value={isDomain ? `${address} (${getEllipsisTxt(validatedAddress)})` : validatedAddress || address}
            onChange={(e: { target: { value: any } }) => {
                updateAddress(e.target.value);
            }}
            disabled={validatedAddress.length > 0 ? true : false}
            style={validatedAddress ? { ...props?.style, border: "1px solid rgb(33, 191, 150)" } : { ...props?.style }}
        />
    );
};

function isSupportedDomain(domain: string) {
    return [".eth", ".crypto", ".coin", ".wallet", ".bitcoin", ".x", ".888", ".nft", ".dao", ".blockchain"].some(
        (tld) => domain.endsWith(tld)
    );
}

export default AddressInput;

// const updateAddress = useCallback(
//   async (value: any) => {
//     setAddress(value);
//     if (isSupportedDomain(value)) {
//       const processPromise = function (promise: Promise<any>) {
//         promise
//           .then((addr) => {
//             setValidatedAddress(addr);
//             setIsDomain(true);
//           })
//           .catch(() => {
//             setValidatedAddress("");
//           });
//       };
//       if (value.endsWith(".eth")) {
//         processPromise(web3?.eth?.ens?.getAddress(value));
//       } else {
//         processPromise(
//           resolveDomain({
//             domain: value,
//           }).then((r) => r?.address)
//         );
//       }
//     } else if (value.length === 42) {
//       setValidatedAddress(getEllipsisTxt(value, 10));
//       setIsDomain(false);
//     } else {
//       setValidatedAddress("");
//       setIsDomain(false);
//     }
//   },
//   [resolveDomain, web3?.eth?.ens]
// );
