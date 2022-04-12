import Repo from '../Repo';

function UpdatePopup (props) {

  const renderList = (items) => items.map(item => <li>
    {item}
  </li>)

  if (props.active) {
    return <div className='bg-popup'>
      <div className='popup-container'>
        <h3>Version {props.version} Available!</h3>
        <ul>
          {renderList(props.changes)}
        </ul>
        <div className='navigation'>
          <button onClick={() => props.onAbort()}>
            Cancel
          </button>
          <button className='active' onClick={() => {
            Repo.goto(props.url)
            props.onAbort()
          }}>
            Update Now
          </button>
        </div>
      </div>
    </div>
  }else{
    return null
  }
}

export default UpdatePopup