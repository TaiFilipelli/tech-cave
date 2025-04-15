export interface Category{
    name:string,
    img:string,
    type:string
}

export const categories: Category[] = [
    { name: 'Motherboards', img: '/stockMothers.jpg', type: 'Placa Madre' },
    { name: 'Procesadores', img: '/stockCPUs.jpg', type: 'Procesador' },
    { name: 'Memoria RAM', img: '/stockRAM.jpg', type: 'Memoria RAM' },
    { name: 'Almacenamiento SSD', img: '/stockSSD.jpg', type: 'Almacenamiento SSD' },
    { name: 'Placas de Video', img: '/stockGPU.jpg', type: 'Placa de Video' },
    { name: 'HDD', img: '/stockHDD.jpg', type: 'Almacenamiento HDD' },
    { name: 'Fuentes', img: '/stockPSU.jpg', type: 'Fuente de Alimentación' },
    { name: 'Mucho más', img: '/stockMisc.jpg', type: 'Otros' },
  ];