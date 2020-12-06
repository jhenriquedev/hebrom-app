import React, {useState, useEffect} from 'react'

import './estilo.css'

import {FindClient, Login} from '../../crud'
import {Navegar} from '../../util'

import Header from '../layout/layoutPadrao/header'
import Body from '../layout/layoutPadrao/body'
import Footer from '../layout/layoutPadrao/footer'

import Modal from '../modal'

import Erro from '../telaErro'

export default props => {

    const [user, setUser] = useState('')

    //const [modal, setModal] = useState({})

    useEffect(()=> { //não permite entrar sem estar logado
        setUser(Login(1))
    }, [])

    return(
        <>
            {
                user ?
                    <div className='grid-padrao'>
                        <div className='header-padrao' >
                            <Header history={props.history} user={user} busca={props.busca} carregado={props.carregado || true}/>
                        </div >
                        <div className='body-padrao'>
                            <Body links={props.links} loading={props.loading} alert={props.alert}>
                                {
                                    props.children
                                }
                            </Body>
                        </div>
                        <div className='footer-padrao'>
                            <Footer />
                        </div>
                    </div >
                    : 
                    <Erro codigo='404 - PAGE NOT FOUND' history={props.history}/>
            }
        </>
    )
}