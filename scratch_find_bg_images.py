import os, glob, re

comp_dir = r"c:\Users\omr_k\Projects\kelime-deckbuilder\src\components"
jsx_files = glob.glob(os.path.join(comp_dir, "*.jsx"))

found_files = []

for filepath in jsx_files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        if re.search(r'src=["\']/[0-9]\.png["\']', content) or "bg-[url" in content:
            found_files.append(filepath)

print("Files containing static background images:", [os.path.basename(f) for f in found_files])
