import './App.css';
import {useState, useEffect} from 'react'
import Repo from './Repo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlay, faUpload, faFolder, faDownload, faPlus, faSync} from '@fortawesome/free-solid-svg-icons'
const { ipcRenderer } = window.require('electron')

function App() {
  const [collections, setCollections] = useState([])
  const [documents, setDocuments] = useState([])
  const [headers, setHeaders] = useState([])
  const [path, setPath] = useState(null)
  const [activeColl, setActiveColl] = useState(null)
  const [refreshable, setRefreshable] = useState(false)
  const [formAddDocument, setFormAddDocument] = useState({
    collId: null,
    docId: null,
    data: null
  })
  const [importOption, setImportOption] = useState({
    delimiter: ',',
    quote: '"'
  })
  const [autoId, setAutoId] = useState(false)
  const [newName, setNewName] = useState('')
  const [showAddPopup, setShowAddPopup] = useState(false)
  const [showRenamePopup, setShowRenamePopup] = useState(false)
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [showImportPopup, setShowImportPopup] = useState(false)

  const generateKeyValue = (key, value) => {
    return `${key}:${value}` 
  }

  const renderCollections = () => {
    return collections.map((item) => {
      if(activeColl === item._id){
        return <a href={generateKeyValue('coll', item._id)} onClick={(e) => e.preventDefault()}>
          <li key={item._id} onClick={() => selectCollection(item._id)} className='active'>
            <FontAwesomeIcon icon={faFolder} className='icon'/>
            {item._id}
          </li> 
        </a>
      }else{
        return <a href={generateKeyValue('coll', item._id)} onClick={(e) => e.preventDefault()}>
          <li key={item._id} onClick={() => selectCollection(item._id)}>
            <FontAwesomeIcon icon={faFolder} className='icon'/>
            {item._id}
          </li>
        </a>
      }
    })
  }
  const renderRowStyle = (key, val) => {
    if(key === '_id'){
      return <b>{val}</b>
    }
    return val
  }
  const renderRow = (item) => {
    return headers.map((key, index) => {
      if(item[key]){
        return <td key={index}>{
          renderRowStyle(key, JSON.stringify(item[key]))
        }</td>
      }else{
        return <td key={index}></td>
      }
    })
  }
  const selectCollection = async (id) => {
    setActiveColl(id)
    const docs = await Repo.getDocuments(id)
    setDocuments(docs)
    const heads = generateHeader(docs)
    setHeaders(heads)
  }
  const renderDocuments = () => {
    return documents.map((item, index) => {
      return <tr key={index}>{renderRow(item)}</tr>
    })
  }
  const renderHeaders = () => {
    return headers.map((item, index) => <td key={index}>{item}</td>)
  }
  const generateHeader = (docs) => {
    const header = {}
    docs.forEach((doc) => {
      const keys = Object.keys(doc)
      keys.forEach((key) => {
        if(key !== '_id'){
          header[key] = true
        }
      })
    })
    return ['_id'].concat(Object.keys(header).sort())
  }
  const fetchData = async () => {
    await Repo.init(path)
    const colls = await Repo.getCollections()
    setCollections(colls)
    const docs = await Repo.getDocuments()
    setDocuments(docs)
    const heads = generateHeader(docs)
    setHeaders(heads)
  }
  const browseServiceAccount = async () => {
    setRefreshable(false)
    const newpath = await Repo.browseServiceAccount()
    setPath(newpath)
  }
  const exportJson = async () => {
    // Repo.exportJson(activeColl)
    Repo.exportCSV(activeColl)
  }
  const importCsv = async () => {
    await Repo.importCsv(activeColl, importOption)
    setShowImportPopup(false)
    fetchData()
  }
  const refresh = async () => {
    setActiveColl(null)
    setCollections([])
    setDocuments([])
    setHeaders([])
    setRefreshable(true)
    await fetchData()
  }
  const addCollection = async () => {
    const payload = {
      ...formAddDocument,
      data: JSON.parse(formAddDocument.data)
    }
    await Repo.addCollection(payload)
    setShowAddPopup(false)
    await fetchData()
  }

  const renameCollection = async () => {
    await Repo.renameCollection({
      collId: activeColl,
      newName
    })
    setShowRenamePopup(false)
    await fetchData()
  }

  const duplicateCollection = async () => {
    await Repo.duplicateCollection({
      collId: activeColl,
      newName
    })
    setShowDuplicatePopup(false)
    await fetchData()
  }

  const deleteCollection = async () => {
    await Repo.deleteCollection(activeColl)
    setShowDeletePopup(false)
    await fetchData()
  }

  useEffect(() => {
    document.title = 'FireTruck v1.0'
    // fetchData()
    ipcRenderer.on('renameCollectionAction', (event, arg) => {
      if(activeColl == null){
        setActiveColl(arg)
      }
      setShowRenamePopup(true)
    })
    ipcRenderer.on('duplicateCollectionAction', (event, arg) => {
      if(activeColl == null){
        setActiveColl(arg)
      }
      setShowDuplicatePopup(true)
    })
    ipcRenderer.on('deleteCollectionAction', (event, arg) => {
      if(activeColl == null){
        setActiveColl(arg)
      }
      setShowDeletePopup(true)
    })
  }, [])

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

  const renderPopup = () => {
    if (showAddPopup) {
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
            })}>{formAddDocument.data}</textarea>
          </div>
          <div className='navigation'>
            <button onClick={() => setShowAddPopup(false)}>
              Cancel
            </button>
            <button className='active' onClick={() => addCollection()}>
              Save
            </button>
          </div>
        </div>
      </div>
    }
  }

  const renderRenamePopup = () => {
    if (showRenamePopup) {
      return <div className='bg-popup'>
        <div className='popup-container'>
          <h2>Rename Collection {activeColl}</h2>
          <div className='form-group'>
            <label>New Name</label>
            <input type='text' placeholder='e.g. MY_COLL' value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <div className='navigation'>
            <button onClick={() => setShowRenamePopup(false)}>
              Cancel
            </button>
            <button className='active' onClick={() => renameCollection()}>
              Save
            </button>
          </div>
        </div>
      </div>
    }
  }

  const renderDuplicatePopup = () => {
    if (showDuplicatePopup) {
      return <div className='bg-popup'>
        <div className='popup-container'>
          <h2>Duplicate Collection {activeColl}</h2>
          <div className='form-group'>
            <label>New Copy Name</label>
            <input type='text' placeholder='e.g. MY_COLL' value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <div className='navigation'>
            <button onClick={() => setShowDuplicatePopup(false)}>
              Cancel
            </button>
            <button className='active' onClick={() => duplicateCollection()}>
              Save
            </button>
          </div>
        </div>
      </div>
    }
  }

  const renderImportButton = () => {
    if(activeColl !== null){
      return <button className='active' onClick={() => importCsv()}>
        Select CSV and Import
      </button>
    }
  }

  const renderImportPopup = () => {
    if (showImportPopup) {
      return <div className='bg-popup'>
        <div className='popup-container'>
          <h2>Import CSV to {activeColl}</h2>
          <div className='form-group'>
            <label>Delimiter</label>
            <select value={importOption.delimiter} onChange={(e) => setImportOption({
              delimiter: e.target.value
            })}>
              <option value=','>, (comma)</option>
              <option value=';'>; (semicolon)</option>
              <option value='\t'>\t (tab)</option>
            </select>
          </div>
          <div className='navigation'>
            <button onClick={() => setShowImportPopup(false)}>
              Cancel
            </button>
            {renderImportButton()}
          </div>
        </div>
      </div>
    }
  }

  const renderDeletePopup = () => {
    if (showDeletePopup) {
      return <div className='bg-popup'>
        <div className='popup-container'>
          <h2>Delete Collection {activeColl}</h2>
          <p>Are you sure want to delete this collection?</p>
          <div className='navigation'>
            <button onClick={() => setShowDeletePopup(false)}>
              No
            </button>
            <button className='active' onClick={() => deleteCollection()}>
              Yes
            </button>
          </div>
        </div>
      </div>
    }
  }

  const renderStartButton = () => {
    if(refreshable){
      return <button className='active' onClick={() => refresh()}>
        <FontAwesomeIcon icon={faSync} />
      </button>
    }else{
      return <button className='active' onClick={() => refresh()}>
        <FontAwesomeIcon icon={faPlay} />
      </button>
    }
  }

  return (
    <div className="App">
      <header>
        <input type="text" placeholder='path to service account json...' value={path} />
        <button onClick={() => browseServiceAccount()}>Browse...</button>
        {renderStartButton()}
        <button onClick={() => setShowImportPopup(true)}>
          <FontAwesomeIcon icon={faUpload} className='icon' />
          Import CSV
        </button>
      </header>
      <div className='content'>
        <div className='sidebar'>
          <h3>Collections</h3>
          <ul>{renderCollections()}</ul>
        </div>
        <div className='table'>
          <table>
            <thead>
              <tr>{renderHeaders()}</tr>
            </thead>
            <tbody>
              {renderDocuments()}
            </tbody>
          </table>
        </div>
      </div>
      <footer>
        <button onClick={() => setShowAddPopup(true)}>
          <FontAwesomeIcon icon={faPlus} className='icon' />
          Add Collection
        </button>
        <div className='spacer'></div>
        <button onClick={() => exportJson()}>
          <FontAwesomeIcon icon={faDownload} className='icon' />
          export csv
        </button>
      </footer>
      {renderPopup()}
      {renderRenamePopup()}
      {renderDuplicatePopup()}
      {renderDeletePopup()}
      {renderImportPopup()}
    </div>
  );
}

export default App;
