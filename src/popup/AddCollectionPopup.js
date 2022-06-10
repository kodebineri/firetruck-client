import Repo from '../Repo'
import {useState} from 'react'

function AddCollectionPopup (props) {
  const [formAddDocument, setFormAddDocument] = useState({
    sessionId: props.sessionId,
    collId: null,
    docId: null,
    data: null
  })
  const [autoId, setAutoId] = useState(false)

  const addCollection = async () => {
    props.onWaiting()
    try{
      const payload = {
        ...formAddDocument,
        sessionId: props.sessionId,
        data: JSON.parse(formAddDocument.data)
      }
      await Repo.addCollection(payload)
    }catch(e){
      Repo.sendError('Wrong data format, please use JSON-formatted data, e.g. {"key": "value"}')
    }
    props.onSuccess()
  }

  const renderInputAutoId = () => {
    if(autoId){
      return <input type='text' placeholder='e.g. 123' disabled value={formAddDocument.docId} onChange={(e) => setFormAddDocument({
        ...formAddDocument,
        docId: e.target.value
      })} />
    }else{
      return <input type='text' placeholder='e.g. 123' value={formAddDocument.docId} onChange={(e) => setFormAddDocument({
        ...formAddDocument,
        docId: e.target.value
      })} />
    }
  }

  const renderButtonAutoId = () => {
    if(autoId){
      return <button className='active' onClick={() => {
        setFormAddDocument({
          ...formAddDocument,
          docId: null
        })
        setAutoId(false)
      }}>Auto ID</button>
    }else{
      return <button onClick={() => setAutoId(true) }>Auto ID</button>
    }
  }

  if (props.active) {
    return <div className='bg-popup'>
      <div className='popup-container'>
        <h2>Add Collection</h2>
        <div className='form-group'>
          <label>Name</label>
          <input type='text' placeholder='e.g. MY_COLL' value={formAddDocument.collId} onChange={(e) => setFormAddDocument({
            ...formAddDocument,
            collId: e.target.value
          })} />
        </div>
        <h3>First Document</h3>
        <div className='form-group'>
          <label>ID</label>
          <div className='inline'>
            {renderInputAutoId()}
            {renderButtonAutoId()}
          </div>
        </div>
        <div className='form-group'>
          <label>Data</label>
          <textarea rows={17} placeholder='e.g. {"name": "Harry Potter","city": "London"}' onChange={(e) => setFormAddDocument({
            ...formAddDocument,
            data: e.target.value
          })} defaultValue={formAddDocument.data}></textarea>
        </div>
        <div className='navigation'>
          <button onClick={() => props.onAbort()}>
            Cancel
          </button>
          <button className='active' onClick={() => addCollection()}>
            Save
          </button>
        </div>
      </div>
    </div>
  }else{
    return null
  }
}

export default AddCollectionPopup