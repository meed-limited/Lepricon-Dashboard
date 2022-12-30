import { FC, MouseEventHandler } from "react";
import { Button } from "antd";

type ButtonActionProps = {
    title: string;
    action: MouseEventHandler<HTMLAnchorElement> & MouseEventHandler<HTMLButtonElement>;
};

const ButtonAction: FC<ButtonActionProps> = ({ title, action }) => {
    return (
        <Button type="primary" className="button-colored-green-action" onClick={action}>
            {title}
        </Button>
    );
};

export default ButtonAction;
