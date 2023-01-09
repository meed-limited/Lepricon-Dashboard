import { FC } from "react";

import { Button } from "antd";

const ButtonAction: FC<ButtonActionProps> = ({ title, action }) => {
    return (
        <Button type="primary" className="button-colored-green-action" onClick={action}>
            {title}
        </Button>
    );
};

export default ButtonAction;
