import { FC, SetStateAction } from "react";

import { Button } from "antd";

type AmountButtonProps = {
    buttonText: string;
    tokenBalance?: string;
    buttonFunction: (value: SetStateAction<number>) => void;
};

const AmountButton: FC<AmountButtonProps> = ({ buttonText, tokenBalance, buttonFunction }) => {
    const calculateAmount = () => {
        if (tokenBalance) {
            if (buttonText === "25%") {
                const amount = Math.floor(Number(tokenBalance) * 0.25);
                buttonFunction(amount);
            } else if (buttonText === "50%") {
                const amount = Math.floor(Number(tokenBalance) * 0.5);
                buttonFunction(amount);
            } else if (buttonText === "75%") {
                const amount = Math.floor(Number(tokenBalance) * 0.75);
                buttonFunction(amount);
            } else if (buttonText === "100%") {
                const amount = Math.floor(Number(tokenBalance));
                buttonFunction(amount);
            }
        }
    };

    const onClickFunction =
        buttonText === "max" ? () => buttonFunction(Math.floor(Number(tokenBalance))) : calculateAmount;

    return (
        <div style={{ display: "flex", alignContent: "center", width: "100%", flexWrap: "wrap" }}>
            <Button
                type="primary"
                shape="round"
                size="small"
                onClick={() => onClickFunction()}
                className="max-button-blue-small"
            >
                {buttonText}
            </Button>
        </div>
    );
};

export default AmountButton;
