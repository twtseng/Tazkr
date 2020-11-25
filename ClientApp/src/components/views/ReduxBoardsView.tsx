import React from 'react'
import { connect } from 'react-redux';
import * as TazkrObjects from '../view-components/TazkrObjects';

import * as actions from '../actions';

interface Props {
    boards : TazkrObjects.Board[];
    getBoardsAction: () => any;
}

const ReduxBoardsView = (props: Props) => {
    React.useEffect(() => {
        props.getBoardsAction();
    },[]);

    console.log(`ReduxBoardsView ${JSON.stringify(props)}`)
    return (
        <div>
            {props.boards.map((x: TazkrObjects.Board) => <h1>{x.Title}</h1>)}
        </div>
    )
}

const mapStateToProps = (state:any) => {
    console.log(`mapStateToProps, state=${JSON.stringify(state)}`)
    return { boards: state.boards} ;
}
const mapDispatchToProps = (dispatch:any) => {
    return { getBoardsAction: () => dispatch(actions.getBoardsAction())}
}
  
export default connect(mapStateToProps, mapDispatchToProps)(ReduxBoardsView)
