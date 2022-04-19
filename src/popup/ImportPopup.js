import Repo from '../Repo'
import {useState} from 'react'

function ImportPopup (props) {
  const [importPath, setImportPath] = useState(null)
  const [importFileType, setImportFileType] = useState('csv')
  const [importOption, setImportOption] = useState({
    delimiter: ',',
    quote: '"'
  })

  const browseImportPath = async () => {
    const newpath = await Repo.browseInputDirectory()
    setImportPath(newpath)
  }

  const doImport = async () => {
    props.onWaiting()
    if(importFileType === 'csv'){
      await Repo.importCsv(props.sessionId, props.activeColl, importOption, importPath)
    }else{
      await Repo.importJson(props.sessionId, props.activeColl, importPath)
    }
    props.onSuccess()
  }

  const renderImportButton = () => {
    if(props.activeColl !== null){
      return <button className='active' onClick={() => doImport()}>
        Import
      </button>
    }
  }

  const renderImportWarning = () => {
    if(props.activeColl == null){
      return <div className='warning'>Please select a collection to import</div>
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

  if (props.active) {
    return <div className='bg-popup'>
    <div className='popup-container'>
      {renderImportWarning()}
        <h2>Import to {props.activeColl}</h2>
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
          <button onClick={() => props.onAbort()}>
            Cancel
          </button>
          {renderImportButton()}
        </div>
      </div>
    </div>
  }else{
    return null
  }
}

export default ImportPopup