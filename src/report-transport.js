function createReportSync({
  prefix,
  snapshotForDevice,
  conflict,
  plan,
  openProgress,
}) {
  const lib = window.ArcadeLive;
  let pair = null,
    pending = null,
    device = null,
    stamp = 0,
    receipt = 0,
    delivered = "",
    running = false,
    timer = null,
    retry = 2500;
  let feedback = "Automatic family updates are off on this browser.";
  function ui(text) {
    feedback = text;
    const e = document.getElementById("familyStatus");
    if (e) e.textContent = text;
    const off = document.getElementById("disconnectFamily");
    if (off) off.hidden = !pair;
  }
  function stored(k) {
    try {
      return localStorage.getItem(prefix + k) || "";
    } catch {
      return "";
    }
  }
  function persist(k, v) {
    try {
      localStorage.setItem(prefix + k, v);
      return true;
    } catch {
      return false;
    }
  }
  function identity() {
    if (device) return;
    device = stored("device");
    if (!/^[a-f0-9]{32}$/.test(device)) {
      device = Array.from(crypto.getRandomValues(new Uint8Array(16)), (n) =>
        n.toString(16).padStart(2, "0"),
      ).join("");
      persist("device", device);
    }
    stamp = Number(stored("stamp")) || 0;
  }
  function queue(delay = 1200) {
    if (!pair || conflict()) return;
    clearTimeout(timer);
    timer = setTimeout(send, delay);
  }
  function makePayload() {
    const snapshot = snapshotForDevice();
    // Changes such as visiting a room do not count as new work on the dashboard.
    const signature = JSON.stringify(snapshot);
    return { snapshot, signature };
  }
  async function send() {
    if (!pair || running || conflict()) return;
    if (!navigator.onLine) {
      ui(
        "Offline. Your family update will retry when this workbook is open online.",
      );
      return;
    }
    const { snapshot, signature } = makePayload();
    if (signature === delivered) {
      ui(
        receipt
          ? "Last confirmed family update: " +
              new Date(receipt).toLocaleString() +
              " · Device " +
              (device || stored("device")).slice(-6).toUpperCase() +
              "."
          : "Family dashboard connected.",
      );
      return;
    }
    running = true;
    const c = pair;
    try {
      identity();
      if (!pending || pending.signature !== signature) {
        const rev = Math.max(
          Date.now(),
          stamp + 1,
          Number(stored("stamp")) + 1,
        );
        stamp = rev;
        persist("stamp", String(rev));
        const blob = await lib.seal(c, device, rev, snapshot);
        pending = { signature, rev, blob };
      }
      if (pair !== c) return;
      const batch = pending;
      const ack = await lib.request({
        op: "write",
        key: c.token,
        id: device,
        rev: batch.rev,
        blob: batch.blob,
      });
      if (pair !== c) return;
      if (ack.rev !== batch.rev) {
        stamp = Math.max(stamp, ack.rev || 0);
        persist("stamp", String(stamp));
        pending = null;
        throw Error("A newer update was received. Retrying.");
      }
      delivered = signature;
      receipt = Date.now();
      persist("receipt", String(receipt));
      persist("delivered", signature);
      pending = null;
      retry = 2500;
      ui(
        "Last confirmed family update: " +
          new Date(receipt).toLocaleString() +
          " · Device " +
          device.slice(-6).toUpperCase() +
          ".",
      );
    } catch {
      if (pair === c) {
        ui(
          "Waiting to sync. The workbook will retry automatically while open.",
        );
        queue(retry);
        retry = Math.min(retry * 2, 60000);
      }
      return;
    } finally {
      running = false;
    }
    if (pair && makePayload().signature !== delivered) queue(200);
  }
  function install(input) {
    try {
      const c = lib.config("writer", input);
      if (!crypto.subtle)
        throw Error(
          "Open the HTTPS workshop in a browser that supports encrypted connections.",
        );
      if (pair && c.token === pair.token && c.cipher === pair.cipher) {
        queue(0);
        return;
      }
      const saved = persist("writer.v1", JSON.stringify(c));
      pair = c;
      pending = null;
      delivered = "";
      receipt = 0;
      persist("delivered", "");
      persist("receipt", "0");
      ui(
        saved
          ? "Connecting this browser to the family dashboard…"
          : "Connecting for this session. This browser blocks saved settings.",
      );
      queue(0);
    } catch (e) {
      ui(e.message);
    }
  }
  function pause() {
    clearTimeout(timer);
    pair = null;
    pending = null;
    delivered = "";
    try {
      localStorage.removeItem(prefix + "writer.v1");
    } catch {}
    persist("paused", "1");
    ui(
      "Automatic updates paused on this browser. Reopen the private device link or reimport the paired family plan to reconnect.",
    );
  }
  function boot() {
    try {
      const raw = stored("writer.v1");
      pair = raw ? lib.config("writer", JSON.parse(raw)) : null;
    } catch {}
    if (pair) {
      delivered = stored("delivered");
      receipt = Number(stored("receipt")) || 0;
      ui("Family dashboard connected.");
      queue(100);
    } else if (plan()?.dashboardPairing && !stored("paused"))
      install(plan().dashboardPairing);
    function pairFromLink() {
      const params = location.hash.match(/^#connect=([\w-]{43})\.([\w-]{43})$/);
      if (!params) return;
      history.replaceState(null, "", "#progress");
      install({ role: "writer", token: params[1], cipher: params[2] });
      persist("paused", "");
      openProgress();
    }
    if (openProgress) {
      pairFromLink();
      window.addEventListener("hashchange", pairFromLink);
    }
    document.addEventListener("click", (ev) => {
      if (ev.target.closest("#disconnectFamily")) pause();
    });
    window.addEventListener("online", () => queue(0));
    window.addEventListener("focus", () => queue(450));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") queue(200);
      else if (pair) send();
    });
    setInterval(() => {
      if (document.visibilityState === "visible") queue(50);
    }, 45000);
    ui(feedback);
  }
  return {
    boot,
    queue,
    pause,
    refreshUI() {
      ui(feedback);
    },
    importPlan(plan) {
      if (plan?.dashboardPairing) {
        persist("paused", "");
        install(plan.dashboardPairing);
      }
    },
  };
}
