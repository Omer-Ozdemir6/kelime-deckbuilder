import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
autoload_dir = os.path.join(godot_dir, "autoload")
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# 1. VFXManager.gd - Global UI VFX & Particle System
# -------------------------------------------------------------
vfx_gd = '''extends Node

# VFXManager.gd - Global Manager for UI Visual Effects, Floating Text & Screen Shake

func spawn_floating_text(text: String, global_pos: Vector2, text_color: Color, parent_node: Node):
	var lbl = Label.new()
	lbl.text = text
	lbl.position = global_pos - Vector2(40, 20)
	lbl.add_theme_color_override("font_color", text_color)
	lbl.add_theme_font_size_override("font_size", 24)
	lbl.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.9))
	lbl.add_theme_constant_override("shadow_offset_x", 2)
	lbl.add_theme_constant_override("shadow_offset_y", 2)
	lbl.z_index = 100
	parent_node.add_child(lbl)
	
	var tween = parent_node.create_tween().set_parallel(true)
	tween.tween_property(lbl, "position:y", lbl.position.y - 60.0, 0.8).set_ease(Tween.EASE_OUT)
	tween.tween_property(lbl, "scale", Vector2(1.2, 1.2), 0.2)
	tween.chain().tween_property(lbl, "modulate:a", 0.0, 0.4)
	tween.chain().tween_callback(Callable(lbl, "queue_free"))

func trigger_screen_shake(target_node: Node, intensity: float = 12.0):
	if not target_node:
		return
	var orig_pos = target_node.position
	var tween = target_node.create_tween()
	for i in range(5):
		var offset = Vector2(randf_range(-intensity, intensity), randf_range(-intensity, intensity))
		tween.tween_property(target_node, "position", orig_pos + offset, 0.04)
	tween.tween_property(target_node, "position", orig_pos, 0.04)

func spawn_spark_burst(global_pos: Vector2, parent_node: Node, spark_color: Color = Color(0.95, 0.85, 0.3)):
	for i in range(8):
		var p = ColorRect.new()
		p.custom_minimum_size = Vector2(6, 6)
		p.position = global_pos
		p.color = spark_color
		p.z_index = 90
		parent_node.add_child(p)
		
		var angle = randf() * TAU
		var dist = randf_range(40, 90)
		var target_p = global_pos + Vector2(cos(angle) * dist, sin(angle) * dist)
		
		var tween = parent_node.create_tween().set_parallel(true)
		tween.tween_property(p, "position", target_p, 0.5).set_ease(Tween.EASE_OUT)
		tween.tween_property(p, "modulate:a", 0.0, 0.5)
		tween.chain().tween_callback(Callable(p, "queue_free"))
'''

with open(os.path.join(autoload_dir, "VFXManager.gd"), "w", encoding="utf-8") as f:
    f.write(vfx_gd)

# -------------------------------------------------------------
# 2. Update WordPlayArea.gd to integrate VFX
# -------------------------------------------------------------
play_gd_path = os.path.join(ui_dir, "WordPlayArea.gd")
with open(play_gd_path, "r", encoding="utf-8") as f:
    play_code = f.read()

# Add VFX triggers on play word
vfx_trigger_code = '''		var points = eval_res["total_score"]
		GameManager.current_score += points
		GameManager.hands_left -= 1
		GameManager.streak += 1
		
		# UI VFX Effects
		VFXManager.spawn_floating_text("+" + str(points) + " PUAN!", Vector2(640, 360), Color(0.3, 0.95, 0.6), self)
		VFXManager.trigger_screen_shake(self, 8.0)
		VFXManager.spawn_spark_burst(Vector2(640, 360), self, Color(0.95, 0.85, 0.3))'''

play_code = play_code.replace(
    'var points = eval_res["total_score"]\n\t\tGameManager.current_score += points\n\t\tGameManager.hands_left -= 1\n\t\tGameManager.streak += 1',
    vfx_trigger_code
)

with open(play_gd_path, "w", encoding="utf-8") as f:
    f.write(play_code)

# -------------------------------------------------------------
# 3. Register VFXManager in project.godot
# -------------------------------------------------------------
project_godot_path = os.path.join(godot_dir, "project.godot")
with open(project_godot_path, "r", encoding="utf-8") as f:
    p_code = f.read()

if "VFXManager=" not in p_code:
    p_code = p_code.replace(
        'NotificationManager="*res://autoload/NotificationManager.gd"',
        'NotificationManager="*res://autoload/NotificationManager.gd"\nVFXManager="*res://autoload/VFXManager.gd"'
    )
    with open(project_godot_path, "w", encoding="utf-8") as f:
        f.write(p_code)

print("UI VFX System & Particle Engine successfully integrated!")
