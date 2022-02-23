import './App.css';
import loading from './loading.gif';
import {useState, useEffect} from 'react'
import Repo from './Repo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlay, faUpload, faFolder, faDownload, faSync, faFile} from '@fortawesome/free-solid-svg-icons'
const { ipcRenderer } = window.require('electron')

function App() {
  const [collections, setCollections] = useState([])
  const [documents, setDocuments] = useState([])
  const [headers, setHeaders] = useState([])
  const [path, setPath] = useState(null)
  const [importPath, setImportPath] = useState(null)
  const [importFileType, setImportFileType] = useState('csv')
  const [exportPath, setExportPath] = useState(null)
  const [exportFileType, setExportFileType] = useState('csv')
  const [exportFilename, setExportFilename] = useState('')
  const [activeColl, setActiveColl] = useState(null)
  const [activeDoc, setActiveDoc] = useState(null)
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
  const [query, setQuery] = useState('')
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('there are no error')
  const [showAddPopup, setShowAddPopup] = useState(false)
  const [showAddDocumentPopup, setShowAddDocumentPopup] = useState(false)
  const [showEditDocumentPopup, setShowEditDocumentPopup] = useState(false)
  const [showRenamePopup, setShowRenamePopup] = useState(false)
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [showDeleteDocumentPopup, setShowDeleteDocumentPopup] = useState(false)
  const [showImportPopup, setShowImportPopup] = useState(false)
  const [showExportPopup, setShowExportPopup] = useState(false)
  const [showLoadingPopup, setShowLoadingPopup] = useState(false)
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  // resizable
  const [initialPos, setInitialPos] = useState(null)
  const [initialSize, setInitialSize] = useState(null)

  const init = (e) => {
    let resizable = document.getElementById('sidebar')
    setInitialPos(e.clientX)
    setInitialSize(resizable.offsetWidth)
  }

  const resize = (e) => {
    let resizable = document.getElementById('sidebar')
    let sidebarWidth = parseInt(initialSize) + parseInt(e.clientX - initialPos)
    let flex = Math.round((sidebarWidth / window.innerHeight) * 100) / 100
    if(flex > 0){
      resizable.style.flex = flex
    }
  }

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
  const isJSON = (str) => {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }
  const renderRowStyle = (key, val) => {
    if(key === '_id'){
      return <b>{val}</b>
    }else if(isJSON(val)){
      return JSON.stringify(val)
    }else{
      return val
    }
  }
  const renderRow = (item) => {
    return headers.map((key, index) => {
      if(key === '_id'){
        return <td key={index}>
          <a href={'doc:' + activeColl + '.' + item[key]}>
            {item[key]}
          </a>
        </td>
      }else{
        if(item[key]){
          return <td key={index}>{
            renderRowStyle(key, item[key])
          }</td>
        }else{
          return <td key={index}></td>
        }
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
  const executeQuery = async () => {
    setShowLoadingPopup(true)
    await Repo.init(path)
    const docs = await Repo.getDocuments(activeColl, query)
    setDocuments(docs)
    const heads = generateHeader(docs)
    setHeaders(heads)
    setShowLoadingPopup(false)
  }
  const browseServiceAccount = async () => {
    setRefreshable(false)
    const newpath = await Repo.browseServiceAccount()
    setPath(newpath)
  }
  const browseImportPath = async () => {
    const newpath = await Repo.browseInputDirectory()
    setImportPath(newpath)
  }
  const browseExportPath = async () => {
    const newpath = await Repo.browseOutputDirectory()
    setExportPath(newpath)
  }
  const doExport = async () => {
    setShowLoadingPopup(true)
    if(exportFileType === 'csv'){
      Repo.exportCSV(activeColl, exportPath, exportFilename + '.' + exportFileType)
    }else{
      Repo.exportJson(activeColl, exportPath, exportFilename + '.' + exportFileType)
    }
    setShowLoadingPopup(false)
  }
  const doImport = async () => {
    setShowLoadingPopup(true)
    if(importFileType === 'csv'){
      await Repo.importCsv(activeColl, importOption, importPath)
    }else{
      await Repo.importJson(activeColl, importPath)
    }
    setShowImportPopup(false)
    fetchData()
    setShowLoadingPopup(false)
  }
  const refresh = async () => {
    setShowLoadingPopup(true)
    setActiveColl(null)
    setCollections([])
    setDocuments([])
    setHeaders([])
    setRefreshable(true)
    await fetchData()
    setShowLoadingPopup(false)
  }
  const addCollection = async () => {
    setShowLoadingPopup(true)
    const payload = {
      ...formAddDocument,
      data: JSON.parse(formAddDocument.data)
    }
    await Repo.addCollection(payload)
    setShowAddPopup(false)
    await fetchData()
    setShowLoadingPopup(false)
  }

  const addDocument = async () => {
    setShowLoadingPopup(true)
    const payload = {
      collId: activeColl,
      docId: activeDoc,
      data: JSON.parse(formAddDocument.data)
    }
    await Repo.addDocument(payload)
    setShowAddDocumentPopup(false)
    await refreshData()
    setShowLoadingPopup(false)
  }

  const editDocument = async () => {
    setShowLoadingPopup(true)
    const payload = {
      collId: activeColl,
      docId: activeDoc,
      data: JSON.parse(formAddDocument.data)
    }
    await Repo.editDocument(payload)
    setShowEditDocumentPopup(false)
    await refreshData()
    setShowLoadingPopup(false)
  }

  const renameCollection = async () => {
    setShowLoadingPopup(true)
    await Repo.renameCollection({
      collId: activeColl,
      newName
    })
    setShowRenamePopup(false)
    await fetchData()
    setShowLoadingPopup(false)
  }

  const duplicateCollection = async () => {
    setShowLoadingPopup(true)
    await Repo.duplicateCollection({
      collId: activeColl,
      newName
    })
    setShowDuplicatePopup(false)
    await fetchData()
    setShowLoadingPopup(false)
  }

  const deleteCollection = async () => {
    setShowLoadingPopup(true)
    await Repo.deleteCollection(activeColl)
    setShowDeletePopup(false)
    await fetchData()
    setShowLoadingPopup(false)
  }

  const deleteDocument = async () => {
    setShowLoadingPopup(true)
    await Repo.deleteDocument({
      collId: activeColl,
      docId: activeDoc
    })
    setShowDeleteDocumentPopup(false)
    await refreshData()
    setShowLoadingPopup(false)
  }

  const refreshData = async () => {
    let docs = []
    if(query != null){
      docs = await Repo.getDocuments(activeColl, query)
      setDocuments(docs)
    }else{
      docs = await Repo.getDocuments(activeColl)
      setDocuments(docs)
    }
    const heads = generateHeader(docs)
    setHeaders(heads)
  }

  useEffect(() => {
    document.title = 'FireTruck Firestore Manager v0.1.0'
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
    ipcRenderer.on('deleteDocumentAction', (event, arg) => {
      const collDoc = arg.split('.')
      const collId = collDoc[0]
      const docId = collDoc[1]
      setActiveDoc(docId)
      setShowDeleteDocumentPopup(true)
    })
    ipcRenderer.on('editDocumentAction', async (event, arg) => {
      const collDoc = arg.split('.')
      const collId = collDoc[0]
      const docId = collDoc[1]
      setActiveDoc(docId)
      const data = await Repo.getDocumentById(collId, docId)
      delete data._id
      setFormAddDocument({
        ...formAddDocument,
        data: JSON.stringify(data, undefined, 4)
      })
      setShowDeletePopup(false)
      setShowEditDocumentPopup(true)
    })
    ipcRenderer.on('duplicateDocumentAction', async (event, arg) => {
      const collDoc = arg.split('.')
      const collId = collDoc[0]
      const docId = collDoc[1]
      await Repo.duplicateDocument({
        collId,
        docId
      })
      await refreshData()
    })
    ipcRenderer.on('error', (event, arg) => {
      setError(arg.toString())
      setShowErrorPopup(true)
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
            })} defaultValue={formAddDocument.data}></textarea>
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

  const renderAddDocumentPopup = () => {
    if (showAddDocumentPopup) {
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
            <button onClick={() => setShowAddDocumentPopup(false)}>
              Cancel
            </button>
            <button className='active' onClick={() => addDocument()}>
              Save
            </button>
          </div>
        </div>
      </div>
    }
  }

  const renderEditDocumentPopup = () => {
    if (showEditDocumentPopup) {
      return <div className='bg-popup'>
        <div className='popup-container'>
          <h2>Edit Document {activeDoc}</h2>
          <div className='form-group'>
            <label>Data</label>
            <textarea rows={17} placeholder='e.g. {"name": "Harry Potter","city": "London"}' onChange={(e) => setFormAddDocument({
              ...formAddDocument,
              data: e.target.value
            })} defaultValue={formAddDocument.data}></textarea>
          </div>
          <div className='navigation'>
            <button onClick={() => setShowEditDocumentPopup(false)}>
              Cancel
            </button>
            <button className='active' onClick={() => editDocument()}>
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

  const renderLoadingPopup = () => {
    if (showLoadingPopup) {
      return <div className='bg-popup'>
        <div className='popup-container loading'>
          <img src={loading} />
        </div>
      </div>
    }
  }

  const renderErrorPopup = () => {
    if (showErrorPopup) {
      return <div className='bg-popup'>
        <div className='popup-container error'>
          <h3>Whoops, an error occured :(</h3>
          <p>{error}</p>
          <div className='navigation'>
            <button onClick={() => setShowErrorPopup(false)}>
              OK
            </button>
          </div>
        </div>
      </div>
    }
  }

  const renderImportButton = () => {
    if(activeColl !== null){
      return <button className='active' onClick={() => doImport()}>
        Import
      </button>
    }
  }

  const renderExportButton = () => {
    if(activeColl !== null){
      return <button className='active' onClick={() => doExport()}>
        Export
      </button>
    }
  }

  const renderImportDelimiter = () => {
    if(importFileType === 'csv'){
      return <div className='form-group'>
        <label>Delimiter</label>
        <select value={importOption.delimiter} onChange={(e) => setImportOption({
          delimiter: e.target.value
        })}>
          <option value=','>, (comma)</option>
          <option value=';'>; (semicolon)</option>
          <option value='\t'>\t (tab)</option>
        </select>
      </div>
    }
  }

  const renderImportWarning = () => {
    if(activeColl == null){
      return <div className='warning'>Please select a collection to import</div>
    }
  }

  const renderExportWarning = () => {
    if(activeColl == null){
      return <div className='warning'>Please select a collection to export</div>
    }
  }

  const renderImportPopup = () => {
    if (showImportPopup) {
      return <div className='bg-popup'>
        <div className='popup-container'>
        {renderImportWarning()}
          <h2>Import to {activeColl}</h2>
          <div className='form-group'>
            <label>File Type</label>
            <select value={importFileType} onChange={(e) => setImportFileType(e.target.value)}>
              <option value='csv'>CSV</option>
              <option value='json'>JSON</option>
            </select>
          </div>
          {renderImportDelimiter()}
          <div className='form-group'>
            <label>Input Path</label>
            <div className='inline'>
              <input type="text" placeholder='import from path...' value={importPath} />
              <button onClick={() => browseImportPath()}>Browse...</button>
            </div>
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

  const renderExportPopup = () => {
    if (showExportPopup) {
      return <div className='bg-popup'>
        <div className='popup-container'>
          {renderExportWarning()}
          <h2>Export from {activeColl}</h2>
          <div className='form-group'>
            <label>File Type</label>
            <select value={exportFileType} onChange={(e) => setExportFileType(e.target.value)}>
              <option value='csv'>CSV</option>
              <option value='json'>JSON</option>
            </select>
          </div>
          <div className='form-group'>
            <label>Filename</label>
            <input type="text" placeholder="filename..." value={exportFilename} onChange={(e) => setExportFilename(e.target.value)} />
          </div>
          <div className='form-group'>
            <label>Output Path</label>
            <div className='inline'>
              <input type="text" placeholder="export to path..." value={exportPath} />
              <button onClick={() => browseExportPath()}>Browse...</button>
            </div>
          </div>
          <div className='navigation'>
            <button onClick={() => setShowExportPopup(false)}>
              Cancel
            </button>
            {renderExportButton()}
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

  const renderDeleteDocumentPopup = () => {
    if (showDeleteDocumentPopup) {
      return <div className='bg-popup'>
        <div className='popup-container'>
          <h2>Delete Document {activeDoc}</h2>
          <p>Are you sure want to delete this document?</p>
          <div className='navigation'>
            <button onClick={() => setShowDeleteDocumentPopup(false)}>
              No
            </button>
            <button className='active' onClick={() => deleteDocument()}>
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

  const renderContentTable = () => {
    if(documents.length > 0){
      return <table>
        <thead>
          <tr>{renderHeaders()}</tr>
        </thead>
        <tbody>
          {renderDocuments()}
        </tbody>
      </table>
    }else{
      return <div className='empty'>No data</div>
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
          Import
        </button>
      </header>
      <div className='content'>
        <div className='sidebar' id='sidebar'>
          <h3>Collections</h3>
          <ul>{renderCollections()}</ul>
        </div>
        <div id='sidebarHandle' draggable={false} onDragStart={init} onDrag={resize} />
        <div className='table' id='table'>
          <div className='inline'>
            <textarea onChange={(e) => setQuery(e.target.value)} placeholder='Enter query here...' defaultValue={query}>
            </textarea>
            <button onClick={() => executeQuery()}>Execute</button>
          </div>
          <div className='table'>
            {renderContentTable()}
          </div>
        </div>
      </div>
      <footer>
        <button onClick={() => setShowAddPopup(true)}>
          <FontAwesomeIcon icon={faFolder} className='icon' />
          Add Collection
        </button>
        <button onClick={() => setShowAddDocumentPopup(true)} style={{marginLeft: 48}}>
          <FontAwesomeIcon icon={faFile} className='icon' />
          Add Document
        </button>
        <div className='spacer'></div>
        <button onClick={() => {
          const timeElapsed = Date.now()
          const today = new Date(timeElapsed)
          setExportFilename(activeColl + '-' + today.toISOString())
          setShowExportPopup(true)
        }}>
          <FontAwesomeIcon icon={faDownload} className='icon' />
          export
        </button>
      </footer>
      {renderPopup()}
      {renderAddDocumentPopup()}
      {renderRenamePopup()}
      {renderDuplicatePopup()}
      {renderDeletePopup()}
      {renderDeleteDocumentPopup()}
      {renderEditDocumentPopup()}
      {renderImportPopup()}
      {renderExportPopup()}
      {renderLoadingPopup()}
      {renderErrorPopup()}
    </div>
  );
}

export default App;
