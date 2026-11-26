const renderers = {
  home: richHome,
  trail: lessonRoom,
  checkin: checkinRoom,
  basket: reviewBasket,
  studio,
  practice,
  explore,
  family,
  checks: readiness,
  review: reviewRoom,
  trade,
  facts: () => numberQuiz("facts"),
  stories: () => numberQuiz("stories"),
  preview: () => numberQuiz("preview"),
  clue: reading,
  books,
  words,
  memory,
  matter: science,
  history: historyLesson,
};
function render() {
  menu();
  $("#main").innerHTML = renderers[state.route]();
  document.title =
    (state.route === "home"
      ? "Grade 2 fieldbook"
      : $("#main h1")?.textContent || "Grade 2 fieldbook") +
    " · Thanksgiving Navigator";
  save();
  if (state.route === "family") gradeSync.refreshUI();
}
function address(route) {
  if (location.hash === "#" + route) return;
  try {
    history.pushState(null, "", "#" + route);
  } catch {}
}
function go(route) {
  if (!validRoutes.has(route)) return;
  state.route = route;
  address(route);
  render();
  window.scrollTo(0, 0);
  $("#main").focus({ preventScroll: true });
}
function redraw(target) {
  const y = window.scrollY;
  render();
  if (target) {
    const hit = [...$("#main").querySelectorAll("button[data-act]")].find(
      (el) =>
        el.dataset.act === target.dataset.act &&
        el.dataset.val === target.dataset.val,
    );
    if (hit && !hit.disabled) hit.focus({ preventScroll: true });
  }
  window.scrollTo(0, y);
}
function showPaper() {
  const s = state;
  $("#paper").innerHTML =
    `<h1>Demeter and Persephone</h1><p>My Greek myth project · Tuesday, December 1, 2026</p><h2>My project plan</h2><p>${esc(s.format || "Poster or diorama")} · ${esc(s.notes.scene || s.notes.sketch || "My scene idea: ________________________________________")}</p><h2>My paragraph</h2>${s.notes.draft.trim() ? `<p>${esc(s.notes.draft)}</p>` : Array.from({ length: 7 }, () => '<div class="writingLine"></div>').join("")}<div class="printChecks"><h2>My final check</h2><ul style="list-style:none;padding:0">${CHECKS.map((t, n) => `<li>${s.checks.includes(n) ? "[x]" : "[  ]"} ${t}</li>`).join("")}</ul>${s.notes.rehearse ? `<p>When I share: ${esc(s.notes.rehearse)}</p>` : ""}</div>`;
}
function showDialog(html) {
  const d = $("#backupDialog");
  $("#dialogContent").innerHTML = html;
  if (!d.open) {
    if (typeof d.showModal === "function") d.showModal();
    else d.setAttribute("open", "");
  }
  $("#dialogContent").scrollTop = 0;
}
function closeDialog() {
  const d = $("#backupDialog");
  if (typeof d.close === "function") d.close();
  else d.removeAttribute("open");
  pending = null;
}
function exportFile() {
  const file = new Blob([JSON.stringify(wrap(), null, 2)], {
    type: "application/json",
  });
  let url = URL.createObjectURL(file),
    a = document.createElement("a");
  a.href = url;
  a.download =
    "Fieldbook-progress-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  showDialog(
    `<h2>Save my progress</h2><p>Look in Downloads for <b>Fieldbook-progress…json</b>. Put it in Box to carry your work to another device.</p><p>If the download did not appear, use the text backup.</p>${button("Use text backup", "backupText")}`,
  );
}
function backupText() {
  showDialog(
    `<h2>Progress as text</h2><label class="field" for="copyOut">Copy this backup into a note or text file</label><textarea id="copyOut" readonly></textarea>${button("Select all backup text", "selectText")}<label class="field" for="pasteIn">Or paste a saved backup here</label><textarea id="pasteIn"></textarea>${button("Review pasted backup", "reviewText")}<p id="loadError" role="status"></p>`,
  );
  $("#copyOut").value = JSON.stringify(wrap());
}
function reviewImport(str) {
  try {
    if (str.length > 600000)
      throw Error("This file is too large to be a Fieldbook progress backup.");
    const recovered = restore(JSON.parse(str));
    pending = recovered;
    showDialog(
      `<h2>Load this saved work?</h2><p>It contains ${recovered.finished.length} checked project steps and ${recovered.notes.draft.trim().length} characters in the paragraph. Loading it replaces the work currently open on this device.</p><div class="btnrow">${button("Load this backup", "confirmImport", "", "primary")}${button("Keep current work", "cancelImport")}</div>`,
    );
  } catch (e) {
    pending = null;
    showDialog(
      `<h2>Couldn’t load this backup</h2><p>Your current work is still here. Choose a Fieldbook progress file or paste its full text.</p><div class="btnrow">${button("Choose a file", "import")}${button("Use text backup", "backupText")}</div>`,
    );
  }
}
function updateNumberForm(form) {
  const k = state.route,
    i = state.positions[k],
    id = k + i;
  if (form.dataset.quiz === "number") {
    const input = $("#mathAnswer"),
      v = input.value.trim();
    state.numberInputs[id] = input.value;
    state.answers[id] = /^\d+$/.test(v) && Number(v) === QUESTIONS[k][i][1];
    state.attempts[id] = true;
  } else {
    let v = $("#spellAnswer").value;
    state.spells[i] = v;
    state.spellTries[i] = true;
    state.spellAnswers[i] = v.trim().toLowerCase() === WORDS[i][0];
  }
  if (form.dataset.quiz === "number" && !state.answers[id])
    scheduleReview(practiceSkill(k, i));
  if (form.dataset.quiz === "spelling" && !state.spellAnswers[i])
    scheduleReview("spelling");
  const y = window.scrollY;
  render();
  const result = $("#main form + .feedback");
  if (result) {
    result.setAttribute("tabindex", "-1");
    result.focus({ preventScroll: true });
  }
  window.scrollTo(0, y);
}
function act(action, v, target) {
  let n = Number(v),
    k = state.route,
    i = state.positions[k];
  if (trailAction(action, v, target)) return;
  if (extraAction(action, v, target)) return;
  switch (action) {
    case "day":
      state.day = n;
      break;
    case "step":
    case "openStep":
      state.step = n;
      go("studio");
      return;
    case "sceneCard":
      state.sceneCard = n;
      break;
    case "sequence":
      changeList(state.order, n, !state.order.includes(n));
      state.storyTry = false;
      break;
    case "checkStory":
      state.storyTry = true;
      break;
    case "format":
      state.format = v;
      break;
    case "position":
      if (n < 0 || n >= groupSizes[k]) return;
      state.positions[k] = n;
      break;
    case "wordMode":
      state.wordMode = v;
      break;
    case "answerChoice": {
      let right =
        k === "clue"
          ? READINGS[i].right
          : k === "history"
            ? HISTORY[i].right
            : i % 3 === 1
              ? 0
              : 1;
      state.answers[k + i] = n === right;
      state.attempts[k + i] = true;
      if (n !== right && k !== "history") scheduleReview(practiceSkill(k, i));
      break;
    }
    case "trade":
      if (v === "ones" && state.trade[2] >= 10) {
        state.trade[2] -= 10;
        state.trade[1]++;
      } else if (v === "tens" && state.trade[1] >= 10) {
        state.trade[1] -= 10;
        state.trade[0]++;
      }
      break;
    case "resetTrade":
      state.trade = [0, 11, 15];
      break;
    case "object":
      state.objects = n;
      break;
    case "property": {
      let list =
        state.properties[state.objects] ||
        (state.properties[state.objects] = []);
      changeList(list, n, !list.includes(n));
      break;
    }
    case "print":
      showPaper();
      window.print();
      return;
    case "export":
      exportFile();
      return;
    case "import":
      $("#fileInput").value = "";
      $("#fileInput").click();
      return;
    case "backupText":
      backupText();
      return;
    case "selectText":
      $("#copyOut").focus();
      $("#copyOut").select();
      return;
    case "reviewText":
      reviewImport($("#pasteIn").value);
      return;
    case "cancelImport":
      closeDialog();
      return;
    case "confirmImport":
      if (pending) {
        let s = pending;
        closeDialog();
        state = s;
        go(s.route);
      }
      return;
    default:
      return;
  }
  redraw(target);
}
document.addEventListener("click", (event) => {
  const el = event.target.closest("button,[data-go],nav a,.wordmark");
  if (!el) return;
  if (el.dataset.go) {
    event.preventDefault();
    go(el.dataset.go);
    return;
  }
  if (el.matches("nav a,.wordmark")) {
    event.preventDefault();
    go(el.hash.slice(1));
    return;
  }
  if (el.dataset.act) {
    event.preventDefault();
    act(el.dataset.act, el.dataset.val, el);
  }
});
document.addEventListener("input", (event) => {
  const el = event.target;
  if (el.dataset.note) {
    state.notes[el.dataset.note] = el.value;
    save();
  } else if (el.dataset.num) {
    state.numberInputs[el.dataset.num] = el.value;
    delete state.answers[el.dataset.num];
    delete state.attempts[el.dataset.num];
    document
      .querySelectorAll("#main form + .feedback")
      .forEach((el) => el.remove());
    save();
  } else if (el.dataset.spell !== undefined) {
    let i = el.dataset.spell;
    state.spells[i] = el.value;
    delete state.spellAnswers[i];
    delete state.spellTries[i];
    document
      .querySelectorAll("#main form + .feedback")
      .forEach((el) => el.remove());
    save();
  }
});
document.addEventListener("change", (event) => {
  const el = event.target;
  if (el.dataset.check) {
    let k = el.dataset.check;
    changeList(state[k], Number(el.value), el.checked);
    save();
    if (k === "finished" || k === "daysDone") {
      const y = window.scrollY;
      render();
      let check = $(`#main input[data-check="${k}"][value="${el.value}"]`);
      if (check) check.focus({ preventScroll: true });
      window.scrollTo(0, y);
    }
  }
});
document.addEventListener("submit", (event) => {
  if (event.target.dataset.quiz) {
    event.preventDefault();
    updateNumberForm(event.target);
  }
});
$("#fileInput").addEventListener("change", async (event) => {
  const f = event.target.files[0];
  if (!f) return;
  if (f.size > 600000) {
    reviewImport("");
    return;
  }
  try {
    reviewImport(await f.text());
  } catch {
    reviewImport("");
  }
});
$("#closeDialog").addEventListener("click", closeDialog);
$("#backupDialog").addEventListener("cancel", () => (pending = null));
window.addEventListener("beforeprint", showPaper);
window.addEventListener("hashchange", () => {
  const target = location.hash.slice(1);
  if (!target) go("home");
  else if (validRoutes.has(target)) go(target);
});
if (validRoutes.has(location.hash.slice(1)))
  state.route = location.hash.slice(1);
gradeSync.boot();
render();
