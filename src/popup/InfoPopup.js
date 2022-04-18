function InfoPopup (props) {
  if (props.active) {
    return <div className='bg-popup'>
      <div className='popup-container error'>
        <h3>{props.title}</h3>
        <p>{props.message}</p>
        <div className='navigation'>
          <button onClick={() => props.onClick()}>
            OK
          </button>
        </div>
      </div>
    </div>
  }else{
    return null
  }
}

export default InfoPopup