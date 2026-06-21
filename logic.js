const popupMessageEl = document.getElementById('message');
const popupEventSelectorEl = document.getElementById('eventSelector');
const EVENT_STORAGE_KEY = 'isHalloweenOrEaster';
if (popupMessageEl && popupEventSelectorEl && chrome?.tabs && chrome?.storage?.local) {
  const setOutsideDomainState = () => {
    popupMessageEl.textContent = 'Open https://dragcave.net/ to use this extension.';
    popupEventSelectorEl.disabled = true;
  };
  const setInsideDomainState = () => {
    popupMessageEl.textContent = '';
    popupEventSelectorEl.disabled = false;
  };
  chrome.storage.local.get([EVENT_STORAGE_KEY], data => {
    popupEventSelectorEl.value = data[EVENT_STORAGE_KEY] || 'none';
  });
  popupEventSelectorEl.addEventListener('change', () => {
    chrome.storage.local.set({ [EVENT_STORAGE_KEY]: popupEventSelectorEl.value });
    popupMessageEl.textContent = 'Saved. Reload Dragcave tab to apply now.';
  });
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const activeTab = tabs[0];
    if (!activeTab || !activeTab.url || !activeTab.url.startsWith('https://dragcave.net/')) {
      setOutsideDomainState();
      return;
    }
    setInsideDomainState();
  });
}
if (window.location.hostname === 'dragcave.net') {
  const injectPageStyles = () => {
    if (document.getElementById('dragcave-inject-css')) return;
    const style = document.createElement('style');
    style.id = 'dragcave-inject-vars';
    style.textContent = `:root { --dragcave-sprite: url('${chrome.runtime.getURL('sprite.webp')}'); }`;
    document.body.appendChild(style);
    const link = document.createElement('link');
    link.id = 'dragcave-inject-css';
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('inject.css');
    document.body.appendChild(link);
  };
  if (document.body) injectPageStyles();
  else window.addEventListener('DOMContentLoaded', injectPageStyles, { once: true });
  // VARS
  const _CONSTS = {
    reloadTime: 100,
    enableLocationSwitcher: 0,
    locationURLBase: `https://dragcave.net/locations/`,
    locationList: [`5-alpine`, `1-coast`, `2-desert`, `3-forest`, `4-jungle`, `6-volcano`],
    drag_names: {
      'A cool mountain breeze blows around this egg.': 'Ridgewing|02|01',
      'A delicate web-like pattern decorates this egg’s shell.': 'Tarantula Hawk Drake|02|01',
      'A faint light glows from within this egg, as if it holds the essence of a winter night.': 'Holiday 2024<br>Noctivellus Dragon|07|17',
      'A few bright markings decorate this egg’s shell.': 'Morphodrake|03|01',
      'A fine mist rolls over this cool, scaly egg.': 'Halloween 2019<br/>Kohraki Dragon|04|01',
      'A low hum emanates from this rough egg.': 'Arrakyma|05|01',
      'A red stone is embedded in this egg’s cold shell.': 'Stellarum|06|01',
      'A serene calm washes over you as you approach this navy egg.': 'Thousand Wish|12|16',
      'A single blue spot marks this egg.': 'Quonebb|07|01',
      'A small puddle of condensation has collected under this egg.': 'Striped River|08|01',
      'A warm, comforting light emanates from within this egg.': 'Holiday 2022<br/>Light Weaver|09|01',
      'A wintry chill swirls just beneath the surface of this egg.': 'Holiday 2015<br/>Aegis Dragon|10|01',
      'An aura of serenity surrounds this iridescent egg.': 'Venturis|11|01',
      'April Fools’ Day.': 'Leetle Tree|12|01',
      Autumn: 'Leetle Tree|11|18',
      'Being near this egg makes it hard to think clearly.': 'Halloween 2014<br/>Desipis Dragon|13|01',
      'Bright sparks glide across the surface of this egg’s shell.': 'Electric|14|01',
      Christmas: 'Leetle Tree|14|18',
      'Cold flames dance across the surface of this egg.': 'Falconiform Wyvern|15|01',
      'Cold lightning arcs out from this egg’s shell if you try to touch it.': 'Thundersnow|16|01',
      'Colorful light twinkles within this frozen egg.': 'Holiday 2020<br/>Glystere|17|01',
      'Colorful swirls decorate the surface of this glossy egg.': "Valentine's 2023<br/>Xocoatl|18|01",
      'Crystals are growing around the shell of this little egg.': 'Flare-Tail Pygmy|19|01',
      'Dead leaves obscure this egg’s scratched shell.': 'Halloween 2020<br/>Pitfire|20|01',
      'Delicate petals envelop this egg.': 'Astrael|01|02',
      'Dim flames spark up from this egg whenever joy sparks up in you.': "Valentine's 2021<br/>Amarignis Dragon|02|02",
      'Earth Day.': 'Leetle Tree|03|02',
      'Frost is creeping over this cold egg.': 'Frostbite|04|02',
      'Grabbing this tiny egg makes you feel reckless.': 'Furor Pygmy|05|02',
      Halloween: 'Leetle Tree|12|18',
      'Holding this warm egg rekindles your spirit.': "Valentine's 2024<br/>Fenghuo|02|17",
      'It almost looks like there are claw marks on this egg.': 'Pseudo-wyvern Drake|06|02',
      'It feels like this egg knew you were coming.': 'Oracle Wyrm|07|02',
      'It is difficult to discern this egg from its gloomy surroundings.': 'Vilvoor|08|02',
      'It’s a tiny speckled egg.': 'Impish Pygmy|20|17',
      'It’s almost like time is distorted around this egg.': 'Aeon Wyvern|10|02',
      'It’s bright. And pink.': 'Pink / Flamingo Wyvern|09|02',
      'Leetle Tree.': 'Leetle Tree|11|02',
      'Mana courses throughout this glassy egg.': 'Xenowyrm|12|02',
      'Mana flows like a current through this glassy egg.': 'Staterae Xenowyrm|13|02',
      'Moonlight ripples across this fragile egg’s shell.': 'Moonblight Dragon|14|17',
      'Moonlight ripples across this large egg’s fragile shell.': 'Moonblight Dragon (Two-Headed)|06|18',
      'Moonlight ripples across this smooth egg’s fragile shell.': 'Moonblight Drake|07|18',
      'Moonlight ripples across this tiny egg’s fragile shell.': 'Moonblight Pygmy|15|17',
      'Powdery snow swirls gently around this egg.': 'Holiday 2023<br/>Harkfrost Dragon|08|16',
      'Powerful energy emanates from this egg.': 'Galvanic Wyvern|14|02',
      'Shadows flicker wildly around this diminutive egg.': 'Occulri Pygmy|15|02',
      'Soft bioluminescence shifts over the surface of this dark egg.': 'Halloween 2023<br/>Abyss Watcher|16|02',
      'Soft chirping sounds are coming from inside the egg.': 'Sawtooth|17|02',
      'Something about this egg seems to lure you in.': 'Cantormaris|18|02',
      'Something about this heavy egg unnerves you.': 'Jaw Splitter Wyrm|19|02',
      'Sparks dance beneath the translucent surface of this dark egg.': 'Missinic|17|17',
      'Spring.': 'Leetle Tree|20|02',
      'Starlight shimmers across this egg’s iridescent shell.': 'Elux Lucis|01|03',
      Summer: 'Leetle Tree|10|18',
      'The air shimmers around this egg, as if from heat.': 'Yellow-Crowned|02|03',
      'The brilliant blue spots on this egg stand out.': 'Alcedine Wyvern|03|03',
      'The light swirls on this egg stand out against the dark underbrush.': 'Tangledrakin|04|03',
      'The markings on this egg glow brightly in the shadows.': 'Luminox|05|03',
      'The markings on this egg match the weather outside.': 'Seasonal|06|03',
      'The pattern on this egg’s shell is unsettling.': 'Halloween 2015<br/>Caligene Dragon|07|03',
      'The surface of this egg is rough and sharp.': 'Hooktalon|08|03',
      'The vibrant scales on this egg glisten in the sunlight.': 'Aranoa|09|03',
      'There is a thin layer of moisture coating this egg.': 'Undine|10|03',
      'This ashen egg is smooth to the touch.': 'Ash|11|03',
      'This beautifully patterned egg was buried close to shore.': 'Archelonian|09|16',
      'This blue and bronze egg piques your curiosity.': 'Razorcrest Wyvern|12|03',
      'This bright egg has a warm shell.': 'Aria|13|03',
      'This bright egg shines in the morning sunlight.': 'Risensong|14|03',
      'This brown egg is covered in intricate designs.': 'Tri-Horn Wyvern|15|03',
      'This colorful egg gleams in the light.': 'Holiday 2014<br/>Mistletoe Dragon|16|03',
      'This colorful egg is covered by a light layer of snow.': 'Holiday 2011<br/>Blizzard Wizard|17|03',
      'This cool, weathered egg is a heavy burden to bear.': 'Halloween 2022<br/>Crypt|18|03',
      'This crystalline egg almost looks like you could reach into its depths.': 'Aeria Gloris|19|03',
      'This dark egg has a delicate shell that smells faintly of pine.': 'Siorghlas Wyvern|03|17',
      'This dark egg has a hard shell that smells faintly of pine.': 'Siorghlas Wyvern|08|18',
      'This dark egg has bright flecks that almost seem to move as they catch the light.': 'Silvershade|20|03',
      'This dark egg shines in the evening sunlight.': 'Setsong|01|04',
      'This deep purple egg shimmers like a pearl.': "Valentine's 2017<br/>Soulstone|02|04",
      'This delicately patterned egg is sitting in the sunshine.': 'Anagallis|03|04',
      'This dense, crystalline egg seems dangerously unstable.': 'Nexus|04|04',
      'This downy egg is hidden in brambles.': 'Halloween 2016<br/>Witchlight Dragon|05|04',
      'This drab egg rests far from the water’s edge.': 'Aqualis|06|04',
      'This dull egg feels cozily warm.': 'Xol|07|04',
      'This dull mottled egg blends into the surrounding algae.': 'Algarre|08|04',
      'This dull purple egg has two bright stripes on it.': 'Nhiostrife Wyvern|09|04',
      'This egg appears to be covered in scales.': 'Deep Sea / Shallow Water|10|04',
      'This egg appears to be made of limestone.': 'Nocturne|11|04',
      'This egg appears to have an evil grin.': 'Halloween 2013<br/>Grave Dragon|12|04',
      'This egg can’t seem to make up its mind what color it is.': 'Duotone|13|04',
      'This egg changes colors in the sunlight.': 'Sunsong Amphiptere|14|04',
      'This egg displays the colors of both dawn and dusk.': 'Sunbeam Drake / Moonglow Drake|15|04',
      'This egg emanates a gentle chime when met with the winter breeze.': 'Holiday 2019<br/>Wintertide Dragon|16|04',
      'This egg emanates a peculiar smell.': 'Mirisia Amphiptere|17|04',
      'This egg emits a soft, heartwarming glow.': 'Holiday 2013<br/>Solstice Dragon|18|04',
      'This egg emits an enchanting glow.': "Valentine's 2025<br/>Mousai|06|17",
      'This egg fades into the shadows.': 'Halloween 2011<br/>Shadow Walker|19|04',
      'This egg feels like polished stone.': 'Pyralspite|20|04',
      'This egg fills you with holiday cheer.': 'Holiday 2009<br/>Snow Angel|01|05',
      'This egg gives off a beautiful glow.': 'Silver / Sophrosyne|02|05',
      'This egg gleams with a reddish shine.': 'Copper|04|05',
      'This egg glitters oddly in the light.': 'Gilded Bloodscale|05|05',
      'This egg glows from within.': 'Spirit Ward|06|05',
      'This egg glows mysteriously.': 'Guardian of Nature|07|05',
      'This egg glows vibrantly in the dark.': 'Lightstreak|08|05',
      'This egg glows with a brilliant radiance.': 'Nebula|09|05',
      'This egg glows with a soft, soothing light.': 'Holiday 2018<br/>Starsinger Dragon|10|05',
      'This egg glows with the light of the moon.': 'Sonata|11|05',
      'This egg has a black cap.': 'Black Capped Teimarr|12|05',
      'This egg has a checkered shell.': 'Jester|13|05',
      'This egg has a dull metallic luster and is hot to the touch.': 'Blazeback|14|05',
      'This egg has a faint green glow around it.': 'Black|15|05',
      'This egg has a faintly exotic scent.': 'Black Tea|16|05',
      'This egg has a fiery pattern.': 'Flameback|18|17',
      'This egg has a holly leaf stuck to it.': 'Holiday 2007<br/>Holly Dragon|17|05',
      'This egg has a pleasant, musky smell.': 'Black Truffle|18|05',
      'This egg has a rich, shiny pattern on it.': 'Holiday 2012<br/>Wrapping-Wing|19|05',
      'This egg has a rough shell.': 'Tatterdrake|20|05',
      'This egg has a rough—yet shiny—shell.': 'Speckle-Throated|01|06',
      'This egg has a rough, scaly surface.': 'Aardrakes|11|17',
      'This egg has a striking pattern.': 'Bolt|02|06',
      'This egg has a sweet, floral scent.': "Valentine's 2018<br/>Floral-Crowned|03|06",
      'This egg has a velvety texture.': 'Pillow|04|06',
      'This egg has a very clean look; it’s completely devoid of dirt and scratches.': 'White|05|06',
      'This egg has a very thin shell.': 'Swallowtail|06|06',
      'This egg has a winding pattern on it.': 'Temple Wyrm|07|06',
      'This egg has an orange aura radiating from it.': 'Magi|08|06',
      'This egg has bright orange and green markings.': 'Gold-Horned Tangar|09|06',
      'This egg has brightly colored markings on it.': 'Spitfire / Striped|10|06',
      'This egg has colored speckles on it.': 'Two-Finned Bluna|11|06',
      'This egg has delicate markings that curl around its shell.': 'Fanalea|12|06',
      'This egg has faint markings.': 'Tetra|13|06',
      'This egg has icicles forming on it.': 'Ice|14|06',
      'This egg has multiple bands of color on it.': 'Dorsal|15|06',
      'This egg has raised golden ridges.': 'Bauta|16|06',
      'This egg has reflective spots that remind you of gems, or eyes.': 'Halloween 2018<br/>Arcana Dragon|17|06',
      'This egg has spots that glow brightly when touched.': 'Ghanser|18|06',
      'This egg has strange markings on it.': 'Frilled / Skywing / Ochredrake|19|06',
      'This egg has strange yellow stripes.': 'Neotropical|20|06',
      'This egg has striations marking its rough shell.': 'Serrati Wyvern|01|07',
      'This egg has vivid red stripes, reminiscent of waves and flames at once.': 'Tideweaver Lindwyrm|02|07',
      'This egg has washed up on the beach.': 'Marocephalic|03|07',
      'This egg is a deep pink.': "Valentine's 2013<br/>Arsani|04|07",
      'This egg is a lush green hue.': 'Terrae|05|07',
      'This egg is almost too hot to touch.': 'Magma|06|07',
      'This egg is buried in leaf litter.': 'Monarch|07|07',
      'This egg is carefully nestled away in soft grasses and feathers.': 'Crested Amphiptere|02|18',
      'This egg is covered in a dark crust.': 'Halloween 2010<br/>Black Marrow|08|07',
      'This egg is covered in black and white stripes.': 'Chaliuba|10|16',
      'This egg is covered in bright spots.': 'Spotted Greenwing|09|07',
      'This egg is covered in mysterious patterns.': 'Script|10|07',
      'This egg is covered in pale blue spots.': 'Boreal|11|07',
      'This egg is covered in soft, downy feathers.': 'Seraph|18|16',
      'This egg is covered in speckles.': 'Bright-Breasted Wyvern|12|07',
      'This egg is covered in thick blue stripes.': 'Blue-Banded|13|07',
      'This egg is covered in tiny golden scales.': 'Honey Drake|14|07',
      'This egg is covered with bright, festive stripes.': 'Holiday 2008<br/>Yulebuck|15|07',
      'This egg is dark with light speckles...or maybe it’s light with dark speckles?': 'Blancblack|16|07',
      'This egg is encrusted with colorful gemstones.': 'Gemshard|17|07',
      'This egg is glowing as brightly as the sun.': 'Sunrise / Sunset|18|07',
      'This egg is heavy and rough, as if it were made out of rock.': 'Geode / Stone|19|07',
      'This egg is hidden behind the others, as if it is shy.': 'Mint|20|07',
      'This egg is hidden by some leaves.': 'Canopy|01|08',
      'This egg is hidden in the trees.': 'Imperial Fleshcrowne|02|08',
      'This egg is much smaller than the others.': 'Chicken|03|08',
      'This egg is off-white in color and smells a bit like salt.': 'Blacktip|04|08',
      'This egg is patterned with an orange flare.': 'Fever Wyvern|05|08',
      'This egg is rather warm.': 'Red|06|08',
      'This egg is really hot.': 'Ember|07|08',
      'This egg is rocking back and forth in a puddle, creating small waves.': 'Tsunami Wyvern|08|08',
      'This egg is sitting in a patch of grass and small flowers even though there’s no sun in the cave.': 'Dark Green|09|08',
      'This egg is sitting in a pile of small pebbles.': 'Green|10|08',
      'This egg is sitting in a shallow puddle.': 'Water|11|08',
      'This egg is sitting in front of the others.': 'Guardian|12|08',
      'This egg is sitting on a cloud.': 'Daydream|13|08',
      'This egg is slimy and blue.': 'Waterhorse|14|08',
      'This egg is smooth and shiny.': 'Khusa|15|08',
      'This egg is so shiny it makes you want to take it.': "Valentine's 2015<br/>Heartstealing|16|08",
      'This egg is so tiny you almost didn’t see it.': 'Common Pygmy|17|08',
      'This egg is soft and smells uncannily like cheese.': 'Cheese|18|08',
      'This egg is speckled and very fragile.': "Valentine's 2009<br/>Valentine|19|08",
      'This egg is speckled with rosette-like markings.': 'Greater Spotted Drake|20|08',
      'This egg is split down the middle into two colors.': 'Split|01|09',
      'This egg is stone cold and smells rotten.': 'Halloween 2008<br/>Vampire Dragon|02|09',
      'This egg is surrounded by beautiful flowers.': 'Wisteria|03|09',
      'This egg is surrounded by fog.': 'Storm|04|09',
      'This egg is surrounded by frost.': 'Holiday 2016<br/>Snow Dragon|05|09',
      'This egg is surrounded by mysterious, reflective dust.': 'Antarean|06|09',
      'This egg is tiny and brightly colored.': 'Crimson Flare Pygmy|07|09',
      'This egg is tiny and made out of several pieces of paper folded together.': 'Paper|08|09',
      'This egg is unusually large and heavy.': 'Brute|09|09',
      'This egg is very large, but light for its size.': 'Stratos|10|09',
      'This egg is very reflective, almost metallic looking.': 'Tinsel|11|09',
      'This egg is very reflective, almost metallic-looking.': 'Gold|12|09',
      'This egg is very sickly looking, like it’s diseased.': 'Neglected|13|09',
      'This egg is very warm, as if it has been sitting out in strong sunlight.': 'Ultraviolet|14|09',
      'This egg is wedged in a dark corner.': 'Halloween 2012<br/>Cavern Lurker|15|09',
      'This egg is well-camouflaged.': 'Peach Pied|16|09',
      'This egg is yellow with orange speckling.': 'Freckled|17|09',
      'This egg looks delicate and sweet.': "Valentine's 2010<br/>Sweetling|18|09",
      'This egg looks like a beautiful blue stone.': 'Sapphire|19|09',
      'This egg looks like cooled lava.': 'Lalopias Leviathans|16|16',
      'This egg looks like it doesn’t belong; it is brightly colored with white spots. It’s much heavier than the other eggs.': 'Yellow Dino|20|09',
      'This egg looks like it doesn’t belong; it is brightly colored with white spots. It’s much lighter than the other eggs.': 'Blue Dino / Purple Dino|01|10',
      'This egg looks like it doesn’t belong; it is brightly colored with white spots. It’s much warmer than the rest of the eggs.': 'Red Dino|02|10',
      'This egg looks like it doesn’t belong; it is brightly colored with white spots.': 'Green Dino|03|10',
      'This egg looks like it doesn’t belong; it is glossy and covered with white spots.': 'Pink Dino|12|17',
      'This egg makes you feel a bit uneasy.': 'Cassare|04|10',
      'This egg radiates an otherworldly chill.': 'Rift Wyrm|05|10',
      'This egg radiates the heat of a fell flame.': 'Hellfire Wyvern|06|10',
      'This egg reminds you of the night sky.': 'Astaarus|07|10',
      'This egg reminds you of the sea.': 'Coastal Waverunner|08|10',
      'This egg resembles a glowing stone.': 'Sunstone / Moonstone|10|10',
      'This egg reverberates with a sound that is somehow haunting and soothing at once.': 'Phantasma|05|18',
      'This egg seems lonely sitting by itself.': 'Windrider Wyvern|15|16',
      'This egg seems quite harmless.': 'Scimitar-wing Wyvern|11|10',
      'This egg seems to be floating on a puddle.': 'Water Walker|12|10',
      'This egg seems to be glowing in spots.': 'Siyat|13|10',
      'This egg shakes from time to time, as if it is eager to hatch.': 'Whiptail|14|10',
      'This egg shakes slightly when taken out of the light.': 'Equinox|15|10',
      'This egg shimmers like gold.': 'Golden Wyvern|16|10',
      'This egg shimmers with dazzling constellations.': 'Carina|17|10',
      'This egg shines brightly in the sunlight.': 'Lumina|18|10',
      'This egg shines brilliantly in moonlight, and is covered in red spots.': 'Bleeding Moon|19|10',
      'This egg shines coldly in the moonlight.': 'Dark Lumina|20|10',
      'This egg shines in the moonlight.': 'Royal Blue|01|11',
      'This egg shines like a diamond.': 'Diamondwing|02|11',
      'This egg shines like a holiday ribbon.': 'Holiday 2010<br/>Ribbon Dancer|03|11',
      'This egg sits on a pile of soft, golden fur.': 'Aluria|05|17',
      'This egg smells faintly like brine.': 'Blusang Lindwyrm|04|11',
      'This egg smells faintly of smoke and herbs.': 'Incense|05|11',
      'This egg smells like the autumn harvest.': 'Halloween 2009<br/>Pumpkin Dragon|06|11',
      'This egg smells musty, like rotting leaves.': 'Olive|07|11',
      'This egg smells pleasantly floral, maybe fruity.': "Valentine's 2022<br/>Vermeil|08|11",
      'This egg smells rather rancid.': 'Brimstone|09|11',
      'This egg smells strongly of turpentine.': 'Turpentine|10|11',
      'This egg was buried in a sand dune.': 'Sandwaste|11|11',
      'This egg was left in an ornate nest of fur and grass.': 'Pastel|08|17',
      'This egg washed ashore.': 'Teris Wyvern|04|17',
      'This egg’s glittering shell sometimes gets lost in fog.': 'Brumous|09|17',
      'This egg’s shell has thin bands of vivid color.': 'Lunate Wyvern|01|18',
      'This egg’s shell is slippery and clean.': 'Sapo|12|11',
      'This egg’s shell is sweet and soft.': 'Halloween 2025<br/>Gummy Wyrm|13|17',
      'This egg’s slick shell is covered in lustrous, vibrant scales.': 'Ceriuth|13|11',
      'This festive egg gives off comforting warmth.': 'Holiday 2017<br/>Garland Dragon|14|11',
      'This glassy egg has a single stripe on it.': 'Spinel Wyvern|15|11',
      'This glassy egg is too hot to hold with your bare hands.': 'Pyrovar|16|11',
      'This glossy green egg is rather warm.': 'Almerald|17|11',
      'This glowing egg seems to tug at your very core.': 'Lihnseyre|18|11',
      'This golden egg is shiny and warm.': 'Miufu|16|17',
      'This green and silver egg lurks in the shadows, tempting you to steal it.': 'Lacula|19|11',
      'This heavy egg feels slightly warm.': 'Harvest|20|11',
      'This heavy egg has a distinct scorched smell.': 'Flint Drake|19|16',
      'This heavy egg has a soft, yielding shell.': 'Baikala|01|12',
      'This heavy egg has an earthy scent, like freshly-tilled soil.': 'Melismor|02|12',
      'This hot egg shakes violently when you touch it.': 'Hellhorse|03|12',
      'This icy egg sparkles with frost.': 'Crystalline|04|12',
      'This iridescent egg radiates mysterious energy.': 'Avatar of Change|05|12',
      'This iridescent egg radiates the warmth of the sun.': 'Caihong|13|16',
      'This large egg has a lustrous sheen and appears to be covered in scales.': 'Azure Glacewing|06|12',
      'This large egg is a dark crimson color.': 'Royal Crimson|07|12',
      'This light egg has very vibrant colors.': 'Skysilk|08|12',
      'This light egg is floating in the air.': 'Balloon|09|12',
      'This little egg blends into the sand.': 'Painted Ray Pygmy|10|12',
      'This little egg is soft with a few feathers stuck to it.': 'Pipio Pygmy|11|12',
      'This lovely egg has rolled off to the side.': "Valentine's 2016<br/>Mutamore|12|12",
      'This magnificent purple egg shimmers in the light.': 'Royal Eminence|13|12',
      'This massive egg is covered with thick plates.': 'Plated Colossus|14|12',
      'This metallic egg shows faint iridescence in moonlight.': 'Lunar Herald|15|12',
      'This mottled egg looks positively ancient.': 'Fell|16|12',
      'This mottled red egg almost glows from within.': 'Candelabra|17|12',
      'This opalescent egg shimmers in the moonlight.': 'Ciriax Lindwyrm|18|12',
      'This partially scaled egg looks like it was placed with great care.': 'Zarafauri|11|16',
      'This pink and red egg wobbles occasionally.': 'Carmine Wyvern|19|12',
      'This plain blue egg almost seems to float.': 'Skystrider|20|12',
      'This pleasant egg was placed in the path of a refreshing breeze.': 'Astralophyne|01|13',
      'This pristine egg sits in a clear pool of water.': 'Amalthean|02|13',
      'This radiant white egg has red and gold swirls on it.': "Valentine's 2014<br/>Radiant Angel|03|13",
      'This red and gold egg sits before the others, almost daring you to grab it.': 'Leodon|04|13',
      'This regal egg feels oddly light.': "Valentine's 2020<br/>Erador Lindwyrm|05|13",
      'This rough egg has shimmering veins of crystal running across its surface.': 'Fire Gem|06|13',
      'This scaled egg is surrounded by the others.': 'False-Headed Hydra|07|13',
      'This scaly egg seems to disappear in the depths.': 'Lotaan|08|13',
      'This scarlet egg has a faintly sweet aroma.': "Valentine's 2012<br/>Heartseeker|09|13",
      'This shady egg seems to be lurking just out of sight.': 'Hooded Murkling|10|13',
      'This shimmering egg radiates primordial energy.': 'Avatar of Creation|11|13',
      'This shimmering egg was hidden far from the others.': 'Labradorite|12|13',
      'This shiny egg gives off an almost magical aura.': 'Kingcrowne|13|13',
      'This shiny egg gives you a headache when you get close.': 'Geminae|14|13',
      'This shiny egg seems to radiate power.': 'Zyumorph|15|13',
      'This shiny egg smells faintly like flowers.': 'Floret Wyvern|16|13',
      'This shiny grey egg smells of burnt metal.': 'Magnesium Amphiptere|17|13',
      'This small egg is engulfed in a cool, purple flame.': 'Magelight Pygmy|18|13',
      'This smoldering egg radiates volatile energy.': 'Avatar of Destruction|19|13',
      'This smooth egg has a bright blue stripe on it.': 'Hunter|20|13',
      'This smooth egg has dark markings.': 'Vespine Drake|01|14',
      'This smooth green egg looks vaguely familiar.': 'Vremya Drake|02|14',
      'This soft egg is carefully nestled in feathers and snow.': 'Cloudplume|03|14',
      'This speckled egg has deep blue spots.': 'Delta Dragon (Small)|14|16',
      'This striped egg feels moist.': 'Glaucus Drake|04|14',
      'This striped egg has a rough, ridged texture.': 'Shumoga|05|14',
      'This striped egg has a warm glow.': 'Sinii Krai|06|14',
      'This striped egg is surprisingly heavy.': 'Hydrophidius / Sabertooth Bull Drake|07|14',
      'This surface of this egg is covered in pits and craters.': 'Luna|19|17',
      'This sweet smelling egg is covered by a ribbon. ': "Valentine's 2011<br/>Rosebud Dragon|09|18",
      'This sweet-smelling egg is covered by a ribbon.': "Valentine's 2011<br/>Rosebud|09|14",
      'This tiny blue egg gives you a slight shock when you touch it.': 'Lightning Pygmy|10|14',
      'This tiny cobalt egg has a crystalline sheen.': 'Kyanite Pygmy|11|14',
      'This tiny egg flashes in the sunlight.': 'Scymrian Pygmy|12|14',
      'This tiny egg gives off a colorful glow.': 'Glowback Pygmy|13|14',
      'This tiny egg has a bold red streak on it.': 'Red-Tailed Pygmy|14|14',
      'This tiny egg has crazy swirls on it.': 'Misfit Pygmy|15|14',
      'This tiny egg is cold and clammy.': 'Gloomstalker Pygmy|04|18',
      'This tiny egg is cold to the touch.': 'Dusk Pygmy|16|14',
      'This tiny egg is heavier than you expected.': 'Nilia Pygmy|17|14',
      'This tiny egg is leathery and damp.': 'Trion Pygmy|10|17',
      'This tiny egg is mysterious and dark.': 'Mistlet Pygmy|18|14',
      'This tiny egg is rather light.': 'Avea Pygmy|19|14',
      'This tiny egg is striped and feels coarse.': 'Coral Pygmy Wyvern|20|14',
      'This tiny egg is twinkling with prismatic light.': 'Twinklecape Pygmy|01|17',
      'This tiny egg resembles a seed.': 'Pargulus Pygmy|01|15',
      'This tiny egg shines like a pearl.': 'Seawyrm Pygmy|02|15',
      'This tiny egg smells like the sea.': 'Mariner Pygmy|03|15',
      'This tiny glowing egg tempts you to follow its light.': 'Mimic Pygmy|04|15',
      'This tiny white egg shakes sometimes.': 'Avin Pygmy|05|15',
      'This tiny, dark egg fills you with existential dread.': 'Kovos Pygmy|06|15',
      'This tough egg has a protective ridge down its shell.': 'Nobleshield|07|15',
      'This translucent egg shines like starlight.': 'Celestial|08|15',
      'This warm brown egg smells faintly of spices.': 'Holiday 2021<br/>Pryanost Lindwyrm|09|15',
      'This warm egg is surrounded by plants.': "Valentine's 2019<br/>Sakuhana|10|15",
      'This warm egg is tangled in the roots of a dead tree.': 'Halloween 2017<br/>Omen Dragon|11|15',
      'Three bold red stripes cut across this egg’s shell.': 'Kaikos|17|16',
      'Tough ridges line the surface of this rough, mottled egg.': 'Pyropellis Wyvern|12|15',
      'Two thin stripes crisscross the shell of this egg.': 'Berry Drake|13|15',
      'Valentine’s Day': 'Leetle Tree|14|15',
      'Water glistens on this egg’s shimmering shell.': 'Tercorn / Ushgorn|15|15',
      'When you tap on this shell, the hatchling inside taps back.': 'Pyrrhichios|17|15',
      'Whenever you go near this egg your hair stands on end.': 'Thunder|18|15',
      'Whenever you pick up this egg, you feel as though someone is watching you.': 'Ouhou Wyvern|03|18',
      'Wind gusts around this egg.': 'Aether Wyvern|19|15',
      Winter: 'Leetle Tree|13|18',
      'Wow, purple isn’t a color of egg you expected to see.': 'Purple|20|15',
      'You almost didn’t see this egg among the plants.': 'Spotted Teal Drake|01|16',
      'You can feel the static electricity that surrounds this egg.': 'Storm-Rider|02|16',
      'You can see the baby dragon curled up inside this translucent egg.': 'Albino|03|16',
      'You feel a clawing dread the closer you get to this egg.': 'Scourgekeeper|04|16',
      'You feel the weight of gravity grow heavier as you are pulled toward this molten egg.': 'Halloween 2024<br/>Quantari Dragon|20|16',
      'You hear a soft melody as you approach this egg.': 'Mistra|05|16',
      'You hear strange noises coming from inside this egg.': 'Howler Drake|06|16',
      'Your eyes struggle to completely focus on the light coming through this cloudy egg.': 'Halloween 2021<br/>Iridichi|07|16',
      'The markings on this cloudy egg glint like gossamer in the sun.': 'Holiday 2025<br>XXXXXXXXX|15|18',
      'Haimatos Dragon': 'This blood-red egg has a jelly-like texture.|16|18',
      //"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX": "This creepy-looking egg looks distinctly like bone.|17|18",
      //"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX|18|18",
      //"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX|19|18",
      //"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX|20|18",
    }, //"This egg has a rough, scaly surface.": "DONO|11|17", |--o--| FORMAT = NAME|COL+1|ROW+1
  };
  // EVENT EGG CLICKER
  const runEventClicker = isHalloweenOrEaster => {
    if (isHalloweenOrEaster === 'none') return;
    setTimeout(() => {
      document.querySelectorAll(`a`).forEach(a => {
        const href = a.getAttribute(`href`) || ``;
        if (href.split(`/`)[1] === isHalloweenOrEaster) a.click();
      });
    }, 500);
  };
  if (chrome?.storage?.local) {
    chrome.storage.local.get([EVENT_STORAGE_KEY], data => {
      runEventClicker(data[EVENT_STORAGE_KEY] || 'none');
    });
  }
  // REDIRECT AND LOCATION SWITCHER
  const currentLocationIndex = _CONSTS.locationList.indexOf(window.location.href.replace(_CONSTS.locationURLBase, ''));
  if (_CONSTS.enableLocationSwitcher && currentLocationIndex >= 0 && currentLocationIndex <= 5) {
    const nextLocation = _CONSTS.locationList[(currentLocationIndex + 1) % _CONSTS.locationList.length];
    const timerElement = document.createElement(`div`);
    timerElement.id = `cd-timer`;
    document.body.appendChild(timerElement);
    let counter = _CONSTS.reloadTime * 1000;
    const timer = setInterval(() => {
      counter -= 100;
      timerElement.textContent = (counter / 1000).toFixed(1);
      if (counter <= 0) {
        clearInterval(timer);
        window.location.href = _CONSTS.locationURLBase + nextLocation;
      }
    }, 100);
  }
  // EGG IMAGE REPLACE
  document.querySelectorAll(`.eggs > div > span`).forEach(eggDescription => {
    const target = eggDescription.parentNode.querySelector(`a`);
    if (!target) return;
    target.classList.add(`sprite`);
    const dragText = eggDescription.innerHTML.trim();
    const dragonType = _CONSTS.drag_names[dragText];
    const data = dragonType ? dragonType.split(`|`) : [`Dragon Not Found`, `1`, `1`];
    target.innerHTML = `
  <div class="egg-img" style="background-position: ${(parseInt(data[1]) - 1) * -50}px ${(parseInt(data[2]) - 1) * -50}px;"></div>
  <div class="egg-name">${data[0]}</div>
  <div class="egg-desc">${dragText} <small>[c${data[1]}|r${data[2]}]</small></div>`;
  });
  // DRAGON RENAME HELP
  const pasteInput = document.querySelector(`input[name="type"]`);
  if (pasteInput) {
    pasteInput.addEventListener(`click`, () =>
      navigator.clipboard.readText().then(cliptext => {
        pasteInput.value = cliptext;
        const renameForm = document.querySelector(`form[method="name"]`);
        if (renameForm) setTimeout(() => renameForm.submit(), 50);
      }, alert)
    );
  }
  // ADD DAYCARE LINK TO THE MAIN MENU
  const mainMenu = document.querySelector(`._p_9`);
  if (mainMenu) {
    mainMenu.innerHTML += `<a href="https://www.allureofnds.net/daycare" target="_blank">Daycare</a>`;
  }
}
