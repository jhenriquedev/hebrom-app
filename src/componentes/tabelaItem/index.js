import React from 'react'

import { GeraMatricula } from '../../util'

import './estilo.css'

import Button from '../../componentes/button'

export default props => {
    return(
        <tr key={props.key} className='tabela-item-padrao' >
            {
                props.icones ?
                    props.icones.map(icone => 
                        <td key={icone.icone}>
                            <span className={`fas ${icone.icone} fa-lg ${icone.cor}`}></span>
                        </td>
                    )
                : ''
            }
            {
                props.colunas ? 
                    props.colunas.map(coluna => <td key={coluna === 0 || coluna === '0' ? GeraMatricula() : coluna}>{coluna}</td>)
                : ''
            }
        </tr>
    )
}