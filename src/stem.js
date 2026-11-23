(() => {
  const el = id => document.getElementById(id);
  const cases = [{n: 2, x: 3, one: 1}, {n: 3, x: 1, one: 4}, {n: 4, x: 2, one: 3}, {n: 5, x: 3, one: 2}];
  const validNumber = (value, upper) => Number.isInteger(value) && value >= 0 && value <= upper;
  const store = (name, value) => { if (typeof window.saveLab === 'function') window.saveLab(name, value); };
  const read = name => typeof window.getLab === 'function' ? window.getLab(name) : undefined;
  const xTerm = n => n === 1 ? 'x' : n + 'x';
  const fieldIds = ['stem-math-a', 'stem-math-b', 'stem-math-c'];
  let math = {};
  let atoms = {};
  let substitution = {};
  let assembly = {};
  const updateMath = () => store('math-area', {...math});
  const updateAtoms = () => store('science-particles', {...atoms});
  function restore() {
    const savedMath = read('math-area') || {};
    math = {
      mode: savedMath.mode === 'factor' ? 'factor' : 'expand',
      index: validNumber(savedMath.index, 3) ? savedMath.index : 0,
      fields: fieldIds.map((id, i) => String(savedMath.fields?.[i] ?? '').replace(/[^0-9]/g, '').slice(0, 3)),
      checked: savedMath.checked === true
    };
    const savedAtoms = read('science-particles') || {};
    atoms = {
      index: savedAtoms.index === 1 ? 1 : 0,
      count: validNumber(savedAtoms.count, 4) ? savedAtoms.count : 1,
      checked: savedAtoms.checked === true
    };
    const savedCheck = read('math-substitution') || {};
    substitution = {
      example: savedCheck.example === 'full' ? 'full' : 'short',
      value: [-2, 0, 1, 2, 3].includes(savedCheck.value) ? savedCheck.value : 2
    };
    restoreAssembly();
    renderMath();
    renderSubstitution();
    renderAtoms();
    renderAssembly();
  }
  function drawTiles(props) {
    const model = el('stem-tiles');
    model.replaceChildren();
    model.setAttribute('aria-label', props.n + ' equal rows. In every row there are ' + props.x + ' long x tiles and ' + props.one + ' unit squares.');
    for (let row = 0; row < props.n; row++) {
      const rowNode = document.createElement('div');
      rowNode.className = 'stem-tile-row';
      for (let index = 0; index < props.x + props.one; index++) {
        const isX = index < props.x;
        const tile = document.createElement('span');
        tile.className = isX ? 'stem-tile stem-x' : 'stem-tile stem-one';
        tile.textContent = isX ? 'x' : '1';
        rowNode.append(tile);
      }
      model.append(rowNode);
    }
  }
  function gradeMath() {
    const {n, x, one} = cases[math.index];
    const expand = math.mode === 'expand';
    const expected = expand ? [n*x, n*one] : [n, x, one];
    const fields = math.fields.slice(0, expected.length);
    if (fields.some(v => !v)) return 'Fill each box with a whole number, then check again.';
    const firstError = expected.findIndex((num, i) => num !== Number(fields[i]));
    const hints = expand
      ? ['Count the long x tiles in one row. Multiply that number by the number of rows.',
         'The outside multiplier reaches the squares too. Count the small squares across every row.']
      : ['Count the equal rows in the picture. Check that this factor divides both terms.',
         'Divide the total number of long x tiles by the number of equal rows.',
         'Divide the total number of small squares by the number of equal rows.'];
    if (firstError >= 0) return 'Try again. ' + hints[firstError];
    const equation = n + '(' + xTerm(x) + ' + ' + one + ') = ' + xTerm(n*x) + ' + ' + n*one + '.';
    return 'Correct. ' + equation + (expand ? ' Every row contributes the same x tiles and the same unit squares.' : ' Dividing both terms by their greatest common factor gives the contents of one row.');
  }
  function renderMath() {
    const {n, x, one} = cases[math.index];
    const expand = math.mode === 'expand';
    el('stem-math-mode').value = math.mode;
    el('stem-math-case').value = String(math.index);
    el('stem-math-question').textContent = expand
      ? 'Expand ' + n + '(' + xTerm(x) + ' + ' + one + '). How many x tiles and unit squares are there altogether?'
      : 'Factor ' + xTerm(n*x) + ' + ' + n*one + '. Find the greatest common factor, then the expression in one row.';
    el('stem-math-label-a').textContent = expand ? 'Total x tiles' : 'Greatest common factor';
    el('stem-math-label-b').textContent = expand ? 'Total unit squares' : 'x tiles in each row';
    el('stem-math-c-wrap').hidden = expand;
    fieldIds.forEach((id, i) => { el(id).value = math.fields[i]; });
    drawTiles({n, x, one});
    el('stem-math-feedback').textContent = math.checked ? gradeMath() : '';
  }
  function changeMath(mode, index) {
    math = {mode, index, fields: ['', '', ''], checked: false};
    updateMath();
    renderMath();
  }
  function renderSubstitution() {
    const {example, value} = substitution;
    const term = example === 'full' ? 12 : 3;
    const left = 4 * (2 * value + 3);
    const right = 8 * value + term;
    el('stem-claim').value = example;
    el('stem-value').value = String(value);
    el('stem-substitution').textContent =
      'At x = ' + value + ', 4(2x + 3) gives ' + left + ' and 8x + ' + term + ' gives ' + right + '. ' +
      (left === right ? 'The values match for this input.' : 'The two values differ by ' + Math.abs(left - right) + '.');
  }
  const moleculeCases = [
    {before: [['H','H'],['H','H'],['O','O']], after: ['H','H','O'], label: 'H₂O molecules', name: 'water', symbols: ['H','O'], equation:'2 H₂ + O₂ → 2 H₂O'},
    {before: [['C','O'],['C','O'],['O','O']], after: ['O','C','O'], label: 'CO₂ molecules', name: 'carbon dioxide', symbols: ['C','O'], equation:'2 CO + O₂ → 2 CO₂'}
  ];
  function drawMolecules(container, groups) {
    container.replaceChildren();
    if (!groups.length) {
      container.textContent = 'No molecules yet.';
      return;
    }
    for (const group of groups) {
      const molecule = document.createElement('span');
      molecule.className = 'stem-molecule';
      const labels = {H:'hydrogen', C:'carbon', O:'oxygen'};
      molecule.setAttribute('role', 'img');
      molecule.setAttribute('aria-label', 'Molecule with atoms ' + group.map(a => labels[a]).join(', '));
      for (const symbol of group) {
        const particle = document.createElement('span');
        particle.className = 'stem-ball stem-' + symbol;
        particle.textContent = symbol;
        molecule.append(particle);
      }
      container.append(molecule);
    }
  }
  const countAtoms = (groups, symbol) => groups.flat().filter(s => s === symbol).length;
  function renderAtoms() {
    const kit = moleculeCases[atoms.index];
    const products = Array.from({length: atoms.count}, () => kit.after);
    el('stem-atom-case').value = String(atoms.index);
    el('stem-product-count').value = String(atoms.count);
    el('stem-product-label').textContent = kit.label;
    drawMolecules(el('stem-before'), kit.before);
    drawMolecules(el('stem-after'), products);
    const counts = kit.symbols.map(symbol => ({symbol, before:countAtoms(kit.before,symbol), after:countAtoms(products,symbol)}));
    el('stem-atom-counts').textContent = counts.map(({symbol,before,after}) => symbol + ' atoms: ' + before + ' before, ' + after + ' after').join('  ·  ');
    const feedback = el('stem-atom-feedback');
    if (!atoms.checked) { feedback.textContent = ''; return; }
    const wrong = counts.find(c => c.before !== c.after);
    if (wrong) {
      const adjust = wrong.after < wrong.before ? 'Add' : 'Remove';
      feedback.textContent = 'Keep testing. ' + adjust + ' a whole ' + kit.name + ' molecule and compare both elements again. The small numbers inside each formula stay fixed.';
    } else {
      feedback.textContent = 'Balanced. ' + kit.equation + '. Each element has the same count on both sides. The atoms are joined in different groups.';
    }
  }
  function restoreAssembly() {
    const saved = read('science-assembly') || {};
    const kit = moleculeCases[atoms.index];
    const remaining = kit.before.flat().slice();
    const trays = [[], []];
    if (saved.index === atoms.index && Array.isArray(saved.trays)) {
      for (const [i, tray] of saved.trays.slice(0, 2).entries()) {
        if (!Array.isArray(tray)) continue;
        for (const symbol of tray.slice(0, 6)) {
          const position = remaining.indexOf(symbol);
          if (position >= 0) {
            trays[i].push(symbol);
            remaining.splice(position, 1);
          }
        }
      }
    }
    assembly = {
      index: atoms.index,
      tray: saved.tray === 1 ? 1 : 0,
      checked: saved.index === atoms.index && saved.checked === true,
      trays
    };
  }
  function remainingOf(symbol) {
    return countAtoms(moleculeCases[atoms.index].before, symbol) - countAtoms(assembly.trays, symbol);
  }
  function renderAssembly() {
    const kit = moleculeCases[atoms.index];
    const [first, second] = kit.symbols;
    const formula = atoms.index === 0 ? 'H₂O' : 'CO₂';
    el('stem-tray').value = String(assembly.tray);
    el('stem-build-target').textContent = 'Build two ' + formula + ' molecules. Each tray needs ' +
      kit.symbols.map(s => kit.after.filter(a => a === s).length + ' ' + s).join(' and ') + '.';
    for (const [id, symbol] of [['stem-choose-first', first], ['stem-choose-second', second]]) {
      const remaining = remainingOf(symbol);
      el(id).textContent = 'Add ' + symbol + ' · ' + remaining + ' left';
      el(id).disabled = remaining === 0;
    }
    for (const [i, tray] of assembly.trays.entries()) {
      const container = el(i === 0 ? 'stem-build-a' : 'stem-build-b');
      container.replaceChildren();
      if (!tray.length) {
        container.textContent = 'Empty tray';
        continue;
      }
      for (const symbol of tray) {
        const ball = document.createElement('span');
        ball.className = 'stem-circle stem-' + symbol;
        ball.textContent = symbol;
        container.append(ball);
      }
    }
    el('stem-build-undo').disabled = assembly.trays[assembly.tray].length === 0;
    const output = el('stem-build-result');
    if (!assembly.checked) { output.textContent = ''; return; }
    const hasLeftovers = kit.symbols.some(symbol => remainingOf(symbol) > 0);
    const wrongTray = assembly.trays.findIndex(tray => kit.symbols.some(symbol =>
      tray.filter(atom => atom === symbol).length !== kit.after.filter(atom => atom === symbol).length));
    if (wrongTray === -1) {
      output.textContent = 'Both molecules match ' + formula + ', and the supply is empty. The six starting atoms are all accounted for.';
    } else if (hasLeftovers) {
      output.textContent = 'Some atoms are still available. Compare tray ' + (wrongTray === 0 ? 'A' : 'B') + ' with the formula, then choose an atom to add.';
    } else {
      output.textContent = 'You used every atom. Check the recipe in tray ' + (wrongTray === 0 ? 'A' : 'B') + '. Return an atom and place it in the other tray if needed.';
    }
  }
  function commitAssembly() {
    store('science-assembly', {...assembly, trays: assembly.trays.map(tray => tray.slice())});
    renderAssembly();
  }
  function boot() {
    if (!el('stem-math-case') || !el('stem-atom-case')) return;
    el('stem-math-mode').addEventListener('change', e => changeMath(e.target.value, math.index));
    el('stem-math-case').addEventListener('change', e => changeMath(math.mode, Number(e.target.value)));
    el('stem-math-next').addEventListener('click', () => changeMath(math.mode, (math.index + 1) % cases.length));
    fieldIds.forEach((id, i) => el(id).addEventListener('input', e => {
      math.fields[i] = e.target.value;
      math.checked = false;
      el('stem-math-feedback').textContent = '';
      updateMath();
    }));
    el('stem-math-check').addEventListener('click', () => {
      math.checked = true;
      el('stem-math-feedback').textContent = gradeMath();
      updateMath();
    });
    for (const id of ['stem-claim', 'stem-value']) {
      el(id).addEventListener('change', () => {
        substitution = {example: el('stem-claim').value, value: Number(el('stem-value').value)};
        store('math-substitution', {...substitution});
        renderSubstitution();
      });
    }
    el('stem-atom-case').addEventListener('change', e => {
      atoms = {index: Number(e.target.value), count: 1, checked: false};
      assembly = {index: atoms.index, tray: 0, checked: false, trays: [[], []]};
      updateAtoms();
      renderAtoms();
      commitAssembly();
    });
    el('stem-product-count').addEventListener('change', e => {
      atoms.count = Number(e.target.value); atoms.checked = false; renderAtoms(); updateAtoms();
    });
    el('stem-atom-check').addEventListener('click', () => {
      atoms.checked = true; renderAtoms(); updateAtoms();
    });
    el('stem-tray').addEventListener('change', e => {
      assembly.tray = Number(e.target.value);
      commitAssembly();
    });
    for (const [i, id] of ['stem-choose-first', 'stem-choose-second'].entries()) {
      el(id).addEventListener('click', () => {
        const symbol = moleculeCases[atoms.index].symbols[i];
        if (remainingOf(symbol) <= 0) return;
        assembly.trays[assembly.tray].push(symbol);
        assembly.checked = false;
        commitAssembly();
      });
    }
    el('stem-build-undo').addEventListener('click', () => {
      assembly.trays[assembly.tray].pop();
      assembly.checked = false;
      commitAssembly();
    });
    el('stem-build-check').addEventListener('click', () => {
      assembly.checked = true;
      commitAssembly();
    });
    window.addEventListener('restore-labs', restore);
    restore();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
