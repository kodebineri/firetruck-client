import Repo from '../Repo'

function DeleteCollectionPopup (props) {

  const deleteCollection = async () => {
    props.onWaiting()
    await Repo.deleteCollection(props.sessionId, props.activeColl)
    props.onSuccess()
  }

  if (props.active) {
    return <div className='bg-popup'>
      <div className='popup-container'>
        <h2>Delete Collection {props.activeColl}</h2>
        <p>Are you sure want to delete this collection?</p>
        <div className='navigation'>
          <button onClick={() => props.onAbort()}>
            No
          </button>
          <button className='active' onClick={() => deleteCollection()}>
            Yes
          </button>
        </div>
      </div>
    </div>
  }else{
    return null
  }
}

export default DeleteCollectionPopup
