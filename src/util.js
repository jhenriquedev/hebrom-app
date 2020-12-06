
import { cnpj, cpf } from 'cpf-cnpj-validator'
import cep from 'cep-promise'

//navegar para a tela
const Navegar = (history, url) => {
    history.push(url)
}

const DataHoje = () => {
    const now = new Date()
    const dia = now.getDate()
    const mes = now.getMonth() + 1
    const ano = now.getFullYear()
    return dia + '/' + mes + '/' + ano
}

const DataHojeLonga = () => {
    var now = new Date()
    var dia = now.getDay()
    if (dia === 0) dia = 'Domingo'
    if (dia === 1) dia = 'Segunda-Feira'
    if (dia === 2) dia = 'Terça-Feira'
    if (dia === 3) dia = 'Quarta-Feira'
    if (dia === 4) dia = 'Quinta-Feira'
    if (dia === 5) dia = 'Sexta-Feira'
    if (dia === 6) dia = 'Sábado'

    var mes = now.getMonth()
    if (mes == 0) mes = 'Janeiro'
    if (mes == 1) mes = 'Fevereiro'
    if (mes == 2) mes = 'Março'
    if (mes == 3) mes = 'Abril'
    if (mes == 4) mes = 'Maio'
    if (mes == 5) mes = 'Junho'
    if (mes == 6) mes = 'Julho'
    if (mes == 7) mes = 'Agosto'
    if (mes == 8) mes = 'Setembro'
    if (mes == 9) mes = 'Outubro'
    if (mes == 10) mes = 'Novembro'
    if (mes == 11) mes = 'Dezembro'

    return (
        dia + ', ' + now.getDate() + ' de ' + mes + ' de ' + now.getFullYear()
    )
}

const getMes = () => {
    var now = new Date()
    var mes = now.getMonth()
    if (mes == 0) mes = 'Janeiro'
    if (mes == 1) mes = 'Fevereiro'
    if (mes == 2) mes = 'Março'
    if (mes == 3) mes = 'Abril'
    if (mes == 4) mes = 'Maio'
    if (mes == 5) mes = 'Junho'
    if (mes == 6) mes = 'Julho'
    if (mes == 7) mes = 'Agosto'
    if (mes == 8) mes = 'Setembro'
    if (mes == 9) mes = 'Outubro'
    if (mes == 10) mes = 'Novembro'
    if (mes == 11) mes = 'Dezembro'

    return (mes)
}

const getAno = () => {
    var now = new Date()
    return now.getFullYear()
}

const FormataData = dataRecebida => {

    var data = new Date(dataRecebida)
    var dia = data.getUTCDate()
    var mes = data.getMonth() + 1
    var ano = data.getFullYear()

    if (dia <= 9) {
        dia = '0' + dia
    }
    if (mes <= 9) {
        mes = '0' + mes
    }
    return dia + '/' + mes + '/' + ano
}

const FormataDataLonga = (data) => {
    var now = new Date(data)
    var dia = now.getDay()
    if (dia === 0) dia = 'Domingo'
    if (dia === 1) dia = 'Segunda-Feira'
    if (dia === 2) dia = 'Terça-Feira'
    if (dia === 3) dia = 'Quarta-Feira'
    if (dia === 4) dia = 'Quinta-Feira'
    if (dia === 5) dia = 'Sexta-Feira'
    if (dia === 6) dia = 'Sábado'

    var mes = now.getMonth()
    if (mes == 0) mes = 'Janeiro'
    if (mes == 1) mes = 'Fevereiro'
    if (mes == 2) mes = 'Março'
    if (mes == 3) mes = 'Abril'
    if (mes == 4) mes = 'Maio'
    if (mes == 5) mes = 'Junho'
    if (mes == 6) mes = 'Julho'
    if (mes == 7) mes = 'Agosto'
    if (mes == 8) mes = 'Setembro'
    if (mes == 9) mes = 'Outubro'
    if (mes == 10) mes = 'Novembro'
    if (mes == 11) mes = 'Dezembro'

    return (
        dia + ', ' + now.getDate() + ' de ' + mes + ' de ' + now.getFullYear()
    )
}

const FormataDataAbrev = (data) => {
    var now = new Date(data)

    var mes = now.getMonth()
    if (mes == 0) mes = 'Jan'
    if (mes == 1) mes = 'Fev'
    if (mes == 2) mes = 'Mar'
    if (mes == 3) mes = 'Abr'
    if (mes == 4) mes = 'Mai'
    if (mes == 5) mes = 'Jun'
    if (mes == 6) mes = 'Jul'
    if (mes == 7) mes = 'Ago'
    if (mes == 8) mes = 'Set'
    if (mes == 9) mes = 'Out'
    if (mes == 10) mes = 'Nov'
    if (mes == 11) mes = 'Dez'

    return (
        now.getDate() + ' ' + mes + '. ' + now.getFullYear()
    )
}

