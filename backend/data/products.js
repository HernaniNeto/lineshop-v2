// Catálogo da Linerock (textos e preços das páginas do site original da Linerock)
const products = [
  {
    name: 'SSD',
    image: '/images/linerock/ssd.jpg',
    description:
      'Apresentamos o SSD, um dispositivo compacto e poderoso para melhorar seu desempenho. Com até 512 GB de capacidade, ele oferece velocidade e eficiência excepcionais. Tamanhos: 120 GB, 240 GB, 256 GB, 480 GB, 500 GB e 512 GB.',
    brand: 'Linerock',
    category: 'Memórias',
    price: 140.0,
    countInStock: 10,
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Memória RAM',
    image: '/images/linerock/memoria-ram.jpg',
    description:
      'Desempenho aprimorado e velocidade excepcional. Acelere suas tarefas e aplicativos com facilidade. Eleve o desempenho do seu sistema com a Memória RAM. Tipos: DDR2, DDR3 e DDR4.',
    brand: 'Linerock',
    category: 'Memórias',
    price: 80.0,
    countInStock: 10,
    rating: 0,
    numReviews: 0
  },
  {
    name: 'HD Desktop',
    image: '/images/linerock/hd-desktop.jpg',
    description:
      'HD (Hard Disk Drive) disponível em nossa loja: armazenamento confiável e de alta capacidade para suas necessidades. Desempenho rápido e estável, ideal para desktops e notebooks. Tamanhos: 500 GB e 1 TB.',
    brand: 'Linerock',
    category: 'Memórias',
    price: 80.0,
    countInStock: 10,
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Placa Mãe',
    image: '/images/linerock/placa-mae.jpg',
    description:
      'Conheça a nossa placa-mãe. Desenvolvida para oferecer desempenho excepcional, suporta uma ampla variedade de processadores. Com recursos avançados e durabilidade comprovada, é a escolha perfeita para construir um sistema de alta performance. Suporte a sockets LGA 1151, LGA 1200, AM4, TR4 e sTRX4.',
    brand: 'Linerock',
    category: 'Placas e Processadores',
    price: 230.0,
    countInStock: 10,
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Placa de Vídeo',
    image: '/images/linerock/placa-de-video.jpg',
    description:
      'Placa de vídeo de alta performance, oferecendo gráficos impressionantes. Potencialize seus jogos e aplicações exigentes com desempenho avançado. Experimente a qualidade visual imersiva da nossa placa de vídeo.',
    brand: 'Linerock',
    category: 'Placas e Processadores',
    price: 170.0,
    countInStock: 10,
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Processador',
    image: '/images/linerock/processador.jpg',
    description:
      'Processador disponível em nossa loja: desempenho excepcional e eficiência energética. Aumente a velocidade e a capacidade de processamento do seu sistema. Opções Intel Core (i3, i5, i7 e i9) e AMD Ryzen (3, 5, 7 e 9).',
    brand: 'Linerock',
    category: 'Placas e Processadores',
    price: 200.0,
    countInStock: 10,
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Mouse',
    image: '/images/linerock/mouse.jpg',
    description:
      'Conheça o conforto e a precisão em suas mãos. Com design ergonômico, este mouse oferece aderência aprimorada para longas horas de uso. Com sensor óptico avançado, garante movimentos precisos e responsivos. Tipos: com fio, sem fio, gamer e comum.',
    brand: 'Linerock',
    category: 'Periféricos',
    price: 20.0,
    countInStock: 10,
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Teclado',
    image: '/images/linerock/teclado.jpg',
    description:
      'Teclado de PC disponível em nossa loja: digitação confortável e resposta rápida. Design ergonômico e retroiluminação ajustável para uma experiência personalizada. Aumente sua produtividade e desfrute de jogos imersivos. Tipos: comum e gamer.',
    brand: 'Linerock',
    category: 'Periféricos',
    price: 40.0,
    countInStock: 10,
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Cabo HDMI',
    image: '/images/linerock/cabo-hdmi.jpg',
    description:
      'Cabo HDMI disponível em nossa loja: qualidade superior e conectividade de alta definição. Transmita áudio e vídeo em alta resolução, com conexão estável e de alta velocidade. Compatível com HD, Full HD, 4K e 8K.',
    brand: 'Linerock',
    category: 'Periféricos',
    price: 1.0,
    countInStock: 10,
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Gabinete Gamer',
    image: '/images/linerock/gabinete.jpg',
    description:
      'Gabinete gamer com lateral em vidro e iluminação RGB. Bom espaço interno para placa de vídeo, cabos e ventilação, deixando seu PC bonito e bem refrigerado. Formato Mid Tower, compatível com placas-mãe ATX, Micro-ATX e Mini-ITX.',
    brand: 'Linerock',
    category: 'Gabinetes e Monitores',
    price: 180.0,
    countInStock: 10,
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Monitor Curvo',
    image: '/images/linerock/monitor.jpg',
    description:
      'Monitor curvo com imagem nítida e cores vivas, ideal para jogos, filmes e trabalho. A tela curva envolve o seu campo de visão e deixa a experiência mais imersiva. Conexões HDMI e DisplayPort.',
    brand: 'Linerock',
    category: 'Gabinetes e Monitores',
    price: 350.0,
    countInStock: 10,
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Cooler para Processador',
    image: '/images/linerock/cooler.jpg',
    description:
      'Cooler para processador com dissipador de alumínio e ventoinha silenciosa. Mantém a temperatura sob controle e prolonga a vida útil do seu processador. Compatível com sockets Intel LGA 1150, 1151, 1155 e 1200.',
    brand: 'Linerock',
    category: 'Placas e Processadores',
    price: 35.0,
    countInStock: 10,
    rating: 0,
    numReviews: 0
  },
  {
    name: 'Cabo VGA',
    image: '/images/linerock/cabo-vga.jpg',
    description:
      'Cabo VGA com filtro contra interferências, para ligar monitores, projetores e TVs ao computador. Conexão estável e imagem limpa. Comprimento de 1,5 metro.',
    brand: 'Linerock',
    category: 'Periféricos',
    price: 10.0,
    countInStock: 10,
    rating: 0,
    numReviews: 0
  }
]

export default products
