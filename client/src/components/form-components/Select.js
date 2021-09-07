import React from 'react'


const Select = ({title, name, value, placeholder, options = [],handleChange}) => {

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {" "}
        {title}{" "}
      </label>
      <select className="form-select" id={name} name={name} value={value} onChange={handleChange}>
        <option value="">{placeholder}</option>
        {options.map(op => {
          return (
            <option className="form-select" key={op.id} value={op.id} label={op.value}>
              {op.value}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default Select