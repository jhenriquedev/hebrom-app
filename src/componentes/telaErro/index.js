import React from 'react'

import './estilo.css'

import {Navegar} from '../../util'

import Logo from '../logo'
import Painel from '../painel'
import Box from '../box'
import Button from '../button'
import FormItem from '../formItem'
import Form from '../form'

export default props => {
    return(
        <div className='grid-login'>
            <div className='login-container'>
                <Logo src='logos/hebrom-vertical-branco.png' className='logo-login' />
                <Painel
                    titulo='Você não está logado'
                    msg={{texto:'Efetue o login e tente novamente!'}}
                >
                    <div className='codigo-erro'>{props.codigo}</div>
                    <Box></Box>
                    <Form>
                        <FormItem>
                            <Button texto='Efetuar o Login' onClick={() => Navegar(props.history, '/login')} />
                        </FormItem>
                    </Form>
                </Painel>
                <Box>
                </Box>
                <div className='rodape-login'>
                    <div className='gradient-login'></div>
                    <div className='copy-login'>
                        HEBROM É UM APLICATIVO
                                <Logo src='logos/codes-auxiliar.png' />
                        STÚDIO
                    </div>
                </div>
            </div>
        </div>
    )
}