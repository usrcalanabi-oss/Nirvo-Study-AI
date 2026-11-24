/* NIRVO-authored Kerala SSLC-style practice bank.
   These are original revision questions inspired by common SCERT topic areas,
   not copied from or represented as official previous-year examination papers. */
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
  ]
 };
 const original = window.offlineQuiz;
 window.offlineQuiz = function(subject) {
   if (sets[subject]) return sets[subject].map(([question, options, answer, explanation]) => ({
     question, options:[...options], answer,
     explanation: explanation + ' (NIRVO original SSLC-style practice; verify the topic with your current SCERT textbook.)'
   }));
   return typeof original === 'function' ? original(subject) : [];
 };
})();