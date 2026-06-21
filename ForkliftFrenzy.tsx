// 100-question bank for the Foundry Trivia Challenge.
// Each round randomly draws 10. Answers are indices into `choices`.
// Facts are kept to well-established fundamentals; this is a game, not a spec.

export interface TriviaQuestion {
  id: number;
  cat: string;
  q: string;
  choices: [string, string, string, string];
  answer: number;
}

export const TRIVIA_BANK: TriviaQuestion[] = [
  { id: 1, cat: "Lean", q: 'In DMAIC, what does the "C" stand for?', choices: ["Control", "Calculate", "Categorize", "Confirm"], answer: 0 },
  { id: 2, cat: "Metallurgy", q: "Cast iron is generally defined as an iron-carbon alloy with more than about how much carbon?", choices: ["0.3%", "0.8%", "2%", "6%"], answer: 2 },
  { id: 3, cat: "Metallurgy", q: "In gray iron, graphite is present mainly in what shape?", choices: ["Flakes", "Spheres", "Nodules", "Cubes"], answer: 0 },
  { id: 4, cat: "Metallurgy", q: "In ductile (nodular) iron, graphite forms mostly as?", choices: ["Flakes", "Spheroids", "Plates", "Needles"], answer: 1 },
  { id: 5, cat: "Metallurgy", q: "Which element is added to molten iron to produce ductile iron?", choices: ["Magnesium", "Lead", "Tin", "Zinc"], answer: 0 },
  { id: 6, cat: "Defects", q: "Which dissolved gas is a primary cause of pinhole/gas porosity in molten iron?", choices: ["Hydrogen", "Helium", "Argon", "Neon"], answer: 0 },
  { id: 7, cat: "Process", q: "The vertical channel into which metal is first poured is called the?", choices: ["Riser", "Sprue", "Vent", "Core"], answer: 1 },
  { id: 8, cat: "Process", q: "What is the main purpose of a riser (feeder)?", choices: ["Trap slag", "Feed metal to offset shrinkage", "Vent gas", "Color the metal"], answer: 1 },
  { id: 9, cat: "Defects", q: "A misrun is usually caused by?", choices: ["Too much carbon", "Insufficient pouring temperature or fluidity", "Excess risering", "Over-venting"], answer: 1 },
  { id: 10, cat: "Defects", q: "A cold shut forms when?", choices: ["Two metal streams meet but fail to fuse", "Sand is too dry", "Metal cools too slowly", "The riser is too large"], answer: 0 },
  { id: 11, cat: "Sand", q: "Green sand is bonded primarily with?", choices: ["Epoxy", "Clay (bentonite) and water", "Sodium silicate", "Phenolic resin"], answer: 1 },
  { id: 12, cat: "Process", q: "The cold box core process typically cures resin-coated sand using a?", choices: ["Heated die", "Gaseous amine catalyst", "UV lamp", "Microwave"], answer: 1 },
  { id: 13, cat: "Lean", q: 'The 5S step "Seiketsu" translates to which English S?', choices: ["Sort", "Standardize", "Shine", "Sustain"], answer: 1 },
  { id: 14, cat: "Lean", q: 'The fifth S, "Shitsuke," is rendered in English as?', choices: ["Set in order", "Sustain", "Sort", "Shine"], answer: 1 },
  { id: 15, cat: "Quality", q: "Cpk is a measure of?", choices: ["Cost per unit", "Process capability", "Cycle time", "Customer priority"], answer: 1 },
  { id: 16, cat: "Quality", q: "A Cpk of 1.33 corresponds to approximately how many sigma?", choices: ["2 sigma", "3 sigma", "4 sigma", "6 sigma"], answer: 2 },
  { id: 17, cat: "Quality", q: "A Six Sigma process targets about how many defects per million opportunities?", choices: ["3.4", "34", "340", "6,000"], answer: 0 },
  { id: 18, cat: "Lean", q: "The Pareto principle is commonly expressed as which ratio?", choices: ["50/50", "60/40", "80/20", "90/10"], answer: 2 },
  { id: 19, cat: "Quality", q: "FMEA stands for?", choices: ["Failure Mode and Effects Analysis", "Final Manufacturing Evaluation Audit", "Functional Machine Error Assessment", "Factory Material Efficiency Analysis"], answer: 0 },
  { id: 20, cat: "Quality", q: "In FMEA, RPN equals Severity × Occurrence × ?", choices: ["Detection", "Cost", "Time", "Frequency"], answer: 0 },
  { id: 21, cat: "Metallurgy", q: "Approximately what is the melting point of pure iron?", choices: ["660°C", "1,085°C", "1,538°C", "2,200°C"], answer: 2 },
  { id: 22, cat: "Metallurgy", q: "Carbon equivalent (CE) for cast iron is commonly approximated as %C + (%Si + %P) ÷ ?", choices: ["2", "3", "4", "5"], answer: 1 },
  { id: 23, cat: "Process", q: "Chvorinov's rule states solidification time is proportional to (volume ÷ surface area) raised to what power?", choices: ["1", "2", "3", "0.5"], answer: 1 },
  { id: 24, cat: "Process", q: "Inoculation of gray iron is done mainly to?", choices: ["Increase sulfur", "Promote graphite nucleation and reduce chill", "Add magnesium", "Cool the melt faster"], answer: 1 },
  { id: 25, cat: "Molding", q: "The top half of a two-part sand mold is called the?", choices: ["Drag", "Cope", "Flask", "Core"], answer: 1 },
  { id: 26, cat: "Molding", q: "The bottom half of a two-part mold is the?", choices: ["Cope", "Drag", "Riser", "Gate"], answer: 1 },
  { id: 27, cat: "Molding", q: "The surface where cope and drag meet is the?", choices: ["Parting line", "Ingate", "Vent", "Fillet"], answer: 0 },
  { id: 28, cat: "Molding", q: "A draft angle on a pattern is provided to?", choices: ["Add strength", "Allow the pattern to be withdrawn from the mold", "Trap gas", "Increase weight"], answer: 1 },
  { id: 29, cat: "Molding", q: "Shrinkage allowance on a pattern compensates for?", choices: ["Sand expansion", "Metal contraction as it cools", "Machining", "Painting"], answer: 1 },
  { id: 30, cat: "Process", q: "A core print serves to?", choices: ["Color the core", "Locate and support the core in the mold", "Vent the riser", "Cool the metal"], answer: 1 },
  { id: 31, cat: "Process", q: "A chaplet is used to?", choices: ["Support a core inside the mold cavity", "Pour the metal", "Mix the sand", "Test hardness"], answer: 0 },
  { id: 32, cat: "Defects", q: "A large, smooth-walled gas cavity in a casting is called a?", choices: ["Blowhole", "Hot tear", "Cold shut", "Inclusion"], answer: 0 },
  { id: 33, cat: "Defects", q: "Metal penetrating between sand grains, leaving a rough surface, is?", choices: ["Penetration", "Misrun", "Shrinkage", "Porosity"], answer: 0 },
  { id: 34, cat: "Defects", q: "A hot tear forms when?", choices: ["The casting is restrained while contracting during solidification", "The sand is too fine", "The riser is too small", "Too much inoculant is used"], answer: 0 },
  { id: 35, cat: "Defects", q: "Veining (finning) defects are most associated with?", choices: ["Low pouring temperature", "Sand thermal expansion", "Excess magnesium", "High humidity"], answer: 1 },
  { id: 36, cat: "Sand", q: "Permeability of molding sand refers to its ability to?", choices: ["Hold moisture", "Allow gases to escape", "Resist heat", "Bond metal"], answer: 1 },
  { id: 37, cat: "Sand", q: "AFS Grain Fineness Number (GFN) characterizes a sand's?", choices: ["Color", "Average grain size", "Moisture", "Hardness"], answer: 1 },
  { id: 38, cat: "Sand", q: "Loss on ignition (LOI) of molding sand measures?", choices: ["Moisture", "Combustible/organic content", "Grain size", "pH"], answer: 1 },
  { id: 39, cat: "Process", q: "A cupola furnace traditionally melts iron using which fuel?", choices: ["Natural gas only", "Coke", "Diesel", "Electricity"], answer: 1 },
  { id: 40, cat: "Process", q: "An induction furnace melts metal by?", choices: ["Burning coke", "Electromagnetic induction", "Arc between electrodes", "Friction"], answer: 1 },
  { id: 41, cat: "Process", q: "A ladle is used to?", choices: ["Mold sand", "Transport and pour molten metal", "Test tensile strength", "Shake out castings"], answer: 1 },
  { id: 42, cat: "Process", q: "Slag on a melt is best described as?", choices: ["The pure metal", "A non-metallic byproduct that floats on top", "Dissolved gas", "The mold material"], answer: 1 },
  { id: 43, cat: "Process", q: "Degassing of molten metal is performed to?", choices: ["Add carbon", "Remove dissolved gases", "Raise temperature", "Add slag"], answer: 1 },
  { id: 44, cat: "Quality", q: "An Ishikawa diagram is also known as a?", choices: ["Pareto chart", "Fishbone (cause-and-effect) diagram", "Control chart", "Scatter plot"], answer: 1 },
  { id: 45, cat: "Lean", q: '"Gemba" refers to?', choices: ["The waste", "The actual place where work happens", "A type of chart", "A defect"], answer: 1 },
  { id: 46, cat: "Lean", q: "Poka-yoke means?", choices: ["Mistake-proofing", "Production leveling", "Visual signal", "Waste"], answer: 0 },
  { id: 47, cat: "Lean", q: '"Muda" is the Japanese term for?', choices: ["Flow", "Waste", "Standard", "Pull"], answer: 1 },
  { id: 48, cat: "Lean", q: 'An "andon" is a?', choices: ["Pull signal", "Visual alert/status signal", "Type of furnace", "Inventory buffer"], answer: 1 },
  { id: 49, cat: "Lean", q: "Takt time is calculated as available production time divided by?", choices: ["Number of operators", "Customer demand", "Machine count", "Cycle time"], answer: 1 },
  { id: 50, cat: "Lean", q: "SMED is a method for reducing?", choices: ["Scrap", "Setup/changeover time", "Energy use", "Headcount"], answer: 1 },
  { id: 51, cat: "Quality", q: "Gauge R&R evaluates?", choices: ["Machine speed", "Measurement system repeatability and reproducibility", "Material cost", "Cycle time"], answer: 1 },
  { id: 52, cat: "Quality", q: "On a control chart, a point beyond the upper or lower control limit signals a?", choices: ["Common cause", "Special (assignable) cause", "Calibration error always", "Normal result"], answer: 1 },
  { id: 53, cat: "Quality", q: "Control limits on a typical Shewhart chart are set how many standard deviations from the center line?", choices: ["±1σ", "±2σ", "±3σ", "±6σ"], answer: 2 },
  { id: 54, cat: "Quality", q: "A histogram primarily displays?", choices: ["A time trend", "A frequency distribution", "Cause and effect", "Correlation"], answer: 1 },
  { id: 55, cat: "Measurement", q: "A Brinell test measures?", choices: ["Tensile strength", "Hardness", "Toughness", "Ductility"], answer: 1 },
  { id: 56, cat: "Measurement", q: "A Charpy impact test measures?", choices: ["Hardness", "Impact toughness", "Elongation", "Density"], answer: 1 },
  { id: 57, cat: "Measurement", q: "A CMM is a?", choices: ["Casting mold machine", "Coordinate Measuring Machine", "Carbon monitoring meter", "Core making mold"], answer: 1 },
  { id: 58, cat: "Measurement", q: "GD&T stands for?", choices: ["Gray Ductile and Tooling", "Geometric Dimensioning and Tolerancing", "General Design and Testing", "Gauge Data and Tracking"], answer: 1 },
  { id: 59, cat: "Safety", q: "LOTO in plant safety stands for?", choices: ["Load Test/Operate", "Lockout/Tagout", "Logistics Tracking", "Low-Temperature Operation"], answer: 1 },
  { id: 60, cat: "Safety", q: "Contact between molten metal and water can cause a?", choices: ["Mild fizz", "Steam explosion", "Color change", "Nothing notable"], answer: 1 },
  { id: 61, cat: "Safety", q: "An SDS (formerly MSDS) provides information about?", choices: ["Shipping routes", "Chemical hazards and handling", "Sales data", "Shift schedules"], answer: 1 },
  { id: 62, cat: "Safety", q: "Long-term inhalation of respirable crystalline silica can cause?", choices: ["Silicosis", "Frostbite", "Tinnitus", "Anemia"], answer: 0 },
  { id: 63, cat: "Safety", q: "Which fire extinguisher class is intended for combustible metals?", choices: ["Class A", "Class B", "Class C", "Class D"], answer: 3 },
  { id: 64, cat: "Safety", q: "OSHA's general action level for occupational noise is around?", choices: ["65 dBA", "75 dBA", "85 dBA", "110 dBA"], answer: 2 },
  { id: 65, cat: "Materials", q: "Adding chromium to steel for corrosion resistance produces?", choices: ["Cast iron", "Stainless steel", "Brass", "Bronze"], answer: 1 },
  { id: 66, cat: "Materials", q: "Galvanizing protects steel by coating it with?", choices: ["Zinc", "Tin", "Copper", "Nickel"], answer: 0 },
  { id: 67, cat: "Materials", q: "Anodizing is a surface treatment most associated with which metal?", choices: ["Iron", "Aluminum", "Lead", "Tungsten"], answer: 1 },
  { id: 68, cat: "Heat Treat", q: "Annealing a metal generally?", choices: ["Hardens it by rapid cooling", "Softens it and relieves stress", "Adds carbon", "Melts it"], answer: 1 },
  { id: 69, cat: "Heat Treat", q: "Quenching refers to?", choices: ["Slow furnace cooling", "Rapid cooling to harden", "Reheating to soften", "Surface painting"], answer: 1 },
  { id: 70, cat: "Heat Treat", q: "Tempering after hardening is done to?", choices: ["Increase brittleness", "Reduce brittleness and relieve stress", "Add chromium", "Remove carbon"], answer: 1 },
  { id: 71, cat: "Heat Treat", q: "Carburizing increases the surface concentration of?", choices: ["Oxygen", "Carbon", "Nitrogen", "Silicon"], answer: 1 },
  { id: 72, cat: "Materials", q: "Copper is especially valued for its high?", choices: ["Density", "Electrical and thermal conductivity", "Melting point", "Magnetism"], answer: 1 },
  { id: 73, cat: "Materials", q: "Aluminum is widely used largely because of its?", choices: ["High density", "Low density (light weight)", "Magnetism", "High cost"], answer: 1 },
  { id: 74, cat: "General", q: "OEE stands for?", choices: ["Overall Equipment Effectiveness", "Operational Energy Estimate", "Output Efficiency Estimate", "Optimal Equipment Engineering"], answer: 0 },
  { id: 75, cat: "General", q: "OEE is the product of Availability, Performance, and?", choices: ["Quality", "Cost", "Safety", "Speed"], answer: 0 },
  { id: 76, cat: "General", q: "JIT manufacturing stands for?", choices: ["Joint Inspection Team", "Just-In-Time", "Job Instruction Training", "Jig and Tool"], answer: 1 },
  { id: 77, cat: "General", q: "A Kanban is essentially a?", choices: ["Push schedule", "Pull/visual signal to replenish", "Quality audit", "Furnace type"], answer: 1 },
  { id: 78, cat: "Lean", q: "PDCA stands for?", choices: ["Plan-Do-Check-Act", "Process-Data-Control-Audit", "Plan-Design-Cost-Analyze", "Pour-Drag-Cope-Anneal"], answer: 0 },
  { id: 79, cat: "Lean", q: 'The "5 Whys" technique is used for?', choices: ["Scheduling", "Root cause analysis", "Costing", "Inventory"], answer: 1 },
  { id: 80, cat: "Lean", q: "TPM stands for?", choices: ["Total Productive Maintenance", "Time-Phased Manufacturing", "Total Process Metrics", "Tool Path Management"], answer: 0 },
  { id: 81, cat: "Process", q: "A pouring basin at the top of the gating system helps to?", choices: ["Increase carbon", "Reduce turbulence and regulate flow", "Cool the metal", "Trap the core"], answer: 1 },
  { id: 82, cat: "Process", q: "A vent in a mold or core is provided to?", choices: ["Add metal", "Let gases escape", "Support the cope", "Color the casting"], answer: 1 },
  { id: 83, cat: "Process", q: "Shakeout is the operation of?", choices: ["Pouring metal", "Removing the casting from the mold/sand", "Heat treating", "Inspecting"], answer: 1 },
  { id: 84, cat: "Process", q: "Fettling (cleaning) of castings includes?", choices: ["Melting", "Removing gates, risers, and surface cleaning", "Pouring", "Molding"], answer: 1 },
  { id: 85, cat: "Process", q: "Shot blasting is used primarily to?", choices: ["Add coating", "Clean and finish casting surfaces", "Heat treat", "Inspect dimensions"], answer: 1 },
  { id: 86, cat: "Metallurgy", q: "Malleable iron is produced by heat-treating which starting material?", choices: ["White iron", "Stainless steel", "Aluminum", "Brass"], answer: 0 },
  { id: 87, cat: "Metallurgy", q: "Compared with gray iron, ductile iron generally offers greater?", choices: ["Thermal conductivity", "Ductility and impact strength", "Vibration damping", "Machinability only"], answer: 1 },
  { id: 88, cat: "Metallurgy", q: "The fluidity of molten metal generally increases with?", choices: ["Lower temperature", "Higher pouring temperature", "More oxide", "Lower carbon only"], answer: 1 },
  { id: 89, cat: "Process", q: "In a cupola, tuyeres are used to?", choices: ["Tap the metal", "Deliver the air blast", "Charge the coke", "Measure temperature"], answer: 1 },
  { id: 90, cat: "Process", q: "A refractory lining in a furnace is chosen for its ability to?", choices: ["Conduct electricity", "Withstand high temperatures", "Add carbon", "Reduce weight"], answer: 1 },
  { id: 91, cat: "Process", q: "Limestone is often added to a cupola charge to act as a?", choices: ["Fuel", "Flux (slag former)", "Coolant", "Inoculant"], answer: 1 },
  { id: 92, cat: "Metallurgy", q: "Magnesium treatment to create nodular graphite is called?", choices: ["Inoculation", "Nodularization (spheroidization)", "Normalizing", "Tempering"], answer: 1 },
  { id: 93, cat: "Defects", q: "An inclusion in a casting is?", choices: ["A foreign/non-metallic particle trapped in the metal", "A gas pocket", "A crack", "A cold region"], answer: 0 },
  { id: 94, cat: "Defects", q: "A shrinkage cavity is best prevented by?", choices: ["Lower pouring temperature", "Proper riser design and feeding", "More vents", "Finer sand only"], answer: 1 },
  { id: 95, cat: "Defects", q: "A scab defect is associated with?", choices: ["Sand expansion lifting and metal filling beneath it", "Excess magnesium", "Low carbon", "High nickel"], answer: 0 },
  { id: 96, cat: "Quality", q: "First Pass Yield refers to the proportion of units that?", choices: ["Are scrapped", "Pass without rework on the first attempt", "Are reworked", "Are inspected"], answer: 1 },
  { id: 97, cat: "Quality", q: "A run of seven or more points on one side of the center line on a control chart suggests?", choices: ["Random variation", "A non-random (special-cause) pattern", "Good control", "Measurement error only"], answer: 1 },
  { id: 98, cat: "General", q: "A bottleneck in a process is the step that?", choices: ["Has the least cost", "Limits overall throughput", "Uses the most operators", "Produces the most scrap"], answer: 1 },
  { id: 99, cat: "Lean", q: '"Kaizen" most nearly means?', choices: ["Big one-time redesign", "Continuous improvement", "Quality control", "Just-in-time"], answer: 1 },
  { id: 100, cat: "Metallurgy", q: "Gray iron is typically poured in the rough temperature range of?", choices: ["600–700°C", "900–1,000°C", "1,350–1,450°C", "1,800–1,900°C"], answer: 2 },
];

/** Fisher-Yates draw of `count` unique questions. */
export function drawQuestions(count: number): TriviaQuestion[] {
  const pool = [...TRIVIA_BANK];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
