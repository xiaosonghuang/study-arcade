"""Build the same portable HTML file for Pages and offline use."""
from pathlib import Path
import base64
import hashlib
import json
import re
root = Path(__file__).resolve().parent
src = root / "src"
def load(name):
    return (src / name).read_text()
fonts = []
for file, family in [("bricolagegrotesque","Bricolage Grotesque"),("dmsans","DM Sans")]:
    data = base64.b64encode((src / "fonts" / (file + ".font")).read_bytes()).decode()
    license_text = load("fonts/" + file + ".license").replace("*/","")
    fonts.append(f"/* {license_text} */\n@font-face{{font-family:'{family}';font-style:normal;font-weight:400 800;src:url(data:font/woff2;base64,{data}) format('woff2');font-display:swap}}")
banks = {}
sections = []
scripts = []
for name in ("computing","stem","english"):
    sections.append(load(name + ".html"))
    banks.update(json.loads(load(name + ".json")))
    scripts.append(load(name + ".js"))
live = load("live-common.js").replace("@@LIVE_ENDPOINT@@", load("live-endpoint.txt").strip())
learner_live = live + "\n" + load("report-transport.js")
guides = []
for subject in ("computing", "stem", "english"):
    guides.extend(json.loads(load("guides-" + subject + ".json")))
def inline_json(data):
    return json.dumps(data,ensure_ascii=False,separators=(",",":")).replace("</","<\\/")
catalog = [{key:g[key] for key in ("id","room","title","skill","coach")} for g in guides]
shared = load("guide-shared.js").replace("@@GUIDE_CATALOG@@",inline_json(catalog))
page = load("shell.html")
for key, value in {"CSS":"\n".join(fonts)+"\n"+load("style.css"), "ROOMS":"\n".join(sections),
                   "GUIDES":inline_json(guides),"GUIDE_SHARED":shared,"LEARNING":load("learning.js")+"\n"+load("lesson-panel.js"),
                   "BANK":json.dumps(banks,ensure_ascii=False).replace("</","<\\/"),
                   "LIVE_COMMON":learner_live, "PARENT_SYNC":load("parent-report.js"), "APP":load("app.js"),"LABS":"\n".join(scripts)}.items():
    page = page.replace("@@"+key+"@@",value)
assert not re.search(r"@@[A-Z]+@@",page)
(root / "docs").mkdir(exist_ok=True)
(root / "docs/index.html").write_text(page)
edition = hashlib.sha256(page.encode()).hexdigest()[:16]
(root / "docs/workbook-worker.js").write_text(load("workbook-worker.js").replace("@@EDITION@@",edition))
(root / "docs/.nojekyll").touch()
print("Built", len(page.encode()), "bytes;", {k:len(v) for k,v in banks.items()})

parent = root / "docs/parent"
parent.mkdir(exist_ok=True)
parent_page = load("parent-view.html").replace("@@LIVE_COMMON@@",live)
parent_page = parent_page.replace("@@GUIDE_SHARED@@",shared).replace("@@GRADE_REPORT@@",load("grade2-parent.js"))
(parent / "index.html").write_text(parent_page)
# The Grade 2 edition runs from both a Pages subdirectory and a downloaded file.
grade = src / "grade2"
illustrations = [
    "data:image/jpeg;base64," + base64.b64encode((grade / f"scene-{n}.jpg").read_bytes()).decode("ascii")
    for n in range(1, 5)
]
script_order = ["data.js", "quest-data.js", "trail-math.js", "trail-words.js", "trail-interests.js", "trail-state.js", "core.js", "lessons.js", "adventure.js", "shoebox.js", "trails.js", "trail-actions.js", "trail-report.js", "app.js"]
fieldbook = (grade / "page.html").read_text()
fieldbook = fieldbook.replace("@@LIVE_COMMON@@",learner_live)
fieldbook = fieldbook.replace("@@ART@@", json.dumps(illustrations))
fieldbook = fieldbook.replace("@@CSS@@", "\n".join(fonts) + "\n" + (grade / "style.css").read_text() + "\n" + (grade / "trails.css").read_text())
fieldbook = fieldbook.replace("@@CODE@@", "\n".join((grade / part).read_text() for part in script_order))
box_art = ["data:image/png;base64," + base64.b64encode((grade / f"shoebox-{name}.png").read_bytes()).decode("ascii")
           for name in ("side", "depth", "tab")]
fieldbook = fieldbook.replace("@@BOXART@@", json.dumps(box_art))
assert not re.search(r"@@[A-Z]+@@", fieldbook)
grade_output = root / "docs" / "grade-2"
grade_output.mkdir(exist_ok=True)
(grade_output / "index.html").write_text(fieldbook)
print("Built Grade 2 Fieldbook:", len(fieldbook.encode()), "bytes")
