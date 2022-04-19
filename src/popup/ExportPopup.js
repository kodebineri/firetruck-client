import Repo from '../Repo'
import {useState} from 'react'

function ExportPopup (props) {
  const [exportPath, setExportPath] = useState(null)
  const [exportFileType, setExportFileType] = useState('csv')
  const [exportFilename, setExportFilename] = useState('')

  const browseExportPath = async () => {
    const newpath = await Repo.browseOutputDirectory()
    setExportPath(newpath)
  }

  const doExport = async () => {
    props.onWaiting()
    if(exportFileType === 'csv'){
      Repo.exportCSV(props.sessionId, props.activeColl, exportPath, exportFilename + '.' + exportFileType)
    }else{
      Repo.exportJson(props.sessionId, props.activeColl, exportPath, exportFilename + '.' + exportFileType)
    }
    props.onSuccess()
  }

  const renderExportButton = () => {
    if(props.activeColl !== null){
      return <button className='active' onClick={() => doExport()}>
        Export
      </button>
    }
  }

  const renderExportWarning = () => {
    if(props.activeColl == null){
      return <div className='warning'>Please select a collection to export</div>
    }
  }

  if (props.active) {
    return <div className='bg-popup'>
      <div className='popup-container'>
        {renderExportWarning()}
        <h2>Export from {props.activeColl}</h2>
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
          <button onClick={() => props.onAbort()}>
            Cancel
          </button>
          {renderExportButton()}
        </div>
      </div>
    </div>
  }else{
    return null
  }
}

export default ExportPopup