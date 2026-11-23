"""Build the same portable HTML file for Pages and offline use."""
from pathlib import Path
import base64
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
page = load("shell.html")
for key, value in {"CSS":"\n".join(fonts)+"\n"+load("style.css"), "ROOMS":"\n".join(sections),
                   "BANK":json.dumps(banks,ensure_ascii=False).replace("</","<\\/"),
                   "APP":load("app.js"),"LABS":"\n".join(scripts)}.items():
    page = page.replace("@@"+key+"@@",value)
assert not re.search(r"@@[A-Z]+@@",page)
(root / "docs").mkdir(exist_ok=True)
(root / "docs/index.html").write_text(page)
(root / "docs/.nojekyll").touch()
print("Built", len(page.encode()), "bytes;", {k:len(v) for k,v in banks.items()})
