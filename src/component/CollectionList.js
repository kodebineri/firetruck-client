import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFolder} from '@fortawesome/free-solid-svg-icons'

function CollectionList (props) {
  const generateKeyValue = (key, value) => {
    return `${key}:${value}`
  }

  return props.collections.map((item) => {
    if(props.activeColl === item._id){
      return <a href={generateKeyValue('coll', item._id)} onClick={(e) => e.preventDefault()}>
        <li key={item._id} onClick={() => props.onClick(item._id)} className='active'>
          <FontAwesomeIcon icon={faFolder} className='icon'/>
          {item._id}
        </li> 
      </a>
    }else{
      return <a href={generateKeyValue('coll', item._id)} onClick={(e) => e.preventDefault()}>
        <li key={item._id} onClick={() => props.onClick(item._id)}>
          <FontAwesomeIcon icon={faFolder} className='icon'/>
          {item._id}
        </li>
      </a>
    }
  })
}

export default CollectionList