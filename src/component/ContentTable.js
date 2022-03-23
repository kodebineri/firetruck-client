function ContentTable (props) {
  const isJSON = (str) => {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  const renderDocuments = () => {
    return props.documents.map((item, index) => {
      return <tr key={index}>{renderRow(item)}</tr>
    })
  }

  const renderHeaders = () => {
    return props.headers.map((item, index) => <td key={index}>{item}</td>)
  }

  const renderRowStyle = (key, val) => {
    if(key === '_id'){
      return <b>{val}</b>
    }else if(val._seconds !== undefined){
      const date = new Date(0)
      date.setSeconds(val._seconds)
      date.setMilliseconds(val._nanoseconds / 1000000)
      return <i>{date.toISOString()}</i>
    }else{
      return JSON.stringify(val)
    }
  }

  const renderRow = (item) => {
    return props.headers.map((key, index) => {
      if(key === '_id'){
        return <td key={index}>
          <a href={'doc:' + props.activeColl + '.' + item[key]}>
            {item[key]}
          </a>
        </td>
      }else{
        if(item[key]){
          return <td key={index}>{
            renderRowStyle(key, item[key])
          }</td>
        }else{
          return <td key={index}></td>
        }
      }
    })
  }

  if(props.documents.length > 0){
    return <table>
      <thead>
        <tr>{renderHeaders()}</tr>
      </thead>
      <tbody>
        {renderDocuments()}
      </tbody>
    </table>
  }else{
    return <div className='empty'>No data</div>
  }
}

export default ContentTable