import React from 'react'


const Alert = ({alertType, message}) => {

  return (
    <div className={`alert ${alertType}`}>
      {message}
    </div>
  )
}

export default Alert;