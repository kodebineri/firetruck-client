import Repo from '../Repo'
import {useState} from 'react'

function EditDocumentPopup (props) {
  const [form, setForm] = useState(props.data)

  const editDocument = async () => {
    props.onWaiting()
    const payload = {
      collId: props.activeColl,
      docId: props.activeDoc,
      data: JSON.parse(form)
    }
    await Repo.editDocument(payload)
    props.onSuccess()
  }

  if (props.active) {
    return <div className='bg-popup'>
      <div className='popup-container'>
        <h2>Edit Document {props.activeDoc}</h2>
        <div className='form-group'>
          <label>Data</label>
          <textarea rows={17} placeholder='e.g. {"name": "Harry Potter","city": "London"}' 
            onChange={(e) => setForm(e.target.value)} 
            defaultValue={props.data}></textarea>
        </div>
        <div className='navigation'>
          <button onClick={() => props.onAbort()}>
            Cancel
          </button>
          <button className='active' onClick={() => editDocument()}>
            Save
          </button>
        </div>
      </div>
    </div>
  }else{
    return null
  }
}

export default EditDocumentPopup