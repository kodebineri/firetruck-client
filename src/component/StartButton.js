import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlay, faSync} from '@fortawesome/free-solid-svg-icons'

function StartButton (props) {
  if(props.refreshable){
    return <button className='active' onClick={() => props.onClick()}>
      <FontAwesomeIcon icon={faSync} />
    </button>
  }else{
    return <button className='active' onClick={() => props.onClick()}>
      <FontAwesomeIcon icon={faPlay} />
    </button>
  }
}

export default StartButton