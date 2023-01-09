import { FC } from "react";

import { Button } from "antd";

const ButtonMax: FC<ButtonMaxProps> = ({ amount, action }) => {
    const handleMax = () => {
        action(Math.floor(Number(amount)));
    };

    return (
        <div className="button-max">
            <div className="button-max-blue-small">
                <Button type="primary" shape="round" size="small" onClick={handleMax}>
                    max
                </Button>
            </div>
        </div>
    );
};

export default ButtonMax;
