import './App.css';
import {useState, useEffect} from 'react'
import Repo from './Repo'
import StartButton from './component/StartButton';
import ImportPopup from './popup/ImportPopup'
import ExportPopup from './popup/ExportPopup'
import AddCollectionPopup from './popup/AddCollectionPopup';
import RenameCollectionPopup from './popup/RenameCollectionPopup';
import DuplicateCollectionPopup from './popup/DuplicateCollectionPopup';
import DeleteCollectionPopup from './popup/DeleteCollectionPopup';
import AddDocumentPopup from './popup/AddDocumentPopup';
import EditDocumentPopup from './popup/EditDocumentPopup';
import DeleteDocumentPopup from './popup/DeleteDocumentPopup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUpload, faFolder, faDownload, faFile, faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import LoadingPopup from './popup/LoadingPopup';
import ErrorPopup from './popup/ErrorPopup';
import CollectionList from './component/CollectionList';
import ContentTable from './component/ContentTable';
import UpdatePopup from './popup/UpdatePopup';
import InfoPopup from './popup/InfoPopup';
const { v4: uuidv4 } = require('uuid')

function App() {
  const [sessionId, setSessionId] = useState('')
  const [collections, setCollections] = useState([])
  const [documents, setDocuments] = useState([])
  const [headers, setHeaders] = useState([])
  const [path, setPath] = useState('')
  const [activeColl, setActiveColl] = useState(null)
  const [activeDoc, setActiveDoc] = useState(null)
  const [refreshable, setRefreshable] = useState(false)
  const [formAddDocument, setFormAddDocument] = useState({
    collId: null,
    docId: null,
    data: null
  })
  const [query, setQuery] = useState('')
  const [info, setInfo] = useState({
    title: '',
    message: ''
  })
  const [error, setError] = useState('there are no error')
  const [perPage, setPerPage] = useState(100)
  const [page, setPage] = useState(1)
  const [changeLog, setChangeLog] = useState({
    version: null,
    changes: []
  })
  // popups
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
  const [showUpdatePopup, setShowUpdatePopup] = useState(false)
  const [showInfoPopup, setShowInfoPopup] = useState(false)
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
  
  const selectCollection = async (id) => {
    setActiveColl(id)
    const docs = await Repo.getDocuments(sessionId, id, undefined)
    setDocuments(docs)
    const heads = generateHeader(docs)
    setHeaders(heads)
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
    await Repo.init(sessionId, path)
    const colls = await Repo.getCollections(sessionId)
    setCollections(colls)
    const docs = await Repo.getDocuments(sessionId, undefined, undefined)
    setDocuments(docs)
    const heads = generateHeader(docs)
    setHeaders(heads)
  }
  const executeQuery = async () => {
    setShowLoadingPopup(true)
    await Repo.init(path)
    const docs = await Repo.getDocuments(sessionId, activeColl, query)
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

  const refreshData = async () => {
    let docs = []
    if(query !== ''){
      docs = await Repo.getDocuments(sessionId, activeColl, query, page, perPage)
      setDocuments(docs)
    }else{
      docs = await Repo.getDocuments(sessionId, activeColl, undefined, page, perPage)
      setDocuments(docs)
    }
    const heads = generateHeader(docs)
    setHeaders(heads)
  }

  const prevPage = () => {
    if(parseInt(page) - 1 < 1){
      setPage(1)
    }else{
      setPage(parseInt(page) - 1)
    }
    refreshData()
  }

  const nextPage = () => {
    setPage(parseInt(page) + 1)
    refreshData()
  }

  useEffect(() => {
    refreshData()
  }, [page])

  useEffect(() => {
    refreshData()
  }, [perPage])

  useEffect(() => {
    document.title = 'FireTruck Firestore Manager'
    setSessionId(uuidv4())
    // fetchData()
    Repo.checkUpdates(false)
    window.api.receive('renameCollectionAction', (_, arg) => {
      if(activeColl == null){
        setActiveColl(arg)
      }
      setShowRenamePopup(true)
    })
    window.api.receive('duplicateCollectionAction', (_, arg) => {
      if(activeColl == null){
        setActiveColl(arg)
      }
      setShowDuplicatePopup(true)
    })
    window.api.receive('deleteCollectionAction', (_, arg) => {
      if(activeColl == null){
        setActiveColl(arg)
      }
      setShowDeletePopup(true)
    })
    window.api.receive('deleteDocumentAction', (_, arg) => {
      const collDoc = arg.split('.')
      const docId = collDoc[1]
      setActiveDoc(docId)
      setShowDeleteDocumentPopup(true)
    })
    window.api.receive('editDocumentAction', async (_, arg) => {
      const collDoc = arg.split('.')
      const collId = collDoc[0]
      const docId = collDoc[1]
      setActiveDoc(docId)
      const data = await Repo.getDocumentById(sessionId, collId, docId)
      delete data._id
      setFormAddDocument({
        ...formAddDocument,
        data: JSON.stringify(data, undefined, 4)
      })
      setShowDeletePopup(false)
      setShowEditDocumentPopup(true)
    })
    window.api.receive('duplicateDocumentAction', async (_, arg) => {
      const collDoc = arg.split('.')
      const collId = collDoc[0]
      const docId = collDoc[1]
      await Repo.duplicateDocument({
        collId,
        docId
      })
      await refreshData()
    })
    window.api.receive('error', (_, arg) => {
      setError(arg.toString())
      setShowErrorPopup(true)
    })
    window.api.receive('update-response', (_, arg) => {
      if(arg.is_available){
        setChangeLog({
          version: arg.version,
          changes: arg.change_logs
        })
        setShowUpdatePopup(true)
      }else{
        if(arg.is_shown){
          setInfo({
            title: 'Check for Updates',
            message: 'You already running the latest version :)'
          })
          setShowInfoPopup(true)
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="App">
      <header>
        <input type="text" placeholder='path to service account json...' defaultValue={path} />
        <button onClick={() => browseServiceAccount()}>Browse...</button>
        <StartButton refreshable={refreshable} onClick={() => refresh()} />
        <button onClick={() => setShowImportPopup(true)}>
          <FontAwesomeIcon icon={faUpload} className='icon' />
          Import
        </button>
      </header>
      <div className='content'>
        <div className='sidebar' id='sidebar'>
          <h3>Collections</h3>
          <ul><CollectionList activeColl={activeColl} collections={collections} onClick={(e) => selectCollection(e)} /></ul>
        </div>
        <div id='sidebarHandle' draggable={false} onDragStart={init} onDrag={resize} />
        <div className='table' id='table'>
          <div className='inline'>
            <textarea onChange={(e) => setQuery(e.target.value)} placeholder='Enter query here...' defaultValue={query}>
            </textarea>
            <button onClick={() => executeQuery()}>Execute</button>
          </div>
          <div className='table'>
            <ContentTable documents={documents} headers={headers} activeColl={activeColl} />
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
        <button onClick={() => prevPage()} className='nav'>
          <FontAwesomeIcon icon={faChevronLeft} className='icon' />
        </button>
        <label>page</label>
        <input type="number" className='perpage' value={page} onChange={(e) => setPage(e.target.value)} />
        <label>@</label>
        <input type="number" className='perpage' value={perPage} onChange={(e) => setPerPage(e.target.value)} />
        <button onClick={() => nextPage()} className='nav'>
          <FontAwesomeIcon icon={faChevronRight} className='icon' />
        </button>
        <div className='spacer'></div>
        <button onClick={() => setShowExportPopup(true)}>
          <FontAwesomeIcon icon={faDownload} className='icon' />
          export
        </button>
      </footer>
      <AddCollectionPopup sessionId={sessionId} activeColl={activeColl} active={showAddPopup} onWaiting={() => setShowLoadingPopup(true)} onSuccess={async () => {
        setShowAddPopup(false)
        await fetchData()
        setShowLoadingPopup(false)
      }} onAbort={() => setShowAddPopup(false)} />
      <AddDocumentPopup activeColl={activeColl} activeDoc={activeDoc} active={showAddDocumentPopup} onWaiting={() => setShowLoadingPopup(true)} onSuccess={async () => {
        setShowAddDocumentPopup(false)
        await refreshData()
        setShowLoadingPopup(false)
      }} onAbort={() => setShowAddDocumentPopup(false)} />
      <RenameCollectionPopup sessionId={sessionId} activeColl={activeColl} active={showRenamePopup} onWaiting={() => setShowLoadingPopup(true)} onSuccess={async () => {
        setShowRenamePopup(false)
        await fetchData()
        setShowLoadingPopup(false)
      }} onAbort={() => setShowRenamePopup(false)} />
      <DuplicateCollectionPopup sessionId={sessionId} activeColl={activeColl} active={showDuplicatePopup} onWaiting={() => setShowLoadingPopup(true)} onSuccess={async () => {
        setShowDuplicatePopup(false)
        await fetchData()
        setShowLoadingPopup(false)
      }} onAbort={() => setShowDuplicatePopup(false)} />
      <DeleteCollectionPopup sessionId={sessionId} activeColl={activeColl} active={showDeletePopup} onWaiting={() => setShowLoadingPopup(true)} onSuccess={async () => {
        setShowDeletePopup(false)
        await fetchData()
        setShowLoadingPopup(false)
      }} onAbort={() => setShowDeletePopup(false)} />
      <DeleteDocumentPopup sessionId={sessionId} activeColl={activeColl} activeDoc={activeDoc} active={showDeleteDocumentPopup} onWaiting={() => setShowLoadingPopup(true)} onSuccess={async () => {
        setShowDeleteDocumentPopup(false)
        await refreshData()
        setShowLoadingPopup(false)
      }} onAbort={() => setShowDeleteDocumentPopup(false)} />
      <EditDocumentPopup sessionId={sessionId} activeColl={activeColl} activeDoc={activeDoc} active={showEditDocumentPopup} data={formAddDocument.data} onWaiting={() => setShowLoadingPopup(true)} onSuccess={async () => {
        setShowEditDocumentPopup(false)
        await refreshData()
        setShowLoadingPopup(false)
      }} onAbort={() => setShowEditDocumentPopup(false)} />
      <ImportPopup sessionId={sessionId} activeColl={activeColl} active={showImportPopup} onWaiting={() => setShowLoadingPopup(true)} onSuccess={async () => {
        setShowImportPopup(false)
        await fetchData()
        setShowLoadingPopup(false)
      }} onAbort={() => setShowImportPopup(false)} />
      <ExportPopup sessionId={sessionId} activeColl={activeColl} active={showExportPopup} onWaiting={() => setShowLoadingPopup(true)} onSuccess={() => {
        setShowExportPopup(false)
        setShowLoadingPopup(false)
      }} onAbort={() => setShowExportPopup(false)} />
      <LoadingPopup active={showLoadingPopup} />
      <UpdatePopup active={showUpdatePopup} version={changeLog.version} changes={changeLog.changes} 
        url='https://kodebineri.com/download/' 
        onAbort={() => setShowUpdatePopup(false)} />
      <ErrorPopup active={showErrorPopup} error={error} onClick={() => setShowErrorPopup(false)} />
      <InfoPopup active={showInfoPopup} title={info.title} message={info.message} onClick={() => setShowInfoPopup(false)} />
    </div>
  );
}

export default App;