const FormataDataInter = data => {
    const date = new Date(data)
    var dia = date.getUTCDate()
    var mes = date.getMonth() + 1
    var ano = date.getFullYear()
    if (dia <= 9) {
        dia = '0' + dia
    }
    if (mes <= 9) {
        mes = '0' + mes
    }
    return ano + '-' + mes + '-' + dia
}

const DataDiaAnterior = () => {
    const hoje = new Date()
    let ontem = new Date(hoje.getTime())
    ontem.setDate(hoje.getDate() - 1)
    const dia = ontem.getDate()
    const mes = ontem.getMonth() + 1
    const ano = ontem.getFullYear()

    const data = ano + '-' + mes + '-' + dia

    return data
}

//gera letras e numeros aleatorios
function textoAleatorio(tamanho) {
    var letras = '0123456789ABCDEFGHIJKLYMNOPQRSTUVWXTZ';
    var aleatorio = '';
    for (var i = 0; i < tamanho; i++) {
        var rnum = Math.floor(Math.random() * letras.length);
        aleatorio += letras.substring(rnum, rnum + 1);
    }
    return aleatorio;
}

const aleatorio = (tamanho, texto) => {
    let aleatorio = ''
    for (var i = 0; i < tamanho; i++) {
        var rnum = Math.floor(Math.random() * texto.length)
        aleatorio += texto.substring(rnum, rnum + 1)
    }
    return aleatorio
}

const GeraMatricula = () => {
    const now = new Date()
    let codigo = ''
    //primeira etapa
    var prefixo = textoAleatorio(1)
    //segunda etapa
    var meio = textoAleatorio(3)
    var ano = now.getFullYear()
    var mes = 1 + now.getMonth()
    var dia = 1 + now.getDate()
    var hora = now.getHours()
    var minutos = now.getMinutes()
    var segundos = now.getSeconds()
    var milisegundos = now.getMilliseconds()
    var soma = ano + mes + dia + hora + minutos + segundos + milisegundos
    soma = aleatorio(3, ('' + soma))
    codigo = prefixo + '' + soma
    //terceira etapa
    codigo += '' + ano + '' + mes + '' + dia + '' + hora + '' + minutos + '' + segundos + '' + milisegundos
    //quarta etapa
    codigo += meio + '' + mes + '' + milisegundos
    //quinta etapa
    codigo = aleatorio(6, codigo)
    //sexta etapa
    codigo += milisegundos
    codigo = aleatorio(7, codigo)
    //setima etapa
    codigo += aleatorio(1, 'ABCDEFGHIJLYMNOPQRSTUVXZWK')

    //oitava etapa basta acrescentar 2 numeros referentes a quantidade de registros no banco
    //exemplo
    codigo += '-' + aleatorio(2, '0123456789')
    //console.log(codigo)
    return codigo
}

const GerarPassword = () => {
    const now = new Date()
    var meio = textoAleatorio(3)
    var ano = now.getFullYear()
    var mes = 1 + now.getMonth()
    var dia = 1 + now.getDate()
    var hora = now.getHours()
    var minutos = now.getMinutes()
    var segundos = now.getSeconds()
    var milisegundos = now.getMilliseconds()
    var soma = ano + mes + dia + hora + minutos + segundos + milisegundos
    soma = aleatorio(3, ('' + soma))

    const texto = '0123456789ABCDEFGHIJKLYMNOPQRSTUVWXTZabcdefghijklmnopqrstuvxywz';
    const maiusculo = 'ABCDEFGHIJLYMNOPQRSTUVXZWK'
    const numeros = '0123456789'
    const pass = `${aleatorio(1, maiusculo)}${aleatorio(3, texto)}${aleatorio(1, soma)}${aleatorio(1, numeros)}${aleatorio(2, texto)}`
    return pass
}

const quebraTexto = texto => {
    return texto.split(' ')
}

const FormataHora = tempo => {
    const data = new Date(tempo)
    var hora = data.getHours()
    var minutos = data.getMinutes()
    if (minutos <= 9) {
        minutos = '0' + minutos
    }
    return hora + ':' + minutos
}

const RemoverElementoArray = (array, indiceInicial, quantidade) => {
    const newArray = array.splice(indiceInicial, quantidade)
    return newArray
}

const itemRandom = vetor => {

    var item = Math.floor(Math.random() * vetor.length)

    return vetor[item]
}


const buscaEmLista = (lista, busca) => {
    let result = []
    if (lista) {
        lista.map(item => item.texto.includes(busca) ?
            result.push(item)
            : ''
        )
    }
    return (result)
}

const VerificarCpf = numero => {
    if(numero){
        if(cpf.isValid(numero)){
            return true
        }else{
            return false
        }
    }else {
        return false
    }
}

const VerificarCnpj = numero => {
    if (numero) {
        if (cnpj.isValid(numero)) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

//retorna uma promisse
const ConsultarCep = numero => {
    if(numero){
        return cep(numero)
    }
}



export {
    Navegar,
    FormataData,
    FormataDataAbrev,
    FormataDataLonga,
    FormataDataInter,
    buscaEmLista,
    GeraMatricula,
    GerarPassword,
    VerificarCpf,
    VerificarCnpj,
    ConsultarCep
}