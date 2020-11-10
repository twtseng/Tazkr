import React from 'react'
import { Form } from 'react-bootstrap';

interface Props {
    updateTitle: () => void;
    title: string;
    setTitle: (title: string) => void;
    className: string;
    size?: "sm" | "lg";
}

const TitleEdit: React.FC<Props> = (props: Props) => {
    const [titleReadOnly, setTitleReadOnly] = React.useState<boolean>(true);
    const handleKeyPress = (event: any) => {
        if(event.key === 'Enter'){
            sendUpdateTitleRequest();
        }
    }
  
    const sendUpdateTitleRequest = () => {
        props.updateTitle();
        setTitleReadOnly(true);
        const selection = document.getSelection();
        if (selection !== null) {
            selection.removeAllRanges();
        }
        const activeElement = document.activeElement;
        if (activeElement !== null) {
            try {
                (activeElement as HTMLElement).blur();
            } catch (err) {
                console.log(`TitleEdit.sendUpdateTitleRequest blur failed, error: ${err}`);
            }
        }
    }
    const onClick = (e: any) => {
        e.stopPropagation();
        setTitleReadOnly(false);
        e.target.select();
    }
    return (
        <Form.Control
            className={props.className}
            size={props.size}
            type="text"
            value={props.title} 
            onChange={e => props.setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            onClick={onClick}
            onMouseLeave={sendUpdateTitleRequest}
            readOnly={titleReadOnly}
            style={titleReadOnly ? {backgroundColor:"transparent", border:"none"} : {}}
        />
    )
}

export default TitleEdit
