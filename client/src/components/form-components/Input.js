import React from 'react'


const Input = ({name, title, type, value, handleChange, placeholder = "", min="", max="", errorDiv, errorMsg, className}) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {title}
      </label>
      <input
        type={type}
        className={`form-control ${className}`}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        max={max}
      />
      <div className={errorDiv}>{errorMsg}</div>
    </div>
  )
}


export default Input;