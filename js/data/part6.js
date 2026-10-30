/* Part 6 – Gapped text. Gaps sit on their own line as {n}; `paragraphs` holds A–H (one is an extra); `answer` is a letter. */
(window.TESTS = window.TESTS || []).push(
{
  id: 'p6-01', part: '6', title: 'The salt road',
  subtitle: 'Following the camel caravans across one of the hottest places on Earth',
  intro: 'Read the extract from a magazine article.',
  text: `We set out at three in the morning, because Ahmed liked to reach the salt before the sun did. The caravan leader had counted his camels twice by torchlight, and the thirty animals shuffled and groaned in the dark like furniture being moved in an empty house. I had come to the Danakil Depression, in the north of Ethiopia's Afar region, to follow the salt trade, which has run along these tracks for centuries. Before I left the capital, three separate people had warned me that I would hate every minute of it.

{1}

By seven we had reached the salt flats themselves, where the first cutters were already at work. The ground there is a startling mosaic of white, rust and sulphur yellow. The cutters squatted in pairs on the crust, one scoring the surface with an axe, the other levering up slabs the size of paving stones, and not one of them so much as glanced up as we passed.

{2}

His present herd is almost as unruly, and loading it is an exercise in patience. Each slab is wrapped in palm matting and balanced against its twin, since a lopsided load will rub a camel raw within a day. Ahmed's men can prepare an animal in a few minutes, whereas my own attempt to help produced a heap of slabs and a look of weary tolerance from the camel.

{3}

Ahmed, of course, had noticed, but he said nothing until early afternoon, when he handed me a strip of cloth and showed me how to wind it across my face. It smelled of woodsmoke and old sweat, and I was in no position to object. "The camels suffer too," he said, "and they do not complain half as much as you." It was the closest he came to a joke all week.

{4}

That first night, though, sleep was hard to come by. The ground gave back the day's heat for hours, and somewhere beyond the circle of firelight a pair of hyenas kept up a rasping conversation. I lay listening to the animals shift and sigh beside me. When Ahmed finally shook my shoulder, it felt as though I had closed my eyes a moment before.

{5}

Their instinct was sound. The escarpment, when we reached its foot, rose in a series of rocky steps, and the track, worn smooth by centuries of hooves, was barely wide enough for a loaded animal. Twice a camel balked at a ledge and had to be coaxed forward and once a slab slipped and shattered on the rocks below. Ahmed walked at the head of the line and I at the back, and for hours I could see nothing but the swaying slabs ahead of me.

{6}

Ahmed, by contrast, looked like a man who had come home. All around him traders were calling out greetings by name, and boys darted between the animals with glasses of tea. In the market yard he unloaded the first slab with the air of someone who has reached the one place where his labour is properly valued, and within the hour a trader had counted a small pile of notes into his palm. The price, I later calculated, was less than I had paid for lunch in the capital.

{7}

"It is not about the money," he said at last. I had been braced for talk of wages, and the plainness of his answer silenced me. "It is about the road." It had been his father's, he explained, and his grandfather's, and a man who stops walking it ceases to belong to something larger than himself. Then he went to check the camels, because there were still thirty of them to water.`,
  paragraphs: [
    { label: 'A', text: 'Strangers are not unusual on the flats, but the work allows no pause, and the cutters are paid by the slab rather than by the hour. Ahmed explained this without a trace of sympathy. He had cut salt himself as a boy, he told me, saving for years until he could afford a camel of his own: a cantankerous grey male that died long ago, but of which he still speaks with something close to affection.' },
    { label: 'B', text: 'The next five days followed the same pattern, and with each one the landscape grew a little less hostile. The flats gave way to crumbling lava fields and then, abruptly, to the first thorn bushes I had seen since leaving the road. Even Ahmed, who rarely commented on anything, hummed under his breath. The camels quickened their pace, as though they could already smell the highlands.' },
    { label: 'C', text: 'We halted only when darkness fell, at a cluster of low stone shelters where earlier caravans had left their ashes. Nobody put up a tent. The camels were hobbled and fed on dried grass carried for the purpose, and the men lit a small fire of thorn, ate flatbread and drank sweet tea before lying down in their clothes. I had expected to loathe every moment of the journey, and I was simply too tired to.' },
    { label: 'D', text: 'For the first hour I was almost enjoying myself. The air was cool, a rare luxury in that country, and the stars were so thick overhead that I forgot to watch my feet. I even began to wonder what all the fuss had been about. Then the sun came up over the plain and turned it the colour of a furnace, and the warnings began to make sense.' },
    { label: 'E', text: 'Eight days of walking, thirty animals and a dozen men, all for a sum that would barely have covered a modest hotel bill. I have thought about the sum often since. When I put it to Ahmed over tea that evening, he looked puzzled, as though I had asked him why the sun rises each morning, and for a long time he said nothing at all.' },
    { label: 'F', text: 'On the fourth evening we camped beside a well where two other caravans had already settled for the night. Ahmed spent an hour greeting their leaders in the formal manner of the road, while the camels were watered one by one. I lay on my back, too stiff to move, and counted the days that remained. Four, Ahmed said, if nothing went wrong, and something almost always did.' },
    { label: 'G', text: 'By the time the last camel was roped, the heat had arrived in earnest. It pressed on the head like a hand, and the horizon dissolved into a shimmering haze in which the caravans trudging towards us appeared to float above the ground. I drank constantly, yet never needed to stop, since the water left my body almost as quickly as it entered, and by noon I was doing my best to hide how badly I was suffering.' },
    { label: 'H', text: 'It was late afternoon when we reached the top, and the town announced itself first as a smudge of woodsmoke and then as a roar of lorries and generators. After days of silence, the noise struck me almost as a physical blow, and I stood in the street with my hands over my ears like a child while the camels were led away towards the market yard without so much as a backward glance.' }
  ],
  questions: [
    { answer: 'D', explain: 'The first hour of the walk answers the warnings (the writer begins to doubt "all the fuss"), and the sun coming up leads to "By seven" at the flats. F is the extra: a fourth-evening camp cannot come between the 3 a.m. start and the first morning at the flats.' },
    { answer: 'A', explain: 'It explains why the cutters never looked up and ends with Ahmed\'s own first camel, which "His present herd is almost as unruly" compares with. G cannot go here because the loading ("the last camel was roped") is only described in the next paragraph.' },
    { answer: 'G', explain: 'Loading has been described, so "the last camel was roped" follows it; the heat and the writer hiding how badly he or she is suffering are what Ahmed "had noticed" in the next paragraph, and the cloth is the remedy.' },
    { answer: 'C', explain: 'The first evening halt: "too tired to" loathe the journey is contrasted by "That first night, though, sleep was hard to come by", and the fire of thorn explains "the circle of firelight". F fails because it is the fourth evening and mentions no fire.' },
    { answer: 'B', explain: 'The camels quicken their pace "as though they could already smell the highlands" leads to "Their instinct was sound" and the foot of the escarpment. F would not give the camels an instinct to refer to, and the next paragraph follows the first night.' },
    { answer: 'H', explain: 'The writer is shaken by the town\'s noise, so "Ahmed, by contrast" (at home, calm) works, and the camels are led to the market yard where he unloads in the next paragraph.' },
    { answer: 'E', explain: 'It does the sum on the small price from the previous paragraph ("the sum"); Ahmed\'s long silence leads to his answer, "It is not about the money".' }
  ]
},
{
  id: 'p6-02', part: '6', title: 'Keeper of the hours',
  subtitle: 'In a Shropshire workshop, one of Britain\'s last restorers of church tower clocks refuses to hurry',
  intro: 'Read the extract from a magazine article.',
  text: `On the first floor of a converted dairy in Shropshire, Edith Marlowe is lifting a cast-iron wheel the size of a dinner table out of its crate. It has spent a hundred and forty years in the tower of a village church, and for the last thirty of them it has not turned. Marlowe regards it the way a doctor regards a patient brought in off the street: with sympathy, a certain professional curiosity, and no illusions about how long the treatment will take. Her workshop smells of oil and cold metal, and there is not a single clock in it that agrees with another.

{1}

The mechanism itself was neither rare nor beautiful, but it was honest, and in its worn pinions she read the story of every winter it had survived: a hard frost that had seized the bearings, a sexton who had oiled all the wrong parts, a wartime year when nobody had climbed the tower at all. Within a year she had taken a pay cut to apprentice herself to an elderly restorer in Derbyshire, and her former colleagues assumed she was having a breakdown.

{2}

Clients are not always persuaded, and some say so loudly. A few would happily see every surface polished until it shone like a trumpet, and one parish council, offered a clock restored with all its scars, asked whether she could at least have the dial repainted. "Everyone wants a clock to look as it did the day it was made," she says, "but a clock only looks like that for about a week. After that it starts to acquire a history, and the history is the interesting part."

{3}

Not every client sees the point of reproducing a mistake, and the odd commission has gone elsewhere as a result. She accepts that, pointing out that a reputation is built on the clocks still running in fifty years' time, not on those that look best at the unveiling. "If I have made a clock indistinguishable from a new one," she says, "I have done something wrong." She is not, she insists, against repair, only against erasure.

{4}

That kind of patience is not something a manual can teach, she believes. She has tried to write her methods down more than once, and each attempt has read like a recipe composed by someone who has never tasted food; the feel of a file beginning to bite, or of a pivot running true, resists description. "The knowledge lives in the hands," she says, "and the hands in question are retiring." By her reckoning there are fewer than a dozen full-time restorers of turret clocks left in the country, and most of them are over sixty.

{5}

"I assumed it was a test," he admits. "It was, but not the kind I expected. By the second week I had stopped glancing at the wall clock, which was wrong by eleven minutes anyway. She wanted to see whether I would rush." Marlowe says only that he did not, and returns to her bench.

{6}

Her case is partly practical, since electric movements fail whereas a well-kept mechanical one can run for two centuries and be mended with a file and a steady hand. But it is also, she concedes, a matter of sentiment. Inside the cases she has opened, she points out, earlier clockmakers pencilled their initials and the date, and she adds her own beside them. "People think a clock is just a way of knowing the time," she says. "It is also a way of knowing who kept it going."

{7}

"Anyone can hear a bell," she tells me as I leave. "What I want to know is whether the thing is breathing properly." Then she picks up a file and returns to the teeth of the next wheel. Outside, the lane is quiet, and for a moment I find myself listening for something I cannot quite hear.`,
  paragraphs: [
    { label: 'A', text: 'Persuading the people who pay for the work is harder. Churchwardens faced with a repair bill of several thousand pounds often ask whether the clock could simply be fitted with an electric movement, leaving the old machinery to gather dust. Marlowe has heard the suggestion so often that she tends to answer it before it is made, and her answer never varies.' },
    { label: 'B', text: 'Repair, in practice, means making what cannot be bought. No supplier stocks a replacement for a Victorian escape wheel, so she cuts the teeth by hand on a dividing engine older than her grandmother, checking each against a template. A single slip means starting the whole wheel again, and she has done so more often than she cares to remember. "The job is ninety per cent patience," she says.' },
    { label: 'C', text: 'Walter Pyke, her new teacher, held that nothing in a clock should be replaced until it had been understood. A worn bearing, he insisted, was a record of how the machine had been used, and to throw it away was to burn the evidence. He made her spend six months doing nothing but taking mechanisms apart and putting them back together, and he inspected every one.' },
    { label: 'D', text: 'Pyke, then in his seventies, spoke seldom, charged little and drove a van full of ladders around the Peak District. Marlowe says she learned more from watching his hands than from anything he told her. He could tell from the sound of a mechanism, before he had opened it, which pivot was worn, and would announce the diagnosis while the vicar was still explaining what had gone wrong.' },
    { label: 'E', text: 'In June, if all goes to plan, the wheel will be winched back up the tower stairs and meshed with its neighbours, and a small crowd will gather in the churchyard to hear the first stroke in thirty years. Marlowe will be standing at the back. The chimes, she has told me, hold no interest for her. She will be listening for the tick.' },
    { label: 'F', text: 'Her own route into the trade was an accident. Trained as a mechanical engineer, she spent a decade designing pumps for an oil company, and would probably be doing so still had a neighbour not asked her, on a whim, to look at the stopped clock in the village tower. "I climbed up expecting a few hours\' work," she says. "I came down three days later, quite besotted."' },
    { label: 'G', text: 'She has, however, found a way to pass some of it on. Last autumn she took on Daniel Okafor, a twenty-four-year-old who abandoned a degree in computer science to work with his hands. He began by sweeping floors, and spent his first month cleaning a single gearwheel with a toothbrush.' },
    { label: 'H', text: 'The wheel on her bench has a history of its own. Its teeth, she has found, are worn unevenly, evidence that the clock was once driven by a heavier weight than its makers intended, perhaps to make it audible across a noisy market square. A more conventional restorer would cut away the damaged teeth and fit new ones of the proper profile. Marlowe will not correct the error. She will reproduce it.' }
  ],
  questions: [
    { answer: 'F', explain: 'Her route into the trade ends with the stopped tower clock, which "The mechanism itself" refers to; "a pay cut" and "former colleagues" need the engineering career mentioned here. H also suits the wheel in the opening, but it would give no previous job and no clock for the next paragraph.' },
    { answer: 'C', explain: 'Pyke, the "elderly restorer", and his rule that nothing is replaced until understood are what clients "are not always persuaded" by, and what her remark about a clock acquiring a history develops. D is the extra: it describes Pyke\'s manner but gives no idea for the clients to resist.' },
    { answer: 'H', explain: '"A history of its own" picks up "the history is the interesting part"; reproducing the worn teeth is the "mistake" in the next paragraph that has cost her commissions. E is tempting for the wheel, but it looks forward to the finished job.' },
    { answer: 'B', explain: '"Repair" picks up "against repair" at the end of the previous paragraph; starting again and "ninety per cent patience" lead into "That kind of patience" in the next paragraph.' },
    { answer: 'G', explain: '"However" contrasts with the retiring restorers, and "some of it" is the knowledge in the hands; the toothbrush job is the "test" that "he" (Daniel) describes in the next paragraph.' },
    { answer: 'A', explain: 'Persuading the paying clients leads to the electric movement suggestion, which "Her case" (practical, then sentimental) answers in the next paragraph.' },
    { answer: 'E', explain: 'It looks forward to the wheel returning to the tower and her listening for the tick, which "Anyone can hear a bell" answers; the final reference to "the next wheel" completes the circle.' }
  ]
},
{
  id: 'p6-03', part: '6', title: 'Spring, on the record',
  subtitle: 'A century of ordinary people noting what they saw from the window has turned out to be a precious scientific resource',
  intro: 'Read the extract from a magazine article.',
  text: `In the study of a Norfolk rectory, the Reverend Alfred Thorne kept a ledger bound in green cloth, and in it, between 1902 and 1937, he noted the date on which he first heard a cuckoo each spring. He recorded, too, the first swallow, the first frogspawn and the day the hawthorn came into leaf. He did not regard this as science. It was, he wrote, "merely a way of paying attention", and he would have been astonished to learn that the ledger now sits in a university archive, consulted by researchers on four continents.

{1}

The 1990s brought a change of fortune for the survivors. A handful of ecologists, searching for evidence of how living things were responding to a warming climate, realised that old diaries were precisely what they lacked. Instruments had measured temperature for generations, and weather stations had kept faithful accounts of rainfall and frost, but the timing of natural events had been recorded almost nowhere on a consistent basis. Satellites could show how green a forest looked from space, but not on which morning a particular oak had opened its first leaf.

{2}

By cross-checking entries from neighbouring parishes, researchers found that they could filter out the more eccentric observers, and what remained was a surprisingly coherent picture. Some of the writers turned out to be reliable to within a day or two, year after year, which is a standard that few modern datasets can claim. It was not a tidy picture, but it was the first that scientists could trust.

{3}

What worries scientists more than the shift itself is its unevenness. Nature is not a single clock but a vast arrangement of interlocking ones, each set over many thousands of years to run in step with the rest. If every part of that arrangement were to speed up together, little would be lost. Different species have moved at different speeds, however, and that is where the trouble begins, because most creatures depend on one another's timing.

{4}

Nobody watched the mismatch develop, which is why the old diaries matter. Nothing in a single season would have revealed it, for in any given year the gap is small and easily put down to the vagaries of the weather. A single record tells us little, but thousands, spanning generations, allow scientists to ask when the gap between predator and prey first began to open, and whether it is still widening.

{5}

There is, however, a catch. The volunteers tend to log whatever catches their eye, wherever they happen to be, and a record of the first butterfly in a sunny garden says little about the butterflies of a whole county. Some people look harder in April than in July, others give up after a wet week, and few stop to note what they did not see. Statisticians can correct for some of this bias, but true continuity is difficult to replicate.

{6}

It is a satisfying result, and a humbling one. A man with no instrument but a notebook and an attentive ear has proved more dependable than many of the devices that came after him. There is a lesson in that for anyone who assumes that precision belongs only to machines, and that care, applied patiently enough, counts for rather more than equipment. Thorne himself, one suspects, would have shrugged, and gone back to listening for the next bird.

{7}

Today the entry reads differently. The cuckoo has declined sharply in Britain in recent decades, and in some places it has fallen silent. Thorne's hearing was probably fine; what he could not have known was how common the silence would become.`,
  paragraphs: [
    { label: 'A', text: 'Over the span of a century, spring events such as the first leafing of oak and the arrival of swallows have crept steadily earlier, in some species by well over a week. Thorne\'s own entries show the same drift, though it was far too slow for him to notice from one year to the next.' },
    { label: 'B', text: 'Thorne was a stickler. A cuckoo counted only if he had heard it himself, in daylight, and he once struck out a swallow he had merely glimpsed from the study window because he could not be sure it was not a martin. Few of his fellow diarists were so strict, and he was not much liked for it at the meetings of the local naturalists\' society.' },
    { label: 'C', text: 'The last of his ledgers closes in the spring of 1937, with a note that the cuckoo has not yet been heard. "Perhaps I am growing deaf," he adds. It is the only entry in thirty-five years in which he doubts his own ears, and it is written, characteristically, in the same neat hand as all the rest.' },
    { label: 'D', text: 'Retrieving the diaries proved a labour in itself. Scattered across archives, attics and parish chests, they were handwritten and wildly inconsistent: one writer\'s "first leaf" was another\'s "full leaf", and some entries had clearly been made weeks after the event, from memory. Reconciling them required an army of volunteers to transcribe thousands of pages, and a good deal of statistical ingenuity to make sense of the result.' },
    { label: 'E', text: 'Consider the pied flycatcher, which winters in West Africa and, like many migrants, times its return to Europe by the length of the day, a signal that does not change however warm the continent grows. The caterpillars on which it feeds its chicks, however, hatch in response to temperature, and so emerge earlier each year. By the time the birds arrive, the peak of the feast may already have passed.' },
    { label: 'F', text: 'Thorne\'s ledger is a different matter. Its author walked the same lane every morning for thirty-five years, and noted the same dozen events using the same stern definition of "first". When researchers compared his entries with those of two diarists living within ten miles, they were struck by how closely the three agreed, even though the men had almost certainly never met.' },
    { label: 'G', text: 'He was far from alone. In the decades either side of 1900, thousands of ordinary people kept similar records, among them clergymen, doctors, farmers\' wives and schoolmasters, many encouraged by local naturalists\' societies. Most assumed that their jottings would interest nobody but themselves, and for the better part of a century they were right. The notebooks gathered dust in attics and parish chests, and a good many were thrown away.' },
    { label: 'H', text: 'Citizen scientists are now taking up the task on a vast scale. Smartphone apps invite anyone to log the first butterfly of the year, and in Britain alone volunteers submit many thousands of records annually. Their enthusiasm would be perfectly recognisable to Thorne, although the tools they use might well have puzzled him.' }
  ],
  questions: [
    { answer: 'G', explain: '"He was far from alone" widens the focus from Thorne; the notebooks that were neglected or thrown away are "the survivors" whose fortune changes in the 1990s. B is the extra: it adds to the portrait of Thorne but gives "the survivors" nothing to refer to.' },
    { answer: 'D', explain: 'Ecologists wanting old diaries are followed by the labour of retrieving and reconciling them; the cross-checking and the "coherent picture" that follows are the outcome of that work.' },
    { answer: 'A', explain: 'It describes the "coherent picture" (events creeping earlier), which is the "shift" whose unevenness worries scientists in the next paragraph. F is also about agreement between diaries but does not mention any shift.' },
    { answer: 'E', explain: 'The flycatcher and its caterpillars exemplify species whose timing has diverged; "the mismatch" and "predator and prey" in the next paragraph refer back to it.' },
    { answer: 'H', explain: 'Volunteers recording first events today develop the idea of "thousands of records"; "The volunteers" and the catch about their bias in the next paragraph need them to have been introduced here.' },
    { answer: 'F', explain: 'Continuity is what modern volunteers lack ("true continuity is difficult to replicate"); Thorne\'s ledger has it, and the close agreement of three diarists is "a satisfying result". B also concerns Thorne\'s habits but reports no result.' },
    { answer: 'C', explain: 'The last ledger entry with its doubt about his hearing is "the entry" that "reads differently" today in the light of the cuckoo\'s decline.' }
  ]
}
);
