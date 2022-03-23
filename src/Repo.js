// import { ipcRenderer } from "electron"
const {ipcRenderer} = window.require('electron')
const { v4: uuidv4 } = require('uuid')

const Repo = {
  init: (val) => {
    const sessionId = uuidv4()
    localStorage.setItem('sessionId', sessionId)
    ipcRenderer.send('init', { path: val, sessionId: localStorage.getItem('sessionId') })
  },
  getCollections: async () => {
    const data = await ipcRenderer.sendSync('getCollections', { sessionId: localStorage.getItem('sessionId') })
    if(data.success){
      return data.data
    }else{
      console.log(data.message)
      return data.data
    }
  },
  getDocuments: async (collId, query) => {
    const data = await ipcRenderer.sendSync('getDocuments', {collId, query, sessionId: localStorage.getItem('sessionId')})
    if(data.success){
      return data.data
    }else{
      console.log(data.message)
      return data.data
    }
  },
  getDocumentById: async (collId, docId) => {
    const data = await ipcRenderer.sendSync('getDocumentById', {collId, docId, sessionId: localStorage.getItem('sessionId')})
    if(data.success){
      return data.data
    }else{
      console.log(data.message)
      return data.data
    }
  },
  browseServiceAccount: () => {
    const data = ipcRenderer.sendSync('browseServiceAccount')
    if(data.success){
      return data.data
    }else{
      console.log(data.message)
      return data.data
    }
  },
  browseInputDirectory: () => {
    const data = ipcRenderer.sendSync('browseInputDirectory')
    if(data.success){
      return data.data
    }else{
      console.log(data.message)
      return data.data
    }
  },
  browseOutputDirectory: () => {
    const data = ipcRenderer.sendSync('browseOutputDirectory')
    if(data.success){
      return data.data
    }else{
      console.log(data.message)
      return data.data
    }
  },
  exportJson: (collId, path, filename) => {
    if(path == null){
      const newpath = ipcRenderer.sendSync('browseOutputDirectory')
      const timeElapsed = Date.now()
      const today = new Date(timeElapsed)
      ipcRenderer.send('exportJson', {
        filename: collId + '-' + today.toISOString(),
        path: newpath,
        collId,
        sessionId: localStorage.getItem('sessionId')
      })
    }else{
      ipcRenderer.send('exportJson', {
        filename,
        path,
        collId,
        sessionId: localStorage.getItem('sessionId')
      })
    }
  },
  importJson: async (collId, path) => {
    if(path == null){
      const newpath = ipcRenderer.sendSync('browseInputDirectory')
      await ipcRenderer.sendSync('importJson', {
        path: newpath,
        collId,
        sessionId: localStorage.getItem('sessionId')
      })
    }else{
      await ipcRenderer.sendSync('importJson', {
        path,
        collId,
        sessionId: localStorage.getItem('sessionId')
      })
    }
  },
  exportCSV: (collId, path, filename) => {
    if(path == null){
      const newpath = ipcRenderer.sendSync('browseOutputDirectory')
      const timeElapsed = Date.now()
      const today = new Date(timeElapsed)
      ipcRenderer.send('exportCSV', {
        filename: collId + '-' + today.toISOString(),
        path: newpath,
        collId,
        sessionId: localStorage.getItem('sessionId')
      })
    }else{
      ipcRenderer.send('exportCSV', {
        filename,
        path,
        collId,
        sessionId: localStorage.getItem('sessionId')
      })
    }
  },
  importCsv: async (collId, options, path) => {
    if(path == null){
      const newpath = ipcRenderer.sendSync('browseInputDirectory')
      await ipcRenderer.sendSync('importCSV', {
        path: newpath,
        collId,
        options,
        sessionId: localStorage.getItem('sessionId')
      })
    }else{
      await ipcRenderer.sendSync('importCSV', {
        path,
        collId,
        options,
        sessionId: localStorage.getItem('sessionId')
      })
    }
  },
  addCollection: async ({collId, docId, data}) => {
    await ipcRenderer.sendSync('addCollection', {
      collId, docId, data, sessionId: localStorage.getItem('sessionId')
    })
  },
  renameCollection: async ({collId, newName}) => {
    await ipcRenderer.sendSync('renameCollection', {
      collId, newName, sessionId: localStorage.getItem('sessionId')
    })
  },
  duplicateCollection: async ({collId, newName}) => {
    await ipcRenderer.sendSync('duplicateCollection', {
      collId, newName, sessionId: localStorage.getItem('sessionId')
    })
  },
  deleteCollection: async (collId) => {
    await ipcRenderer.sendSync('deleteCollection', {collId, sessionId: localStorage.getItem('sessionId')})
  },
  addDocument: async ({collId, docId, data}) => {
    await ipcRenderer.sendSync('addDocument', {
      collId, docId, data, sessionId: localStorage.getItem('sessionId')
    })
  },
  editDocument: async ({collId, docId, data}) => {
    await ipcRenderer.sendSync('editDocument', {
      collId, docId, data, sessionId: localStorage.getItem('sessionId')
    })
  },
  deleteDocument: async ({collId, docId}) => {
    await ipcRenderer.sendSync('deleteDocument', {
      collId, docId, sessionId: localStorage.getItem('sessionId')
    })
  },
  duplicateDocument: async ({collId, docId, newDocId}) => {
    await ipcRenderer.sendSync('duplicateDocument', {
      collId, docId, newDocId, sessionId: localStorage.getItem('sessionId')
    })
  },
}

export default Repo