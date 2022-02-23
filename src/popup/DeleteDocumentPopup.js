import Repo from '../Repo'

function DeleteDocumentPopup (props) {
  const deleteDocument = async () => {
    props.onWaiting()
    await Repo.deleteDocument({
      collId: props.activeColl,
      docId: props.activeDoc
    })
    props.onSuccess()
  }

  if (props.active) {
    return <div className='bg-popup'>
      <div className='popup-container'>
        <h2>Delete Document {props.activeDoc}</h2>
        <p>Are you sure want to delete this document?</p>
        <div className='navigation'>
          <button onClick={() => props.onAbort()}>
            No
          </button>
          <button className='active' onClick={() => deleteDocument()}>
            Yes
          </button>
        </div>
      </div>
    </div>
  }else{
    return null
  }    
}

export default DeleteDocumentPopup