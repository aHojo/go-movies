import React from 'react'


const TextArea = ({name, title, value, handleChange}) => {

  return (
  <div className="mb-3">
    <label htmlFor={name} className="form-label">
      {title}
    </label>
    <textarea
      className="form-control" id={name} name={name} row="3" onChange={handleChange} value={value}/>
  </div>
  )
}

export default TextArea;