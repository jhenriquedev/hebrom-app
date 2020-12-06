import React from 'react'

import './estilo.css'

import FormItem from '../formItem'
import Button from '../button'
import Input from '../input'
import Select from '../select'
import Text from '../textarea'
import Check from '../checkbox'
import InputAvatar from '../inputAvatar'

export default props => {
    const config = props.config

    return(
        config ?
            <form onSubmit={config.submit} className='form-padrao'>
                {props.children}
                {
                    props.campos ?
                        props.campos.map(campo => 
                            <FormItem key={campo}>
                                {
                                    campo.tipoAvatar ?
                                        <InputAvatar onChange={campo.onChange} avatar={campo.avatar}/>
                                    : ''
                                }
                                {
                                    campo.tipoInput ? 
                                        <Input config={campo} />
                                    : ''
                                }
                                {
                                    campo.tipoSelect ? 
                                        <Select config={campo} />
                                    : ''
                                }
                                {
                                    campo.tipoText ?
                                        <Text config={campo} />
                                    : ''
                                }
                                {
                                    campo.tipoCheck ?
                                        <Check config={campo} />
                                    : ''
                                }
                            </FormItem>
                        )
                    : ''
                }
                {
                    config.id ?
                        <FormItem>
                            {
                                config.cancelar ?
                                    <Button type='reset' className='mineral' texto='Cancelar' onClick={config.cancelar} />
                                : ''
                            }
                            {
                                config.noButton ? '':
                                    <Button type='submit' className='mid-blue' texto={config.texto || 'Salvar'} />
                            }
                        </FormItem>
                        : ''
                }
            </form>
        : ''
    )
}