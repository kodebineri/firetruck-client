import Repo from '../Repo'
import {useState} from 'react'

function AddDocumentPopup (props) {
  const [formAddDocument, setFormAddDocument] = useState({
    collId: null,
    docId: null,
    data: null
  })
  const [autoId, setAutoId] = useState(false)

  const addDocument = async () => {
    props.onWaiting()
    try{
      const payload = {
        collId: props.activeColl,
        docId: props.activeDoc,
        data: JSON.parse(formAddDocument.data)
      }
      await Repo.addDocument(payload)
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
        <h2>Add New Document</h2>
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
          <button className='active' onClick={() => addDocument()}>
            Save
          </button>
        </div>
      </div>
    </div>
  }else{
    return null
  }
}

export default AddDocumentPopup