import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
autoload_dir = os.path.join(godot_dir, "autoload")
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# 1. NotificationManager.gd (Toast Notifications for Achievements/Objectives)
# -------------------------------------------------------------
noti_gd = '''extends Node

# NotificationManager.gd - Handles Toast Popups across all screens

func show_achievement_toast(title: String, desc: String, parent_node: Node):
	var toast = PanelContainer.new()
	toast.custom_minimum_size = Vector2(340, 64)
	toast.anchors_preset = Control.PRESET_CENTER_TOP
	toast.offset_top = 20
	toast.offset_left = -170
	toast.offset_right = 170
	
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.12, 0.1, 0.18, 0.95)
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.border_color = Color(0.95, 0.8, 0.3)
	style.corner_radius_top_left = 12
	style.corner_radius_top_right = 12
	style.corner_radius_bottom_left = 12
	style.corner_radius_bottom_right = 12
	style.shadow_color = Color(0.95, 0.8, 0.3, 0.4)
	style.shadow_size = 8
	toast.add_theme_stylebox_override("panel", style)
	
	var hbox = HBoxContainer.new()
	hbox.alignment = BoxContainer.ALIGNMENT_CENTER
	toast.add_child(hbox)
	
	var icon = Label.new()
	icon.text = "🏆 "
	icon.add_theme_font_size_override("font_size", 24)
	hbox.add_child(icon)
	
	var vbox = VBoxContainer.new()
	vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	hbox.add_child(vbox)
	
	var t_lbl = Label.new()
	t_lbl.text = title
	t_lbl.add_theme_color_override("font_color", Color(0.95, 0.85, 0.3))
	t_lbl.add_theme_font_size_override("font_size", 14)
	vbox.add_child(t_lbl)
	
	var d_lbl = Label.new()
	d_lbl.text = desc
	d_lbl.add_theme_color_override("font_color", Color(0.8, 0.85, 0.95))
	d_lbl.add_theme_font_size_override("font_size", 12)
	vbox.add_child(d_lbl)
	
	parent_node.add_child(toast)
	AudioManager.play_sfx("victory")
	
	var tween = parent_node.create_tween()
	toast.scale = Vector2(0.8, 0.8)
	tween.tween_property(toast, "scale", Vector2(1.0, 1.0), 0.2).set_ease(Tween.EASE_OUT)
	tween.tween_interval(3.0)
	tween.tween_property(toast, "modulate:a", 0.0, 0.4)
	tween.tween_callback(Callable(toast, "queue_free"))
'''

with open(os.path.join(autoload_dir, "NotificationManager.gd"), "w", encoding="utf-8") as f:
    f.write(noti_gd)

# -------------------------------------------------------------
# 2. ChallengeSelectModal.gd & ChallengeSelectModal.tscn
# -------------------------------------------------------------
challenge_gd = '''extends Control

@onready var close_btn = $Panel/CloseButton
@onready var ch1_btn = $Panel/VBox/Grid/Challenge1
@onready var ch2_btn = $Panel/VBox/Grid/Challenge2
@onready var ch3_btn = $Panel/VBox/Grid/Challenge3

func _ready():
	close_btn.connect("pressed", Callable(self, "_on_close"))
	ch1_btn.connect("pressed", Callable(self, "_start_challenge").bind("SHORT_WORDS"))
	ch2_btn.connect("pressed", Callable(self, "_start_challenge").bind("NO_GOLD"))
	ch3_btn.connect("pressed", Callable(self, "_start_challenge").bind("TIMED"))

func _start_challenge(challenge_id: String):
	AudioManager.play_sfx("card_select")
	GameManager.start_new_run("MIMAR", "WHITE_STAKE")

func _on_close():
	queue_free()
'''

with open(os.path.join(ui_dir, "ChallengeSelectModal.gd"), "w", encoding="utf-8") as f:
    f.write(challenge_gd)

challenge_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/ChallengeSelectModal.gd" id="1_ch"]

[node name="ChallengeSelectModal" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_ch")

[node name="Overlay" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0, 0, 0, 0.85)

[node name="Panel" type="Panel" parent="."]
custom_minimum_size = Vector2(580, 420)
layout_mode = 1
anchors_preset = 8
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -290.0
offset_top = -210.0
offset_right = 290.0
offset_bottom = 210.0
grow_horizontal = 2
grow_vertical = 2

[node name="CloseButton" type="Button" parent="Panel"]
custom_minimum_size = Vector2(36, 36)
layout_mode = 1
anchors_preset = 1
anchor_left = 1.0
anchor_right = 1.0
offset_left = -44.0
offset_top = 10.0
offset_right = -8.0
offset_bottom = 46.0
grow_horizontal = 0
text = "❌"

[node name="VBox" type="VBoxContainer" parent="Panel"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 24.0
offset_top = 20.0
offset_right = -24.0
offset_bottom = -20.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 16

[node name="Title" type="Label" parent="Panel/VBox"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 22
text = "🔥 ÖZEL MEYDAN OKUMALAR (CHALLENGES)"
horizontal_alignment = 1

[node name="Grid" type="VBoxContainer" parent="Panel/VBox"]
layout_mode = 2
size_flags_vertical = 3
theme_override_constants/separation = 12
alignment = 1

[node name="Challenge1" type="Button" parent="Panel/VBox/Grid"]
custom_minimum_size = Vector2(0, 60)
layout_mode = 2
text = "⏳ Sadece 3 Harfli Kelimeler (Zorluk: ⭐⭐⭐)\nKural: 4+ harfli kelimeler skor vermez!"

[node name="Challenge2" type="Button" parent="Panel/VBox/Grid"]
custom_minimum_size = Vector2(0, 60)
layout_mode = 2
text = "🚫 Altınsız Sınav (Zorluk: ⭐⭐⭐⭐)\nKural: Hiçbir aşamada altın kazanılamaz!"

[node name="Challenge3" type="Button" parent="Panel/VBox/Grid"]
custom_minimum_size = Vector2(0, 60)
layout_mode = 2
text = "⚡ Zamana Karşı Yarış (Zorluk: ⭐⭐⭐⭐⭐)\nKural: Her aşamada 45 saniye süren var!"
'''

with open(os.path.join(ui_dir, "ChallengeSelectModal.tscn"), "w", encoding="utf-8") as f:
    f.write(challenge_tscn)

# Register NotificationManager in project.godot if missing
project_godot_path = os.path.join(godot_dir, "project.godot")
with open(project_godot_path, "r", encoding="utf-8") as f:
    p_code = f.read()

if "NotificationManager=" not in p_code:
    p_code = p_code.replace(
        'AudioManager="*res://autoload/AudioManager.gd"',
        'AudioManager="*res://autoload/AudioManager.gd"\nNotificationManager="*res://autoload/NotificationManager.gd"'
    )
    with open(project_godot_path, "w", encoding="utf-8") as f:
        f.write(p_code)

print("NotificationManager and ChallengeSelectModal successfully added!")
