import React from  'react'

import './estilo.css'

import RowItem from '../rowItem'
import Form from '../form'

export default props => {
    return(
        props.config ?
            <div className='modal-container' style={{display:props.config.display ? '' : 'none'}}>
                <div className='modal-padrao nivel-3'>
                    <div className='modal-header'>
                        <h3>{props.config.titulo || 'Titulo'}</h3>
                    </div>
                    <RowItem larg3={true}>
                        <Form config={props.form} campos={props.campos} />
                    </RowItem>
                    <p></p>
                </div>
            </div>
        : ''
    )
}