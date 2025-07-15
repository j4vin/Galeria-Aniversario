// src/lib/gallery-data.ts

// Primero, definimos la estructura de datos para cada imagen.
export type Image = {
	id: number;
	src: string;
	alt: string;
	title: string;
	description: string;
};

// Luego, creamos y exportamos el array con toda la información.
// ¡Este es el único lugar que necesitarás editar en el futuro!
export const images: Image[] = [
	
    {
		id: 1,
		src: '/images/img_10.jpg',
		alt: 'Descripción alternativa para la imagen 10.',
		title: 'Foto de Ejemplo',
		description: 'Esta foto es un ejemplo de cómo se puede añadir una nueva imagen al array.'
	},

    {
		id: 2,
		src: '/images/img_11.jpg',
		alt: 'Descripción alternativa para la imagen 11.',
		title: 'Foto épica',
		description: 'Esta foto es épica e impresionante.'
	},

    {
        id: 3,
        src: '/images/img_12.jpg',
        alt: 'Descripción alternativa para la imagen 12.',
        title: 'Inceríble',
        description: 'Esta imagen es increíble y muestra algo realmente asombroso.'
    },

    {
        id: 4,
        src: '/images/img_13.jpg',
        alt: 'Descripción alternativa para la imagen 13.',
        title: 'Ayuda',
        description: 'Esta imagen es una llamada de ayuda, porque no se me ocurre nada más que poner aquí.'
    },

    {
        id: 5,
        src: '/images/img_14.jpg',
        alt: 'Descripción alternativa para la imagen 14.',
        title: 'Sin ideas',
        description: 'No se me ocurrió nada para esta imagen, pero aquí está.'
    },

    {
        id: 6,
        src: '/images/img_15.jpg',
        alt: 'Descripción alternativa para la imagen 15.',
        title: 'Otra imagen sin ideas',
        description: 'Otra imagen sin ideas, pero sigue siendo parte de la colección.'
    }

	// Para añadir una nueva imagen, simplemente copia y pega un bloque como este:
	// {
	// 	id: 10,
	// 	src: '/images/img_10.jpg',
	// 	alt: 'Descripción de la nueva imagen.',
	// 	title: 'Título de la Nueva Imagen',
	// 	description: 'Descripción de la nueva imagen.'
	// },
];