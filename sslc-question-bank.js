/* NIRVO-authored Kerala SSLC-style practice bank.
   Original revision questions inspired by broad school-level topic areas.
   These are not official previous-year papers or a claim of chapter-by-chapter SCERT verification. */
(() => {
 const sets = {
  Mathematics: [
   ['The first term of an arithmetic sequence is 5 and its common difference is 3. What is the 10th term?',['29','30','32','35'],2,'Use aₙ = a + (n − 1)d = 5 + 9 × 3 = 32.'],
   ['Find the sum of the first 10 terms of 2, 5, 8, 11, …',['145','150','155','160'],2,'Sₙ = n/2 [2a + (n − 1)d] = 10/2 [4 + 27] = 155.'],
   ['Which equation has roots 2 and 5?',['x² + 7x + 10 = 0','x² − 7x + 10 = 0','x² − 10x + 7 = 0','x² + 3x − 10 = 0'],1,'The sum of roots is 7 and product is 10, so x² − 7x + 10 = 0.'],
   ['The roots of x² − 9 = 0 are:',['0 and 9','3 and 3','−3 and 3','−9 and 1'],2,'x² = 9 gives x = ±3.'],
   ['What is the midpoint of A(2, 4) and B(6, 8)?',['(4, 6)','(8, 12)','(2, 2)','(3, 4)'],0,'Midpoint = ((2+6)/2, (4+8)/2) = (4, 6).'],
   ['A tangent touches a circle at P. The angle between OP and the tangent at P is:',['45°','60°','90°','180°'],2,'The radius drawn to the point of contact is perpendicular to the tangent.'],
   ['An angle at the centre standing on an arc is 100°. The angle at the circumference standing on the same arc is:',['25°','50°','100°','200°'],1,'The angle at the centre is twice the angle at the circumference on the same arc.'],
   ['In a right triangle, the side opposite θ is 3 cm and the hypotenuse is 5 cm. Find sin θ.',['3/5','4/5','5/3','3/4'],0,'sin θ = opposite / hypotenuse = 3/5.'],
   ['A bag has 3 red and 2 blue balls. One ball is chosen at random. What is the probability of choosing blue?',['1/5','2/5','3/5','2/3'],1,'There are 2 favourable outcomes out of 5 equally likely outcomes: 2/5.'],
   ['If the common difference of an arithmetic sequence is −4, each new term is:',['4 more than the previous term','4 less than the previous term','twice the previous term','the same as the previous term'],1,'A negative common difference means subtract 4 to obtain the next term.'],
   ['The distance between (0, 0) and (3, 4) is:',['3 units','4 units','5 units','7 units'],2,'Distance = √(3² + 4²) = √25 = 5 units.'],
   ['If the angles of a cyclic quadrilateral are A and C opposite each other, then:',['A + C = 90°','A + C = 180°','A = C always','A + C = 360°'],1,'Opposite angles of a cyclic quadrilateral are supplementary.']
  ],
  Physics: [
   ['A current of 2 A flows through a 5 Ω resistor. What is the potential difference?',['2.5 V','7 V','10 V','20 V'],2,'Ohm’s law: V = IR = 2 × 5 = 10 V.'],
   ['Two resistors of 2 Ω and 3 Ω are connected in series. Their equivalent resistance is:',['1 Ω','1.2 Ω','5 Ω','6 Ω'],2,'In series, resistances add: 2 + 3 = 5 Ω.'],
   ['An appliance uses 600 J of energy in 3 seconds. Its power is:',['100 W','200 W','300 W','1800 W'],1,'Power = energy / time = 600 / 3 = 200 W.'],
   ['Which change increases the heat produced in a resistor when current flows for the same time?',['Decrease current','Increase current','Remove the resistor','Use zero resistance'],1,'Joule heating is proportional to I² for a fixed resistance and time.'],
   ['The magnetic field lines around a straight current-carrying conductor are:',['Straight and parallel','Concentric circles','Radial lines','Random curves'],1,'The magnetic field forms concentric circles around a straight conductor.'],
   ['Which device converts electrical energy into mechanical energy?',['Electric motor','Generator','Transformer','Fuse'],0,'An electric motor uses the magnetic effect of current to produce motion.'],
   ['Electromagnetic induction occurs when:',['A conductor is heated','Magnetic flux linked with a circuit changes','A resistor is cooled','A battery is disconnected from every circuit'],1,'A changing magnetic flux can induce an emf in a circuit.'],
   ['A convex lens is also called a:',['Diverging lens','Converging lens','Plane lens','Cylindrical mirror'],1,'A convex lens converges parallel rays of light.'],
   ['When light travels from air into glass, it generally:',['Speeds up and bends away from the normal','Slows down and bends towards the normal','Stops','Keeps the same speed in all materials'],1,'Glass has a higher refractive index than air, so light slows and bends towards the normal.'],
   ['The splitting of white light into its component colours is called:',['Reflection','Dispersion','Diffusion','Conduction'],1,'Dispersion occurs because different colours refract by different amounts.'],
   ['Which colour of visible light has the longest wavelength?',['Violet','Blue','Green','Red'],3,'Red light has the longest wavelength in the visible spectrum.'],
   ['Which is a renewable source of energy?',['Coal','Petroleum','Wind','Natural gas'],2,'Wind is naturally replenished and is a renewable energy source.']
  ],
  Chemistry: [
   ['What is the chemical symbol for sodium?',['S','So','Na','N'],2,'Sodium is represented by Na, from its Latin name natrium.'],
   ['A solution with pH 3 is generally:',['Acidic','Neutral','Basic','A metal'],0,'A pH below 7 indicates an acidic solution.'],
   ['Which gas is commonly released when an acid reacts with a reactive metal?',['Oxygen','Hydrogen','Nitrogen','Helium'],1,'A typical acid–metal reaction produces a salt and hydrogen gas.'],
   ['How many covalent bonds can a carbon atom usually form?',['One','Two','Three','Four'],3,'Carbon has valency four and commonly forms four covalent bonds.'],
   ['A covalent bond is formed mainly by:',['Transfer of protons','Sharing of electron pairs','Sharing of neutrons','Transfer of nuclei'],1,'Covalent bonding involves sharing electron pairs between atoms.'],
   ['What are the main products of the electrolysis of water?',['Hydrogen and oxygen','Carbon and oxygen','Nitrogen and hydrogen','Chlorine and hydrogen'],0,'Water decomposes into hydrogen and oxygen during electrolysis.'],
   ['Oxidation can be described as:',['Gain of electrons','Loss of electrons','Gain of neutrons','Loss of protons from the nucleus'],1,'In electron-transfer terms, oxidation is loss of electrons.'],
   ['In the modern periodic table, elements in the same group generally have the same number of:',['Occupied shells','Valence electrons for main-group elements','Neutrons','Isotopes'],1,'Main-group elements in a group have the same number of valence electrons.'],
   ['Which gas turns limewater milky?',['Oxygen','Hydrogen','Carbon dioxide','Nitrogen'],2,'Carbon dioxide reacts with limewater to form insoluble calcium carbonate.'],
   ['A neutralisation reaction between an acid and a base generally forms:',['Salt and water','Metal and oxygen','Only hydrogen','Carbon and water'],0,'Acid–base neutralisation generally produces salt and water.'],
   ['Which particle determines the atomic number of an element?',['Neutron','Proton','Electron shell','Molecule'],1,'The atomic number equals the number of protons in the nucleus.'],
   ['Which of these is a mixture?',['Pure oxygen','Distilled water','Air','Pure copper'],2,'Air contains several gases mixed together.']
  ],
  Biology: [
   ['Which cell organelle contains most genetic material in a typical plant or animal cell?',['Ribosome','Nucleus','Cell wall','Vacuole'],1,'The nucleus contains most of a eukaryotic cell’s DNA.'],
   ['What is the functional unit of the kidney?',['Neuron','Nephron','Alveolus','Villus'],1,'Each nephron filters blood and helps form urine.'],
   ['Which organ produces insulin?',['Liver','Pancreas','Kidney','Lung'],1,'The pancreas produces insulin in its beta cells.'],
   ['Where does photosynthesis mainly occur in plant cells?',['Mitochondria','Chloroplasts','Nucleus','Ribosomes'],1,'Chloroplasts contain chlorophyll and are the main site of photosynthesis.'],
   ['Where does gas exchange take place in human lungs?',['Trachea','Alveoli','Diaphragm','Larynx'],1,'Thin-walled alveoli provide a large surface for oxygen and carbon dioxide exchange.'],
   ['Which plant tissue transports water and minerals from roots?',['Phloem','Xylem','Epidermis','Cortex only'],1,'Xylem transports water and dissolved minerals from the roots.'],
   ['Meiosis usually produces cells with:',['The same chromosome number as the parent cell','Half the chromosome number','Twice the chromosome number','No chromosomes'],1,'Meiosis reduces the chromosome number by half to form haploid cells.'],
   ['Antibiotics are primarily used to treat infections caused by:',['Bacteria','Viruses','Allergies','Vitamin deficiency'],0,'Antibiotics act against bacteria; they do not treat viral infections.'],
   ['Which part of the nervous system is central to many simple reflex actions?',['Spinal cord','Stomach','Pancreas','Liver'],0,'Many reflex arcs are coordinated through the spinal cord for a rapid response.'],
   ['Biodiversity refers to the variety of:',['Only rocks','Living organisms','Only weather patterns','Only minerals'],1,'Biodiversity includes variation among living organisms and ecosystems.'],
   ['Which blood component helps in clotting?',['Red blood cells','Platelets','Plasma water only','White blood cells only'],1,'Platelets help form clots that reduce blood loss.'],
   ['Which process releases energy from glucose in cells?',['Respiration','Transpiration','Pollination','Osmosis'],0,'Cellular respiration releases usable energy from glucose.']
  ],
  English: [
   ['Choose the correctly spelled word.',['Enviroment','Environment','Envirnoment','Environmant'],1,'Environment is spelled e-n-v-i-r-o-n-m-e-n-t.'],
   ['Choose the simple past tense of “go”.',['Goed','Gone','Went','Going'],2,'“Went” is the simple past form of “go”.'],
   ['Which word is an adjective in “The bright moon shone”?',['Moon','Shone','Bright','The'],2,'“Bright” describes the noun “moon”.'],
   ['Choose a synonym for “rapid”.',['Slow','Quick','Quiet','Weak'],1,'“Rapid” means fast or quick.'],
   ['Which punctuation mark normally ends a direct question?',['Full stop','Comma','Question mark','Colon'],2,'A direct question normally ends with a question mark.'],
   ['Choose the correct passive form of “The boy kicked the ball.”',['The ball kicked the boy.','The ball was kicked by the boy.','The boy was kicked by the ball.','The ball is kicking the boy.'],1,'The simple past active sentence changes to “The ball was kicked by the boy.”'],
   ['Choose the correct reported speech: He said, “I am tired.”',['He said that I am tired.','He said that he was tired.','He says that he tired.','He said he is tiring.'],1,'In reported speech, “I am” changes to “he was” in this context.'],
   ['Choose the correct article: She is ___ honest student.',['a','an','the','no article'],1,'“Honest” begins with a vowel sound, so “an” is used.'],
   ['Choose the correct question tag: “You are ready, ___?”',['are you','do you','aren’t you','isn’t it'],2,'A positive statement with “are” takes the negative tag “aren’t you?”.'],
   ['Choose the correct preposition: The book is ___ the table.',['at','on','between','through'],1,'“On” describes the book’s position on the surface of the table.'],
   ['Choose the correct conjunction: I was tired, ___ I finished my work.',['but','because','unless','although'],0,'“But” joins two contrasting ideas in this sentence.'],
   ['Which sentence is in the present perfect tense?',['She writes a letter.','She wrote a letter.','She has written a letter.','She will write a letter.'],2,'“Has written” is the present perfect form.']
  ],
  'Social Science': [
   ['Which organ of government interprets laws?',['Executive','Legislature','Judiciary','Election Commission'],2,'The judiciary interprets laws and applies them in legal cases.'],
   ['What does a map scale help you calculate?',['Direction only','Distance on the ground','Population only','Rainfall only'],1,'A map scale relates distance on the map to actual ground distance.'],
   ['What is the main purpose of an election in a democracy?',['Choose representatives','Write court judgments','Measure rainfall','Prepare a census'],0,'Elections allow eligible citizens to choose their representatives.'],
   ['Which of these is a renewable energy resource?',['Coal','Petroleum','Solar energy','Natural gas'],2,'Solar energy is renewable because sunlight is naturally replenished.'],
   ['What is the main role of a constitution?',['Set the framework and principles of government','Predict daily weather','Set every shop price','Measure land area'],0,'A constitution establishes the structure, powers and guiding principles of government.'],
   ['Which latitude is known as the Equator?',['0°','23½° N','66½° S','90° N'],0,'The Equator is the line of latitude at 0 degrees.'],
   ['The Standard Meridian of India is approximately:',['68°7′ E','82°30′ E','90° E','97°25′ E'],1,'India uses 82°30′ east longitude as its Standard Meridian.'],
   ['The Non-Cooperation Movement in India was launched in:',['1905','1915','1920','1942'],2,'Mahatma Gandhi launched the Non-Cooperation Movement in 1920.'],
   ['GDP is commonly used to measure:',['The value of final goods and services produced within a country','Only the number of citizens','Only government tax rates','The area of farmland'],0,'GDP measures the value of final goods and services produced within a country over a period.'],
   ['Which amendment gave constitutional status to Panchayati Raj institutions in India?',['42nd','44th','73rd','86th'],2,'The 73rd Constitutional Amendment strengthened rural local self-government.'],
   ['Which winds bring much of India’s seasonal rainfall?',['Trade winds only','Southwest monsoon winds','Polar easterlies','Local land breezes only'],1,'The southwest monsoon brings a major share of India’s annual rainfall.'],
   ['A resource that can be replaced naturally within a relatively short period is called:',['Non-renewable','Renewable','Exhaustible only','Artificial'],1,'Renewable resources are replenished naturally on a human timescale.']
  ],
  Malayalam: [
   ['“പൂവ്” എന്ന വാക്കിന്റെ ബഹുവചനം ഏത്?',['പൂവുകൾ','പൂവിന്','പൂവിൽ','പൂവാൽ'],0,'“പൂവ്” എന്നതിന്റെ ബഹുവചന രൂപമാണ് “പൂവുകൾ”.'],
   ['“വെളിച്ചം” എന്നതിന്റെ വിപരീതപദം ഏത്?',['പ്രകാശം','ഇരുട്ട്','നിലാവ്','കിരണം'],1,'“വെളിച്ചം” എന്നതിന്റെ വിപരീതപദമാണ് “ഇരുട്ട്”.'],
   ['“അവൻ പുസ്തകം വായിച്ചു” എന്ന വാക്യത്തിലെ ക്രിയ ഏത്?',['അവൻ','പുസ്തകം','വായിച്ചു','വാക്യം'],2,'പ്രവർത്തി സൂചിപ്പിക്കുന്ന പദമാണ് “വായിച്ചു”.'],
   ['“മരം” എന്നതിന്റെ ബഹുവചനം ഏത്?',['മരത്തിൽ','മരങ്ങൾ','മരത്തിന്','മരമായി'],1,'“മരം” എന്നതിന്റെ ബഹുവചന രൂപമാണ് “മരങ്ങൾ”.'],
   ['“നല്ല കുട്ടി” എന്നതിൽ വിശേഷണം ഏത്?',['നല്ല','കുട്ടി','എന്നത്','ഇതിൽ'],0,'“നല്ല” എന്ന പദം കുട്ടിയെ വിശേഷിപ്പിക്കുന്നു.'],
   ['“ജലം” എന്ന പദത്തിന്റെ പര്യായപദം ഏത്?',['അഗ്നി','വെള്ളം','കാറ്റ്','മണ്ണ്'],1,'“വെള്ളം” എന്നത് “ജലം” എന്ന പദത്തിന്റെ പര്യായമാണ്.'],
   ['“അവൾ പാടുന്നു” എന്ന വാക്യത്തിലെ സർവനാമം ഏത്?',['അവൾ','പാടുന്നു','വാക്യം','ഇല്ല'],0,'“അവൾ” എന്നത് വ്യക്തിയെ സൂചിപ്പിക്കുന്ന സർവനാമമാണ്.'],
   ['“സന്തോഷം” എന്നതിന്റെ വിപരീതപദം ഏത്?',['ആനന്ദം','ദുഃഖം','ഉല്ലാസം','പ്രസന്നത'],1,'“ദുഃഖം” എന്നത് “സന്തോഷം” എന്നതിന്റെ വിപരീതപദമാണ്.'],
   ['“മനോഹരമായ പൂവ്” എന്ന പ്രയോഗത്തിലെ വിശേഷണം ഏത്?',['പൂവ്','മനോഹരമായ','എന്ന','ആണ്'],1,'“മനോഹരമായ” എന്ന പദം പൂവിന്റെ ഗുണം വ്യക്തമാക്കുന്നു.'],
   ['ചോദ്യവാക്യത്തിന്റെ അവസാനം സാധാരണ ഉപയോഗിക്കുന്ന ചിഹ്നം ഏത്?',['കോമ','ചോദ്യചിഹ്നം','അർദ്ധവിരാമം','ഉദ്ധരണി'],1,'ചോദ്യവാക്യത്തിന്റെ അവസാനം ചോദ്യചിഹ്നം ഉപയോഗിക്കുന്നു.'],
   ['“കുട്ടികൾ കളിക്കുന്നു” എന്ന വാക്യത്തിലെ ക്രിയ ഏത്?',['കുട്ടികൾ','കളിക്കുന്നു','എന്ന','വാക്യം'],1,'പ്രവർത്തി സൂചിപ്പിക്കുന്ന പദമാണ് “കളിക്കുന്നു”.'],
   ['“വലിയ” എന്ന പദത്തിന്റെ വിപരീതപദം ഏത്?',['ചെറിയ','ഉയർന്ന','നീളമുള്ള','വിസ്തൃതമായ'],0,'“ചെറിയ” എന്നത് “വലിയ” എന്നതിന്റെ വിപരീതപദമാണ്.']
  ],
  Hindi: [
   ['“दिन” का विलोम शब्द क्या है?',['सुबह','रात','सूरज','समय'],1,'“दिन” का विलोम “रात” है।'],
   ['“लड़का” का सामान्य बहुवचन क्या है?',['लड़की','लड़के','लड़कों','लड़कियाँ'],1,'“लड़का” का सामान्य बहुवचन “लड़के” है।'],
   ['“सुंदर फूल” में विशेषण कौन सा है?',['सुंदर','फूल','में','कोई नहीं'],0,'“सुंदर” फूल की विशेषता बताता है।'],
   ['“जल” का समानार्थी शब्द कौन सा है?',['आग','पानी','हवा','धरती'],1,'“जल” का अर्थ “पानी” है।'],
   ['प्रश्न के अंत में कौन सा चिह्न लगाया जाता है?',['।',',','?',';'],2,'प्रश्न के अंत में प्रश्नवाचक चिह्न लगाया जाता है।'],
   ['“मैं स्कूल गया।” वाक्य में क्रिया कौन सी है?',['मैं','स्कूल','गया','वाक्य'],2,'“गया” इस वाक्य में काम या क्रिया को बताता है।'],
   ['“किताब” शब्द का लिंग क्या है?',['पुल्लिंग','स्त्रीलिंग','नपुंसकलिंग','इनमें से कोई नहीं'],1,'“किताब” हिंदी में स्त्रीलिंग संज्ञा है।'],
   ['“वह खेलता है।” वाक्य में सर्वनाम कौन सा है?',['वह','खेलता','है','कोई नहीं'],0,'“वह” किसी व्यक्ति के स्थान पर प्रयुक्त सर्वनाम है।'],
   ['“विद्यालय” का अर्थ क्या है?',['अस्पताल','स्कूल','बाज़ार','घर'],1,'“विद्यालय” का अर्थ स्कूल है।'],
   ['“तेज़” का विलोम शब्द कौन सा है?',['शीघ्र','धीमा','जल्दी','फुर्तीला'],1,'“धीमा” “तेज़” का विलोम है।'],
   ['“बच्चा” का बहुवचन क्या है?',['बच्ची','बच्चे','बच्चों','बच्चियाँ'],1,'“बच्चा” का सामान्य बहुवचन “बच्चे” है।'],
   ['“राम और श्याम” में “और” कौन सा शब्द है?',['संज्ञा','सर्वनाम','समुच्चयबोधक','विशेषण'],2,'“और” दो शब्दों को जोड़ने वाला समुच्चयबोधक है।']
  ]
 };
 const original = window.offlineQuiz;
 const canonical = subject => {
   if (subject === 'Malayalam I' || subject === 'Malayalam II') return 'Malayalam';
   if (subject === 'Social Science I' || subject === 'Social Science II' || subject === 'Social Science') return 'Social Science';
   return subject;
 };
 window.offlineQuiz = function(subject) {
   const key = canonical(String(subject || '').trim());
   if (sets[key]) return sets[key].map(([question, options, answer, explanation]) => ({
     question, options:[...options], answer,
     explanation: explanation + ' (NIRVO original practice; check the topic against your current SCERT textbook.)'
   }));
   if (typeof original === 'function') {
     const fallback = original(subject);
     return Array.isArray(fallback) ? fallback : [];
   }
   return [];
 };
})();