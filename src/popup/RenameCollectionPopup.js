import Repo from '../Repo'
import {useState} from 'react'

function RenameCollectionPopup (props) {
  const [newName, setNewName] = useState('')

  const renameCollection = async () => {
    props.onWaiting()
    await Repo.renameCollection({
      collId: props.activeColl,
      newName
    })
    props.onSuccess()
  }

  if (props.active) {
    return <div className='bg-popup'>
      <div className='popup-container'>
        <h2>Rename Collection {props.activeColl}</h2>
        <div className='form-group'>
          <label>New Name</label>
          <input type='text' placeholder='e.g. MY_COLL' value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div className='navigation'>
          <button onClick={() => props.onAbort()}>
            Cancel
          </button>
          <button className='active' onClick={() => renameCollection()}>
            Save
          </button>
        </div>
      </div>
    </div>
  }else{
    return null
  }
}

export default RenameCollectionPopup