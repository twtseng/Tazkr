import React from 'react'
import { Dropdown } from 'react-bootstrap'
import * as BoardDataApi from '../api-board-data/BoardDataApi';

interface Props {
    className: string,
    boardId: string, 
    isPubliclyVisible: boolean,
    getBoard: () => void
} 

const BoardVisibilityDropdown = (props: Props) => {
    const [publiclyVisible, setPubliclyVisible] = React.useState(true);
    const setBoardVisibility = (isPublic: boolean) => {
        setPubliclyVisible(isPublic);
        BoardDataApi.setBoardPublicVisibility(props.boardId, isPublic);
        props.getBoard();
    }
    React.useEffect(() => {
        setPubliclyVisible(props.isPubliclyVisible);
    },[props.isPubliclyVisible])
    return (
        <Dropdown className={props.className}>
            <Dropdown.Toggle className="text-light" variant="muted">
                Visibility: { publiclyVisible ? "Public" : "Private" }
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => setBoardVisibility(false)}><b>Private:</b><small> Only board members can view</small></Dropdown.Item>
                <Dropdown.Item onClick={() => setBoardVisibility(true)}><b>Public:</b><small> Anyone can view, but only members can edit</small></Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default BoardVisibilityDropdown
