
import React, {useState, useEffect, useMemo} from 'react'

import './estilo.css'

import {
    Login,
    FindAllNewsUsers,
    FindAllClient,
    FindOne,
    Remove,
    Update, POST, Postagem, Count, Sumario, FindClient
} from '../../crud'

import {
    Navegar,
    GerarPassword,
    GeraMatricula,
    FormataData, FormataDataInter
} from '../../util'

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

import Modal from '../../componentes/modal'

import Form from '../../componentes/form'
import FormItem from '../../componentes/formItem'

export default ({ history }) => {
    const [sumario, setSumario] = useState([])

    const [tab, setTab] = useState(0)

    //modal
    const [modal, setModal] = useState({})
    const [inputModal, setInputModal] = useState()
    const [updateClient, setUpdateClient] = useState(false)

    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({})

    //para verificar se todos os dados foram carregados
    const [dadosCarregados, setDadosCarregados] = useState(false)

    const [dadosLista, setDadosLista] = useState([]) //dados prontos para a lista

    const [dadosTabelaClientes, setDadosTabelaClientes] = useState([])

    const [dadosResumo, setDadosResumo] = useState([]) //resumo do ministério

    //perfil
    const [avatar, setAvatar] = useState({}) //relativo ao avatar do cliente

    const [dadosIniciais, setDadosIniciais] = useState({})
    const [root, setRoot] = useState({}) //dados do user root
    const [client, setClient] = useState({}) //dados do cliente

    //diretoria
    const [listaDiretoria, setListaDiretoria] = useState([])
    const [modalDiretoria, setModalDiretoria] = useState({})
    const [diretoriaModal, setDiretoriaModal] = useState({})
    const [selectDiretoria, setSelectDiretoria] = useState([])
    const [removerDiretoria, setRemoverDiretoria] = useState(false)
    const [membroDiretoriaRemover, setMembroDiretoriaRemover] = useState({})

    if (alert.display) { //verifica se o display está aberto em tela
        setTimeout(() => {
            setAlert({ ...alert, display: false })
        }, 1000)
    }

    useEffect(() => {
        setLoading(true)
        const user = Login(1)

        try {
            Sumario('clients', user.client).then(resp => {
                if (resp.data) {
                    changeSumario(resp.data)
                    setTimeout(() => {
                        setLoading(resp.loading)
                        setAlert({tipo:'danger', texto:'Súmario Carregado...', display: true})
                    }, 1000)
                }
            })
            setLoading(true)
            FindOne('users', user._id, 'Usuário Carregado...').then(resp => {
                if(resp.data){
                    setRoot({ ...resp.data, matricula: resp.data.matricula ? resp.data.matricula : GeraMatricula() })
                    setDadosIniciais(resp.data)
                    setAvatar(resp.data.avatar)
                    setTimeout(() => {
                        setLoading(resp.loading)
                        setAlert(resp)
                    }, 1000)
                }
            })
            setLoading(true)
            FindOne('clients', user.client._id, 'Ministério Carregado...').then(resp => {
                if(resp.data){
                    setClient(resp.data)
                    changeDiretoria(resp.data.diretoria)
                    setTimeout(() => {
                        setLoading(resp.loading)
                        setAlert(resp)
                    }, 1000)
                }
            })
            setLoading(true)
            FindAllClient('users', 'Dados Carregados...').then(resp => {
                if(resp.data){
                    changeSelectDiretoria(resp.data)
                    setLoading(resp.loading)
                    setAlert(resp)
                    setDadosCarregados(true)
                }
            })

        } catch (err) {
            setLoading(false)
            setAlert({ tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
        }
    }, [])

    useEffect(() => {
        setLoading(true)

        try {
            if (tab === 0) FindAllNewsUsers().then(resp => {
                changeDadosLista(resp.data)
                setLoading(resp.loading)
            })
            if(tab === 1) changeClient()
            if(tab === 3) changeClient()
            if(tab === 4) changeClient()

            if (tab != 7) reset()

        } catch (err) {
            setLoading(false)
            changeDadosLista(false)
            setAlert({ tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
        }
    }, [tab])


    useEffect(() => {
        if(updateClient){
            setLoading(true)

            let dados = client

            let lista = []

            if (inputModal) { //inclui novos itens
                if (tab === 4) { //cargos
                    lista = client.cargos
                    lista.unshift(inputModal.texto)

                    dados.cargos = lista
                }

                if (tab === 3) {
                    lista = client.funcoes
                    lista.unshift(inputModal.texto)
                    dados.funcoes = lista
                }

                setInputModal({ ...inputModal, texto: '' })
                setModal({ ...modal, display: false })  

            }

            if(tab === 1){
                let diretoria = client.diretoria
                diretoria.unshift(diretoriaModal.nome)
                dados.diretoria = diretoria

                setModalDiretoria({ ...modalDiretoria, display: false })
                setDiretoriaModal({})
            }

            try {
                Update('clients', 'Dados atualizados.', client._id, dados).then(resp => {
                    if (resp) {
                        changeDiretoria(resp.data.diretoria)
                        setLoading(resp.loading)
                        setAlert(resp)
                        //setInputModal({ ...inputModal, texto: '' })
                    }
                })
            }
            catch (err) {
                setLoading(false)
                setAlert({ tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
            }


            setUpdateClient(!updateClient) 
        }
    },[updateClient])

    useEffect(() => {
        let dados = client

        if(removerDiretoria){
            let diretoria = client.diretoria
            diretoria.splice(diretoria.indexOf(membroDiretoriaRemover), 1)
            dados.diretoria = diretoria
            
            setLoading(true)
            try {
                Update('clients', 'Dados atualizados.', client._id, dados).then(resp => {
                    if (resp) {
                        changeDiretoria(resp.data.diretoria)
                        setLoading(resp.loading)
                        setAlert(resp)
                        //setInputModal({ ...inputModal, texto: '' })
                    }
                })
            }
            catch (err) {
                setLoading(false)
                setAlert({ tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
            }

            //setMembroDiretoriaRemover({})
            setRemoverDiretoria(!removerDiretoria)
        }
    },[removerDiretoria])

    const links = [
        { id: 0, texto: 'Ministério', to: '/ministerio', history: history, btn: true, icone: 'icone-menu minister' }
    ]

    const verificaTab = tabVerificar => {
        return tabVerificar === tab ? 'tab-selecionado' : ''
    }

    var linksTab = [
        { id: 0, texto: 'Overview', className: verificaTab(0), tab: () => setTab(0) },
        { id: 1, texto: 'Diretoria', className: verificaTab(1), tab: () => setTab(1) },
        { id: 2, texto: 'Departamentos', className: verificaTab(2), tab: () => setTab(2) },
        { id: 3, texto: 'Funções Ministeriais', className: verificaTab(3), tab: () => setTab(3) },
        { id: 4, texto: 'Cargos Eclesiásticos', className: verificaTab(4), tab: () => setTab(4) },
        { id: 5, texto: 'Usuários do Sistema', className: verificaTab(5), tab: () => setTab(5) },
        { id: 6, texto: 'Relatórios', className: verificaTab(6), tab: () => setTab(6) },
        { id: 7, texto: 'Gerenciar', className: verificaTab(7), tab: () => setTab(7) },
    ]

    const changeClient = async () => {
        //setAlert({ tipo: 'danger', texto: client._id, display: true })
        await FindOne('clients', client._id, 'Dados Carregados...').then(resp => {
            if (resp.data) {
                setClient(resp.data)
                setLoading(resp.loading)
                setAlert(resp)
            }
        })
    }

    const changeSumario = sumario => {
        let lista = [
            { id: 0, texto: 'Conselhos', info: `${sumario.conselhos}` },
            { id: 1, texto: 'Departamentos', info: `${sumario.departamentos}` },
            { id: 2, texto: 'Núcleos', info: `${sumario.nucleos}` },
            { id: 3, texto: 'Setores', info: `${sumario.setores}` },
            { id: 4, texto: 'Áreas', info: `${sumario.areas}` },
            { id: 5, texto: 'Congregações', info: `${sumario.congregs}` },
            { id: 6, texto: 'Células', info: `${sumario.celulas}` },
            { id: 7, texto: 'Familias', info: `${sumario.familias}` },
            { id: 8, texto: 'Membros', info: `${sumario.membros}` }
        ]
        return setSumario(lista)
    }

    const changeDadosLista = dados => {
        let lista = []

        if (dados) {
            dados.map(item => {
                lista.push({
                    id: item._id,
                    icone: [
                        { id: 0, icon: 'power-off', cor: item.ativo ? 'green-2' : 'red' }
                    ],
                    avatar: item.avatar ? item.avatar.url : 'img/user2.png',
                    texto: item.nome,
                    destaque: 'Congregação',
                    span: item.congregacao ? item.congregacao.nome : 'Não informado',
                    info: item.matricula
                })
            })
        } else {
            lista.push({
                id: 0,
                icone: [
                    { id: 0, icon: 'power-off', cor: 'red' }
                ],
                texto: 'Não há membros cadastrados',
                info: 'Cadastre um membro.',
                link: { texto: 'Cadastrar', onClick: () => Navegar(history, '/membros')}
            })
        }

        return setDadosLista(lista)
    }

    const update = async e => {
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

                    update('users', root._id, { ...root, avatar: resp.data._id })
                }
            })
        }
    }

    const remover = () => {}


    const reset = () => {
        setRoot(dadosIniciais)
        setClient(dadosIniciais.client)
        setAvatar(dadosIniciais.avatar)
        setInputModal({ ...inputModal, texto: '' })
        setModal({ ...modal, display: false })
    }

    const removeItem = item => {
        let lista = tab === 3 ? client.funcoes : client.cargos

        lista.splice(lista.indexOf(item), 1)

        if (tab === 3) setClient({ ...client, funcoes: lista })

        if (tab === 4) setClient({ ...client, cargos: lista })

        setUpdateClient(!updateClient)
    }

    const formataArray = array => {

        let lista  = []

        if(array){
            //verifica itens nulos ou vazios
            array.map(item => {
                if (item === '' || item === null) array.splice(array.indexOf(item), 1)
            })

            array.map(item => {
                lista.push({ texto: item, onClick: () => removeItem(item) })
            })

        }

        return(lista)
    }


    //PROGRAMAÇÃO DA DIRETORIA

    const changeSelectDiretoria = dados => {
        let lista = []

        if (dados) {
            let membros = dados.filter(item => item.funcaoAtual)

            membros.map(item => {
                lista.push({ _id: item._id, nome: item.nome})
            })
        }
        if (dados.length < 1) {
            lista.push({
                id: '0',
                nome: 'Não existem Membros cadastrados'
            })
        }

        return setSelectDiretoria(lista)
    }

    const changeDiretoria = (diretoria) => {
        let lista = []

        if (diretoria.length > 0) {

            diretoria.map(item => {
                lista.push({
                    id: item._id,
                    icone: [
                        { id: 0, icon: 'user-tie', cor: item.ativo ? 'green-2' : 'gray' }
                    ],
                    texto: item.nome,
                    destaque: item.cargoAtual,
                    //span: item.posse ? `${FormataData(item.posse)} à ${
                    //    item.dataFim ? FormataData(item.dataFim) : 'Atualmente'
                    //    }` : 'Não informado',
                    info: item.funcaoAtual,
                    obs: item.OutrosF,
                    link: { icone: 'trash-alt', onClick: () => removerMembroDiretoria(item) }
                })
            })
        } else {
            lista.push({
                id: 0,
                info: 'Inclua membros para formar a diretoria'
            })
        }

        return setListaDiretoria(lista)
    }

    const removerMembroDiretoria = membro => {
        setMembroDiretoriaRemover(membro)
        setRemoverDiretoria(!removerDiretoria)
    }

    const adicionarMembroDiretoria = e => {
        e.preventDefault()

        setUpdateClient(!updateClient)
    }

    const formModalDiretoria = {
        submit: adicionarMembroDiretoria,
        id: true,
        cancelar: () => {
            setModalDiretoria({ ...modalDiretoria, display: false })
            setDiretoriaModal({})
        }
    }

    const campoModalDiretoria = [
        {
            tipoSelect: true,
            id: 'nome-membro',
            label: true,
            icone: 'briefcase',
            name: 'Função',
            placeholder: 'Selecione um Membro',
            required: true,
            disabled: false,
            lista: selectDiretoria,
            onChange: event => setDiretoriaModal({ ...diretoriaModal, nome: event.target.value }),
            value: diretoriaModal.nome
        },
    ]


    //FIM DA PROGRAMAÇÃO DA DIRETORIA
  
    //configuracao dos formularios
    const configForm = {
        submit: update,
        id: root._id ? true : false,
        cancelar: () => setRoot(dadosIniciais)
    }

    const camposRoot = [
        {
            tipoAvatar: true,
            onChange: event => setAvatar({ ...avatar, url: URL.createObjectURL(event.target.files[0]), thumbnail: event.target.files[0] }),
            avatar: avatar ? avatar.url : false
        },
        {
            tipoInput: true,
            label: true,
            id: 'email-dashboard',
            icone: 'at',
            type: 'email',
            name: 'E-mail',
            placeholder: 'E-mail',
            maxLength: '50',
            minLength: '7',
            required: true,
            disabled: false,
            onChange: event => setRoot({ ...root, email: event.target.value }),
            value: root.email
        },
        {
            tipoInput: true,
            label: true,
            id: 'senha-dashboard',
            icone: 'key',
            type: 'text',
            name: 'Password',
            placeholder: 'Password',
            maxLength: '16',
            minLength: '6',
            required: true,
            disabled: false,
            onChange: event => setRoot({ ...root, password: event.target.value }),
            value: root.password
        },
        {
            tipoInput: true,
            label: true,
            id: 'matricula-dashboard',
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
        },
        {
            tipoInput: true,
            label: true,
            id: 'nome-dashboard',
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
        },
        {
            tipoInput: true,
            label: true,
            id: 'cpf-dashboard',
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
        },
        {
            tipoInput: true,
            label: true,
            id: 'fixo-dashboard',
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
        },
        {
            tipoInput: true,
            label: true,
            id: 'celular-dashboard',
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
        }
    ]

    const camposClient = [
        {
            tipoInput: true,
            label: true,
            id: 'nome-cliente-dashboard',
            icone: 'building',
            type: 'text',
            name: 'name',
            placeholder: 'Nome',
            maxLength: '50',
            minLength: '7',
            required: true,
            disabled: false,
            onChange: event => setClient({ ...client, nome: event.target.value }),
            value: client ? client.nome : ''
        },
        {
            tipoInput: true,
            label: true,
            id: 'cnpj-cliente-dashboard',
            icone: 'id-card',
            type: 'text',
            name: 'cnpj',
            placeholder: 'Cnpj',
            maxLength: '14',
            minLength: '14',
            required: true,
            disabled: false,
            onChange: event => setClient({ ...client, cnpj: event.target.value }),
            value: client ? client.cnpj : ''
        },
        {
            tipoInput: true,
            label: true,
            id: 'fundacao-cliente-dashboard',
            icone: 'calendar-alt',
            type: 'date',
            name: 'fundacao',
            placeholder: 'Fundação',
            maxLength: '50',
            minLength: '7',
            required: false,
            disabled: false,
            onChange: event => setClient({ ...client, fundacao: event.target.value }),
            value: client ? FormataDataInter(client.fundacao) : ''
        }
    ]

    const tabs = [
            <TabPainel id='Overview'>
                <TabCol col='0'>
                    <TabRow>
                        <Lista
                            titulo='Novos Membros'
                            button={[{ id: 0, lista: true, texto: 'Gerenciar', icone: 'fas fa-arrow-alt-circle-right', onClick: () => Navegar(history, `/membros`) }]}
                            itens={dadosLista}
                        />
                    </TabRow>
                </TabCol>
                <TabCol col='1'>
                    <TabRow>
                        <Lista
                            className='lista-simples'
                            titulo='Útimas Atualizações'
                            button={[{ id: 0, lista: true, texto: 'Ver Relatórios', icone: 'fas fa-arrow-alt-circle-right', onClick: () => setTab(6) }]}
                            itens={sumario}
                        />
                    </TabRow>
                </TabCol>
            </TabPainel>,
            <TabPainel id='Diretoria' full={true}>
                <TabRow>
                    <RowContainer>
                        <RowItem>
                            <Lista
                                className='lista-form'
                                form={true}
                                titulo='Membros da diretoria'
                                button={[{ id: 0, lista: true, texto: 'Adicionar', icone: 'fas fa-plus', onClick: () => setModalDiretoria({ ...modalDiretoria, display: true, titulo: 'Incluir Novo Membro' }) }]}
                                itens={listaDiretoria.length > 0 ? listaDiretoria : []}
                            />
                        </RowItem>
                    </RowContainer>
                </TabRow>
            </TabPainel>,
            <TabPainel id='Departamentos'>
                <TabCol col='0'>
                    TabCol 1
            </TabCol>
                <TabCol col='1'>
                    TabCol 2
            </TabCol>
            </TabPainel>,
            <TabPainel id='Funções'>
                <TabCol col='0'>
                    <TabRow>
                        <Lista
                            titulo='Todas as Funções'
                            button={[{ id: 0, lista: true, texto: 'Adicionar', icone: 'fas fa-plus', onClick: () => setModal({...modal, display: true, titulo:'Incluir Nova Função'}) }]}
                            array={client ? formataArray(client.funcoes) : false}
                        />
                    </TabRow>
                </TabCol>
                <TabCol col='1'>
                    TabCol 2
            </TabCol>
            </TabPainel>,
            <TabPainel id='Cargos'>
                <TabCol col='0'>
                    <TabRow>
                        <Lista
                            titulo='Todos os Cargos'
                            button={[{ id: 0, lista: true, texto: 'Adicionar', icone: 'fas fa-plus', onClick: () => setModal({ ...modal, display: true, titulo: 'Incluir Novo Cargo' })  }]}
                            array={client ? formataArray(client.cargos) : false}
                        />
                    </TabRow>
                </TabCol>
                <TabCol col='1'>
                    TabCol 2
                </TabCol>
            </TabPainel>,
            <TabPainel id='Usuários'>
                <TabCol col='0'>
                    TabCol 1
            </TabCol>
                <TabCol col='1'>
                    TabCol 2
            </TabCol>
            </TabPainel>,
            <TabPainel id='Relatórios'>
                <TabCol col='0'>
                    TabCol 1
                </TabCol>
                <TabCol col='1'>
                    TabCol 2
            </TabCol>
            </TabPainel>,
            <TabPainel id='Gerenciar' full={true}>
                <TabRow bottom={true}>
                    <RowContainer>
                        <RowItem>
                            <h3>Root</h3>
                            <p>Informações do titular da conta e configurações de login.</p>
                            { 
                                root.createdAt ? 
                                    <p>Criado em: <b>{FormataData(root.createdAt)}</b></p>
                                : ''
                            }
                            <div className='row-item-link'>
                                <a onClick={() => setRoot({ ...root, password: GerarPassword() })}>Gerar Novo Password</a>
                                <a onClick={() => setRoot({ ...root, matricula: GeraMatricula() })}>Gerar Matricula</a>
                            </div>
                        </RowItem>
                        <RowItem>
                            <Form config={configForm} campos={camposRoot} />
                        </RowItem>
                    </RowContainer>
                </TabRow>
                <TabRow bottom={true}>
                    <RowContainer>
                        <RowItem>
                            <h3>Dados Gerais</h3>
                            <p>Informações básicas do cliente.</p>
                            {
                                client ?
                                    <p>Criado em: <b>{FormataData(client.createdAt)}</b></p>
                                : ''
                            }
                        </RowItem>
                        <RowItem>
                            <Form config={configForm} campos={camposClient} />
                        </RowItem>
                    </RowContainer>
                </TabRow>
                <TabRow bottom={true}>
                    {
                        client ?
                            client.ativo ?
                                <RowContainer>
                                    <RowItem>
                                        <h3>Desativar a Conta</h3>
                                        <p>Ao clicar neste botão você irá desativar a conta e não poderá mais efetuar o login.</p>
                                    </RowItem>
                                    <RowItem>
                                        <FormItem>
                                            <Button className='red' texto='Desativar a Conta' onClick={() => setClient({ ...client, ativo: !client.ativo })} />
                                        </FormItem>
                                    </RowItem>
                                </RowContainer>
                            : 
                                <RowContainer>
                                    <RowItem>
                                        <h3>Ativar a Conta</h3>
                                        <p>Ao clicar neste botão você irá ativar a conta e voltará a efetuar o login.</p>
                                    </RowItem>
                                    <RowItem>
                                        <FormItem>
                                            <Button className='green' texto='Ativar a Conta' onClick={() => setClient({ ...client, ativo: !client.ativo })} />
                                        </FormItem>
                                    </RowItem>
                                </RowContainer>
                        : ''
                    }
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
                                <Button className='red' texto='Deletar a Conta' onClick={() => remover()} />
                            </FormItem>
                        </RowItem>
                    </RowContainer>
                </TabRow>
            </TabPainel>,
        ]

    const updateModal = e => {
        e.preventDefault()

        setUpdateClient(!updateClient) //avisa que deve atualizar o cliente

    }

    const formModal = {
        submit: updateModal,
        id: true,
        cancelar: () => {
            setModal({ ...modal, display: false })
            setInputModal({...inputModal, texto: ''})
        }
    }

    const campoModal = [{
        tipoInput: true,
        label: true,
        required: true,
        disabled: false,
        id: 'input-modal',
        name: 'input-modal',
        maxLength: '50',
        minLength: '3',
        type: 'text',
        icone: 'briefcase',
        placeholder: 'Digite o nome',
        onChange: event => setInputModal({...inputModal, texto: event.target.value}),
        value: inputModal ? inputModal.texto : '',
    }]

        return (
            <Tela 
                links={links} 
                history={history} 
                loading={loading} 
                alert={alert} 
                carregado={dadosCarregados}
            >
                <Modal config={modalDiretoria} form={formModalDiretoria} campos={campoModalDiretoria} />
                <Modal config={modal} form={formModal} campos={campoModal}/>
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
