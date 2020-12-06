import React from 'react'

import './estilo.css'

import Link from '../link'

export default props => {
    return(
        <div className='div-avatar' onChange={props.onChange}>
            <div className='input-avatar'>
                <img src={props.avatar || 'img/user2.png'} alt="Avatar" />
            </div>
            <input type='file' name='avatar' id='upload' accept='.jpg,.png,.jpeg' />
            <label htmlFor='upload' ><Link texto='Avatar'/></label>
        </div>
    )
}