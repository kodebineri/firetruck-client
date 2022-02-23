import Repo from '../Repo'
import {useState} from 'react'

function DuplicateCollectionPopup (props) {
  const [newName, setNewName] = useState('')

  const duplicateCollection = async () => {
    props.onWaiting()
    await Repo.duplicateCollection({
      collId: props.activeColl,
      newName
    })
    props.onSuccess()
  }

  if (props.active) {
    return <div className='bg-popup'>
      <div className='popup-container'>
        <h2>Duplicate Collection {props.activeColl}</h2>
        <div className='form-group'>
          <label>New Copy Name</label>
          <input type='text' placeholder='e.g. MY_COLL' value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div className='navigation'>
          <button onClick={() => props.onAbort()}>
            Cancel
          </button>
          <button className='active' onClick={() => duplicateCollection()}>
            Save
          </button>
        </div>
      </div>
    </div>
  }else{
    return null
  }
}

export default DuplicateCollectionPopup