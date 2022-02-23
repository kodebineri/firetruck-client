function ErrorPopup (props) {
  if (props.active) {
    return <div className='bg-popup'>
      <div className='popup-container error'>
        <h3>Whoops, an error occured :(</h3>
        <p>{props.error}</p>
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

export default ErrorPopup