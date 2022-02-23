import loading from '../loading.gif';

function LoadingPopup (props) {
  if (props.active) {
    return <div className='bg-popup'>
      <div className='popup-container loading'>
        <img src={loading} alt='loading...' />
      </div>
    </div>
  }else{
    return null
  }
}

export default LoadingPopup