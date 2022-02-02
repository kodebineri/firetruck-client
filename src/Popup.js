const Popup = {
  deletePopup: (yesAction, noAction, arg) => {
    return <div className='bg-popup'>
      <div className='popup-container'>
        <h2>Delete Collection {arg}</h2>
        <p>Are you sure want to delete this collection?</p>
        <div className='navigation'>
          <button onClick={() => noAction()}>
            No
          </button>
          <button className='active' onClick={() => yesAction()}>
            Yes
          </button>
        </div>
      </div>
    </div>
  }
}

export default Popup;