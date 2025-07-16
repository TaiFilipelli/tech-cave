'use client';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'

export default function OrderComponent({ onChange, order = null}: {onChange: (order: 'asc' | 'desc') => void; order?: 'asc' | 'desc' | null; }) { 
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className='font-semibold text-medium'>{order==='asc' ? "Menor a mayor precio" : order === 'desc' ? "Mayor o menor precio" : 'Ordenar por precio'}</Button> 
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key='asc' onPress={() => onChange('asc')}>Menor a mayor precio</DropdownItem>
        <DropdownItem key='desc' onPress={()=> onChange('desc')}>Mayor a menor precio</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}