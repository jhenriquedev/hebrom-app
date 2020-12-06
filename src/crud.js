import axios from 'axios'

import { Navegar } from './util'

//Testa a conexão com a api
const Ping = async () => {
    const user = Login(1)
    const auth = user ? user.token : ''

    const resp = await API.get('/', { headers: { auth } })
    //if(resp.data.error) console.log('problema no ping: ' + resp.data.error)
    return (resp.data)
}

const Logout = (history, logout) => {
    if (!Login(1)) return Navegar(history, '/')
    Ping().then(resp => {
        if (resp.error && resp.codigo === 0) return Navegar(history, '/')
    })

    if (logout) {
        Login(3)
        return Navegar(history, '/')
    }
}

const FindClient = () => {
    const user = Login(1)
    const auth = user ? user.token : ''
    const _id = user ? user.client._id : ''

    const msg = 'Dados Carregados!'

    const url = `/clients/find-one`

    const resp = Ping().then(async resp => {
        const findClient = await API.get(url, { headers: { auth, _id } })
        if (findClient.data.error) {
            return ({ loading: false, tipo: 'danger', texto: findClient.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: msg, display: true, data: findClient.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })
    return resp
}

//SERVICES

const API = axios.create({
    baseURL: 'https://i-social-api.herokuapp.com'
})

//cria um novo
const POST = (tabela, data, msg) => {
    const user = Login(1)
    const auth = user ? user.token : ''

    const url = `/${tabela}/create`

    const resp = Ping().then(async resp => { //testa a conexão
        const post = await API.post(url, data, { headers: { auth } })
        if (post.data.error) {
            return ({ loading: false, tipo: 'danger', texto: post.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: msg, display: true, data: post.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })

    return resp
}

const Postagem = (file, msg='') => {
    const user = Login(1)
    const auth = user ? user.token : ''
    const url = `/postagens/create`
    const data = new FormData()

    data.append('file', file)

    const resp = Ping().then(async resp => { //testa a conexão
        const post = await API.post(url, data, { headers: { auth } })
        if (post.data.error) {
            return ({ loading: false, tipo: 'danger', texto: post.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: msg, display: true, data: post.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })

    return resp
}

//lista todos
const FindAll = (tabela, msg) => {
    const user = Login(1)
    const auth = user ? user.token : ''

    const url = `/${tabela}/find-all`

    const resp = Ping().then(async resp => {
        const findAll = await API.get(url, { headers: { auth } })
        if (findAll.data.error) {
            return ({ loading: false, tipo: 'danger', texto: findAll.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: msg, display: true, data: findAll.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })
    return resp
}

//lista todos populando os clientes
const FindAllRootsClients = news => {
    const user = Login(1)
    const auth = user ? user.token : ''

    let url = `/clients/find-all-roots`

    if(news){ //se estiver buscando apenas os novos
        url = `/clients/find-all-news`
    }

    const resp = Ping().then(async resp => {
        const findAll = await API.get(url, { headers: { auth } })
        if (findAll.data.error) {
            return ({ loading: false, tipo: 'danger', texto: findAll.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: 'Dados Carregados', display: true, data: findAll.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })
    return resp
}

const FindAllClient = (tabela, msg) => {
    const user = Login(1)
    const auth = user ? user.token : ''
    const client = user ? user.client._id : ''

    const url = `/${tabela}/find-all-client`

    const resp = Ping().then(async resp => {
        const findAll = await API.get(url, { headers: { auth, client } })
        if (findAll.data.error) {
            return ({ loading: false, tipo: 'danger', texto: findAll.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: msg, display: true, data: findAll.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })
    return resp
}

const FindAllNewsUsers = () => {
    const user = Login(1)
    const auth = user ? user.token : ''
    const client = user ? user.client._id : ''

    const url = `/users/find-all-news`
    const msg = 'Dados Carregados'

    const resp = Ping().then(async resp => {
        const findAll = await API.get(url, { headers: { auth, client } })
        if (findAll.data.error) {
            return ({ loading: false, tipo: 'danger', texto: findAll.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: msg, display: true, data: findAll.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })
    return resp
}

//busca os usuarios pela funcao atual
const FindFuncao = (funcao) => {
    const user = Login(1)
    const auth = user ? user.token : ''
    const client = user ? user.client._id : ''

    const url = `/users/find-function`
    const msg = 'Dados Carregados'

    const resp = Ping().then(async resp => {
        const findAll = await API.get(url, { headers: { auth, client, funcao } })
        if (findAll.data.error) {
            return ({ loading: false, tipo: 'danger', texto: findAll.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: msg, display: true, data: findAll.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })
    return resp
}

//busca por data de batismo
const FindBatismo = (batismo) => {
    const user = Login(1)
    const auth = user ? user.token : ''
    const client = user ? user.client._id : ''

    const url = `/users/find-batismo`
    const msg = 'Dados Carregados'

    const resp = Ping().then(async resp => {
        const findAll = await API.get(url, { headers: { auth, client, batismo } })
        if (findAll.data.error) {
            return ({ loading: false, tipo: 'danger', texto: findAll.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: msg, display: true, data: findAll.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })
    return resp
}

const Busca = (tabela, msg, tags) => {
    const user = Login(1)
    const auth = user ? user.token : ''
    const client = user ? user.client._id : ''

    //const url = `/${tabela}/find/`
    const url = `/${tabela}`

    const resp = Ping().then(async resp => {
        const findAll = await API.get(url, { headers: { auth, client, tags } })
        if (findAll.data.error) {
            return ({ loading: false, tipo: 'danger', texto: findAll.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: msg, display: true, data: findAll.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })
    return resp
}

//lista 1
const FindOne = (tabela, _id, msg) => {
    const user = Login(1)
    const auth = user ? user.token : ''

    const url = `/${tabela}/find-one`

    const resp = Ping().then(async resp => {
        const findAll = await API.get(url, { headers: { auth, _id } })
        if (findAll.data.error) {
            return ({ loading: false, tipo: 'danger', texto: findAll.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: msg, display: true, data: findAll.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })
    return resp
}



//deleta 1
//recebe => headers = {headers:id_que_deve_ser_removido}
const Remove = (tabela, msg, _id) => {
    const user = Login(1)
    const auth = user ? user.token : ''

    const url = `/${tabela}/remove`

    const header = { headers: { auth, _id } }
    const resp = Ping().then(async resp => {
        const remove = await API.delete(url, header)
        if (remove.data.error) {
            return ({ loading: false, tipo: 'danger', texto: remove.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: msg, display: true, data: remove.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })
    return resp
}

const Update = (tabela, msg, _id, data) => {
    const user = Login(1)
    const auth = user ? user.token : ''

    const url = `/${tabela}/update/`

    const resp = Ping().then(async resp => { //testa a conexão
        const put = await API.put(url, data, { headers: { auth } })
        if (put.data.error) {
            return ({ loading: false, tipo: 'danger', texto: put.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: msg, display: true, data: put.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })

    return resp
}

const Sumario = (tabela, _id) => {
    const user = Login(1)
    const auth = user ? user.token : ''

    const url = `/${tabela}/sumario/`

    const resp = Ping().then(async resp => {
        const sum = await API.get(url, { headers: { auth, _id } })
        if (sum.data.error) {
            return ({ loading: false, tipo: 'danger', texto: sum.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: 'Contagem Concluida...', display: true, data: sum.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })
    return resp
}

const Count = tabela => {
    const user = Login(1)
    const auth = user ? user.token : ''

    const url = `/${tabela}/count/`

    const resp = Ping().then(async resp => {
        const count = await API.get(url, { headers: { auth } })
        if (count.data.error) {
            return ({ loading: false, tipo: 'danger', texto: count.data.error, display: true })
        } else {
            return ({ loading: false, tipo: 'success', texto: 'Contagem Concluida!', display: true, data: count.data })
        }
    }).catch(error => {
        return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
    })
    return resp
}


//CONTROLE DE SESSÃO
const Login = (opt, user) => { //recebe 1 numero e 1 documento

    if (opt == 0) localStorage.setItem('user', JSON.stringify(user)) //cria sessão

    if (opt == 1) return JSON.parse(localStorage.getItem('user')) //recupera sessão

    if (opt == 3) localStorage.removeItem('user') //remove sessão

    if (opt == 2) { //efetua o login

        const remove = Login(1) //busca sessoes antigas
        if (remove) Login(3) //remove as sessoes antigas

        const msg = 'Bem vindo ao Hebrom!'

        const resp = Ping().then(async resp => { //testa a conexão
            const login = await API.post('/users/login', user)
            if (login.data.error) {
                return ({ loading: false, tipo: 'danger', texto: login.data.error, display: true })
            } else {
                const { _id, client, acesso, ativo, autenticado, rootAplicacao, rootConta, nome, token, email, avatar } = login.data

                Login(0, { //cria a nova sessao
                    _id: _id,
                    client: client,
                    acesso: acesso,
                    ativo: ativo,
                    autenticado: autenticado,
                    rootAplicacao: rootAplicacao,
                    rootConta: rootConta,
                    nome: nome,
                    avatar: avatar,
                    email: email,
                    token: token
                })

                return ({ loading: false, tipo: 'success', texto: msg, display: true, data: login.data })
            }
        }).catch(error => {
            return ({ loading: false, tipo: 'danger', texto: 'Verifique sua conexão com a internet e tente novamente!, Se o problema persistir, avise o desenvolvedor.', display: true })
        })

        return resp
    }
}



/*
//Mantém o servidor ativo
const OiServidor = () => {
    //console.log('Chamando servidor...')
    setTimeout(OiServidor, 3000);
}
OiServidor()
*/

export {
    API,
    Ping,

    POST,
    Postagem,
    FindAll,
    FindAllRootsClients,
    FindAllClient,
    FindAllNewsUsers,
    FindOne,
    FindFuncao,
    FindClient,
    FindBatismo,
    Busca,
    Remove,
    Update,
    Count,
    Sumario,

    Login,
    Logout
}