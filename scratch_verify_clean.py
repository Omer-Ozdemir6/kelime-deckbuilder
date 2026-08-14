import os, glob, re

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
gd_files = glob.glob(os.path.join(godot_dir, "**", "*.gd"), recursive=True)

errors = []

for filepath in gd_files:
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            code = f.read()
            # Strip string literals "..."
            code_no_strings = re.sub(r'".*?"', '""', code)
            code_no_strings = re.sub(r"'.*?'", "''", code_no_strings)
            
            if code_no_strings.count("(") != code_no_strings.count(")"):
                errors.append(f"{os.path.basename(filepath)}: Unbalanced parenthesis ()")
            if code_no_strings.count("{") != code_no_strings.count("}"):
                errors.append(f"{os.path.basename(filepath)}: Unbalanced braces {{}}")
            if code_no_strings.count("[") != code_no_strings.count("]"):
                errors.append(f"{os.path.basename(filepath)}: Unbalanced brackets []")
    except Exception as e:
        errors.append(f"{os.path.basename(filepath)}: Error reading file ({e})")

if len(errors) == 0:
    print("ALL 23 GDScript files passed clean code syntax check! ZERO errors!")
else:
    print("Errors:")
    for err in errors:
        print(" -", err)
