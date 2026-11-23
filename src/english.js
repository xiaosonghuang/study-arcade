(() => {
  'use strict';

  const poems = {
    pencil: {
      lines: [
        'My pencil shivers in the light.',
        'The blank page waits for me to start.',
        'One crooked star appears in sight.',
        'Its five small lines unstick my heart.'
      ],
      rhyme: 'ABAB',
      rhymeHint: 'Say “light” beside “sight,” then “start” beside “heart.” Give each pair its own letter.',
      rhymeWhy: '“Light” and “sight” share one ending. “Start” and “heart” share another. The two sounds alternate.',
      image: '“One crooked star appears in sight.”',
      sense: 'sight',
      senseWhy: '“Crooked” and “appears in sight” direct your attention to the shape the writer sees.',
      claims: [
        'The speaker feels less stuck after making one imperfect mark.',
        'The speaker pays close attention to the shape of the drawing.'
      ],
      comparisons: [
        'This reading accounts for the movement from waiting to relief. The star can be crooked and still give the writer a way to begin.',
        'The crooked shape does capture the speaker’s attention. Compare the “shivers” at the start with “unstick my heart” at the end. Which reading accounts for that shift?'
      ],
      lineCue: [
        'The shivering pencil can echo a shaky hand.',
        'The waiting page makes the pause before the first mark feel long.',
        'The star is visibly imperfect, yet it has appeared on the page.',
        '“Unstick my heart” gives the final line a feeling of release.'
      ]
    },
    platform: {
      lines: [
        'Rain strikes the railing, bright as tin.',
        'A last train hums beyond the hill.',
        'The empty platform trembles still.',
        'I cup the sound and hold it in.'
      ],
      rhyme: 'ABBA',
      rhymeHint: 'Read the outside end words “tin” and “in.” Then read the two inside end words, “hill” and “still.”',
      rhymeWhy: '“Tin” rhymes with “in” around the outside. The “hill” and “still” pair sits between them.',
      image: '“A last train hums beyond the hill.”',
      sense: 'sound',
      senseWhy: '“Hums” gives you an audible trace of the train even when it has traveled beyond the hill.',
      claims: [
        'The speaker notices noisy details around a train platform.',
        'The speaker tries to hold on to a moment as the train moves away.'
      ],
      comparisons: [
        'Rain striking and the train humming support this observation. Now consider why the speaker tries to “cup” the sound in the last line. The second reading also explains that gesture.',
        'This reading connects the distant train, the lingering tremble and the final gesture. Sound seems like something the speaker can hold for a moment.'
      ],
      lineCue: [
        'The rain strikes the railing and flashes in the light.',
        'The train is already beyond the hill, though its sound reaches the speaker.',
        'The platform keeps trembling after the train has moved away.',
        'A person cannot literally hold a sound in cupped hands. The gesture suggests wanting to keep it.'
      ]
    }
  };

  function initialize() {
    const room = document.getElementById('english');
    if (!room) return;
    const get = id => room.querySelector('#poetry-' + id);
    const poemsByName = Object.keys(poems);

    function emptyRecord() {
      return { evidence: [], rhymes: ['', '', '', ''], sense: '', claim: -1 };
    }

    let active;
    let records;

    function readRecord(raw) {
      const result = emptyRecord();
      if (!raw || typeof raw !== 'object') return result;
      if (Array.isArray(raw.evidence)) {
        result.evidence = [...new Set(raw.evidence.filter(n => Number.isInteger(n) && n >= 0 && n < 4))].slice(0, 2);
      }
      if (Array.isArray(raw.rhymes)) {
        result.rhymes = result.rhymes.map((_, i) => ['A', 'B', 'C', 'D'].includes(raw.rhymes[i]) ? raw.rhymes[i] : '');
      }
      if (['sight', 'sound', 'touch'].includes(raw.sense)) result.sense = raw.sense;
      if ([0, 1].includes(raw.claim)) result.claim = raw.claim;
      return result;
    }

    function save() {
      if (typeof window.saveLab === 'function') {
        window.saveLab('poetryStudio', JSON.stringify({ active, records }));
      }
    }

    function restore() {
      let raw = typeof window.getLab === 'function' ? window.getLab('poetryStudio') : null;
      if (typeof raw === 'string') {
        try { raw = JSON.parse(raw); } catch { raw = null; }
      }
      active = poemsByName.includes(raw?.active) ? raw.active : 'pencil';
      records = Object.fromEntries(poemsByName.map(k => [k, readRecord(raw?.records?.[k])]));
      render();
    }

    function evidenceStatus() {
      const selected = records[active].evidence;
      get('evidence-status').textContent = selected.length
        ? 'Evidence selected from ' + (selected.length === 1 ? 'line ' : 'lines ') + selected.map(i => i + 1).join(' and ') + '.'
        : 'Choose a line that gives you something to say about the speaker.';
    }

    function choiceRow(container, type, text, checked, onChange) {
      const label = document.createElement('label');
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.gap = '.6rem';
      label.style.minHeight = '2.75rem';
      const input = document.createElement('input');
      input.type = type;
      if (type === 'radio') input.name = 'poetry-reading';
      input.checked = checked;
      input.addEventListener('change', () => onChange(input));
      label.append(input, document.createTextNode(text));
      container.append(label);
    }

    function render() {
      const poem = poems[active];
      const record = records[active];
      get('stanza').value = active;
      const lines = get('lines');
      const rhymes = get('rhyme-choices');
      const claims = get('interpretations');
      lines.replaceChildren();
      rhymes.replaceChildren();
      claims.replaceChildren();
      poem.lines.forEach((line, i) => {
        choiceRow(lines, 'checkbox', (i + 1) + '. ' + line, record.evidence.includes(i), input => {
          if (input.checked && record.evidence.length === 2) {
            input.checked = false;
            get('evidence-status').textContent = 'Two lines are selected. Clear one first to try a different piece of evidence.';
            return;
          }
          record.evidence = input.checked
            ? [...record.evidence, i].sort((a, b) => a - b)
            : record.evidence.filter(n => n !== i);
          evidenceStatus();
          get('claim-feedback').textContent = '';
          save();
        });

        const label = document.createElement('label');
        label.textContent = 'Line ' + (i + 1) + ' ';
        const select = document.createElement('select');
        select.setAttribute('aria-label', 'Rhyme letter for line ' + (i + 1));
        for (const value of ['', 'A', 'B', 'C', 'D']) {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = value || 'Choose';
          select.append(option);
        }
        select.value = record.rhymes[i];
        select.addEventListener('change', () => {
          record.rhymes[i] = select.value;
          get('rhyme-feedback').textContent = '';
          save();
        });
        label.append(select);
        rhymes.append(label);
      });

      get('sense-stem').textContent = 'Read this line again. ' + poem.image;
      get('sense').value = record.sense;
      poem.claims.forEach((claim, i) => {
        choiceRow(claims, 'radio', claim, record.claim === i, () => {
          record.claim = i;
          get('claim-feedback').textContent = '';
          save();
        });
      });
      evidenceStatus();
      for (const target of ['rhyme-feedback', 'sense-feedback', 'claim-feedback']) {
        get(target).textContent = '';
      }
    }

    get('stanza').addEventListener('change', event => {
      active = event.target.value;
      render();
      save();
    });
    get('check-rhyme').addEventListener('click', () => {
      const letters = records[active].rhymes;
      const poem = poems[active];
      const blank = letters.indexOf('');
      get('rhyme-feedback').textContent = blank >= 0
        ? 'Line ' + (blank + 1) + ' still needs a letter. Say its end word aloud.'
        : letters.join('') === poem.rhyme
          ? 'Yes. ' + poem.rhyme + '. ' + poem.rhymeWhy
          : 'Give the first sound an A and revisit line ' + (letters.findIndex((letter, i) => letter !== poem.rhyme[i]) + 1) + '. ' + poem.rhymeHint;
    });
    get('sense').addEventListener('change', event => {
      records[active].sense = event.target.value;
      get('sense-feedback').textContent = '';
      save();
    });
    get('check-sense').addEventListener('click', () => {
      const poem = poems[active];
      const sense = records[active].sense;
      get('sense-feedback').textContent = !sense
        ? 'Choose a sense first, then check the words that led you there.'
        : sense === poem.sense
          ? 'Yes. ' + poem.senseWhy
          : 'Look for the strongest clue in this particular line. ' + poem.senseWhy + ' Try tagging it again.';
    });
    get('compare').addEventListener('click', () => {
      const record = records[active];
      const poem = poems[active];
      let feedback;
      if (record.claim < 0) feedback = 'Pick a reading, then compare it with a detail in the stanza.';
      else if (!record.evidence.length) feedback = 'Select a line in the stanza that supports your reading, then compare again.';
      else feedback = poem.comparisons[record.claim] + ' ' + record.evidence.map(i => 'Line ' + (i + 1) + ' — ' + poem.lineCue[i]).join(' ');
      get('claim-feedback').textContent = feedback;
    });
    window.addEventListener('restore-labs', restore);
    document.addEventListener('restore-labs', restore);
    restore();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
