import React from 'react'
import { Form } from 'react-bootstrap';

const TitleEdit = (props) => {
    const [titleReadOnly, setTitleReadOnly] = React.useState(true)
    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            props.updateTitle();
            document.getSelection().removeAllRanges();
        }
    }
    return (
        <Form.Control
            type="text"
            value={props.title} 
            onChange={e => props.setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            onClick={(e) => { e.stopPropagation(); setTitleReadOnly(false); e.target.select();}}
            onMouseLeave={() => { props.updateTitle(); setTitleReadOnly(true); document.getSelection().removeAllRanges(); }}
            readOnly={titleReadOnly}
            style={titleReadOnly ? {backgroundColor:"transparent", border:"none"} : {}}
            {...props}
        />
    )
}

export default TitleEdit
