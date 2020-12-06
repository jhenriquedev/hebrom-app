import React, {useState, useEffect, useMemo} from 'react'

import './estilo.css'

import { 
    Login, 
    FindAllRootsClients, 
    Remove, 
    Update, POST, Postagem, Count } from '../../crud'

import { 
    Navegar, 
    GerarPassword, 
    GeraMatricula, 
    FormataData, FormataDataInter } from '../../util'

import env from '../../environments'

import Tela from '../../componentes/tela'
import Tab from '../../componentes/tab'

import Button from '../../componentes/button'
import Link from '../../componentes/link'

import TabPainel from '../../componentes/tabPainel' //painel que contém todos os itens
import TabCol from '../../componentes/tabCol' //colunas do painel => dividido em 2
import TabRow from '../../componentes/tabRow' //linhas que ficam dentro das colunas
import TabBox from '../../componentes/tabBox' //box que dividem as linhas em 2

import RowContainer from '../../componentes/rowContainer'
import RowItem from '../../componentes/rowItem'

import Lista from '../../componentes/lista'

import Tabela from '../../componentes/tabela'

import Form from '../../componentes/form'
import FormItem from '../../componentes/formItem'
import Input from '../../componentes/input'
import InputAvatar from '../../componentes/inputAvatar'


export default ({history}) => {
    const [sessao, setSessao] = useState({})

    //para verificar se todos os dados foram carregados
    const [dadosCarregados, setDadosCarregados] = useState(false)

    const [tab, setTab] = useState(0)

    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({})

    const [dadosLista, setDadosLista] = useState([]) //dados prontos para a lista

    const [dadosTabelaClientes, setDadosTabelaClientes] = useState([])

    //perfil
    const [avatar, setAvatar] = useState({}) //relativo ao avatar do cliente

    const [dadosIniciais, setDadosIniciais] = useState({})
    const [root, setRoot] = useState({}) //dados do user root
    const [client, setCliente] = useState({}) //dados do cliente
    const [countClients, setCountClients] = useState(0)

    if (alert.display) { //verifica se o display está aberto em tela
        setTimeout(() => {
            setAlert({ ...alert, display: false })
        }, 1000)
    }

    useEffect(() => { //não permite visualizar se não tiver permissão
        const user = Login(1)
        user.rootAplicacao ? setSessao(user) : Navegar(history, '/ministerio')
    }, [])

    useEffect(() => {
        setLoading(true)
        try {
            FindAllRootsClients(true).then(resp => {
                Count('clients').then(resp => setCountClients(resp.data))
                changeDadosLista(resp.data)
                setLoading(resp.loading)
                setAlert(resp)
                setDadosCarregados(!resp.loading)
            })
        } catch (err) {
            setLoading(false)
            changeDadosLista(false)
            setAlert(env.ALERTS[0])
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        try {
            if(tab === 0) FindAllRootsClients(true).then(resp => {
                changeDadosLista(resp.data)
                setLoading(resp.loading)
            })
            if (tab === 1) FindAllRootsClients().then(resp => {
                changeDadosTabelaClientes(resp.data)
                setLoading(resp.loading)
            }) 
            if(tab >= 2) setLoading(false)
            if(tab != 5) resetPerfil()
            if(tab === 5 && !root._id){
                setRoot({ 
                    ...root, 
                    matricula: GeraMatricula(),
                    password: GerarPassword() 
                })
            }
        } catch (err) {
            setLoading(false)
            changeDadosLista(false)
            setAlert(env.ALERTS[0])
        }
    }, [tab])

    var links = [{ id: 0, texto: 'Dashboard', to: '/dashboard', history: '', btn: true, icone: 'fa-tachometer-alt' }]

    const verificaTab = tabVerificar =>{
        return tabVerificar === tab ? 'tab-selecionado' : ''
    }

    var linksTab = [
        { id: 0, texto: 'Overview', className: verificaTab(0), tab: ()=> setTab(0) },
        { id: 1, texto: 'Clientes', className: verificaTab(1), tab: () => setTab(1) },
        { id: 2, texto: 'Contatos', className: verificaTab(2), tab: () => setTab(2) },
        { id: 3, texto: 'Pedidos de Suporte', className: verificaTab(3), tab: () => setTab(3) },
        { id: 4, texto: 'Listas Configurações', className: verificaTab(4), tab: () => setTab(4) },
        { id: 5, texto: root._id ? 'Gerenciar' : 'Adicionar', className: verificaTab(5), tab: () => setTab(5) },
    ]

    const changeDadosLista = dados => {
        let lista = []

        if(dados){
            dados.map(item => {
                lista.push({
                    id: item._id,
                    icone: [
                        { id: 0, icon: 'power-off', cor: item.client.ativo ? 'green-2' : 'red' }
                    ],
                    avatar: item.avatar ? item.avatar.url : 'img/user2.png',
                    texto: item.email,
                    destaque: 'Titular',
                    span: item.nome,
                    info: item.client.nome,
                    link: { texto: 'Gerenciar', onClick: () => changePerfil(item) }
                })
            })
        }else{
            lista.push({
                id: 0,
                icone: [
                    { id: 0, icon: 'power-off', cor: 'red' }
                ],
                texto: 'Não há clientes cadastrados',
                info: 'Cadastre um cliente.',
                link: { texto: 'Cadastrar', onClick: () => console.log('clicou') }
            })
        }

        return setDadosLista(lista)
    }

    const changeDadosTabelaClientes = dados => {
        let lista = []

        //'Ativo', 'Nome', 'CNPJ', 'Criação', 'Root', 'E-mail', <Button texto='Add Cliente'

        if (dados) {
            dados.map(item => {
                lista.push({
                    id: item._id,
                    icone: [{ id: 0, icone: 'fa-power-off', cor: item.client.ativo ? 'green-2' : 'red' }],
                    colunas: [
                        item.client.nome,
                        item.client.cnpj,
                        item.client.createdAt,
                        item.nome,
                        item.email,
                        <>
                            <Link texto='Gerenciar' onClick={() => changePerfil(item)}/>
                        </>,
                    ]
                })
            })
        }

        return setDadosTabelaClientes(lista)

    }

    const changePerfil = item => {
        setRoot(item)
        setCliente(item.client)
        setDadosIniciais(item)
        setAvatar(item.avatar)

        if(!item.matricula) item.matricula = GeraMatricula()

        verificaTab(5)
        setTab(5)
    }

    const abrirAdicionar = () => {
        setRoot({...root, matricula:GeraMatricula(), password:GerarPassword()})

        verificaTab(5)
        setTab(5)
    }

    const update = (tabela, _id, dados) => {
        setLoading(true)

        Update(tabela, 'Dados Atualizados', _id, dados).then(resp => {
            if (resp) {
                //changePerfil(resp.data)
                setLoading(resp.loading)
                setAlert(resp)
            }
        })
    }

    const updateUser = async e => {
        e.preventDefault()

        const avatarInicial = dadosIniciais.avatar || {}

        if (avatarInicial.url != avatar.url) {
            setLoading(true)

            //remove qualquer avatar antigo salvo no banco
            if (avatarInicial._id) await Remove('postagens', 'Avatar removido.', avatarInicial._id)

            await Postagem(avatar.thumbnail).then(resp => {
                if (resp) {
                    setLoading(resp.loading)
                    setAlert(resp)
                    setAvatar(resp.data)

                    update('users', root._id, {...root, avatar:resp.data._id})
                }
            })
        } 
    }

    const updateClient = async e => {
        e.preventDefault()
        update('clients', client._id, client)
        update('users', root._id, {...root, ativo:client.ativo})
    }

    useMemo(() => {
        if(root.client){
            if (root.client.ativo != client.ativo)
                update('clients', client._id, client)
        }
    }, [client.ativo])

    const criarConta = (() => {
        //event.preventDefault()

        setLoading(true)

        const data = {
            matricula: root.matricula, 
            nome:client.nome, 
            cnpj:client.cnpj, 
            nomeUser:root.nome, 
            cpf:root.cpf,
            email:root.email, 
            password:root.password, 
            acesso:'*', 
            rootConta: true,
            //rootAplicacao:true
        }

        const msg = 'Conta criada com sucesso!'

        POST('clients', data, msg)
            .then(resp => {
                setLoading(resp.loading)
                resetPerfil()
                setAlert(resp)
                setTimeout(() => {
                    verificaTab(1) //volta para listagem de clientes
                    setTab(1)
                }, 1000)
            })
    })

    const removeConta = () => {
        setLoading(true)
        Remove('clients', 'Cliente removido', client._id)
            .then(resp => {
                if (resp) {
                    resetPerfil()
                    setLoading(resp.loading)
                    setAlert(resp)
                    setTimeout(() => {
                        verificaTab(1) //volta para listagem de clientes
                        setTab(1)
                    }, 1000)
                }
            })
    }

    const resetPerfil = () => {
        setCliente({})
        setRoot({})
        setDadosIniciais({})
        setAvatar({})
    }


    //configuracao dos formularios
    const configForm = {
        submit: updateUser,
        id: root._id ? true : false,
        cancelar: () => setRoot(dadosIniciais)
    }

    //configuracao dos formularios
    const configFormClient = {
        submit: updateClient,
        id: root._id ? true : false,
        cancelar: () => setRoot(dadosIniciais)
    }

    const tabs = [
        <TabPainel id='Overview'>
            <TabCol col='0'>
                <TabRow>
                    <Lista 
                        titulo='Novos Clientes' 
                        button={[{ id: 0, lista:true, texto: 'Ver Todos', icone: 'fas fa-arrow-alt-circle-right', onClick: () => setTab(1) }]} 
                        itens={dadosLista}
                    />
                </TabRow>
            </TabCol>
            <TabCol col='1'>
                <TabRow>
                    <RowContainer>
                        <RowItem>
                            <p>Total de Clientes: <b>{countClients}</b></p>
                        </RowItem>
                    </RowContainer>
                </TabRow>
            </TabCol>
        </TabPainel>,
        <TabPainel id='Clientes' full={true}>
            <TabRow>
                <Tabela 
                    colunas={['Ativo', 'Nome', 'CNPJ', 'Criação', 'Root', 'E-mail', <Button texto='Add Cliente' onClick={() => abrirAdicionar()}/>]}
                    linhas={dadosTabelaClientes}
                />
            </TabRow>
        </TabPainel>,
        <TabPainel id='Contatos'>
            <TabCol col='0'>
                TabCol 1
            </TabCol>
            <TabCol col='1'>
                TabCol 2
            </TabCol>
        </TabPainel>,
        <TabPainel id='Pedidos de Suporte'>
            <TabCol col='0'>
                TabCol 1
            </TabCol>
            <TabCol col='1'>
                TabCol 2
            </TabCol>
        </TabPainel>,
        <TabPainel id='Listas de Configurações'>
            <TabCol col='0'>
                TabCol 1
            </TabCol>
            <TabCol col='1'>
                TabCol 2
            </TabCol>
        </TabPainel>,
        <TabPainel id={root._id ? 'Gerenciar' : 'Adicionar'} full={true}>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Root</h3>
                        <p>Informações do titular da conta e configurações de login.</p>
                        <p>Criado em: <b>{root.createdAt ? FormataData(root.createdAt) : ''}</b></p>
                        <div className='row-item-link'>
                            <a onClick={() => setRoot({ ...root, password: GerarPassword() })}>Gerar Novo Password</a>
                            <a onClick={() => setRoot({ ...root, matricula: GeraMatricula() })}>Gerar Matricula</a>
                        </div>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm}>
                            <FormItem>
                                <InputAvatar onChange={event => setAvatar({...avatar, url: URL.createObjectURL(event.target.files[0]), thumbnail: event.target.files[0] })} avatar={avatar ? avatar.url : false}/>
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'email-dashboard',
                                    label: true,
                                    icone: 'at',
                                    type: 'email',
                                    name: 'E-mail',
                                    placeholder: 'E-mail',
                                    maxLength: '50',
                                    minLength: '7',
                                    required: true,
                                    disabled: false,
                                    autoFocus: root._id ? false : true,
                                    onChange: event => setRoot({...root, email:event.target.value}),
                                    value: root.email
                                }}/>
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'senha-dashboard',
                                    label: true,
                                    icone: 'key',
                                    type: 'text',
                                    name: 'Password',
                                    placeholder: 'Password',
                                    maxLength: '16',
                                    minLength: '6',
                                    required: true,
                                    disabled: false,
                                    onChange: event => setRoot({...root, password:event.target.value}),
                                    value: root.password
                                }}
                            />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'matricula-dashboard',
                                    label: true,
                                    icone: 'id-badge',
                                    type: 'text',
                                    name: 'matricula',
                                    placeholder: 'Matricula',
                                    maxLength: '11',
                                    minLength: '11',
                                    required: true,
                                    disabled: false,
                                    onChange: event => setRoot({ ...root, matricula: event.target.value }),
                                    value: root.matricula
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'nome-dashboard',
                                    label: true,
                                    icone: 'user',
                                    type: 'text',
                                    name: 'nome',
                                    placeholder: 'Nome',
                                    maxLength: '50',
                                    minLength: '6',
                                    required: true,
                                    disabled: false,
                                    onChange: event => setRoot({ ...root, nome: event.target.value }),
                                    value: root.nome
                                }}
                                />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'cpf-dashboard',
                                    label: true,
                                    icone: 'address-card',
                                    type: 'text',
                                    name: 'cpf',
                                    placeholder: 'CPF',
                                    maxLength: '11',
                                    minLength: '6',
                                    required: true,
                                    disabled: false,
                                    onChange: event => setRoot({ ...root, cpf: event.target.value }),
                                    value: root.cpf
                                }}
                                />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'fixo-dashboard',
                                    label: true,
                                    icone: 'phone',
                                    type: 'text',
                                    name: 'fixo',
                                    placeholder: 'Telefone Fixo',
                                    maxLength: '11',
                                    minLength: '8',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setRoot({ ...root, fixo: event.target.value }),
                                    value: root.fixo
                                }}
                                />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'celular-dashboard',
                                    label: true,
                                    icone: 'mobile-alt',
                                    type: 'text',
                                    name: 'celular',
                                    placeholder: 'Celular',
                                    maxLength: '12',
                                    minLength: '9',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setRoot({ ...root, celular: event.target.value }),
                                    value: root.celular
                                }}
                                />
                            </FormItem>
                        </Form>
                    </RowItem>
                </RowContainer>
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Dados Gerais</h3>
                        <p>Informações básicas do cliente.</p>
                        {
                            client._id ?
                                <p>Criado em: <b>{client ? FormataData(client.createdAt) : ''}</b></p>
                            : ''
                        }
                    </RowItem>
                    <RowItem>
                        <Form config={configFormClient}>
                            <FormItem>
                                <Input config={{
                                    id: 'nome-cliente-dashboard',
                                    label: true,
                                    icone: 'building',
                                    type: 'text',
                                    name: 'name',
                                    placeholder: 'Nome',
                                    maxLength: '50',
                                    minLength: '7',
                                    required: true,
                                    disabled: false,
                                    onChange: event => setCliente({ ...client, nome: event.target.value }),
                                    value: client.nome
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'cnpj-cliente-dashboard',
                                    label: true,
                                    icone: 'id-card',
                                    type: 'text',
                                    name: 'cnpj',
                                    placeholder: 'Cnpj',
                                    maxLength: '14',
                                    minLength: '14',
                                    required: true,
                                    disabled: false,
                                    onChange: event => setCliente({ ...client, cnpj: event.target.value }),
                                    value: client.cnpj
                                }} />
                            </FormItem>
                            <FormItem>
                                <Input config={{
                                    id: 'fundacao-cliente-dashboard',
                                    label: true,
                                    icone: 'calendar-alt',
                                    type: 'date',
                                    name: 'fundacao',
                                    placeholder: 'Fundação',
                                    maxLength: '50',
                                    minLength: '7',
                                    required: false,
                                    disabled: false,
                                    onChange: event => setCliente({ ...client, fundacao: event.target.value }),
                                    value: FormataDataInter(client.fundacao)
                                }} />
                            </FormItem>
                        </Form>
                    </RowItem>
                </RowContainer>
            </TabRow>
            {
                root._id ?
                    <>
                        <TabRow bottom={true}>
                            <RowContainer>
                                <RowItem>
                                    {
                                        client.ativo ?
                                            <>
                                                <h3>Desativar a Conta</h3>
                                                <p>Ao clicar neste botão você irá desativar a conta e o cliente não poderá mais efetuar o login.</p>
                                            </>
                                            :
                                            <>
                                                <h3>Ativar a Conta</h3>
                                                <p>Ao clicar neste botão você irá ativar a conta e o cliente voltará a poder efetuar o login.</p>
                                            </>
                                    }
                                </RowItem>
                                <RowItem>
                                    <FormItem>
                                        <Button className={client.ativo ? 'red' : 'green'} texto={client.ativo ? 'Desativar a Conta' : 'Ativar a Conta'} onClick={() => setCliente({ ...client, ativo: !client.ativo })} />
                                    </FormItem>
                                </RowItem>
                            </RowContainer>
                        </TabRow>
                        <TabRow>
                            <RowContainer>
                                <RowItem>
                                    <h3>Excluir a Conta</h3>
                                    <p>Ao clicar neste botão você irá remover a conta permanentemente.</p>
                                    <p><b>Warning: </b> Esta ação é irreversivel!</p>
                                </RowItem>
                                <RowItem>
                                    <FormItem>
                                        <Button className='red' texto='Deletar a Conta' onClick={() => removeConta()}/>
                                    </FormItem>
                                </RowItem>
                            </RowContainer>
                        </TabRow>
                    </>
                : 
                    <TabRow>
                        <RowContainer>
                            <RowItem>
                                <h3>Criar Nova Conta</h3>
                                <p>Ao clicar neste botão você irá criar uma nova conta com os parametros informados.</p>
                            </RowItem>
                            <RowItem>
                                <FormItem>
                                    <Button className='green' texto='Criar Conta' onClick={() => criarConta()}/>
                                </FormItem>
                            </RowItem>
                        </RowContainer>
                    </TabRow>                    
            }
        </TabPainel>,
    ]

    return(
        <Tela links={links} history={history} loading={loading} alert={alert} carregado={dadosCarregados}>
            <Tab links={
                dadosCarregados ?
                    linksTab
                    :
                    [
                        {
                            id: 0,
                            texto: 'Carregando...',
                            className: verificaTab(0),
                            tab: () => setTab(0)
                        }
                    ]
            }
                tab={tabs[tab]} />
        </Tela>
    )
}
