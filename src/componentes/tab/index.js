import React from 'react'

import './estilo.css'

import Menu from '../menu'

import Button from '../button'

import Tools from '../tabTools'

export default props => {
    return(
        <div className='tab'>
            <div className='tab-header'>
                <Menu links={props.links} />
                {
                    props.tools ? 
                        <Tools>
                            {
                                props.tools.map(item => item)
                            }
                        </Tools>
                    : ''
                }
            </div>
            <div className='tab-body'>
                {
                    props.tab
                }
            </div>
        </div>
    )
}