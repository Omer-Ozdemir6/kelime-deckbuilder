import os, glob

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
gd_files = glob.glob(os.path.join(godot_dir, "**", "*.gd"), recursive=True)

print(f"Found {len(gd_files)} GDScript files in project.")
errors = []

for filepath in gd_files:
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            code = f.read()
            # Basic syntax check for unbalanced parens/brackets
            if code.count("(") != code.count(")"):
                errors.append(f"{os.path.basename(filepath)}: Unbalanced parenthesis ()")
            if code.count("{") != code.count("}"):
                errors.append(f"{os.path.basename(filepath)}: Unbalanced braces {{}}")
            if code.count("[") != code.count("]"):
                errors.append(f"{os.path.basename(filepath)}: Unbalanced brackets []")
    except Exception as e:
        errors.append(f"{os.path.basename(filepath)}: Error reading file ({e})")

if len(errors) == 0:
    print("ALL GDScript files passed code structure verification successfully!")
else:
    print("Found structural issues:")
    for err in errors:
        print(" -", err)
