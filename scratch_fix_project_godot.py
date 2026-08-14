import os

godot_file = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder\project.godot"

project_godot_content = '''; Engine configuration file for Kelime Deckbuilder

config_version=5

[application]

config/name="Kelime Deckbuilder"
config/description="Turkce Kelime ve Strateji Deckbuilder Oyunu"
run/main_scene="res://scenes/Main.tscn"
config/features=PackedStringArray("4.3", "Forward Plus")

[autoload]

GameManager="*res://autoload/GameManager.gd"
WordEngine="*res://autoload/WordEngine.gd"
CardDatabase="*res://autoload/CardDatabase.gd"
AudioManager="*res://autoload/AudioManager.gd"

[display]

window/size/viewport_width=1280
window/size/viewport_height=720
window/stretch/mode="canvas_items"
window/stretch/aspect="expand"

[rendering]

textures/canvas_textures/default_texture_filter=1
'''

with open(godot_file, "w", encoding="utf-8") as f:
    f.write(project_godot_content)

print("project.godot successfully fixed!")
