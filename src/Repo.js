const Repo = {
  init: (sessionId, path) => {
    window.api.send('init', { path, sessionId})
  },
  checkUpdates: (is_shown = false) => {
    window.api.send('checkUpdates', is_shown)
  },
  goto: (url) => {
    window.api.send('goto', url)
  },
  sendError: (error) => {
    window.api.send('error', error)
  },
  getCollections: async (sessionId) => {
    const data = await window.api.sendSync('getCollections', { sessionId })
    if(data.success){
      return data.data
    }else{
      console.log(data.message)
      return data.data
    }
  },
  getDocuments: async (sessionId, collId, query, page = 1, perPage = 100) => {
    const data = await window.api.sendSync('getDocuments', {collId, query, sessionId, page: parseInt(page), perPage: parseInt(perPage)})
    if(data.success){
      return data.data
    }else{
      console.log(data.message)
      return data.data
    }
  },
  getDocumentById: async (sessionId, collId, docId) => {
    const data = await window.api.sendSync('getDocumentById', {collId, docId, sessionId})
    if(data.success){
      return data.data
    }else{
      console.log(data.message)
      return data.data
    }
  },
  browseServiceAccount: () => {
    const data = window.api.sendSync('browseServiceAccount')
    if(data.success){
      return data.data
    }else{
      console.log(data.message)
      return data.data
    }
  },
  browseInputDirectory: () => {
    const data = window.api.sendSync('browseInputDirectory')
    if(data.success){
      return data.data
    }else{
      console.log(data.message)
      return data.data
    }
  },
  browseOutputDirectory: () => {
    const data = window.api.sendSync('browseOutputDirectory')
    if(data.success){
      return data.data
    }else{
      console.log(data.message)
      return data.data
    }
  },
  exportJson: (sessionId, collId, path, filename) => {
    if(path == null){
      const newpath = window.api.sendSync('browseOutputDirectory')
      const timeElapsed = Date.now()
      const today = new Date(timeElapsed)
      window.api.send('exportJson', {
        filename: collId + '-' + today.toISOString(),
        path: newpath,
        collId,
        sessionId
      })
    }else{
      window.api.send('exportJson', {
        filename,
        path,
        collId,
        sessionId
      })
    }
  },
  importJson: async (sessionId, collId, path) => {
    if(path == null){
      const newpath = window.api.sendSync('browseInputDirectory')
      await window.api.sendSync('importJson', {
        path: newpath,
        collId,
        sessionId
      })
    }else{
      await window.api.sendSync('importJson', {
        path,
        collId,
        sessionId
      })
    }
  },
  exportCSV: (sessionId, collId, path, filename) => {
    if(path == null){
      const newpath = window.api.sendSync('browseOutputDirectory')
      const timeElapsed = Date.now()
      const today = new Date(timeElapsed)
      window.api.send('exportCSV', {
        filename: collId + '-' + today.toISOString(),
        path: newpath,
        collId,
        sessionId
      })
    }else{
      window.api.send('exportCSV', {
        filename,
        path,
        collId,
        sessionId
      })
    }
  },
  importCsv: async (sessionId, collId, options, path) => {
    if(path == null){
      const newpath = window.api.sendSync('browseInputDirectory')
      await window.api.sendSync('importCSV', {
        path: newpath,
        collId,
        options,
        sessionId
      })
    }else{
      await window.apiwindow.api.sendSync('importCSV', {
        path,
        collId,
        options,
        sessionId
      })
    }
  },
  addCollection: async ({sessionId, collId, docId, data}) => {
    await window.api.sendSync('addCollection', {
      collId, docId, data, sessionId
    })
  },
  renameCollection: async ({sessionId, collId, newName}) => {
    await window.api.sendSync('renameCollection', {
      collId, newName, sessionId
    })
  },
  duplicateCollection: async ({sessionId, collId, newName}) => {
    await window.api.sendSync('duplicateCollection', {
      collId, newName, sessionId
    })
  },
  deleteCollection: async (sessionId, collId) => {
    await window.api.sendSync('deleteCollection', {collId, sessionId})
  },
  addDocument: async ({sessionId, collId, docId, data}) => {
    await window.api.sendSync('addDocument', {
      collId, docId, data, sessionId
    })
  },
  editDocument: async ({sessionId, collId, docId, data}) => {
    await window.api.sendSync('editDocument', {
      collId, docId, data, sessionId
    })
  },
  deleteDocument: async ({sessionId, collId, docId}) => {
    await window.api.sendSync('deleteDocument', {
      collId, docId, sessionId
    })
  },
  duplicateDocument: async ({sessionId, collId, docId, newDocId}) => {
    await window.api.sendSync('duplicateDocument', {
      collId, docId, newDocId, sessionId
    })
  },
}

export default Repo