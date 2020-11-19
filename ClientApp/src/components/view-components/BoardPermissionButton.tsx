import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

interface Props {
    permissionLevel: string;
    className: string;
  }

const BoardPermissionButton = (props: Props) => {
    const permissionDescriptions : any = {
        "Owner" : "You have full control of this board",
        "User" : "You can edit and move tasks but cannot delete objects",
        "Viewer" : "You can view, manipulate UI, but cannot change data in the database for this board",
    }
    return (
        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{permissionDescriptions[props.permissionLevel]}</Tooltip>}>
            <span className={props.className}>
                <Button variant="secondary" style={{ pointerEvents: 'none' }}>
                    Permission level: {props.permissionLevel}
                </Button>
            </span>
        </OverlayTrigger>
    )
}

export default BoardPermissionButton
