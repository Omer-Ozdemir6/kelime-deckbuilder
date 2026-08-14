import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# Update WordPlayArea.gd to transition to DRAFT reward screen
# -------------------------------------------------------------
play_gd_path = os.path.join(ui_dir, "WordPlayArea.gd")

with open(play_gd_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace transition after victory with State.DRAFT
new_content = content.replace(
    'GameManager.change_state(GameManager.State.MAP)',
    'GameManager.change_state(GameManager.State.DRAFT)'
)

with open(play_gd_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("WordPlayArea.gd victory transition updated to State.DRAFT!")
