import React, {useState} from 'react'

import './estilo.css'

import { Login } from '../../crud'
import { Navegar } from '../../util'

import Logo from '../../componentes/logo' 
import Painel from '../../componentes/painel'
import FormItem from '../../componentes/formItem'
import Box from '../../componentes/box'
import Button from '../../componentes/button'
import Link from '../../componentes/link'
import Input from '../../componentes/input' 
import Form from '../../componentes/form'


export default ({ history }) => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const [alert, setAlert] = useState({}) //documento alert
    const [loading, setLoading] = useState(false) //icone de loading

    const [sessao, setSessao] = useState({})

    if (alert.display) { //verifica se o display está aberto em tela
        setTimeout(() => {
            nextPage()
        }, 1000)
    }

    const nextPage = () => { //decide se deve navegar a outra pagina
        setAlert({ ...alert, display: false })

        if (alert.display && alert.tipo === 'success') {
            //if (sessao.rootAplicacao) return Navegar(history, '/configuracoes')
            //if (sessao.rootConta) return Navegar(history, '/ministerio')
            Navegar(history, '/dashboard')
        }
    }

    const handleSubmit = event => {
        event.preventDefault()

        setAlert(false)

        setLoading(true)

        Login(2, { email: email, password: senha })
            .then(resp => {
                setSessao(resp.data)
                setLoading(resp.loading)
                setAlert(resp)
            })
    }

    //configuracao dos formularios
    const configForm = {
        submit: handleSubmit,
        id: true,
        noButton: true
    }

    return (
        <div className='grid-login'>
            <div className='login-container'>
                    <Logo src='logos/hebrom-vertical-branco.png' className='logo-login'/>
                    <Painel
                        titulo='Efetuar Login'
                        link={{ label: 'Novo no Hebrom?', onClick: () => console.log('Clicou!'), texto: 'Criar Conta'}}
                        loading={loading}
                        msg={alert}
                    >
                    <Form config={configForm}>
                        <FormItem>
                            <Input config={{
                                id: 'email-login',
                                icone: 'at',
                                type: 'email',
                                name: 'E-mail',
                                placeholder: 'E-mail',
                                maxLength: '50',
                                minLength: '7',
                                required: true,
                                disabled: false,
                                autoFocus: true,
                                onChange: event => setEmail(event.target.value),
                                value: email
                            }}
                            />
                        </FormItem>
                        <FormItem>
                            <Input config={{
                                id: 'senha-login',
                                icone: 'key',
                                type: 'password',
                                name: 'Password',
                                placeholder: 'Password',
                                maxLength: '15',
                                minLength: '6',
                                required: true,
                                disabled: false,
                                onChange: event => setSenha(event.target.value),
                                value: senha,
                                onClick: () => console.log('click')
                            }}
                            />
                        </FormItem>
                        <FormItem>
                            <Button type='submit' texto='Log In' />
                        </FormItem>
                        </Form>
                    </Painel>
                    <Box>
                        <Link texto='Saiba mais' to='/' />
                        <Link texto='Esqueceu sua senha?' />
                    </Box>
                    <div className='rodape-login'>
                            <div className='gradient-login'></div>
                            <div className='copy-login'>
                                HEBROM É UM APLICATIVO 
                                <Logo src='logos/codes-auxiliar.png'/>
                                STÚDIO
                            </div>
                    </div>
            </div>
        </div>
    )
}