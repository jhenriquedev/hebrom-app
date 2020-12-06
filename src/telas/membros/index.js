import React, { useState, useEffect, useMemo } from 'react'

//import {parseISO} from 'date-fns'

import './estilo.css'

import {
    Login,
    FindAllClient,
    FindAllNewsUsers,
    Remove,
    Update, POST, Sumario, Busca, 
    FindOne,
    Postagem
} from '../../crud'

import { 
    FormataData, 
    FormataDataInter, 
    GeraMatricula, 
    GerarPassword,
    VerificarCpf ,
    ConsultarCep
} from '../../util'

import Env from '../../environments'

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
import Check from '../../componentes/checkbox'

import Icone from '../../componentes/icone'

import Avatar from '../../componentes/avatar'

import Modal from '../../componentes/modal'

export default ({ history }) => {
    const [sessao, setSessao] = useState({})
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({})

    const [tab, setTab] = useState(0)

    const [client, setClient] = useState({})

    //modal
    const [modal, setModal] = useState({})
    const [modalCargos, setModalCargos] = useState({})
    const [modalFuncoes, setModalFuncoes] = useState({})
    const [cargoModal, setCargoModal] = useState({})
    const [funcaoModal, setFuncaoModal] = useState({})

    const [inputBusca, setInputBusca] = useState(false)
    const [busca, setBusca] = useState('')

    const [sumario, setSumario] = useState([])

    const [tabela, setTabela] = useState([])
    const [ordenaMembro, setOrdenaMembro] = useState('')
    const [membros, setMembros] = useState([])

    const [novos, setNewMembros] = useState([])

    const [selecionados, setSelecionados] = useState([])

    //perfil
    const [dadosIniciais, setDadosIniciais] = useState({})
    const [membro, setMembro] = useState({})
    const [avatar, setAvatar] = useState({})
    const [cargos, setCargos] = useState([])
    const [funcoes, setFuncoes] = useState([])

    //selects
    const [congregs, setCongregs] = useState([])
    const [selectCargos, setSelectCargos] = useState([])
    const [selectFuncoes, setSelectFuncoes] = useState([])

    //infos de campos dos forms
    const [infoCpf, setInfoCpf] = useState('')
    const [infoCep, setInfoCep] = useState('')


    const links = [
        { id: 0, texto: 'Membros', to: '/membros', history: history, btn: true, icone: 'fa-user' }
    ]

    if (alert.display) { //verifica se o display está aberto em tela
        setTimeout(() => {
            setAlert({ ...alert, display: false })
        }, 1000)
    }

    useEffect(() => {
        setLoading(true)
        const user = Login(1)
        setSessao(user)
        try{
            Sumario('clients', user.client._id).then(resp => {
                if(resp.data) changeSumario(resp.data)
            })

            FindOne('clients', user.client._id, 'Ministério Carregado...').then(resp => {
                if (resp.data) {
                    setClient(resp.data)
                    changeSelectCargos(resp.data.cargos)
                    changeSelectFuncoes(resp.data.funcoes)
                }
            })

        }catch(error){
            setLoading(false)
            setAlert({ tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
        }
    }, [])

    useEffect(() => {
        setLoading(true)

        try {
            FindAllClient('congregacoes', 'Dados Carregados').then(resp => {
                if(resp.data) changeSelectCongregs(resp.data)
            })
            if (tab === 0) FindAllNewsUsers().then(resp => {
                changeNewMembros(resp.data)
                setLoading(resp.loading)
                setAlert(resp)
            })
            if(tab===1) FindAllClient('users', 'Dados Carregados').then(resp => {
                setTabela([])
                listagem(resp.data)
                setMembros(resp.data)
                setLoading(resp.loading)
                setAlert(resp)

                setInputBusca(true)
            })
            if (tab === 2) setLoading(false)
            if (tab === 2 && !membro._id) {
                setMembro(membro)
                //changeCargos(membro.cargos)
                //changeFuncoes(membro.funcoes)

                setTimeout(() => {
                    setLoading(false)
                }, 1000)
            }
            if (tab != 2) resetPerfil()
            if(tab != 1) setInputBusca(false)
        } catch (err) {
            setLoading(false)
            setAlert(Env.ALERTS[0])
        }
    }, [tab])

    useEffect(() => {
        if(!modalCargos.display) setCargoModal({})
    },[modalCargos.display])

    useMemo(() => {
        if (membro._id) {
            if (membro.ativo != dadosIniciais.ativo) {
                setLoading(true)
                const msg = membro.ativo ? 'Membro Ativado!' : 'Membro Desativado!'
                Update('users', msg, membro._id, membro).then(resp => {
                    setLoading(resp.loading)
                    setAlert(resp)
                    setDadosIniciais(resp.data)
                })
            }
        }
    }, [membro.ativo])

    useMemo(() => {
        if(membro.cpf){
            if (membro.cpf.length >= 1) {
                if (VerificarCpf(membro.cpf)) {
                    setInfoCpf('')
                }
                else {
                    setInfoCpf('CPF inválido.')
                }
            }else{
                setInfoCpf('')
            }
        }
    }, [membro.cpf])

    useMemo(() => {
        if(membro.cep){
            if(membro.cep.length >= 8){
                setInfoCep('')

                setMembro({
                    ...membro,
                    logradouro: '',
                    bairro: '',
                    cidade: '',
                    uf: ''
                })
                
                ConsultarCep(membro.cep)
                .then(resp => {
                    setInfoCep('')
                    setMembro({
                        ...membro,
                        logradouro: resp.street,
                        bairro: resp.neighborhood,
                        cidade: resp.city,
                        uf: resp.state
                    })
                }).catch(setInfoCep('CEP não encontrado.'))
            }
        }
    }, [membro.cep])

    const verificaTab = tabVerificar => {
        return tabVerificar === tab ? 'tab-selecionado' : ''
    }

    var linksTab = [
        { id: 0, texto: 'Overview', className: verificaTab(0), tab: () => setTab(0) },
        { id: 1, texto: 'Membros', className: verificaTab(1), tab: () => setTab(1) },
        { id: 2, texto: membro._id ? 'Gerenciar' : 'Adicionar', className: verificaTab(2), tab: () => setTab(2) }
    ]


    const changeSumario = sumario => {
        let lista = [
            {
                id: 3, texto: 'Membros', info: `${sumario.membros}`,
                link: { texto: sumario.membros > 0 ? 'Ver todos' : 'Adicionar', onClick: sumario.membros > 0 ? () => setTab(1) : () => setTab(2) }
            }
        ]
        return setSumario(lista)
    }

    const ordenaMembros = (dados, campo) => {
        if (campo === 'Ativo') return dados.sort((a, b) => {
            if (a.ativo && !b.ativo) {
                return -1
            }
            if (!a.ativo && b.ativo) {
                return 1
            }
            return 0
        })
        if(campo === 'Nome') return dados.sort((a,b) => {
            return a.nome.localeCompare(b.nome)
        })
        if (campo === 'Congregação') return dados.sort((a, b) => {
            if(a.congregacao){
                if(b.congregacao){
                    return a.congregacao.nome.localeCompare(b.congregacao.nome)
                }
                return -1
            }
            return 1
        })
        if (campo === 'Cargo') return dados.sort((a, b) => {
            if (a.cargoAtual) {
                if (b.cargoAtual) {
                    return a.cargoAtual.localeCompare(b.cargoAtual)
                }
                return -1
            }
            return 1
        })
        if (campo === 'Funcao') return dados.sort((a, b) => {
            if (a.funcaoAtual) {
                if (b.funcaoAtual) {
                    return a.funcaoAtual.localeCompare(b.funcaoAtual)
                }
                return -1
            }
            return 1
        })
        if (campo === 'Tipo') return dados.sort((a, b) => {
            if (a.tipo) {
                if (b.tipo) {
                    return a.tipo.localeCompare(b.tipo)
                }
                return -1
            }
            return 1
        })
        if (campo === 'Situacao') return dados.sort((a, b) => {
            if (a.situacao) {
                if (b.situacao) {
                    return a.situacao.localeCompare(b.situacao)
                }
                return -1
            }
            return 1
        })

        if (campo === 'Batismo') return dados.sort((a, b) => {
            if(a.dataBatismo && !b.dataBatismo){
                return 1
            }
            if(!a.dataBatismo && b.dataBatismo){
                return -1
            }
            return 0
        })

        if (campo === 'Dizimista') return dados.sort((a, b) => {
            if(a.dizimista && !b.dizimista){
                return -1
            }
            if(!a.dizimista && b.dizimista){
                return 1
            }
            return 0
        })
        if (campo === 'Criado') return dados.sort((a, b) => {
            if (a.createdAt) {
                if (b.createdAt) {
                    return a.createdAt.localeCompare(b.createdAt)
                }
                return 1
            }
            return -1
        })
    }

    const listagem = (dados, campo) => {
        let lista = []

        if (!loading)
            if (dados) {

                if(campo){ //se tiver um parametro
                    ordenaMembros(dados, campo)
                }

                if(tabela.length >= 1){
                    tabela.length = 0
                }

                dados.map(item => {
                    lista.push({
                        id: item._id,
                        icone: [{ id: 0, icone: 'fa-power-off', cor: item.ativo ? 'green-2' : 'red' }],
                        colunas: [
                            item.avatar ? <Avatar src={item.avatar.url} /> : <Avatar src='img/user2.png' />,
                            item.matricula ? item.matricula : '',
                            item.nome ? item.nome : '',
                            item.cargoAtual ? item.cargoAtual : '',
                            item.funcaoAtual ? item.funcaoAtual : '',
                            item.congregacao ? item.congregacao.nome : 'Não informado',
                            item.tipo ? item.tipo : 'Não informado',
                            item.situacao ? item.situacao : 'Não informado',
                            item.dataBatismo ? FormataData(item.dataBatismo) : <b className='red'>Não Batizado</b>,
                            item.dizimista ? <b className='green'><i className='fas fa-check'></i></b> : <b className='red'><i className='fas fa-check'></i></b>,
                            FormataData(item.createdAt),
                            <><Link texto='Gerenciar' onClick={() => changePerfil(item)} /></>,
                        ]
                    })
                })
            }
            else {
                lista.push({
                    id: '0',
                    icone: [{ id: 0, icone: 'fa-power-off', cor: 'red' }],
                    colunas: ['Não existem membros cadastrados', '', '', '', '', '', '', '']
                })
            }

        return setTabela(lista)
    }

    const colunas = [
        {
            button: true,
            texto: 'Ativo',
            icone: 'angle-down',
            cor: 'cinza',
            onClick: () => listagem(membros, 'Ativo')
        },
        'Foto', 'Matricula', 
        { 
            button: true, 
            texto: 'Nome', 
            width: 'width-500',
            icone: 'angle-down', 
            cor: 'cinza', 
            onClick: () => listagem(membros, 'Nome') 
        }, 
        {
            button: true,
            texto: 'Cargo',
            width: 'width-200',
            icone: 'angle-down',
            cor: 'cinza',
            onClick: () => listagem(membros, 'Cargo')
        },
        {
            button: true,
            texto: 'Função',
            width: 'width-200',
            icone: 'angle-down',
            cor: 'cinza',
            onClick: () => listagem(membros, 'Funcao')
        },
        {
            button: true,
            texto: 'Congregação',
            width: 'width-500',
            icone: 'angle-down',
            cor: 'cinza',
            onClick: () => listagem(membros, 'Congregação')
        }, 
        {
            button: true,
            texto: 'Tipo',
            icone: 'angle-down',
            cor: 'cinza',
            onClick: () => listagem(membros, 'Tipo')
        },
        {
            button: true,
            texto: 'Situação',
            icone: 'angle-down',
            cor: 'cinza',
            onClick: () => listagem(membros, 'Situacao')
        },
        {
            button: true,
            texto: 'Batismo em Águas',
            icone: 'angle-down',
            cor: 'cinza',
            onClick: () => listagem(membros, 'Batismo')
        },
        {
            button: true,
            texto: 'Dizimista',
            icone: 'angle-down',
            cor: 'cinza',
            onClick: () => listagem(membros, 'Dizimista')
        },
        {
            button: true,
            texto: 'Criado em',
            width: 'width-400',
            icone: 'angle-down',
            cor: 'cinza',
            onClick: () => listagem(membros, 'Criado')
        }, 
        <Button texto='Add Membro' onClick={() => setTab(2)} />
    ]

    const changeNewMembros = dados => {
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
                    info: item.matricula,
                    link: { texto: 'Gerenciar', onClick: () => changePerfil(item) }
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
                link: { texto: 'Cadastrar', onClick: () => setTab(2) }
            })
        }

        return setNewMembros(lista)
    }

    const changeSelectCongregs = dados => {
        let lista = []

        if (dados) {
            let congreg = membro.congregacao
            dados.map(item => {
                if (congreg && congreg._id === item._id) {
                    lista.push({ _id: item._id, nome: item.nome, selected: true })
                } else {
                    lista.push({ _id: item._id, nome: item.nome, selected: false })
                }
                //lista.push({ _id: item._id, nome: item.nome })
            })
        }
        if (dados.length < 1) {
            lista.push({
                id: '0',
                nome: 'Não existem Congregações cadastradas'
            })
        }

        //ordena
        lista.sort(function(a,b){
            return a.nome.localeCompare(b.nome)
        })

        return setCongregs(lista)
    }

    const changeSelectCargos = dados => {
        let lista = []

        if (dados) {
            dados.map(item => {
                lista.push({ _id: item, nome: item })
            })
        }
        if (dados.length < 1) {
            lista.push({
                id: '0',
                nome: 'Não existem Cargos cadastrados'
            })
        }

        lista.sort(function (a, b) {
            return a.nome.localeCompare(b.nome)
        })

        return setSelectCargos(lista)
    }

    const changeSelectFuncoes = dados => {
        let lista = []

        if (dados) {
            dados.map(item => {
                lista.push({ _id: item, nome: item })
            })
        }
        if (dados.length < 1) {
            lista.push({
                id: '0',
                nome: 'Não existem Funções cadastradas'
            })
        }

        lista.sort(function (a, b) {
            return a.nome.localeCompare(b.nome)
        })

        return setSelectFuncoes(lista)
    }


    const changePerfil = item => {
        setDadosIniciais(item)
        setMembro(item)
        setAvatar(item.avatar)
        if(!item.matricula) item.matricula = GeraMatricula()
        changeCargos(item.cargos, item)
        changeFuncoes(item.funcoes, item)

        setTab(2)
    }

    const resetPerfil = () => {
        setMembro({})
        setDadosIniciais({})
        setAvatar({})
        setCargos({})
        setFuncoes({})
    }

    const criarTags = () => {
        let tags = []
        if(membro.matricula) tags.push(membro.matricula)
        if (membro.nome) tags.push(membro.nome)
        if (membro.cpf) tags.push(membro.cpf)
        if (membro.rg) tags.push(membro.rg)
        if (membro.email) tags.push(membro.email)
        if (membro.estadoCivil) tags.push(membro.estadoCivil)
        if (membro.genero) tags.push(membro.genero)
        if (membro.sangue) tags.push(membro.sangue)
        if (membro.fixo) tags.push(membro.fixo)
        if (membro.celular) tags.push(membro.celular)
        if(membro.cargoAtual) tags.push(membro.cargoAtual)
        if(membro.funcaoAtual) tags.push(membro.funcaoAtual)
        //setMembro({...membro, tags: tags})

        return tags
    }

    const verificaCpf = () => {
        //setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        
        if (infoCpf.length >= 1) {
            setTimeout(() => {
                setAlert({ tipo: 'danger', texto: `${infoCpf} Verifique e tente novamente!`, display: true })
            }, 1000)
            return false
        }else{
            return true
        }
    }

    const criar = async () => {

        setLoading(true)

        if(!verificaCpf()) return false

        const data = { ...membro, tags: criarTags(), client: sessao.client }

        const msg = 'Novo Membro Adicionado!'

        //console.log(avatar)

        if(avatar.thumbnail){
            await Postagem(avatar.thumbnail).then(resp => {
                if (resp) {
                    //setLoading(resp.loading)
                    //setAlert(resp)
                    setAvatar(resp.data)

                    POST('users', {...data, avatar: resp.data._id}, msg).then(resp => {
                        if (resp) {
                            setLoading(resp.loading)
                            resetPerfil()
                            setAlert(resp)
                            if (resp.tipo === 'success') {
                                setTimeout(() => {
                                    verificaTab(1) //volta para listagem
                                    setTab(1)
                                }, 1000)
                            }
                        }
                    })
                }
            })
        }else{
            //console.log(data)
            await POST('users', data, msg).then(resp => {
                if (resp) {
                    setLoading(resp.loading)
                    resetPerfil()
                    setAlert(resp)
                    if (resp.tipo === 'success') {
                        setTimeout(() => {
                            verificaTab(1) //volta para listagem
                            setTab(1)
                        }, 1000)
                    }
                }
            })
        }
    }

    const update = (tabela, _id, dados) => {
        setLoading(true)

        Update(tabela, 'Dados Atualizados', _id, dados).then(resp => {
            if (resp) {
                setLoading(resp.loading)
                setAlert(resp)
            }
        })
    }

    const updateMembro = async e => {
        e.preventDefault()

        if(!verificaCpf()) return false

        const avatarInicial = dadosIniciais.avatar ? dadosIniciais.avatar : {}


        if(avatar){
            if (avatarInicial.url != avatar.url) {
                setLoading(true)

                //remove qualquer avatar antigo salvo no banco
                if (avatarInicial._id) await Remove('postagens', 'Avatar removido.', avatarInicial._id)

                await Postagem(avatar.thumbnail).then(resp => {
                    if (resp) {
                        setLoading(resp.loading)
                        setAlert(resp)
                        setAvatar(resp.data)

                        update('users', membro._id, { ...membro, avatar: resp.data._id, tags: criarTags() })
                    }
                })
            }else{
                update('users', membro._id, { ...membro, tags: criarTags() })
            }
        }else {
            update('users', membro._id, { ...membro, tags: criarTags() })
        }
    }

    const remove = () => {
        setLoading(true)
        Remove('users', 'Membro Removido.', membro._id)
            .then(resp => {
                if (resp) {
                    resetPerfil()
                    setLoading(resp.loading)
                    setAlert(resp)
                    setTimeout(() => {
                        verificaTab(1) //volta para listagem
                        setTab(1)
                    }, 1000)
                }
            })
    }


    /* EDIÇÃO DE CARGOS */

    const changeCargos = (cargos, membro) => {
        let lista = []

        if (cargos.length > 0) {
        
            cargos.map(item => {
                lista.push({
                    id: item._id ? item._id : item.nome,
                    icone: [
                        { id: 0, icon: 'address-card', cor: item.atual ? 'green-2' : 'gray' }
                    ],
                    texto: item.nome,
                    destaque: 'Consagrado em',
                    span: item.uncao ? FormataData(item.uncao) : 'Não informado',
                    info: item.localUncao,
                    obs: item.observacoes,
                    link: { icone: 'trash-alt', onClick: () => removerCargo(cargos, item, membro) }
                })
            })
        } else {
            lista.push({
                id: 0,
                info: 'Não há registro de cargos'
            })
        }

        return setCargos(lista)
    }

    const removerCargo = (cargos, cargo, membro) => {

        cargos.splice(cargos.indexOf(cargo), 1)

        let cargoAtual = ''

        if(cargos.length > 0){
            cargos[0].atual = true  //muda o cargo atual 
            cargoAtual=cargos[0].nome
        }

        membro.cargoAtual = cargoAtual
        membro.cargos = cargos
        

        if(membro._id){
            update('users', membro._id, membro)
        }

        changeCargos(cargos, membro)
    }

    const updateModalCargos = e => {
        e.preventDefault()

        let cargo = { 
            nome: cargoModal.nome,
            uncao: cargoModal.uncao,
            localUncao: cargoModal.localUncao,
            observacoes: cargoModal.observacoes,
            atual: true
        }

        let cargos = membro.cargos || []

        cargos.map(item => { //busca antigos cargos atuais
            if (item.atual) item.atual = false
        })

        cargos.unshift(cargo) //insere no inicio da lista

        let dados = { ...membro, cargoAtual: cargo.nome, cargos: cargos }

        changeCargos(cargos, membro)

        setMembro({...membro, cargoAtual:cargo.nome, cargos:cargos}) //atualiza o membro

        if (membro._id) { //se for uma alteracao
            update('users', membro._id, dados)
        }

        setModalCargos({ ...modalCargos, display: false })

        return setCargoModal({})
    }

    const formModalCargos = {
        submit: updateModalCargos,
        id: true,
        cancelar: () => {
            setModalCargos({ ...modalCargos, display: false })
            setCargoModal({})
        }
    }

    const campoModalCargos = [
        {
            tipoSelect: true,
            id: 'nome-cargo',
            label: true,
            icone: 'briefcase',
            name: 'Cargo',
            placeholder: 'Selecione o Cargo',
            required: true,
            disabled: false,
            lista: selectCargos,
            onChange: event => setCargoModal({ ...cargoModal, nome: event.target.value }),
            value: cargoModal.nome
        },
        {
            tipoInput: true,
            label: true,
            required: false,
            disabled: false,
            id: 'dt-uncao-cargo',
            name: 'dt-uncao-cargo',
            maxLength: '50',
            minLength: '3',
            type: 'date',
            icone: 'calendar-alt',
            placeholder: 'Consagrado em',
            onChange: event => setCargoModal({ ...cargoModal, uncao: event.target.value }),
            value: cargoModal.uncao,
        },
        {
            tipoInput: true,
            label: true,
            required: false,
            disabled: false,
            id: 'local-uncao-cargo',
            name: 'local-uncao-cargo',
            maxLength: '50',
            minLength: '3',
            type: 'text',
            icone: 'location-arrow',
            placeholder: 'Local de Consagração (Ministério)',
            onChange: event => setCargoModal({ ...cargoModal, localUncao: event.target.value }),
            value: cargoModal.localUncao,
        },
        {
            tipoText: true,
            id: 'ob-cargo',
            label: true,
            type: 'text',
            name: 'Observações',
            placeholder: 'Observações...',
            maxLength: '200',
            minLength: '5',
            required: false,
            disabled: false,
            onChange: event => setCargoModal({ ...cargoModal, observacoes: event.target.value }),
            value: cargoModal.observacoes
        }
    ]


    /* FIM DA EDIÇÃO DE CARGOS */

    const removerFuncao = (funcoes, funcao, membro) => {
        funcoes.splice(funcoes.indexOf(funcao), 1)

        let funcaoAtual = ''

        if (funcoes.length > 0) {
            funcoes[0].atual = true  //muda a função atual 
            funcaoAtual = funcoes[0].nome
        }

        membro.funcaoAtual = funcaoAtual
        membro.funcoes = funcoes


        if (membro._id) {
            update('users', membro._id, membro)
        }

        changeFuncoes(funcoes, membro)
    }

    const changeFuncoes = (funcoes, membro) => {
        let lista = []

        if(funcoes){
            if (funcoes.length > 0) {
                funcoes.map(item => {
                    lista.push({
                        id: item._id,
                        icone: [
                            { id: 0, icon: 'briefcase', cor: item.atual ? 'green-2' : 'gray' }
                        ],
                        texto: item.nome,
                        destaque: 'Periodo',
                        span: item.posse ? `${FormataData(item.posse)} à ${
                            item.dataFim ? FormataData(item.dataFim) : 'Atualmente'
                            }` : 'Não informado',
                        info: item.localPosse,
                        obs: item.OutrosF,
                        link: { icone: 'trash-alt', onClick: () => removerFuncao(funcoes, item, membro) }
                    })
                })
            } else {
                lista.push({
                    id: 0,
                    info: 'Não há registro de funções'
                })
            }
        } else {
            lista.push({
                id: 0,
                info: 'Não há registro de funções'
            })
        }

        return setFuncoes(lista)
    }

    const updateModalFuncoes = e => {
        e.preventDefault()

        let funcao = {
            nome: funcaoModal.nome,
            posse: funcaoModal.posse,
            localPosse: funcaoModal.localPosse,
            dataFim: funcaoModal.dataFim,
            area: funcaoModal.area,
            congregacao: funcaoModal.congregacao,
            OutrosF: funcaoModal.OutrosF,
            atual: true
        }

        let funcoes = membro.funcoes || []

        funcoes.map(item => { //busca antigas funcoes atuais
            if (item.atual) item.atual = false
        })

        funcoes.unshift(funcao) //insere no inicio da lista

        let dados = { ...membro, funcaoAtual: funcao.nome, funcoes: funcoes }

        changeFuncoes(funcoes, membro)

        setMembro({ ...membro, funcaoAtual: funcao.nome, funcoes: funcoes }) //atualiza o membro

        if (membro._id) { //se for uma alteracao
            update('users', membro._id, dados)
        }

        setModalFuncoes({ ...modalFuncoes, display: false })

        return setFuncaoModal({})
    }

    const formModalFuncoes = {
        submit: updateModalFuncoes,
        id: true,
        cancelar: () => {
            setModalFuncoes({ ...modalFuncoes, display: false })
            setFuncaoModal({})
        }
    }

    const campoModalFuncoes = [
        {
            tipoSelect: true,
            id: 'nome-cargo',
            label: true,
            icone: 'briefcase',
            name: 'Função',
            placeholder: 'Selecione a Função',
            required: true,
            disabled: false,
            lista: selectFuncoes,
            onChange: event => setFuncaoModal({ ...funcaoModal, nome: event.target.value }),
            value: funcaoModal.nome
        },
        {
            tipoInput: true,
            label: true,
            required: false,
            disabled: false,
            id: 'dt-posse-funcao',
            name: 'dt-posse-funcao',
            maxLength: '50',
            minLength: '3',
            type: 'date',
            icone: 'calendar-alt',
            placeholder: 'Data da Posse',
            onChange: event => setFuncaoModal({ ...funcaoModal, posse: event.target.value }),
            value: funcaoModal.posse,
        },
        {
            tipoInput: true,
            label: true,
            required: false,
            disabled: false,
            id: 'dt-fim-funcao',
            name: 'dt-fim-funcao',
            maxLength: '50',
            minLength: '3',
            type: 'date',
            icone: 'calendar-alt',
            placeholder: 'Finalizou em',
            onChange: event => setFuncaoModal({ ...funcaoModal, dataFim: event.target.value }),
            value: funcaoModal.dataFim,
        },
        {
            tipoInput: true,
            label: true,
            required: false,
            disabled: false,
            id: 'local-posse-funcao',
            name: 'local-posse-funcao',
            maxLength: '50',
            minLength: '3',
            type: 'text',
            icone: 'location-arrow',
            placeholder: 'Local da Posse (Congregação)',
            onChange: event => setFuncaoModal({ ...funcaoModal, localPosse: event.target.value }),
            value: funcaoModal.localPosse,
        },
        {
            tipoInput: true,
            label: true,
            required: false,
            disabled: false,
            id: 'local-outrosF-funcao',
            name: 'local-outrosF-funcao',
            maxLength: '50',
            minLength: '3',
            type: 'text',
            icone: 'location-arrow',
            placeholder: 'Executou a Função em outro Ministério',
            onChange: event => setFuncaoModal({ ...funcaoModal, OutrosF: event.target.value }),
            value: funcaoModal.OutrosF,
        },
    ]

    /* FIM DA EDIÇÃO DE FUNÇÕES */


    //configuracao dos formularios
    const configForm = {
        submit: updateMembro,
        id: membro._id ? true : false,
        cancelar: () => setMembro(dadosIniciais)
    }

    const camposBasicos = [
        { 
            tipoAvatar: true, 
            onChange: event => setAvatar({ ...avatar, url: URL.createObjectURL(event.target.files[0]), thumbnail: event.target.files[0] }),
            avatar: avatar ? avatar.url : false
        },
        {
            tipoInput: true, id: 'email-dashboard', label: true,
            icone: 'at', type: 'email', name: 'E-mail', placeholder: 'E-mail',
            maxLength: '50', minLength: '7', required: true,disabled: false,
            autoFocus: membro._id ? false : true,
            onChange: event => setMembro({ ...membro, email: event.target.value }),
            value: membro.email
        },
        {
            tipoInput: true, id: 'senha-dashboard', label: true,
            icone: 'key', type: 'text', name: 'Password',
            placeholder: 'Password', maxLength: '16', minLength: '6',
            required: true, disabled: false,
            onChange: event => setMembro({ ...membro, password: event.target.value }),
            value: membro.password
        },
        {
            tipoInput: true, id: 'matricula-dashboard', label: true,
            icone: 'id-badge', type: 'text', name: 'matricula',
            placeholder: 'Matricula', maxLength: '11', minLength: '11',
            required: true, disabled: false,
            onChange: event => setMembro({ ...membro, matricula: event.target.value }),
            value: membro.matricula
        }
    ]

    const camposCivis = [
        {
            tipoInput : true,
            id: 'nome-membro',
            label: true,
            icone: 'user',
            type: 'text',
            name: 'nome',
            placeholder: 'Nome',
            maxLength: '50',
            minLength: '3',
            required: true,
            disabled: false,
            onChange: event => setMembro({ ...membro, nome: event.target.value }),
            value: membro.nome
        },
        {
            tipoInput : true,
            id: 'cpf-membro',
            label: true,
            icone: 'address-card',
            type: 'text',
            name: 'cpf',
            placeholder: 'CPF',
            maxLength: '15',
            minLength: '11',
            info: infoCpf,
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, cpf: event.target.value }),
            value: membro.cpf
        },
        {
            tipoInput: true,
            id: 'rg-membro',
            label: true,
            icone: 'fingerprint',
            type: 'text',
            name: 'rg',
            placeholder: 'RG',
            maxLength: '11',
            minLength: '6',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, rg: event.target.value }),
            value: membro.rg
        },
        {
            tipoInput: true,
            id: 'naturalidade-membro',
            label: true,
            icone: 'flag-usa',
            type: 'text',
            name: 'naturalidade',
            placeholder: 'Naturalidade',
            maxLength: '50',
            minLength: '3',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, naturalidade: event.target.value }),
            value: membro.naturalidade
        },
        {
            tipoInput: true,
            id: 'pai-membro',
            label: true,
            icone: 'male',
            type: 'text',
            name: 'pai',
            placeholder: 'Nome do Pai',
            maxLength: '50',
            minLength: '3',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, pai: event.target.value }),
            value: membro.pai
        },
        {
            tipoInput: true,
            id: 'mae-membro',
            label: true,
            icone: 'female',
            type: 'text',
            name: 'mae',
            placeholder: 'Nome da Mãe',
            maxLength: '50',
            minLength: '3',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, mae: event.target.value }),
            value: membro.mae
        },
        {
            tipoInput: true,
            id: 'nascimento-membro',
            label: true,
            icone: 'baby',
            type: 'date',
            name: 'Nascimento',
            placeholder: 'Data de Nascimento',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, dataNascimento: event.target.value }),
            value: membro.dataNascimento
        },
        {
            tipoSelect: true,
            id: 'estadocivil-membro',
            label: true,
            icone: 'ring',
            name: 'estado civil',
            placeholder: 'Estado Civil',
            required: false,
            disabled: false,
            lista: Env.LISTAS_CONFIG[12].lista,
            onChange: event => setMembro({ ...membro, estadoCivil: event.target.value }),
            value: membro.estadoCivil
        },
        {
            tipoSelect: true,
            id: 'genero-membro',
            label: true,
            icone: 'restroom',
            name: 'genero',
            placeholder: 'Gênero',
            required: false,
            disabled: false,
            lista: Env.LISTAS_CONFIG[13].lista,
            onChange: event => setMembro({ ...membro, genero: event.target.value }),
            value: membro.genero
        },
        {
            tipoSelect: true,
            id: 'tiposanguineo-membro',
            label: true,
            icone: 'tint',
            name: 'tipo sanguineo',
            placeholder: 'Tipo Sanguineo',
            required: false,
            disabled: false,
            lista: Env.LISTAS_CONFIG[7].lista,
            onChange: event => setMembro({ ...membro, sangue: event.target.value }),
            value: membro.sangue
        }
    ]

    const camposEleitorais = [
        {
            tipoInput: true,
            id: 'titulo-membro',
            label: true,
            icone: 'id-card-alt',
            type: 'text',
            name: 'Titulo',
            placeholder: 'Titulo de Eleitor',
            maxLength: '20',
            minLength: '5',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, titulo: event.target.value }),
            value: membro.titulo
        },
        {
            tipoInput: true,
            id: 'zona-membro',
            label: true,
            icone: 'map-marked',
            type: 'text',
            name: 'Zona',
            placeholder: 'Zona Eleitoral',
            maxLength: '20',
            minLength: '3',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, zona: event.target.value }),
            value: membro.zona
        },
        {
            tipoInput: true,
            id: 'secao-membro',
            label: true,
            icone: 'map-marker-alt',
            type: 'text',
            name: 'Seção',
            placeholder: 'Seção',
            maxLength: '20',
            minLength: '3',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, secao: event.target.value }),
            value: membro.secao
        }
    ]

    const camposEspeciais = [
        {
            tipoSelect: true,
            id: 'tiponecessidade-membro',
            label: true,
            icone: 'wheelchair',
            name: 'tipo necessidade',
            placeholder: 'Tipo Necessidade Especial',
            required: false,
            disabled: false,
            lista: Env.LISTAS_CONFIG[8].lista,
            onChange: event => setMembro({ ...membro, tipoNecessidade: event.target.value }),
            value: membro.tipoNecessidade
        },
        {
            tipoText: true,
            id: 'obnecessidade-membro',
            label: true,
            type: 'text',
            name: 'obNecessidade',
            placeholder: 'Descrição da Necessidade...',
            maxLength: '200',
            minLength: '5',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, obNecessidade: event.target.value }),
            value: membro.obNecessidade
        }
    ]

    const camposEndereco = [
        {
            tipoInput: true,
            id: 'cep-membro',
            label: true,
            icone: 'envelope',
            type: 'text',
            name: 'Cep',
            placeholder: 'Cep',
            maxLength: '9',
            info: infoCep,
            required: true,
            disabled: false,
            onChange: event => setMembro({ ...membro, cep: event.target.value }),
            value: membro.cep
        },
        {
            tipoSelect: true,
            id: 'uf-membro',
            label: true,
            icone: 'flag-checkered',
            name: 'Uf',
            placeholder: 'UF',
            required: false,
            disabled: false,
            lista: Env.UFS,
            onChange: event => setMembro({ ...membro, uf: event.target.value }),
            value: membro.uf
        },
        {
            tipoInput: true,
            id: 'cidade-membro',
            label: true,
            icone: 'city',
            type: 'text',
            name: 'Cidade',
            placeholder: 'Cidade',
            maxLength: '50',
            minLength: '3',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, cidade: event.target.value }),
            value: membro.cidade
        },
        {
            tipoInput: true,
            id: 'bairro-membro',
            label: true,
            icone: 'map',
            type: 'text',
            name: 'Bairro',
            placeholder: 'Bairro',
            maxLength: '50',
            minLength: '3',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, bairro: event.target.value }),
            value: membro.bairro
        },
        {
            tipoInput: true,
            id: 'logradouro-membro',
            label: true,
            icone: 'location-arrow',
            type: 'text',
            name: 'Logradouro',
            placeholder: 'Logradouro',
            maxLength: '50',
            minLength: '5',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, logradouro: event.target.value }),
            value: membro.logradouro
        },
        {
            tipoInput: true,
            id: 'complemento-membro',
            label: true,
            icone: 'puzzle-piece',
            type: 'text',
            name: 'Complemento',
            placeholder: 'Complemento',
            maxLength: '50',
            minLength: '5',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, complemento: event.target.value }),
            value: membro.complemento
        },
        {
            tipoInput: true,
            id: 'numero-membro',
            label: true,
            icone: 'sort-numeric-up',
            type: 'text',
            name: 'Número',
            placeholder: 'Número',
            maxLength: '9',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, numero: event.target.value }),
            value: membro.numero
        }
    ]

    const camposContatos = [
        {
            tipoInput: true,
            id: 'telefone-membro',
            label: true,
            icone: 'phone-alt',
            type: 'tel',
            name: 'Fixo',
            placeholder: 'Telefone Fixo',
            maxLength: '12',
            minLength: '8',
            required: true,
            disabled: false,
            onChange: event => setMembro({ ...membro, fixo: event.target.value }),
            value: membro.fixo
        },
        {
            tipoInput: true,
            id: 'celular-membro',
            label: true,
            icone: 'mobile-alt',
            type: 'tel',
            name: 'Celular',
            placeholder: 'Celular',
            maxLength: '13',
            minLength: '9',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, celular: event.target.value }),
            value: membro.celular
        },
        {
            tipoInput: true,
            id: 'email-membro',
            label: true,
            icone: 'at',
            type: 'email',
            name: 'Email',
            placeholder: 'E-mail',
            maxLength: '50',
            minLength: '5',
            required: true,
            disabled: false,
            onChange: event => setMembro({ ...membro, email: event.target.value }),
            value: membro.email
        }
    ]

    const camposCristao = [
        {
            tipoSelect: true,
            id: 'congreg-membro',
            label: true,
            icone: 'map-marker-alt',
            name: 'Congregação',
            placeholder: 'Congregação',
            required: false,
            disabled: false,
            lista: congregs,
            onChange: event => setMembro({ ...membro, congregacao: event.target.value }),
            value: membro.congregacao ? membro.congregacao._id : membro.congregacao
        },
        {
            tipoSelect: true,
            id: 'tipo-membro',
            label: true,
            icone: 'user-tag',
            name: 'Tipo',
            placeholder: 'Tipo de Membro',
            required: false,
            disabled: false,
            lista: Env.LISTAS_CONFIG[9].lista,
            onChange: event => setMembro({ ...membro, tipo: event.target.value }),
            value: membro.tipo
        },
        {
            tipoSelect: true,
            id: 'situacao-membro',
            label: true,
            icone: 'smile',
            name: 'Situação',
            placeholder: 'Situação do Membro',
            required: false,
            disabled: false,
            lista: Env.LISTAS_CONFIG[11].lista,
            onChange: event => setMembro({ ...membro, situacao: event.target.value }),
            value: membro.situacao
        },
        {
            tipoSelect: true,
            id: 'procedencia-membro',
            label: true,
            icone: 'place-of-worship',
            name: 'Procedencia',
            placeholder: 'Procedencia do Membro',
            required: false,
            disabled: false,
            lista: Env.LISTAS_CONFIG[10].lista,
            onChange: event => setMembro({ ...membro, procedencia: event.target.value }),
            value: membro.procedencia
        },
        {
            tipoInput: true,
            id: 'origem-membro',
            label: true,
            icone: 'hiking',
            type: 'text',
            name: 'Origem',
            placeholder: 'Origem do Membro',
            maxLength: '50',
            minLength: '6',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, origem: event.target.value }),
            value: membro.origem
        },
        {
            tipoInput: true,
            id: 'dmudanca-membro',
            label: true,
            icone: 'calendar-alt',
            type: 'date',
            name: 'Data de Mudança',
            placeholder: 'Data de Mudança',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, dMudanca: event.target.value }),
            value: membro.dMudanca ? membro.dMudanca : ''
        },
        {
            tipoInput: true,
            id: 'dconversao-membro',
            label: true,
            icone: 'pray',
            type: 'date',
            name: 'Data de Conversão',
            placeholder: 'Data de Conversão',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, dataConversao: event.target.value }),
            value: membro.dataConversao
        },
        {
            tipoInput: true,
            id: 'lconversao-membro',
            label: true,
            icone: 'map-marker-alt',
            type: 'text',
            name: 'Local de Conversão',
            placeholder: 'Local de Conversão',
            maxLength: '50',
            minLength: '6',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, conLocal: event.target.value }),
            value: membro.conLocal
        },
        {
            tipoInput: true,
            id: 'dbatismo-membro',
            label: true,
            icone: 'water',
            type: 'date',
            name: 'Data de Batismo',
            placeholder: 'Data de Batismo nas Águas',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, dataBatismo: event.target.value }),
            value: membro.dataBatismo
        },
        {
            tipoInput: true,
            id: 'batLocal-membro',
            label: true,
            icone: 'map-marker-alt',
            type: 'text',
            name: 'Local de Batismo',
            placeholder: 'Local de Batismo nas Águas',
            maxLength: '50',
            minLength: '6',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, batLocal: event.target.value }),
            value: membro.batLocal
        },
        {
            tipoInput: true,
            id: 'dbatismoesp-membro',
            label: true,
            icone: 'dove',
            type: 'date',
            name: 'Data de Batismo Espirito Santo',
            placeholder: 'Data de Batismo Espirito Santo',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, dataBatEspirito: event.target.value }),
            value: membro.dataBatEspirito
        },
        {
            tipoInput: true,
            id: 'batELocal-membro',
            label: true,
            icone: 'map-marker-alt',
            type: 'text',
            name: 'Local de Batismo no Espirito Santo',
            placeholder: 'Local de Batismo no Espirito Santo',
            maxLength: '50',
            minLength: '6',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, batELocal: event.target.value }),
            value: membro.batELocal
        },
        {
            tipoCheck: true,
            icone: 'hand-holding-usd',
            label: true,
            id: 'dizimista-membro',
            name: 'Dizimista?',
            placeholder: 'Dizimista?',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, dizimista: event.target.checked }),
            checked: membro.dizimista
        },
        {
            tipoText: true,
            id: 'obmembro-membro',
            label: true,
            type: 'text',
            name: 'Observações do Membro',
            placeholder: 'Observações do Membro...',
            maxLength: '200',
            minLength: '5',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, obMembro: event.target.value }),
            value: membro.obMembro
        }
    ]

    const camposPastores = [
        {
            tipoInput: true,
            id: 'cgadb-membro',
            label: true,
            icone: 'address-card',
            type: 'text',
            name: 'Número do CGADB',
            placeholder: 'CGADB',
            maxLength: '50',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, cgadb: event.target.value }),
            value: membro.cgadb
        },
        {
            tipoInput: true,
            id: 'comieadepa-membro',
            label: true,
            icone: 'id-badge',
            type: 'text',
            name: 'Número da COMIEADEPA',
            placeholder: 'COMIEADEPA',
            maxLength: '50',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, comieadepa: event.target.value }),
            value: membro.comieadepa
        },
        {
            tipoInput: true,
            id: 'uncao-membro',
            label: true,
            icone: 'wine-glass',
            type: 'date',
            name: 'Ordenado a pastor em',
            placeholder: 'Ordenado a Pastor em',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, dUnc: event.target.value }),
            value: membro.dUnc
        },
        {
            tipoInput: true,
            id: 'localuncao-membro',
            label: true,
            icone: 'map-marker-alt',
            type: 'text',
            name: 'Ordenado a Pastor na',
            placeholder: 'Ordenado a Pastor na (Local)',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, locUnc: event.target.value }),
            value: membro.locUnc
        },
        {
            tipoInput: true,
            id: 'jubilacao-membro',
            label: true,
            icone: 'blind',
            type: 'date',
            name: 'Data de Jubilação',
            placeholder: 'Data de Jubilação',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, dJub: event.target.value }),
            value: membro.dJub
        },
        {
            tipoInput: true,
            id: 'localjubilacao-membro',
            label: true,
            icone: 'map-marker-alt',
            type: 'text',
            name: 'Local de Jubilação',
            placeholder: 'Local de Jubilação',
            maxLength: '50',
            minLength: '6',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, locJub: event.target.value }),
            value: membro.locJub
        },
        {
            tipoInput: true,
            id: 'inicioprob-membro',
            label: true,
            icone: 'file-signature',
            type: 'date',
            name: 'Data de Inicio de Periodo Probatório',
            placeholder: 'Data de Inicio de Periodo Probatório',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, inicioProb: event.target.value }),
            value: membro.inicioProb
        },
        {
            tipoInput: true,
            id: 'fimprob-membro',
            label: true,
            icone: 'award',
            type: 'date',
            name: 'Data de Término de Periodo Probatório',
            placeholder: 'Data de Término de Periodo Probatório',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, fimProb: event.target.value }),
            value: membro.fimProb
        },
        {
            tipoText: true,
            id: 'obmembroprob-membro',
            label: true,
            type: 'text',
            name: 'Observações do Periodo Probatório',
            placeholder: 'Observações do Periodo Probatório...',
            maxLength: '200',
            minLength: '5',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, obsProbatorio: event.target.value }),
            value: membro.obsProbatorio
        }
    ]

    const camposArquivos = [
        {
            tipoInput: true,
            id: 'dataderegistro-membro',
            label: true,
            icone: 'calendar-alt',
            type: 'date',
            name: 'Data de Registro',
            placeholder: 'Data de Registro',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, dataRegistro: event.target.value }),
            value: membro.dataRegistro
        },
        {
            tipoInput: true,
            id: 'registro-membro',
            label: true,
            icone: 'sort-numeric-up',
            type: 'text',
            name: 'Registro',
            placeholder: 'Número de Registro',
            maxLength: '50',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, registro: event.target.value }),
            value: membro.registro
        },
        {
            tipoInput: true,
            id: 'livro-membro',
            label: true,
            icone: 'book',
            type: 'text',
            name: 'Livro',
            placeholder: 'Livro',
            maxLength: '50',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, livro: event.target.value }),
            value: membro.livro
        },
        {
            tipoInput: true,
            id: 'pagina-membro',
            label: true,
            icone: 'file-alt',
            type: 'text',
            name: 'Página',
            placeholder: 'Página',
            maxLength: '50',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, pagina: event.target.value }),
            value: membro.pagina
        }
    ]

    const camposCurriculo = [
        {
            tipoInput: true,
            id: 'profissao-membro',
            label: true,
            icone: 'user-tie',
            type: 'text',
            name: 'Profissão',
            placeholder: 'Profissão',
            maxLength: '50',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, profissao: event.target.value }),
            value: membro.profissao
        },
        {
            tipoInput: true,
            id: 'salario-membro',
            label: true,
            icone: 'dollar-sign',
            type: 'text',
            name: 'Salário',
            placeholder: 'Pretensão Salárial',
            maxLength: '10',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, salario: event.target.value }),
            value: membro.salario
        },
        {
            tipoText: true,
            id: 'objetivos-membro',
            label: true,
            type: 'text',
            name: 'Objetivos',
            placeholder: 'Objetivos na carreira...',
            maxLength: '200',
            minLength: '5',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, objetivos: event.target.value }),
            value: membro.objetivos
        },
        {
            tipoText: true,
            id: 'descricao-membro',
            label: true,
            type: 'text',
            name: 'Descrição',
            placeholder: 'Descrição Pessoal...',
            maxLength: '200',
            minLength: '5',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, descricao: event.target.value }),
            value: membro.descricao
        },
        {
            tipoCheck: true,
            icone: 'search-dollar',
            label: true,
            id: 'curriculo-procurando',
            name: 'Procurando Oportunidades?',
            placeholder: 'Procurando Oportunidades?',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, procurando: event.target.checked }),
            checked: membro.procurando
        },
        {
            tipoCheck: true,
            icone: 'eye',
            label: true,
            id: 'curriculo-publico',
            name: 'Perfil Público?',
            placeholder: 'Perfil Público?',
            required: false,
            disabled: false,
            onChange: event => setMembro({ ...membro, publico: event.target.checked }),
            checked: membro.publico
        },
    ]

    const tabs = [
        <TabPainel id='Overview'>
            <TabCol col='0'>
                <TabRow>
                    <Lista
                        titulo='Novos Membros'
                        button={[{ id: 0, lista: true, texto: 'Ver Todos', icone: 'fas fa-arrow-alt-circle-right', onClick: () => setTab(1) }]}
                        itens={novos}
                    />
                </TabRow>
            </TabCol>
            <TabCol col='1'>
                <TabRow>
                    <Lista
                        className='lista-simples'
                        titulo='Útimas Atualizações'
                        button={[{ id: 0, lista: true, texto: 'Ver Relatórios', icone: 'fas fa-arrow-alt-circle-right', onClick: () => setTab(1) }]}
                        itens={sumario}
                    />
                </TabRow>
            </TabCol>
        </TabPainel>,
        <TabPainel id='Membros' className='tab-item-full-tabela'>
            <TabRow>
                <Tabela colunas={colunas} linhas={tabela} />
            </TabRow>
        </TabPainel>,
        <TabPainel id={membro.id ? 'Gerenciar' : 'Adicionar'} full={true}>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Membro</h3>
                        <p>Informações básicas do membro e configurações de login.</p>
                        <p>Criado em: <b>{membro.createdAt ? FormataData(membro.createdAt) : ''}</b></p>
                        <div className='row-item-link'>
                            <a onClick={() => setMembro({ ...membro, password: GerarPassword() })}>Gerar Novo Password</a>
                            <a onClick={() => setMembro({ ...membro, matricula: GeraMatricula() })}>Gerar Matricula</a>
                        </div>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm} campos={camposBasicos} />
                    </RowItem>
                </RowContainer>
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Dados Civis</h3>
                        <p>Documentação e informações relacionadas.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm} campos={camposCivis} />
                    </RowItem>
                </RowContainer>
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Dados Eleitorais</h3>
                        <p>Informações eleitorias do membro.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm} campos={camposEleitorais} />
                    </RowItem>
                </RowContainer>
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                            <h3>Necessidades Especiais</h3>
                            <p>Dados de membros portadores de necessidades especiais.</p>
                            <p>Selecione uma categoria de necessidade especial e informe uma descrição especifica da doença.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm} campos={camposEspeciais} />
                    </RowItem>
                </RowContainer>
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                            <h3>Endereço</h3>
                            <p>Dados de endereço do membro.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm} campos={camposEndereco} />
                    </RowItem>
                </RowContainer>
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                            <h3>Contatos</h3>
                            <p>Dados de contatos do membro.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm} campos={camposContatos} />
                    </RowItem>
                </RowContainer>
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                            <h3>Perfil Cristão</h3>
                            <p>Dados gerais da pessoa como membro da igreja.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm} campos={camposCristao} />
                    </RowItem>
                </RowContainer>   
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Pastores</h3>
                        <p>Informações apenas para pastores convencionais.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm} campos={camposPastores} />
                    </RowItem>
                </RowContainer>
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Cargos Ministeriais</h3>
                        <p>Histórico de cargos do ministério galgados pelo membro.</p>
                    </RowItem>
                    <RowItem larg={true}>
                        <Lista
                            className='lista-form'
                            form={true}
                            titulo='Cargos Registrados'
                            button={[{ id: 0, lista: true, texto: 'Adicionar', icone: 'fas fa-plus', onClick: () => setModalCargos({ ...modalCargos, display: true, titulo: 'Registrar novo Cargo' }) }]}
                            itens={cargos.length > 0 ? cargos : []}
                        />
                        
                    </RowItem>
                </RowContainer>
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Funções Ministeriais</h3>
                        <p>Histórico de funções do ministério executadas pelo membro.</p>
                    </RowItem>
                    <RowItem larg={true} >
                        <Lista
                            className='lista-form'
                            form={true}
                            titulo='Funções Registradas'
                            button={[{ id: 0, lista: true, texto: 'Adicionar', icone: 'fas fa-plus', onClick: () => setModalFuncoes({ ...modalFuncoes, display: true, titulo: 'Registrar nova Função' }) }]}
                            itens={funcoes.length > 0 ? funcoes : []}
                        />
                        
                    </RowItem>
                </RowContainer>
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Arquivos</h3>
                        <p>Relacionamento com os arquivos fisicos do membro.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm} campos={camposArquivos} />
                    </RowItem>
                </RowContainer>
            </TabRow>
            <TabRow bottom={true}>
                <RowContainer>
                    <RowItem>
                        <h3>Curriculo</h3>
                        <p>Perfil profissional do membro, os dados informados aqui poderão aparecer no site da igreja posteriormente caso seja marcado como público.</p>
                    </RowItem>
                    <RowItem>
                        <Form config={configForm} campos={camposCurriculo} />
                    </RowItem>
                </RowContainer>
            </TabRow>
            {
                membro._id ?
                    <>
                        <TabRow bottom={true}>
                            <RowContainer>
                                <RowItem>
                                    {
                                        membro.ativo ?
                                            <>
                                                <h3>Desativar Perfil</h3>
                                                <p>Ao clicar neste botão você irá desativar a conta e o membro aparecerá somente nos relatórios de membros inativos.</p>
                                                <p>Essa ação irá bloquear o acesso ao sistema por parte deste perfil.</p>
                                            </>
                                            :
                                            <>
                                                <h3>Ativar Perfil</h3>
                                                <p>Ao clicar neste botão você irá ativar a conta e o membro voltará a aparecer nas relações de membros.</p>
                                            </>
                                    }
                                </RowItem>
                                <RowItem>
                                    <FormItem>
                                        <Button className={membro.ativo ? 'red' : 'green'} texto={membro.ativo ? 'Desativar Perfil' : 'Ativar Perfil'} onClick={() => setMembro({ ...membro, ativo: !membro.ativo })} />
                                    </FormItem>
                                </RowItem>
                            </RowContainer>
                        </TabRow>
                        <TabRow>
                            <RowContainer>
                                <RowItem>
                                    <h3>Excluir Perfil</h3>
                                    <p>Ao clicar neste botão você irá remover o perfil permanentemente.</p>
                                    <p><b>Warning: </b> Esta ação é irreversivel!</p>
                                </RowItem>
                                <RowItem>
                                    <FormItem>
                                        <Button className='red' texto='Deletar Perfil' onClick={() => remove()} />
                                    </FormItem>
                                </RowItem>
                            </RowContainer>
                        </TabRow>
                    </>
                    :
                    <TabRow>
                        <RowContainer>
                            <RowItem>
                                <h3>Criar Perfil</h3>
                                <p>Ao clicar neste botão você irá criar um novo perfil de membro com os parametros informados.</p>
                            </RowItem>
                            <RowItem>
                                <FormItem>
                                    <Button className='green' texto='Criar Perfil' onClick={() => criar()} />
                                </FormItem>
                            </RowItem>
                        </RowContainer>
                    </TabRow>
            }
        </TabPainel>,
    ]

    const tabTools = []

    const buscar = { 
        placeholder: 'Nome, Matrícula, E-mail, CPF...',
        onChange: event => setBusca(event.target.value),
        value: busca
    }


    return (
        <Tela links={links} history={history} loading={loading} alert={alert} busca={inputBusca ? buscar : false}>
            <Modal config={modalCargos} form={formModalCargos} campos={campoModalCargos} />
            <Modal config={modalFuncoes} form={formModalFuncoes} campos={campoModalFuncoes} />
            <Tab links={linksTab} tab={tabs[tab]} tools={tab === 1 ? tabTools : false}/>
        </Tela>
    )
}