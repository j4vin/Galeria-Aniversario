// src/lib/gallery-data.ts

// 1. ESTRUCTURA DE DATOS
// Se añade la propiedad "date" para el ordenamiento.
// Se recomienda usar el formato 'AAAA-MM-DD'.
export type Image = {
	id: number;
	src: string;
	alt: string;
	title: string;
	description: string;
	date: string; // <-- Campo añadido para la fecha
};

// 2. ARRAY DE IMÁGENES
// Aquí es donde agregas todas tus imágenes.
// Puedes añadirlas en cualquier orden, el código de abajo las ordenará.
export const images: Image[] = [
	{
		id: 1,
		src: '/images/img_1.jpg',
		alt: 'Descripción alternativa para la imagen 1.',
		title: 'Encuentro Misiones 2017',
		description: 'Jóvenes de la comunidad en el Encuentro previo a las Misiones 2017.',
        date: '2017-01-02'
	},
    {
		id: 2,
		src: '/images/img_2.jpg',
		alt: 'Descripción alternativa para la imagen 2.',
		title: 'Misa a la Chilena 2017',
		description: 'Jóvenes de la comunidad celebrando la Misa a la Chilena en 2017.',
        date: '2017-09-01' // La más reciente, aparecerá primero.
	},
    {
        id: 3,
        src: '/images/img_3.jpg',
        alt: 'Descripción alternativa para la imagen 3.',
        title: 'JMJ 2013',
        description: 'Viajando a Brasil al encuentro de los jóvenes con el papa Francisco.',
        date: '2013-07-01'
    },
    {
        id: 4,
        src: '/images/img_4.jpg',
        alt: 'Descripción alternativa para la imagen 4.',
        title: 'Peregrinación 2018',
        description: 'Jóvenes en la peregrinación San Alberto Hurtado de 2018.',
        date: '2018-08-01' // La más antigua, aparecerá al final.
    },
    {
        id: 5,
        src: '/images/img_5.jpg',
        alt: 'Descripción alternativa para la imagen 5.',
        title: 'La Plaza en 2005',
        description: 'La Plaza de nuestros inicios.',
        date: '2005-03-01'
    },
    {
        id: 6,
        src: '/images/img_6.jpg',
        alt: 'Descripción alternativa para la imagen 6.',
        title: 'Jueves Santo 2017',
        description: 'Acompañando a Jesús.',
        date: '2017-04-13'
    },

    {
        id: 7,
        src: '/images/img_7.jpg',
        alt: 'Descripción alternativa para la imagen 7.',
        title: 'Lavado de Pies 2017',
        description: 'Semana Santa y el Lavado de Pies a personas de nuestra comunidad.',
        date: '2017-04-13'
    },

    {
        id: 8,
        src: '/images/img_8.jpg',
        alt: 'Descripción alternativa para la imagen 8.',
        title: 'Procesión Jueves Santo 2017',
        description: 'Procesión del Jueves Santo al rededor de la plaza junto a la Parroquia, acompañando a Jesús.',
        date: '2017-04-13'
    },

    {
        id: 9,
        src: '/images/img_9.jpg',
        alt: 'Descripción alternativa para la imagen 9.',
        title: 'Jovenes Misioneros 2017',
        description: 'Misiones en Mallarauco 2017',
        date: '2017-02-01'
    },

    {
        id: 10,
        src: '/images/img_19.jpg',
        alt: 'Descripción alternativa para la imagen 10.',
        title: 'Jovenes Misioneros 2017',
        description: 'Misiones en Mallarauco 2017',
        date: '2017-02-01'
    },

    {
        id: 11,
        src: '/images/img_20.jpg',
        alt: 'Descripción alternativa para la imagen 11.',
        title: 'Jovenes Misioneros 2017',
        description: 'Misiones en Mallarauco 2017',
        date: '2017-02-01'
    },

    {
        id: 12,
        src: '/images/img_10.jpg',
        alt: 'Descripción alternativa para la imagen 12.',
        title: 'Confirmaciones Jóvenes 2017',
        description: 'Confirmaciones de jóvenes de la comunidad en 2017.',
        date: '2017-05-01'
    },

    {
        id: 13,
        src: '/images/img_11.jpg',
        alt: 'Descripción alternativa para la imagen 13.',
        title: 'Confirmaciones Jóvenes 2019',
        description: 'Confirmaciones de jóvenes de la comunidad en 2019.',
        date: '2019-05-01'
    },

    {
        id: 14,
        src: '/images/img_12.jpg',
        alt: 'Descripción alternativa para la imagen 14.',
        title: 'Coro Misa Navidad 2017',
        description: 'Participación del coro en la Misa de Navidad 2017.',
        date: '2017-12-24'
    },

    {
        id: 15,
        src: '/images/img_13.jpg',
        alt: 'Descripción alternativa para la imagen 15.',
        title: 'Aniversario Parroquial 2018',
        description: 'Celebración del aniversario de la Parroquia en 2018.',
        date: '2018-09-30'
    },

    {
        id: 16,
        src: '/images/img_14.jpg',
        alt: 'Descripción alternativa para la imagen 16.',
        title: 'Confirmaciones de Adultos 2018',
        description: 'Confirmaciones de adultos de la comunidad en 2018.',
        date: '2018-04-01'
    },

    {
        id: 17,
        src: '/images/img_15.jpg',
        alt: 'Descripción alternativa para la imagen 17.',
        title: '1% Domingo de Ramos 2019',
        description: 'Integrantes del 1% en la celebración del Domingo de Ramos 2019.',
        date: '2019-04-14'
    },

    {
        id: 18,
        src: '/images/img_16.jpg',
        alt: 'Descripción alternativa para la imagen 18.',
        title: 'Coro Domingo de Ramos 2019',
        description: 'Coro participando en la Misa del Domingo de Ramos 2019.',
        date: '2019-04-14'
    },

    {
        id: 19,
        src: '/images/img_17.jpg',
        alt: 'Descripción alternativa para la imagen 19.',
        title: 'Aniversario Parroquial 2019',
        description: 'Celebración del Aniversario Parroquial 2019.',
        date: '2019-10-06'
    },

    {
        id: 20,
        src: '/images/img_18.jpg',
        alt: 'Descripción alternativa para la imagen 20.',
        title: 'Despedida Padre Samuel 2020',
        description: 'Nuestra comunidad despidiendo a Padre Samuel en 2020.',
        date: '2020-03-08'
    },

    {
        id: 21,
        src: '/images/img_21.jpg',
        alt: 'Descripción alternativa para la imagen 21.',
        title: 'Misa Navidad 2018',
        description: 'Ministros de Comunión en la celebración de la Misa de Navidad 2018.',
        date: '2018-12-25'
    },

    {
        id: 22,
        src: '/images/img_22.jpeg',
        alt: 'Descripción alternativa para la imagen 22.',
        title: 'Monseñor Luis Migone 2025',
        description: 'Nos visita Monseñor Luis Migone en 2025.',
        date: '2025-06-16'
    },

    {
        id: 23,
        src: '/images/img_23.jpeg',
        alt: 'Descripción alternativa para la imagen 23.',
        title: 'Asención del Señor 2025',
        description: 'Celebración de la Asención del Señor en 2025 junto a Catequesis de Segundo Año.',
        date: '2025-06-01'
    },

    {
        id: 24,
        src: '/images/img_24.jpeg',
        alt: 'Descripción alternativa para la imagen 24.',
        title: 'Cuasimodo 2025',
        description: 'Acompañamos a Jesús Sacramentado para llevar la comunión a los enfermos de nuestra Comunidad.',
        date: '2025-04-27'
    },

    {
        id: 25,
        src: '/images/img_25.jpg',
        alt: 'Descripción alternativa para la imagen 25.',
        title: 'Via Crucis 2025',
        description: 'Jóvenes participando en el Via Crucis en 2025.',
        date: '2025-04-18'
    },

    {
        id: 26,
        src: '/images/img_26.jpg',
        alt: 'Descripción alternativa para la imagen 26.',
        title: 'Liturgia de la Pasión 2025',
        description: 'Veneramos la cruz, signo de amor infinito, y rezamos juntos la Coronilla de la Divina Misericordia.',
        date: '2025-04-18'
    },

    {
        id: 27,
        src: '/images/img_27.jpg',
        alt: 'Descripción alternativa para la imagen 27.',
        title: 'Confirmaciones Jóvenes 2025',
        description: 'Confirmaciones de jóvenes de la comunidad en 2025.',
        date: '2025-01-05'
    },

    {
        id: 28,
        src: '/images/img_28.jpg',
        alt: 'Descripción alternativa para la imagen 28.',
        title: 'Primeras Comuniones Capilla de Fátima 2024',
        description: 'Primeras Comuniones de niños en la Capilla de Fátima en 2024.',
        date: '2024-12-22'

    },

    {
        id: 29,
        src: '/images/img_29.jpg',
        alt: 'Descripción alternativa para la imagen 29.',
        title: 'Día del Niño 2024',
        description: 'Celebración del Día del Niño con Catequesis de Primer Año en 2024.',
        date: '2024-08-11'
    },

    {
        id: 30,
        src: '/images/img_30.jpg',
        alt: 'Descripción alternativa para la imagen 30.',
        title: 'Cuasimodo 2024',
        description: 'Llevando a Jesús Sacramentado a nuestros hermanos enfermos en 2024.',
        date: '2024-04-08'
    },

    {
        id: 31,
        src: '/images/img_31.jpg',
        alt: 'Descripción alternativa para la imagen 31.',
        title: 'Via Crucis 2024',
        description: 'Participación de la comunidad en el Via Crucis en 2024.',
        date: '2024-04-30'
    },

    {
        id: 32,
        src: '/images/img_32.jpg',
        alt: 'Descripción alternativa para la imagen 32.',
        title: 'Coro Domingo de Ramos 2024',
        description: 'Participación de jóvenes en el Coro del Domingo de Ramos en 2024.',
        date: '2024-03-24'
    },

    {
        id: 33,
        src: '/images/img_33.jpg',
        alt: 'Descripción alternativa para la imagen 33.',
        title: 'Misa Navidad 2023',
        description: 'El tamborilero entrando con los reyes magos a la Misa de Navidad 2023.',
        date: '2023-12-24'
    },

    {
        id: 34,
        src: '/images/img_34.jpg',
        alt: 'Descripción alternativa para la imagen 34.',
        title: 'Cantata a María 2023',
        description: 'Coro celebrando a María en la Cantata a María 2023.',
        date: '2023-11-08'
    },

    {
        id: 35,
        src: '/images/img_35.jpg',
        alt: 'Descripción alternativa para la imagen 35.',
        title: 'Peregrinación Santa Teresa de los Andes 2023',
        description: 'Este año bajo el lema “Con Teresita peregrinos de la Esperanza".',
        date: '2023-10-16'
    },

    {
        id: 36,
        src: '/images/img_36.jpg',
        alt: 'Descripción alternativa para la imagen 36.',
        title: 'Retiro Parroquial 2023',
        description: 'Retiro Parroquial con la comunidad en 2023: Iglesia para todos.',
        date: '2023-10-01'
    },

    {
        id: 37,
        src: '/images/img_37.jpg',
        alt: 'Descripción alternativa para la imagen 37.',
        title: 'Misa a la Chilena 2023',
        description: 'Celebración de la Misa a la Chilena con la comunidad en 2023.',
        date: '2023-09-26'
    },

    {
        id: 38,
        src: '/images/img_38.jpg',
        alt: 'Descripción alternativa para la imagen 38.',
        title: 'Confirmaciones Jóvenes 2023',
        description: 'Por medio de la unción con el aceite, el confirmando recibe "la marca", el sello del Espíritu Santo.',
        date: '2023-08-27'
    },

    {
        id: 39,
        src: '/images/img_39.jpg',
        alt: 'Descripción alternativa para la imagen 39.',
        title: 'Cena Pan y Vino 2023',
        description: 'Los niños de Catequesis Familiar de Segundo Año fueron los invitados y quienes sin duda realizaron junto a las Rojitas una hermosa Cena.',
        date: '2023-08-21'
    },

    {
        id: 40,
        src: '/images/img_40.jpg',
        alt: 'Descripción alternativa para la imagen 40.',
        title: 'Pentecostés 2023',
        description: 'Comunidad celebrando Pentecostés 2023. "Ven Espíritu Santo creador, ven fuego que alienta la vida".',
        date: '2023-05-31'
    },

    {
        id: 41,
        src: '/images/img_41.jpg',
        alt: 'Descripción alternativa para la imagen 41.',
        title: 'Confirmaciones Jóvenes 2023',
        description: 'Confirmaciones de jóvenes de la comunidad en 2023.',
        date: '2023-05-28'
    },

    {
        id: 42,
        src: '/images/img_42.jpg',
        alt: 'Descripción alternativa para la imagen 42.',
        title: 'Aniversario Capilla Nuestra Señora de Fátima 2023',
        description: 'Celebración del Aniversario de la Capilla Nuestra Señora de Fátima en 2023.',
        date: '2023-05-13'
    },

    {
        id: 43,
        src: '/images/img_43.jpg',
        alt: 'Descripción alternativa para la imagen 43.',
        title: 'Jueves Santo 2023',
        description: 'Celebración del Jueves Santo con la comunidad en 2023, en el lavado de pies, recordamos el gesto de Jesús.',
        date: '2023-04-07'
    },

    {
        id: 44,
        src: '/images/img_44.jpg',
        alt: 'Descripción alternativa para la imagen 44.',
        title: 'Misa Navidad 2022',
        description: 'Celebración de la Misa de Navidad con la comunidad en 2022.',
        date: '2022-12-24'
    },

    {
        id: 45,
        src: '/images/img_45.jpg',
        alt: 'Descripción alternativa para la imagen 45.',
        title: 'Amigas de María',
        description: 'La comunidad "Amigas de María" vivieron su cierre de fin de año junto a bailes, conversas y amistad.',
        date: '2022-12-16'
    },

    {
        id: 46,
        src: '/images/img_46.jpg',
        alt: 'Descripción alternativa para la imagen 46.',
        title: 'Desayuno Rosario del Alba',
        description: 'En el mes de María, después del Rosario del Alba, nuestra comunidad invita a un desayuno comunitario para compartir y celebrar.',
        date: '2023-04-02'
    },

    {
        id: 47,
        src: '/images/img_47.jpg',
        alt: 'Descripción alternativa para la imagen 47.',
        title: 'Peregrinación con Capacidad de Amar 2022',
        description: 'Peregrinación de Fe y Luz 2022, mediante el lema "Bajo tu amparo Santa Madre de Dios"',
        date: '2022-11-04'
    },

    {
        id: 48,
        src: '/images/img_48.jpg',
        alt: 'Descripción alternativa para la imagen 48.',
        title: 'Aniversario Parroquial 2022',
        description: 'Celebración del Aniversario Parroquial en 2022.',
        date: '2022-10-19'
    },

    {
        id: 49,
        src: '/images/img_49.jpg',
        alt: 'Descripción alternativa para la imagen 49.',
        title: 'Misa Navidad 2016',
        description: 'Celebración de Misa de Navidad 2016.',
        date: '2016-12-24'
    },

    {
        id: 50,
        src: '/images/img_50.jpg',
        alt: 'Descripción alternativa para la imagen 50.',
        title: '#NavidadEnLaCalle 2016',
        description: 'Hermosa Navidad junto a nuestros hermanos más necesitados.',
        date: '2016-12-24'
    },

    {
        id: 51,
        src: '/images/img_51.jpg',
        alt: 'Descripción alternativa para la imagen 51.',
        title: 'Talleres Navideños 2016',
        description: 'Talleres navideños con niños de la comunidad en 2016.',
        date: '2016-12-22'
    },

    {
        id: 52,
        src: '/images/img_52.jpg',
        alt: 'Descripción alternativa para la imagen 52.',
        title: 'Jornada Caminantes 2016',
        description: 'Hermosa jornada de cierre de año del grupo de "Caminantes" de la pastoral juvenil en 2016.',
        date: '2016-12-04'
    },

    {
        id: 53,
        src: '/images/img_53.jpg',
        alt: 'Descripción alternativa para la imagen 53.',
        title: 'Marcha por la vida 2016',
        description: 'Nuestra Parroquia acompañando en la Celebración por la vida en 2016.',
        date: '2016-09-04'
    },

    {
        id: 54,
        src: '/images/img_54.jpg',
        alt: 'Descripción alternativa para la imagen 54.',
        title: 'Retiro Parroquial 2016',
        description: 'Un tiempo de reflexión y oración para la comunidad.',
        date: '2016-04-23'
    },

    {
        id: 55,
        src: '/images/img_55.jpg',
        alt: 'Descripción alternativa para la imagen 55.',
        title: 'Cierre de Año Consejo Parroquial 2018',
        description: 'Celebración del cierre de año del Consejo Parroquial en 2018.',
        date: '2018-12-15'
    },

    {
        id: 56,
        src: '/images/img_56.jpg',
        alt: 'Descripción alternativa para la imagen 56.',
        title: 'Inmaculada Concepción 2018',
        description: 'Celebración de la Inmaculada Concepción en 2018.',
        date: '2018-12-08'
    },

    {
        id: 57,
        src: '/images/img_57.jpg',
        alt: 'Descripción alternativa para la imagen 57.',
        title: 'Jornada Catequesis Primer Año 2018',
        description: 'Jornada para los niños de catequesis de Primer Año en 2018.',
        date: '2018-11-24'
    },

    {
        id: 58,
        src: '/images/img_58.jpg',
        alt: 'Descripción alternativa para la imagen 58.',
        title: 'Primeras Comuniones 2020',
        description: 'Celebración de las Primeras Comuniones en 2020.',
        date: '2020-12-18'
    },

    {
        id: 59,
        src: '/images/img_59.jpg',
        alt: 'Descripción alternativa para la imagen 59.',
        title: 'Rosario Mes de María 2021',
        description: 'Rosario en el mes de María 2021.',
        date: '2021-11-24'
    }

];

// 3. LÓGICA DE ORDENAMIENTO AUTOMÁTICO
// Esta línea ordena el array 'images' por fecha, de más reciente a más antigua,
// cada vez que la aplicación se carga. No necesitas tocarla.
images.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


// --- INSTRUCCIONES PARA AÑADIR NUEVAS IMÁGENES ---
// Para añadir una nueva imagen, simplemente copia, pega y edita un bloque
// como el siguiente dentro del array 'images' de arriba.
//
// {
// 	id: 7, // <-- Usa un 'id' único
// 	src: '/images/mi-nueva-foto.jpg',
// 	alt: 'Descripción de la nueva imagen.',
// 	title: 'Título de la Nueva Imagen',
// 	description: 'Descripción detallada de lo que muestra la nueva imagen.',
//  date: '2024-08-01' // <-- ¡No olvides añadir la fecha!
// },