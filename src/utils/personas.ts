export interface Persona {
  id: string;
  name: string;
  path: any;
}

// Mapeamento das imagens de personas disponíveis
const personaImages: { [key: string]: any } = {
  a: require('../../assets/personas/a/arara.png'),
  b: require('../../assets/personas/b/baleia.png'),
  c: require('../../assets/personas/c/cobra.png'),
  d: require('../../assets/personas/d/dragao.png'),
  e: require('../../assets/personas/e/elefante.png'),
  f: require('../../assets/personas/f/flamingo.png'),
  g: require('../../assets/personas/g/girafa.png'),
  h: require('../../assets/personas/h/hipopotamo.png'),
  i: require('../../assets/personas/i/iguana.png'),
  j: require('../../assets/personas/j/jaguar.png'),
  k: require('../../assets/personas/k/koala.png'),
  l: require('../../assets/personas/l/leao.png'),
  m: require('../../assets/personas/m/macaco.png'),
  n: require('../../assets/personas/n/naja.png'),
  o: require('../../assets/personas/o/onca.png'),
  p: require('../../assets/personas/p/panda.png'),
  q: require('../../assets/personas/q/quati.png'),
  r: require('../../assets/personas/r/raposa.png'),
  s: require('../../assets/personas/s/sapo.png'),
  t: require('../../assets/personas/t/tigre.png'),
  u: require('../../assets/personas/u/urso.png'),
  v: require('../../assets/personas/v/vaca.png'),
  w: require('../../assets/personas/w/wallaby.png'),
  x: require('../../assets/personas/x/xingu.png'),
  y: require('../../assets/personas/y/yak.png'),
  z: require('../../assets/personas/z/zebra.png'),
};

// Nomes dos animais para cada letra (todas as letras do alfabeto)
const animalNames: { [key: string]: string } = {
  a: 'Arara',
  b: 'Baleia',
  c: 'Cobra',
  d: 'Dragão',
  e: 'Elefante',
  f: 'Flamingo',
  g: 'Girafa',
  h: 'Hipopótamo',
  i: 'Iguana',
  j: 'Jaguar',
  k: 'Koala',
  l: 'Leão',
  m: 'Macaco',
  n: 'Naja',
  o: 'Onça',
  p: 'Panda',
  q: 'Quati',
  r: 'Raposa',
  s: 'Sapo',
  t: 'Tigre',
  u: 'Urso',
  v: 'Vaca',
  w: 'Wallaby',
  x: 'Xingu',
  y: 'Yak',
  z: 'Zebra'
};

// Criar personas apenas para as letras que têm imagens disponíveis
export const PERSONAS: Persona[] = Object.keys(personaImages).map(id => ({
  id,
  name: animalNames[id] || id.toUpperCase(),
  path: personaImages[id]
}));

export const getPersonaById = (id: string): Persona | undefined => {
  return PERSONAS.find(persona => persona.id === id);
};

export const getPersonaImage = (personaId: string | null): any => {
  if (!personaId) return null;
  const persona = getPersonaById(personaId);
  return persona?.path || null;
};