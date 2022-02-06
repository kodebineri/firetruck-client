// import { ipcRenderer } from "electron"
const {ipcRenderer} = window.require('electron')

const Repo = {
  init: (val) => {
    ipcRenderer.send('init', val)
  },
  getCollections: async () => {
    const data = await ipcRenderer.sendSync('getCollections')
    if(data.success){
      return data.data
    }else{
      console.log(data.message)
      return data.data
    }
  },
  getDocuments: async (collId, query) => {
    const data = await ipcRenderer.sendSync('getDocuments', {collId, query})
    if(data.success){
      return data.data
    }else{
      console.log(data.message)
      return data.data
    }
  },
  getDocumentById: async (collId, docId) => {
    const data = await ipcRenderer.sendSync('getDocumentById', {collId, docId})
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
        collId
      })
    }else{
      ipcRenderer.send('exportJson', {
        filename,
        path,
        collId
      })
    }
  },
  importJson: async (collId, path) => {
    if(path == null){
      const newpath = ipcRenderer.sendSync('browseInputDirectory')
      await ipcRenderer.sendSync('importJson', {
        path: newpath,
        collId
      })
    }else{
      await ipcRenderer.sendSync('importJson', {
        path,
        collId
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
        collId
      })
    }else{
      ipcRenderer.send('exportCSV', {
        filename,
        path,
        collId
      })
    }
  },
  importCsv: async (collId, options, path) => {
    if(path == null){
      const newpath = ipcRenderer.sendSync('browseInputDirectory')
      await ipcRenderer.sendSync('importCSV', {
        path: newpath,
        collId,
        options
      })
    }else{
      await ipcRenderer.sendSync('importCSV', {
        path,
        collId,
        options
      })
    }
  },
  addCollection: async ({collId, docId, data}) => {
    await ipcRenderer.sendSync('addCollection', {
      collId, docId, data
    })
  },
  renameCollection: async ({collId, newName}) => {
    await ipcRenderer.sendSync('renameCollection', {
      collId, newName
    })
  },
  duplicateCollection: async ({collId, newName}) => {
    await ipcRenderer.sendSync('duplicateCollection', {
      collId, newName
    })
  },
  deleteCollection: async (collId) => {
    await ipcRenderer.sendSync('deleteCollection', collId)
  },
  addDocument: async ({collId, docId, data}) => {
    await ipcRenderer.sendSync('addDocument', {
      collId, docId, data
    })
  },
  editDocument: async ({collId, docId, data}) => {
    await ipcRenderer.sendSync('editDocument', {
      collId, docId, data
    })
  },
  deleteDocument: async ({collId, docId}) => {
    await ipcRenderer.sendSync('deleteDocument', {
      collId, docId
    })
  },
  duplicateDocument: async ({collId, docId, newDocId}) => {
    await ipcRenderer.sendSync('duplicateDocument', {
      collId, docId, newDocId
    })
  },
}

export default Repo