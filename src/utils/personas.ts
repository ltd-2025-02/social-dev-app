export interface Persona {
  id: string;
  name: string;
  path: any;
  category?: string;
}

// Mapeamento completo de todas as imagens de personas disponíveis
const personaImages: { [key: string]: any } = {
  // Letra A
  arara: require('../../assets/personas/a/arara.png'),
  
  // Letra B
  baleia: require('../../assets/personas/b/baleia.png'),
  borboleta: require('../../assets/personas/b/borboleta.png'),
  
  // Letra C
  cachorro: require('../../assets/personas/c/cachorro.png'),
  cobra: require('../../assets/personas/c/cobra.png'),
  
  // Letra D
  dinossauro: require('../../assets/personas/d/dinossauro.png'),
  dragao: require('../../assets/personas/d/dragao.png'),
  
  // Letra E
  elefante: require('../../assets/personas/e/elefante.png'),
  
  // Letra F
  flamingo: require('../../assets/personas/f/flamingo.png'),
  
  // Letra G
  girafa: require('../../assets/personas/g/girafa.png'),
  
  // Letra H
  hipopotamo: require('../../assets/personas/h/hipopotamo.png'),
  
  // Letra I
  iguana: require('../../assets/personas/i/iguana.png'),
  
  // Letra J
  jacare: require('../../assets/personas/j/jacare.png'),
  jaguar: require('../../assets/personas/j/jaguar.png'),
  
  // Letra K
  koala: require('../../assets/personas/k/koala.png'),
  
  // Letra L
  leao: require('../../assets/personas/l/leao.png'),
  
  // Letra M
  macaco: require('../../assets/personas/m/macaco.png'),
  
  // Letra N
  naja: require('../../assets/personas/n/naja.png'),
  
  // Letra O
  onca: require('../../assets/personas/o/onca.png'),
  
  // Letra P
  panda: require('../../assets/personas/p/panda.png'),
  
  // Letra Q
  quati: require('../../assets/personas/q/quati.png'),
  
  // Letra R
  raposa: require('../../assets/personas/r/raposa.png'),
  
  // Letra S
  sapo: require('../../assets/personas/s/sapo.png'),
  
  // Letra T
  tigre: require('../../assets/personas/t/tigre.png'),
  
  // Letra U
  urso: require('../../assets/personas/u/urso.png'),
  
  // Letra V
  vaca: require('../../assets/personas/v/vaca.png'),
  
  // Letra W
  wallaby: require('../../assets/personas/w/wallaby.png'),
  wombate: require('../../assets/personas/w/wombate.png'),
  
  // Letra X
  xenops: require('../../assets/personas/x/xenops.png'),
  xingu: require('../../assets/personas/x/xingu.png'),
  
  // Letra Y
  yak: require('../../assets/personas/y/yak.png'),
  yorkshire: require('../../assets/personas/y/yorkshire.png'),
  
  // Letra Z
  zebra: require('../../assets/personas/z/zebra.png'),
};

// Nomes amigáveis dos animais
const animalNames: { [key: string]: string } = {
  arara: 'Arara',
  baleia: 'Baleia',
  borboleta: 'Borboleta',
  cachorro: 'Cachorro',
  cobra: 'Cobra',
  dinossauro: 'Dinossauro',
  dragao: 'Dragão',
  elefante: 'Elefante',
  flamingo: 'Flamingo',
  girafa: 'Girafa',
  hipopotamo: 'Hipopótamo',
  iguana: 'Iguana',
  jacare: 'Jacaré',
  jaguar: 'Jaguar',
  koala: 'Koala',
  leao: 'Leão',
  macaco: 'Macaco',
  naja: 'Naja',
  onca: 'Onça',
  panda: 'Panda',
  quati: 'Quati',
  raposa: 'Raposa',
  sapo: 'Sapo',
  tigre: 'Tigre',
  urso: 'Urso',
  vaca: 'Vaca',
  wallaby: 'Wallaby',
  wombate: 'Wombate',
  xenops: 'Xenops',
  xingu: 'Peixe Xingu',
  yak: 'Yak',
  yorkshire: 'Yorkshire',
  zebra: 'Zebra'
};

// Categorias dos animais para organização
const animalCategories: { [key: string]: string } = {
  arara: 'Aves',
  baleia: 'Aquáticos',
  borboleta: 'Insetos',
  cachorro: 'Domésticos',
  cobra: 'Répteis',
  dinossauro: 'Extintos',
  dragao: 'Míticos',
  elefante: 'Terrestres',
  flamingo: 'Aves',
  girafa: 'Terrestres',
  hipopotamo: 'Aquáticos',
  iguana: 'Répteis',
  jacare: 'Répteis',
  jaguar: 'Felinos',
  koala: 'Marsupiais',
  leao: 'Felinos',
  macaco: 'Primatas',
  naja: 'Répteis',
  onca: 'Felinos',
  panda: 'Terrestres',
  quati: 'Terrestres',
  raposa: 'Terrestres',
  sapo: 'Anfíbios',
  tigre: 'Felinos',
  urso: 'Terrestres',
  vaca: 'Domésticos',
  wallaby: 'Marsupiais',
  wombate: 'Marsupiais',
  xenops: 'Aves',
  xingu: 'Aquáticos',
  yak: 'Terrestres',
  yorkshire: 'Domésticos',
  zebra: 'Terrestres'
};

// Criar personas com todas as imagens disponíveis
export const PERSONAS: Persona[] = Object.keys(personaImages).map(id => ({
  id,
  name: animalNames[id] || id.charAt(0).toUpperCase() + id.slice(1),
  path: personaImages[id],
  category: animalCategories[id] || 'Outros'
}));

// Organizar personas por categoria
export const PERSONAS_BY_CATEGORY = PERSONAS.reduce((acc, persona) => {
  const category = persona.category || 'Outros';
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(persona);
  return acc;
}, {} as { [key: string]: Persona[] });

export const getPersonaById = (id: string): Persona | undefined => {
  return PERSONAS.find(persona => persona.id === id);
};

export const getPersonaImage = (personaId: string | null): any => {
  if (!personaId) return null;
  const persona = getPersonaById(personaId);
  return persona?.path || null;
};