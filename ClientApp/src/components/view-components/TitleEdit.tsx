import React from 'react'
import { Form } from 'react-bootstrap';

interface Props {
    updateTitle: () => void;
    title: string;
    setTitle: (title: string) => void;
    className: string;
    size: "sm" | "lg";
}

const TitleEdit: React.FC<Props> = ({
    updateTitle,
    title,
    setTitle,
    className,
    size
}) => {
    const [titleReadOnly, setTitleReadOnly] = React.useState<boolean>(true);
    const handleKeyPress = (event: any) => {
        if(event.key === 'Enter'){
            sendUpdateTitleRequest();
        }
    }
  
    const sendUpdateTitleRequest = () => {
        updateTitle();
        setTitleReadOnly(true);
        const selection = document.getSelection();
        if (selection !== null) {
            selection.removeAllRanges();
        }
    }
    const onClick = (e:any) => {
        e.stopPropagation();
        setTitleReadOnly(false);
        e.target.select();
    }
    return (
        <Form.Control
            className={className}
            size={size}
            type="text"
            value={title} 
            onChange={e => setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            onClick={onClick}
            onMouseLeave={sendUpdateTitleRequest}
            readOnly={titleReadOnly}
            style={titleReadOnly ? {backgroundColor:"transparent", border:"none"} : {}}
        />
    )
}

export default TitleEdit
