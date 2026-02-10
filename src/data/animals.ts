export interface Animal {
  id: number;
  nameEn: string;
  nameRu: string;
  size: 'small' | 'medium' | 'large' | 'giant';
  weight: string;
  length: string;
  origin: string;
  description: string;
  diet: string;
  funFact: string;
  status: string;
  /** Filename in /images/ (e.g. "fox.jpg"). Undefined if image not yet provided. */
  image?: string;
}

export const animals: Animal[] = [
  {
    id: 1,
    nameEn: 'Wildcat',
    nameRu: 'Дикая кошка',
    size: 'small',
    weight: '3–8 kg',
    length: '45–80 cm',
    origin:
      'Europe, western Asia, and Africa. Found in forests, scrublands, and grasslands from Scotland to southern Africa.',
    description:
      'A small, stocky feline with a broad head and distinctive tabby-striped fur. Closely related to domestic cats but more muscular and with a thicker tail. Wildcats are solitary, fiercely territorial nocturnal hunters that stalk prey with extraordinary patience.',
    diet: 'Small mammals (mice, voles), birds, insects, and occasionally reptiles.',
    funFact:
      'All 600 million domestic cats on Earth descend from the African wildcat subspecies.',
    status: 'Least Concern — hybridization with domestic cats threatens genetic purity.',
    image: 'wildcat.jpg',
  },
  {
    id: 2,
    nameEn: 'Fox',
    nameRu: 'Лисица',
    size: 'small',
    weight: '3–14 kg',
    length: '45–90 cm',
    origin:
      'Virtually worldwide. Red foxes inhabit Europe, Asia, North America, and parts of North Africa — the most widespread wild carnivore on Earth.',
    description:
      'A slender, agile canid with a pointed muzzle, large triangular ears, and a famously bushy tail. Foxes are renowned for their cunning and adaptability, thriving in forests, mountains, deserts, and even city centers. They are mostly crepuscular and solitary.',
    diet: 'Omnivorous: rodents, rabbits, birds, fruits, berries, and human refuse.',
    funFact:
      'Foxes use Earth\'s magnetic field to calculate pounce trajectories — the only animal known to use magnetism for hunting.',
    status: 'Least Concern — abundant and highly adaptable.',
    image: 'fox.jpg',
  },
  {
    id: 3,
    nameEn: 'Jackal',
    nameRu: 'Шакал',
    size: 'small',
    weight: '6–15 kg',
    length: '60–105 cm',
    origin:
      'Africa, southeastern Europe, and South Asia. Golden jackals prefer open savannas and dry grasslands.',
    description:
      'A medium-small canid with long legs, a slender body, and a short golden-brown coat. Jackals form lifelong monogamous pairs and are highly vocal, communicating with yips, howls, and growls. They are opportunistic and incredibly resourceful.',
    diet: 'Omnivorous: small mammals, insects, fruits, carrion, and human scraps.',
    funFact:
      'Jackal pairs coordinate so precisely during hunts that their success rate doubles compared to solo efforts.',
    status: 'Least Concern — populations stable across range.',
    image: 'jackal.jpg',
  },
  {
    id: 4,
    nameEn: 'Raven',
    nameRu: 'Ворон',
    size: 'small',
    weight: '0.7–1.6 kg',
    length: '54–67 cm',
    origin:
      'Throughout the Northern Hemisphere — North America, Europe, Asia, and North Africa. Thrives in varied habitats from arctic tundra to deserts.',
    description:
      'The largest passerine bird, entirely glossy black with a massive wedge-shaped bill. Ravens are among the most intelligent animals alive, capable of problem-solving, tool use, and future planning. They fly with distinctive slow, deliberate wingbeats.',
    diet: 'Omnivorous scavenger: carrion, insects, grain, berries, small animals, and eggs.',
    funFact:
      'Ravens can imitate human speech and have been observed sliding down snowy rooftops purely for fun.',
    status: 'Least Concern — expanding range in many regions.',
    image: 'raven.jpg',
  },
  {
    id: 5,
    nameEn: 'Owl',
    nameRu: 'Сова',
    size: 'small',
    weight: '0.1–4.5 kg',
    length: '13–70 cm',
    origin:
      'Every continent except Antarctica. Over 200 species inhabit forests, deserts, tundra, and grasslands worldwide.',
    description:
      'Nocturnal raptors with large forward-facing eyes, a flat facial disc, and asymmetrically placed ears for pinpoint sound localization. Owls can rotate their heads up to 270 degrees. Their feathers have specialized fringes that enable virtually silent flight.',
    diet: 'Carnivorous: mice, voles, insects, fish, and other birds depending on species.',
    funFact:
      'An owl\'s eyes are not true spheres but elongated tubes, so they cannot move in their sockets at all.',
    status: 'Varies by species — several forest-dwelling species are Vulnerable.',
    image: 'owl.jpg',
  },
  {
    id: 6,
    nameEn: 'Eagle',
    nameRu: 'Орёл',
    size: 'medium',
    weight: '2–7 kg',
    length: '60–100 cm',
    origin:
      'Worldwide. Golden and bald eagles dominate the Northern Hemisphere; martial and crowned eagles rule African skies.',
    description:
      'Powerful raptors with broad wings, a hooked beak, and exceptional eyesight capable of spotting prey from over 3 km away. Eagles are apex aerial predators that soar on thermal currents and dive at astonishing speeds. They build enormous nests reused for decades.',
    diet: 'Carnivorous: fish, mammals (rabbits, hares), birds, and reptiles.',
    funFact:
      'A bald eagle\'s nest can weigh over 2 tonnes — the largest tree nest of any animal.',
    status: 'Many species recovering thanks to conservation; some tropical species remain Endangered.',
    image: 'eagle.jpg',
  },
  {
    id: 7,
    nameEn: 'Monkey',
    nameRu: 'Обезьяна',
    size: 'small',
    weight: '0.1–35 kg',
    length: '12–100 cm',
    origin:
      'Tropical and subtropical forests of Central/South America (New World) and Africa/Asia (Old World).',
    description:
      'A diverse group of primates ranging from tiny pygmy marmosets to large mandrills. Most monkeys are arboreal with dexterous hands, forward-facing eyes, and complex social structures. Many New World species have prehensile tails acting as a fifth limb.',
    diet: 'Omnivorous: fruits, leaves, insects, eggs, and small vertebrates.',
    funFact:
      'Capuchin monkeys have been observed using stones as tools for over 3,000 years — their own Stone Age.',
    status: 'Highly variable — many species face severe habitat loss and are Endangered.',
    image: 'monkey.jpg',
  },
  {
    id: 8,
    nameEn: 'Penguin',
    nameRu: 'Пингвин',
    size: 'medium',
    weight: '1–45 kg',
    length: '30–120 cm',
    origin:
      'Exclusively the Southern Hemisphere: Antarctica, South America, South Africa, New Zealand, and subantarctic islands.',
    description:
      'Flightless seabirds superbly adapted to aquatic life. Penguins have counter-shaded black-and-white plumage, dense waterproof feathers, and flipper-like wings for underwater propulsion. They are social birds that form enormous colonies and display strong pair bonds.',
    diet: 'Carnivorous: fish, krill, and squid caught during deep dives.',
    funFact:
      'Emperor penguins can dive over 500 meters deep and hold their breath for more than 20 minutes.',
    status: 'Several species Vulnerable or Endangered due to climate change and overfishing.',
    image: 'penguin.jpg',
  },
  {
    id: 9,
    nameEn: 'Chimpanzee',
    nameRu: 'Шимпанзе',
    size: 'medium',
    weight: '30–60 kg',
    length: '64–94 cm',
    origin:
      'West and Central Africa. Inhabits tropical rainforests, woodland-savanna mosaics, and montane forests.',
    description:
      'Our closest living relative, sharing approximately 98.7% of our DNA. Chimps are highly intelligent, using tools, learning sign language, and exhibiting self-awareness. They live in complex hierarchical communities of up to 150 individuals led by an alpha male.',
    diet: 'Omnivorous: fruits, leaves, seeds, insects, honey, and occasionally red meat from hunted monkeys.',
    funFact:
      'Chimpanzees have been observed self-medicating by eating specific plants to treat intestinal parasites.',
    status: 'Endangered — rapidly declining due to deforestation, poaching, and disease.',
    image: 'chimpanzee.jpg',
  },
  {
    id: 10,
    nameEn: 'Cheetah',
    nameRu: 'Гепард',
    size: 'large',
    weight: '21–72 kg',
    length: '110–150 cm',
    origin:
      'Sub-Saharan Africa with a small critically endangered population in Iran. Prefers open grasslands and savannas.',
    description:
      'The fastest land animal, built for pure speed with a lightweight frame, deep chest, long legs, and semi-retractable claws for grip. Cheetahs accelerate from 0 to 100 km/h in about 3 seconds. Unlike other big cats, they hunt by sight in daylight and rarely scavenge.',
    diet: 'Carnivorous: small to medium antelopes (gazelles, impalas) and hares.',
    funFact:
      'Cheetahs cannot roar — instead they chirp and purr like domestic cats.',
    status: 'Vulnerable — fewer than 7,000 remain in the wild.',
    image: 'cheetah.jpg',
  },
  {
    id: 11,
    nameEn: 'Leopard',
    nameRu: 'Леопард',
    size: 'large',
    weight: '30–90 kg',
    length: '90–190 cm',
    origin:
      'Sub-Saharan Africa, Central Asia, India, and China. Incredibly adaptable, found from rainforests to mountains above 5,000 m.',
    description:
      'A muscular, solitary big cat with a stunning rosette-patterned coat. Leopards are stealthy ambush predators and phenomenal climbers, often hoisting prey heavier than themselves into trees to avoid scavengers. They are the most adaptable of all big cats.',
    diet: 'Carnivorous: antelopes, deer, monkeys, rodents, and birds.',
    funFact:
      'A melanistic leopard (all-black fur) is commonly known as a "black panther" — the rosettes are still visible under certain light.',
    status: 'Vulnerable — population declining across most of range due to habitat loss.',
    image: 'leopard.jpg',
  },
  {
    id: 12,
    nameEn: 'Gorilla',
    nameRu: 'Горилла',
    size: 'large',
    weight: '70–220 kg',
    length: '120–180 cm',
    origin:
      'Central and East Africa. Found in tropical and subtropical forests from lowland swamps to montane bamboo forests.',
    description:
      'The largest living primate, with a powerful build and expressive dark eyes. Despite their fearsome appearance, gorillas are predominantly gentle herbivores. They live in family groups led by a dominant "silverback" male and communicate through over 25 distinct vocalizations.',
    diet: 'Herbivorous: leaves, stems, bamboo shoots, fruits, and occasionally ants or termites.',
    funFact:
      'Each gorilla has a unique nose-print, just like human fingerprints.',
    status: 'Critically Endangered — both species face poaching, disease, and habitat destruction.',
    image: 'gorilla.jpg',
  },
  {
    id: 13,
    nameEn: 'Wolf',
    nameRu: 'Волк',
    size: 'medium',
    weight: '25–80 kg',
    length: '100–160 cm',
    origin:
      'North America, Europe, and Asia. Gray wolves inhabit forests, tundra, grasslands, and mountain regions.',
    description:
      'A highly social apex predator that lives and hunts in packs of 6–10 members with a strict dominance hierarchy. Wolves have incredible endurance, capable of trotting at 10 km/h for hours. Their haunting howls coordinate pack movements and reinforce bonds across vast territories.',
    diet: 'Carnivorous: elk, deer, moose, bison, and smaller mammals.',
    funFact:
      'Wolf reintroduction in Yellowstone literally changed the course of rivers by restoring vegetation that stabilized riverbanks.',
    status: 'Least Concern globally — but locally threatened in many European and Asian regions.',
    image: 'wolf.jpg',
  },
  {
    id: 14,
    nameEn: 'Deer',
    nameRu: 'Олень',
    size: 'large',
    weight: '20–450 kg',
    length: '80–250 cm',
    origin:
      'All continents except Antarctica and Australia (introduced there). Inhabit forests, tundra, grasslands, and wetlands.',
    description:
      'Graceful ruminant herbivores recognizable by their branching antlers (in males of most species), which are shed and regrown annually. Deer are crepuscular grazers and browsers, relying on speed, agility, and acute senses to evade predators. Some species form huge seasonal herds.',
    diet: 'Herbivorous: grass, leaves, twigs, bark, lichens, and fruits.',
    funFact:
      'Deer antlers are the fastest-growing tissue in the animal kingdom — up to 2 cm per day.',
    status: 'Most species Least Concern — some Asian species are Critically Endangered.',
    image: 'deer.jpg',
  },
  {
    id: 15,
    nameEn: 'Tiger',
    nameRu: 'Тигр',
    size: 'large',
    weight: '100–300 kg',
    length: '200–330 cm',
    origin:
      'South and Southeast Asia, eastern Russia, and China. Inhabits tropical forests, mangroves, and taiga.',
    description:
      'The largest living cat, instantly recognized by bold black stripes on orange fur — each pattern unique as a fingerprint. Tigers are solitary, powerful swimmers and ambush hunters that can take down prey much larger than themselves. They require vast territories.',
    diet: 'Carnivorous: deer, wild boar, buffalo, and occasionally fish or monkeys.',
    funFact:
      'Unlike most cats, tigers love water and are excellent swimmers, often cooling off in pools and streams.',
    status: 'Endangered — approximately 4,500 remain in the wild, though numbers are slowly recovering.',
    image: 'tiger.jpg',
  },
  {
    id: 16,
    nameEn: 'Lion',
    nameRu: 'Лев',
    size: 'large',
    weight: '120–250 kg',
    length: '170–250 cm',
    origin:
      'Sub-Saharan Africa with a small population in India\'s Gir Forest. Prefers savannas, grasslands, and open woodlands.',
    description:
      'The only truly social cat, living in prides of up to 30 individuals. Males sport a magnificent mane that signals fitness and dominance. Lionesses cooperate in coordinated hunts, while males defend territory. Their roar can be heard from 8 km away.',
    diet: 'Carnivorous: zebras, wildebeest, buffalo, and various antelopes.',
    funFact:
      'Lions sleep up to 20 hours a day — the laziest of all big cats.',
    status: 'Vulnerable — populations have halved in 25 years due to habitat loss and conflict with humans.',
    image: 'lion.jpg',
  },
  {
    id: 17,
    nameEn: 'Panther',
    nameRu: 'Пантера',
    size: 'large',
    weight: '30–100 kg',
    length: '100–190 cm',
    origin:
      'Africa, Asia, and the Americas. "Panther" refers to melanistic leopards (Africa/Asia) or jaguars (Americas).',
    description:
      'Not a separate species but a melanistic color variant of leopards or jaguars. Their jet-black coat results from excess melanin pigmentation, though rosettes are often faintly visible. Panthers share all the stealth and power of their spotted relatives but appear even more ghostly in dense jungle.',
    diet: 'Carnivorous: deer, wild pigs, monkeys, birds, and fish.',
    funFact:
      'Black jaguars in South America and black leopards in Asia are both called "panthers" but are genetically unrelated variants.',
    status: 'As per parent species — generally Vulnerable or Near Threatened.',
    image: 'panther.jpg',
  },
  {
    id: 18,
    nameEn: 'Zebra',
    nameRu: 'Зебра',
    size: 'large',
    weight: '175–450 kg',
    length: '200–250 cm',
    origin:
      'Eastern and southern Africa. Inhabits grasslands, savannas, woodlands, and mountainous terrain.',
    description:
      'Iconic African equids with bold black-and-white stripes that are unique to each individual. Zebras are highly social, living in harems or large herds. They are tough, fast (up to 65 km/h), and have a powerful kick that can injure lions.',
    diet: 'Herbivorous: primarily grasses, occasionally shrubs, herbs, and bark.',
    funFact:
      'Zebra stripes may deter biting flies — experiments with striped coats on horses significantly reduced fly landings.',
    status: 'Plains zebra: Near Threatened. Grevy\'s zebra: Endangered (fewer than 2,000 remain).',
    image: 'zebra.jpg',
  },
  {
    id: 19,
    nameEn: 'Mountain Goat',
    nameRu: 'Горный козёл',
    size: 'medium',
    weight: '45–140 kg',
    length: '120–180 cm',
    origin:
      'Mountainous regions of North America, Europe, and Central Asia. Thrives on steep, rocky alpine terrain above the tree line.',
    description:
      'A sure-footed ungulate with a thick white coat, a beard, and short curved horns. Mountain goats are remarkable climbers, ascending near-vertical cliffs with specialized rubbery hooves that provide incredible grip. They endure extreme cold and high-altitude conditions.',
    diet: 'Herbivorous: alpine grasses, mosses, lichens, and shrubs.',
    funFact:
      'Mountain goats can climb slopes of nearly 60 degrees and jump 3.5 meters in a single bound.',
    status: 'Least Concern — stable populations in protected mountain habitats.',
    image: 'goat.jpg',
  },
  {
    id: 20,
    nameEn: 'Bull',
    nameRu: 'Бык',
    size: 'large',
    weight: '450–1,100 kg',
    length: '200–310 cm',
    origin:
      'Domesticated worldwide from the wild aurochs (Bos primigenius, now extinct). Wild relatives include gaur and banteng in Asia.',
    description:
      'A powerful bovine with a massive muscular build, broad shoulders, and often impressive horns. Bulls are known for their strength and occasionally aggressive temperament. Wild ancestors were among the largest land animals in Eurasia, standing over 180 cm at the shoulder.',
    diet: 'Herbivorous: grasses, hay, grains, and silage.',
    funFact:
      'Bulls are partially color-blind — they charge the movement of a matador\'s cape, not its red color.',
    status: 'Domestic: abundant. Wild relatives: gaur Near Threatened, banteng Endangered.',
    image: 'bull.jpg',
  },
  {
    id: 21,
    nameEn: 'Horse',
    nameRu: 'Лошадь',
    size: 'large',
    weight: '380–1,000 kg',
    length: '200–270 cm',
    origin:
      'Domesticated from wild horses of the Central Asian steppe ~4000 BCE. Przewalski\'s horse survives as the last truly wild horse in Mongolia.',
    description:
      'A large, elegant ungulate with a long mane, flowing tail, and powerful legs built for sustained speed. Horses have an extraordinary sense of hearing and nearly 360-degree vision. They sleep standing up and can run within hours of birth.',
    diet: 'Herbivorous: grasses, hay, oats, and supplemental grains.',
    funFact:
      'Horses can sleep both standing and lying down, thanks to a special "stay apparatus" that locks their leg joints.',
    status: 'Domestic: abundant. Przewalski\'s horse: Endangered but recovering through reintroduction programs.',
    image: 'horse.jpg',
  },
  {
    id: 22,
    nameEn: 'Buffalo',
    nameRu: 'Буйвол',
    size: 'large',
    weight: '300–920 kg',
    length: '210–340 cm',
    origin:
      'Sub-Saharan Africa (Cape buffalo) and South/Southeast Asia (water buffalo). Favors grasslands, swamps, and floodplains.',
    description:
      'A massively built bovid with thick curved horns that can fuse into a protective "boss" on the forehead. Cape buffalo are notoriously unpredictable and are considered one of Africa\'s most dangerous animals. They live in herds of hundreds and defend each other fiercely.',
    diet: 'Herbivorous: tall grasses, reeds, and aquatic vegetation.',
    funFact:
      'Cape buffalo are known to remember and seek revenge on hunters who have wounded them — even years later.',
    status: 'Near Threatened (Cape buffalo). Domestic water buffalo: abundant.',
    image: 'buffalo.jpg',
  },
  {
    id: 23,
    nameEn: 'Giraffe',
    nameRu: 'Жираф',
    size: 'giant',
    weight: '800–1,930 kg',
    length: '400–600 cm (height)',
    origin:
      'Sub-Saharan Africa. Inhabits savannas, grasslands, and open woodlands where acacia trees abound.',
    description:
      'The tallest living animal, with an extraordinarily long neck (up to 2.4 m), long legs, and a distinctive spotted coat pattern unique to each individual. Despite their height, giraffes have only 7 neck vertebrae — the same as humans — each one greatly elongated.',
    diet: 'Herbivorous: acacia and mimosa leaves, buds, and fruits browsed from treetops.',
    funFact:
      'A giraffe\'s heart weighs about 11 kg and generates twice the blood pressure of humans to pump blood up to its brain.',
    status: 'Vulnerable — populations have declined ~40% in 30 years due to habitat fragmentation.',
    image: 'giraffe.jpg',
  },
  {
    id: 24,
    nameEn: 'Bear',
    nameRu: 'Медведь',
    size: 'large',
    weight: '60–600 kg',
    length: '120–300 cm',
    origin:
      'North America, South America, Europe, and Asia. From Arctic ice (polar bears) to tropical forests (sun bears).',
    description:
      'Large, powerfully built mammals with thick fur, a short tail, and plantigrade feet (walking on the whole sole). Bears are generally solitary and have an excellent sense of smell — up to 2,000 times better than humans. Most species enter a state of torpor (not true hibernation) in winter.',
    diet: 'Omnivorous: berries, nuts, roots, fish (especially salmon), insects, honey, and carrion.',
    funFact:
      'A polar bear\'s fur is actually transparent (not white) and its skin underneath is black to absorb heat.',
    status: 'Varies: polar bear Vulnerable, giant panda Vulnerable, brown bear Least Concern.',
    image: 'bear.jpg',
  },
  {
    id: 25,
    nameEn: 'Crocodile',
    nameRu: 'Крокодил',
    size: 'large',
    weight: '40–1,000 kg',
    length: '150–620 cm',
    origin:
      'Tropical regions of Africa, Asia, the Americas, and Australia. Inhabits rivers, lakes, wetlands, and coastal brackish waters.',
    description:
      'Ancient apex predators that have survived virtually unchanged for 200 million years. Crocodiles have armored scaly skin, immensely powerful jaws, and a streamlined body built for explosive aquatic ambush. Their bite force — over 3,700 PSI — is the strongest of any living animal.',
    diet: 'Carnivorous: fish, birds, mammals, and anything they can ambush at the water\'s edge.',
    funFact:
      'Crocodiles swallow stones (gastroliths) to help grind food in their stomachs and act as ballast for diving.',
    status: 'Varies widely: saltwater croc Least Concern, Philippine croc Critically Endangered.',
    image: 'crocodile.jpg',
  },
  {
    id: 26,
    nameEn: 'Rhino',
    nameRu: 'Носорог',
    size: 'giant',
    weight: '800–2,300 kg',
    length: '250–400 cm',
    origin:
      'Africa (white and black rhinos) and South/Southeast Asia (Indian, Javan, Sumatran rhinos). Inhabits grasslands, savannas, and tropical forests.',
    description:
      'Massive, thick-skinned herbivores with one or two distinctive horns made entirely of keratin. Despite their bulk, rhinos can charge at 50 km/h. They have poor eyesight but excellent hearing and smell. Oxpecker birds often ride on their backs, eating parasites.',
    diet: 'Herbivorous: grasses (white rhino) or shrubs and leaves (black rhino).',
    funFact:
      'A group of rhinos is called a "crash" — a fitting name given their tendency to charge first and investigate later.',
    status: 'Critically Endangered (Javan, Sumatran). Vulnerable (Indian, Black). Near Threatened (White).',
    image: 'rhino.jpg',
  },
  {
    id: 27,
    nameEn: 'Whale',
    nameRu: 'Кит',
    size: 'giant',
    weight: '2,000–150,000 kg',
    length: '250–3,000 cm',
    origin:
      'All of the world\'s oceans — from tropical to polar waters. Some species undertake the longest migrations of any mammal.',
    description:
      'The largest animals ever to have lived on Earth. Whales are fully aquatic mammals divided into baleen whales (filtering krill and plankton) and toothed whales (hunting fish and squid). They breathe air through blowholes, communicate with complex songs, and exhibit sophisticated social behavior.',
    diet: 'Baleen whales: krill, plankton, and small fish. Toothed whales: fish, squid, and marine mammals.',
    funFact:
      'A blue whale\'s heart is the size of a small car and its aorta is wide enough for a human to crawl through.',
    status: 'Several species Endangered: blue, North Atlantic right, sei whales. Many recovering slowly.',
    image: 'whale.jpg',
  },
];
