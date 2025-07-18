const uncountableWords = new Set([
  'accommodation',
  'adulthood',
  'advertising',
  'advice',
  'aggression',
  'aid',
  'air',
  'aircraft',
  'alcohol',
  'anger',
  'applause',
  'arithmetic',
  'assistance',
  'athletics',

  'bacon',
  'baggage',
  'beef',
  'biology',
  'blood',
  'botany',
  'bread',
  'butter',

  'carbon',
  'cardboard',
  'cash',
  'chalk',
  'chaos',
  'chess',
  'crossroads',
  'countryside',

  'dancing',
  'deer',
  'dignity',
  'dirt',
  'dust',

  'economics',
  'education',
  'electricity',
  'engineering',
  'enjoyment',
  'envy',
  'equipment',
  'ethics',
  'evidence',
  'evolution',

  'fame',
  'fiction',
  'flour',
  'flu',
  'food',
  'fuel',
  'fun',
  'furniture',

  'gallows',
  'garbage',
  'garlic',
  'genetics',
  'gold',
  'golf',
  'gossip',
  'gratitude',
  'grief',
  'guilt',
  'gymnastics',

  'happiness',
  'hardware',
  'harm',
  'hate',
  'hatred',
  'health',
  'heat',
  'help',
  'homework',
  'honesty',
  'honey',
  'hospitality',
  'housework',
  'humour',
  'hunger',
  'hydrogen',

  'ice',
  'importance',
  'inflation',
  'information',
  'innocence',
  'iron',
  'irony',

  'jam',
  'jewelry',
  'judo',

  'karate',
  'knowledge',

  'lack',
  'laughter',
  'lava',
  'leather',
  'leisure',
  'lightning',
  'linguine',
  'linguini',
  'linguistics',
  'literature',
  'litter',
  'livestock',
  'logic',
  'loneliness',
  'luck',
  'luggage',

  'macaroni',
  'machinery',
  'magic',
  'management',
  'mankind',
  'marble',
  'mathematics',
  'mayonnaise',
  'measles',
  'methane',
  'milk',
  'minus',
  'money',
  'mud',
  'music',
  'mumps',

  'nature',
  'news',
  'nitrogen',
  'nonsense',
  'nurture',
  'nutrition',

  'obedience',
  'obesity',
  'oxygen',

  'pasta',
  'patience',
  'physics',
  'poetry',
  'pollution',
  'poverty',
  'pride',
  'psychology',
  'publicity',
  'punctuation',

  'quartz',

  'racism',
  'relaxation',
  'reliability',
  'research',
  'respect',
  'revenge',
  'rice',
  'rubbish',
  'rum',

  'safety',
  'scenery',
  'seafood',
  'seaside',
  'series',
  'shame',
  'sheep',
  'shopping',
  'sleep',
  'smoke',
  'smoking',
  'snow',
  'soap',
  'software',
  'soil',
  'spaghetti',
  'species',
  'steam',
  'stuff',
  'stupidity',
  'sunshine',
  'symmetry',

  'tennis',
  'thirst',
  'thunder',
  'timber',
  'traffic',
  'transportation',
  'trust',

  'underwear',
  'unemployment',
  'unity',

  'validity',
  'veal',
  'vegetation',
  'vegetarianism',
  'vengeance',
  'violence',
  'vitality',

  'warmth',
  'wealth',
  'weather',
  'welfare',
  'wheat',
  'wildlife',
  'wisdom',

  'yoga',

  'zinc',
  'zoology',
])

export const pluralize = (word: string | undefined | null, count: number): string => {
  const _word = word || ''
  if (uncountableWords.has(_word.toLowerCase())) {
    return _word
  }
  return count > 1 ? `${_word}s` : _word
}
