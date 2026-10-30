/* Part 3 – Word formation. `stem` is the capitalised word shown beside the gap. */
(window.TESTS = window.TESTS || []).push(
{
  id: 'p3-01', part: '3', title: 'Living with volcanoes',
  text: `Volcanoes have a fearsome reputation, yet millions of people choose to settle on their slopes, tending vineyards and orchards within sight of a crater that may erupt again at any moment. The {1} of the soil, enriched by ash, is the main attraction, and in many regions farmers have little alternative, given the {2} of other cultivable land. Scientists now monitor tremors in {3} buried magma chambers, and their instruments are becoming ever more {4}, but the exact timing of an eruption remains stubbornly {5}. An evacuation ordered too early can prove costly, and residents are understandably {6} to abandon their homes on the strength of a warning that may come to nothing. Each false alarm, after all, makes the next one harder to enforce. Officials therefore try to {7} public trust by explaining their findings openly, though they concede that no amount of {8} can ever remove the risk entirely.`,
  questions: [
    { stem: 'FERTILE', answer: ['fertility'], explain: 'A noun is needed after "The" and before "of the soil": the fertility of the soil explains why farmers stay.' },
    { stem: 'SHORT', answer: ['shortage'], explain: 'A noun after "the": "the shortage of other cultivable land" explains why farmers have little alternative.' },
    { stem: 'DEEP', answer: ['deeply'], explain: 'An adverb modifying the participle "buried": "deeply buried magma chambers". "Deep" would not collocate with "buried" here.' },
    { stem: 'RELY', answer: ['reliable'], explain: 'An adjective after "ever more": the instruments are becoming more reliable, which sets up the contrast with the next clause.' },
    { stem: 'PREDICT', answer: ['unpredictable'], explain: 'The contrast signalled by "but" and "stubbornly" requires the negative adjective: despite better instruments, timing remains unpredictable.' },
    { stem: 'WILLING', answer: ['unwilling'], explain: 'The negative adjective, followed by "to abandon": residents are understandably unwilling to leave on the strength of a warning that may come to nothing.' },
    { stem: 'STRONG', answer: ['strengthen'], explain: 'A verb after "try to", with an internal change: officials try to strengthen public trust.' },
    { stem: 'PREPARE', answer: ['preparation', 'preparedness'], explain: 'An uncountable noun after "no amount of": no amount of preparation can remove the risk entirely.' }
  ]
},
{
  id: 'p3-02', part: '3', title: 'Concrete convictions',
  text: `Few architectural movements have aroused such strong feelings as Brutalism, the raw, unadorned manner of building that spread across Europe and North America after the Second World War. Funded largely by councils and universities, these buildings were meant to show honestly how they had been made. The concrete towers, once dismissed as {1} blots on the landscape, are now winning over a new generation of {2}, many of whom admire the sheer {3} of the designs. Detractors note that the concrete has not aged {4}, yet supporters reply that its {5} owes more to neglect than to any flaw in the architecture. To the {6} dismay of preservationists, several landmarks have already been demolished, although campaigners hope that wider {7} of the style will save others. They insist that such buildings {8} the optimism of their age, and that a society which pulls them down is erasing part of its own story.`,
  questions: [
    { stem: 'SIGHT', answer: ['unsightly'], explain: 'Towers "dismissed as ... blots on the landscape" need the negative adjective "unsightly".' },
    { stem: 'ENTHUSIASM', answer: ['enthusiasts'], explain: 'A plural noun for people, after "generation of" and before "many of whom admire".' },
    { stem: 'BOLD', answer: ['boldness'], explain: 'An uncountable noun after "the sheer" and before "of the designs".' },
    { stem: 'GRACE', answer: ['gracefully'], explain: 'An adverb after "has not aged": the concrete has not aged gracefully.' },
    { stem: 'DETERIORATE', answer: ['deterioration'], explain: 'A noun after "its": the deterioration of the buildings owes more to neglect than to the design.' },
    { stem: 'CONSIDER', answer: ['considerable'], explain: 'An adjective before "dismay": "to the considerable dismay of preservationists".' },
    { stem: 'APPRECIATE', answer: ['appreciation'], explain: 'An uncountable noun after "wider" and before "of the style": wider appreciation of the style.' },
    { stem: 'BODY', answer: ['embody'], explain: 'A verb after "such buildings", formed with the prefix em-: buildings that embody the optimism of their age.' }
  ]
},
{
  id: 'p3-03', part: '3', title: 'Working by the app',
  text: `The gig economy is often hailed as a triumph of {1}, giving workers the freedom to choose when and where they labour. The reality, however, is rather less appealing. Many couriers earn well below the minimum wage once their expenses are deducted, and have no {2} to sick pay or paid holidays. Those who complain are liable to be {3} removed from the app. Campaigners argue that the {4} of power between platform and courier is stark and that regulation is long overdue. Industry spokesmen warn that tighter rules could {5} the very freedom that workers value, and that firms should not be saddled with an {6} burden of paperwork. The sector has, they add, expanded {7} in just a few years. Whatever the outcome, the courts will play a decisive role, since the legal {8} of a courier as an employee or a contractor has yet to be settled.`,
  questions: [
    { stem: 'FLEXIBLE', answer: ['flexibility'], explain: 'A noun after "triumph of": the freedom to choose when and where to work is flexibility.' },
    { stem: 'ENTITLE', answer: ['entitlement', 'entitlements'], explain: 'A noun followed by "to": "no entitlement to sick pay or paid holidays".' },
    { stem: 'SUMMARY', answer: ['summarily'], explain: 'An adverb before the participle "removed": couriers can be summarily removed, that is, at once and without a hearing.' },
    { stem: 'BALANCE', answer: ['imbalance'], explain: 'The context ("stark", regulation "long overdue") demands the negative noun: an imbalance of power.' },
    { stem: 'THREAT', answer: ['threaten'], explain: 'A verb after "could": tighter rules could threaten the freedom workers value.' },
    { stem: 'EXCESS', answer: ['excessive'], explain: 'An adjective before "burden": firms should not be saddled with an excessive burden of paperwork.' },
    { stem: 'DRAMA', answer: ['dramatically'], explain: 'An adverb after "expanded": the sector has expanded dramatically in a few years.' },
    { stem: 'CLASSIFY', answer: ['classification'], explain: 'A noun after "the legal": the classification of a courier as an employee or a contractor.' }
  ]
},
{
  id: 'p3-04', part: '3', title: 'Voices fading',
  text: `Of the roughly seven thousand languages spoken today, around half are expected to disappear within the century, according to {1} estimates. Such figures are often met with {2}, since many speakers associate a dominant tongue with greater {3} and see no reason to hold on to a minority one. Linguists, though, argue that when a language dies, a unique way of seeing the world is lost, and with it centuries of {4} knowledge about local plants, animals and landscapes. Efforts at {5} have had mixed results, and often depend on whether children hear the language at home as well as in the classroom. In Wales, the language has been {6} supported in schools, whereas elsewhere {7} funding has doomed similar projects before they could take root. Whatever the outcome, the debate has at least {8} public awareness of what is lost when a community stops speaking the language of its grandparents.`,
  questions: [
    { stem: 'CONSERVE', answer: ['conservative'], explain: '"Conservative estimates" means cautious figures, which are still alarming.' },
    { stem: 'INDIFFERENT', answer: ['indifference'], explain: 'A noun after "met with": speakers who see no reason to preserve a minority language react with indifference.' },
    { stem: 'PROSPER', answer: ['prosperity'], explain: 'A noun after "greater": a dominant tongue is associated with greater prosperity.' },
    { stem: 'ACCUMULATE', answer: ['accumulated'], explain: 'A participial adjective before "knowledge": centuries of accumulated knowledge.' },
    { stem: 'REVIVE', answer: ['revival'], explain: 'A noun after "Efforts at": efforts at revival have had mixed results.' },
    { stem: 'GENEROUS', answer: ['generously'], explain: 'An adverb before "supported", contrasted with the lack of funding elsewhere.' },
    { stem: 'SUFFICIENT', answer: ['insufficient'], explain: 'The contrast with Wales ("whereas elsewhere") and the verb "doomed" require the negative: insufficient funding.' },
    { stem: 'HEIGHT', answer: ['heightened'], explain: 'A past-participle verb after "has at least", with internal change and suffix: heightened public awareness.' }
  ]
},
{
  id: 'p3-05', part: '3', title: 'Running on empty',
  text: `Ultramarathons, once the preserve of a few eccentrics, now attract thousands of {1}, many of them with no athletic background. Their {2} is easy to understand: the sheer {3} of crossing a mountain range on foot offers a satisfaction that shorter races cannot match. Yet the sport is not without its {4}. Runners can be on their feet for more than a day, and the strain on the body is almost {5}. Medical teams at the finish line report a steady stream of cases of severe {6}, and doctors warn that a {7} to ignore pain is not a virtue. Organisers insist that safety is their priority, though they accept that no regulation can ever fully {8} the dangers of the wilderness.`,
  questions: [
    { stem: 'PARTICIPATE', answer: ['participants'], explain: 'A plural noun for people after "thousands of": the people who take part are participants.' },
    { stem: 'POPULAR', answer: ['popularity'], explain: 'A noun after "Their": the sport\'s popularity is easy to understand.' },
    { stem: 'ACHIEVE', answer: ['achievement'], explain: 'An uncountable noun after "the sheer" and before "of crossing": the achievement of crossing a mountain range.' },
    { stem: 'CRITIC', answer: ['critics', 'criticisms', 'criticism'], explain: 'A plural noun after "its": "not without its critics" means the sport has people who oppose it.' },
    { stem: 'IMAGINE', answer: ['unimaginable'], explain: 'An adjective after "almost", and negative: the strain is almost beyond what can be imagined.' },
    { stem: 'HYDRATE', answer: ['dehydration'], explain: 'A noun after "severe", with the prefix de- and a different ending: cases of severe dehydration.' },
    { stem: 'WILLING', answer: ['willingness'], explain: 'A noun after "a": a willingness to ignore pain. The negative form would reverse the sense, since doctors say ignoring pain is not a virtue.' },
    { stem: 'MINIMUM', answer: ['minimise', 'minimize'], explain: 'A verb after "can ever fully", formed with -ise: no regulation can fully minimise the dangers.' }
  ]
},
{
  id: 'p3-06', part: '3', title: 'The outsourced mind',
  text: `Few of us can recall a telephone number any more, and some psychologists see this as evidence of a {1} decline in our powers of recollection. Others are less {2}. They argue that we have always relied on external aids, from knotted string to printed diaries, and that the human mind is remarkably {3} when it comes to deciding what is worth storing. The real {4} of the smartphone, they suggest, lies elsewhere. Because every fact is instantly available, we are less inclined to {5} information, and therefore less likely to understand it deeply. In one experiment, volunteers who expected to find the answers online later proved {6} to recall them. Critics object that the sample was too small to be {7}, yet most agree that the habit of constantly checking our devices does little to {8} concentration.`,
  questions: [
    { stem: 'MARK', answer: ['marked'], explain: 'An adjective before "decline": a marked decline means a noticeable one.' },
    { stem: 'ALARM', answer: ['alarmed', 'alarmist'], explain: 'A participial adjective after "less": others are less alarmed by the trend.' },
    { stem: 'SELECT', answer: ['selective'], explain: 'An adjective after "remarkably": the mind is selective about what it stores.' },
    { stem: 'SIGNIFY', answer: ['significance'], explain: 'A noun after "The real": the real significance of the smartphone lies elsewhere.' },
    { stem: 'MEMORY', answer: ['memorise', 'memorize'], explain: 'A verb after "inclined to": less inclined to memorise information.' },
    { stem: 'ABLE', answer: ['unable'], explain: 'The negative adjective: volunteers who relied on the internet proved unable to recall the answers.' },
    { stem: 'CONCLUDE', answer: ['conclusive'], explain: 'An adjective after "to be": the sample was too small to be conclusive.' },
    { stem: 'COURAGE', answer: ['encourage'], explain: 'A verb after "little to", with the prefix en-: does little to encourage concentration.' }
  ]
},
{
  id: 'p3-07', part: '3', title: 'The price of a shirt',
  text: `The average garment in a Western wardrobe is worn only a handful of times before being thrown away, and the {1} of cheap clothing has only accelerated the habit. Clothing has become so {2} that many shoppers treat it as disposable, a habit that carries a heavy {3} cost. Producing a single cotton shirt can require thousands of litres of water, and much of the dye used ends up in rivers, to the {4} of local communities. Campaigners warn that the industry's growth is {5}, but they acknowledge that consumers cannot be expected to carry the whole burden. Several brands have introduced schemes to recycle old garments, though critics regard these as {6} gestures rather than genuine reform. Real change, they say, will come only with stricter {7} of the industry, and a genuine {8} to put durability before profit.`,
  questions: [
    { stem: 'AVAILABLE', answer: ['availability'], explain: 'A noun after "the": the availability of cheap clothing.' },
    { stem: 'AFFORD', answer: ['affordable'], explain: 'An adjective after "so": clothing has become so affordable that shoppers treat it as disposable.' },
    { stem: 'ENVIRONMENT', answer: ['environmental'], explain: 'An adjective before "cost": a heavy environmental cost.' },
    { stem: 'ADVANTAGE', answer: ['disadvantage'], explain: 'The fixed phrase "to the disadvantage of": the dye harms local communities.' },
    { stem: 'SUSTAIN', answer: ['unsustainable'], explain: 'Campaigners "warn", so the negative adjective is needed: growth that is unsustainable.' },
    { stem: 'SYMBOL', answer: ['symbolic', 'token'], explain: 'An adjective before "gestures": critics see the recycling schemes as symbolic, not real reform.' },
    { stem: 'REGULATE', answer: ['regulation', 'regulations'], explain: 'A noun after "stricter" and before "of the industry".' },
    { stem: 'COMMIT', answer: ['commitment'], explain: 'A noun after "genuine", followed by "to": a genuine commitment to put durability before profit.' }
  ]
},
{
  id: 'p3-08', part: '3', title: 'Drawing the world',
  text: `Maps have never been neutral. Every one reflects the {1} of its maker, who must decide what to include and what to leave out. The mapmakers of the Middle Ages, for instance, placed Jerusalem at the centre of the world, a {2} that tells us more about their beliefs than about geography. Even today, the way we {3} the globe onto a page distorts the relative size of continents, making Africa appear {4} smaller than it truly is. Digital maps promise {5} accuracy, yet they too are shaped by commercial interests, and a restaurant that pays for {6} will appear more prominently than a better one. Some cartographers therefore insist that users should treat every map with a degree of {7}. Only then, they say, can we hope to {8} the assumptions that are quietly built into what we see.`,
  questions: [
    { stem: 'PRIORITY', answer: ['priorities'], explain: 'A plural noun after "the" and before "of its maker".' },
    { stem: 'CHOOSE', answer: ['choice'], explain: 'A noun after "a", with internal change: placing Jerusalem at the centre was a choice that reveals beliefs.' },
    { stem: 'FLAT', answer: ['flatten'], explain: 'A verb after "we", with the suffix -en: the way we flatten the globe onto a page.' },
    { stem: 'PROPORTION', answer: ['disproportionately', 'disproportionally'], explain: 'An adverb before "smaller", with a negative prefix: Africa appears disproportionately smaller than it truly is.' },
    { stem: 'PRECEDENT', answer: ['unprecedented'], explain: 'An adjective before "accuracy", negative: promised accuracy never seen before.' },
    { stem: 'PROMOTE', answer: ['promotion', 'promotions'], explain: 'An uncountable noun after "pays for": a restaurant that pays for promotion appears more prominently.' },
    { stem: 'SCEPTIC', answer: ['scepticism', 'skepticism'], explain: 'A noun after "a degree of": treat every map with a degree of scepticism.' },
    { stem: 'COVER', answer: ['uncover'], explain: 'A verb after "hope to", with the prefix un-: uncover the assumptions built into what we see.' }
  ]
}
);
