import React from 'react'

import './estilo.css'

import {Navegar} from '../../util'

export default props => {
    return (
        <div className='menu'>
            {
                props.links ?
                    props.links.map(link => {
                        if(link.sub){
                            return (
                                <a 
                                    key={link.id} 
                                    className={link.className}
                                    onClick={() => 
                                        link.sub.map(sub => 
                                            <a key={sub.id} href={sub.to}>
                                                {sub.texto}
                                            </a>
                                        )
                                    }>
                                    {link.texto}
                                    <span className={`fas fa-${link.icone || 'angle-down'}  fa-sm`}></span>
                                </a>
                            )
                        }
                        if(link.lista) return(
                            <a
                                key={link.id}
                                className={link.className}
                                onClick={link.onClick}
                            >
                                {link.texto}
                                <span className={`fas fa-${link.icone || 'angle-down'}  fa-sm`}></span>
                            </a>
                        )
                        if(link.tab) return(
                            <a
                                key={link.id}
                                className={`${link.off ? 'item-off' : ''} ${link.className}`}
                                onClick={link.tab}
                            >
                                {link.texto}
                            </a>
                        )
                        if (link.icone) return (<button className='button-menu' key={link.id} onClick={(() => Navegar(link.history, link.to))}>{link.icone ? <i className={`fas ${link.icone} fa-lg`}></i> : ''}{link.texto}</button>)
                        if (link.btn) return (<button key={link.id} onClick={(() => Navegar(link.history, link.to))}>{link.texto}</button>)
                        return (<a key={link.id} href={link.to}>{link.texto}</a>)
                    })
                : ''
            }
        </div>
    )
}