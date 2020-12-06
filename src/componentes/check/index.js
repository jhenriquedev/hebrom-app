import React from 'react'

import './estilo.css'

export default props => {
    return(
      <div className="check-tabela">
        <input 
          type='checkbox'
          {...props.config} 
          checked = {props.checked}
        />
      </div>
    )
}