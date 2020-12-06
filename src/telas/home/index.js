import React from 'react'

import './estilo.css'

import Header from '../../componentes/layout/header'
import Footer from '../../componentes/layout/footer'
import Body from '../../componentes/layout/body'

import Carrossel from '../../componentes/carrossel'

export default ({history}) => {
    return(
        <div className='grid-home'>
            <div className='header-home'>
                <Header history={history}/>
            </div>
            <div className='body-home'>
                <Body>
                    <Carrossel />
                </Body>
            </div>
            <div className='footer-home'>
                <Footer />
            </div>
        </div>
    )
}