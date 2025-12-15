import vestidos from '../img/Categoria/fotovestido.jpg'
import carteras from '../img/Categoria/bolsofoto.jpg'
import ropapersonalizada from '../img/Categoria/ropapersonalizada1.jpg'
import joya1 from '../img/Categoria/fotojoyas.jpg'
import foto1 from '../img/Carrousel/foto11.jpg'
import foto2 from '../img/Carrousel/foto21.jpg'
import foto3 from '../img/Carrousel/foto31.jpg'

export const ProductsCategoria = [
    {
        id: 1,
        id_name: "vestidos",
        image: vestidos,
        name: "VESTIDOS",
        precio: "$3519",
    },
    {
        id: 2,
        id_name: "bolsos",
        image: carteras,
        name: "BOLSOS",
        precio: "$3519",
    },
    {
        id: 3,
        id_name: "indumentaria",
        image: ropapersonalizada,
        name: "INDUMENTARIA",
        precio: "$3519",
    },
    {
        id: 4,
        id_name: "joyeria",
        image: joya1,
        name: "JOYERIA",
        precio: "$3519",
    },
]

export const carruselSlides = [
    {
        url: foto1,
    },
    {
        url: foto3,
    },
    {
        url: foto2,
    }
]
