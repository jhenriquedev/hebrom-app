import React from 'react'

import './estilo.css'

import Logo from '../../logo'
import Menu from '../../menu'

export default props => {
    return (
        <div className='rodape'>
            <div className='rodape-top'>
                <Logo src='logos/heroku-logo.svg' alt='Heroku' className='logo-especial-2'/>
                <Logo src='logos/mongo-logo.png' alt='MongoDb' className='logo-especial-2'/>
                <Logo src='logos/node.png' alt='NodeJs' className='logo-especial-3'/>
                <Logo src='logos/react-logo.png' alt='ReactJs' className='logo-especial-2' />
                <Logo src='logos/javascript-logo.png' alt='JavaScript' className='logo-especial-2' />
            </div>
            <div className='rodape-bottom'>
                <div className='rodape-direita'>
                    <div className='texto-rodape'>
                        <Logo src='logos/codes-branco.png' alt='Codes Stúdio' />
                    </div>
                    <div className='texto-rodape'>
                        <h4>Desenvolvido por Codes Stúdio</h4>
                        <p>21 DE NOVEMBRO, 2019 BELÉM, PA</p>
                    </div>
                </div>
                <div className='rodape-esquerda'>
                    <div className='texto-rodape'>
                        <Menu links={
                            [
                                { id: 4, texto: 'CONTRATAR', to: '', btn: true }
                            ]
                        } />
                    </div>
                </div>
            </div>
        </div>
    )
}