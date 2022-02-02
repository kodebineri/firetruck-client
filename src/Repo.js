// import { ipcRenderer } from "electron"
const {ipcRenderer} = window.require('electron')

const Repo = {
  init: (val) => {
    ipcRenderer.send('init', val)
  },
  // getCollections: async () => {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve([
  //         {
  //           id: 'COLL1'
  //         },
  //         {
  //           id: 'COLL2'
  //         },
  //         {
  //           id: 'COLL3'
  //         }
  //       ])
  //     }, 300)
  //   })
  // },
  getCollections: async () => {
    const data = await ipcRenderer.sendSync('getCollections')
    return data
  },
  // getDocuments: async (collId, limit = 100, offset = 0) => {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve([
  //         {
  //           id: 'abc',
  //           title: 'Lorem ipsum',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'def',
  //           title: 'Lorem ipsum 2',
  //           content: 'dolor sit amet',
  //           extra: 'boost'
  //         },
  //         {
  //           id: 'ghi',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'jkl',
  //           title: 'Lorem ipsum 3',
  //           content: ['testing', 'testing 2']
  //         },
  //         {
  //           id: 'jkl',
  //           title: 'Lorem ipsum 3',
  //           content: ['testing', {
  //             key: 1,
  //             value: 2
  //           }]
  //         },
  //         {
  //           id: 'ghi2',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'ghi3',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'ghi4',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'ghi5',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'ghi6',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'ghi7',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'ghi8',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'ghi9',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'ghi10',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'ghi11',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'ghi12',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'ghi13',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'ghi14',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet'
  //         },
  //         {
  //           id: 'ghi15',
  //           title: 'Lorem ipsum 3',
  //           content: 'dolor sit amet',
  //           content2: 'dolor sit amet',
  //           content3: 'dolor sit amet',
  //           content4: 'dolor sit amet',
  //           content5: 'dolor sit amet'
  //         },
  //       ])
  //     }, 300)
  //   })
  // },
  getDocuments: async (collId, limit = 100, offset = 0) => {
    const data = await ipcRenderer.sendSync('getDocuments', collId)
    return data
  },
  browseServiceAccount: () => {
    const path = ipcRenderer.sendSync('browseServiceAccount')
    return path
  },
  exportJson: (collId) => {
    const path = ipcRenderer.sendSync('browseOutputDirectory')
    const timeElapsed = Date.now()
    const today = new Date(timeElapsed)
    ipcRenderer.send('exportJson', {
      filename: collId + '-' + today.toISOString(),
      path,
      collId
    })
  },
  importJson: async (collId) => {
    const path = ipcRenderer.sendSync('browseInputDirectory')
    await ipcRenderer.sendSync('importJson', {
      path,
      collId
    })
  },
  exportCSV: (collId) => {
    const path = ipcRenderer.sendSync('browseOutputDirectory')
    const timeElapsed = Date.now()
    const today = new Date(timeElapsed)
    ipcRenderer.send('exportCSV', {
      filename: collId + '-' + today.toISOString(),
      path,
      collId
    })
  },
  importCsv: async (collId) => {
    const path = ipcRenderer.sendSync('browseInputDirectory')
    await ipcRenderer.sendSync('importCSV', {
      path,
      collId
    })
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
  }
}

export default Repo