import os

godot_dir = r"C:\Users\omr_k\Projects\Godot\kelime-deckbuilder"
ui_dir = os.path.join(godot_dir, "scenes", "ui")

# -------------------------------------------------------------
# Upgraded MapScreen.gd (Branching Procedural Map with Lines & Glow)
# -------------------------------------------------------------
map_gd = '''extends Control

@onready var scroll_container = $ScrollContainer
@onready var map_content = $ScrollContainer/Margin/MapContent
@onready var lines_container = $ScrollContainer/Margin/MapContent/LinesContainer
@onready var floors_vbox = $ScrollContainer/Margin/MapContent/FloorsVBox
@onready var boss_banner_label = $HeaderInfo/BossBanner/BossLabel

# Map configuration: 8 floors total (Floor 0 to Floor 7 = Boss)
var total_floors: int = 8
var map_graph: Array = [] # Array of floor arrays: [ [node_obj, ...], [node_obj, ...] ]
var active_floor: int = 0

var node_types = [
	{"type": "COMBAT", "name": "Kelime Savaşı", "icon": "⚔️", "color": Color(0.9, 0.4, 0.4)},
	{"type": "ELITE", "name": "Zorlu Savaş", "icon": "💀", "color": Color(0.95, 0.25, 0.25)},
	{"type": "SHOP", "name": "Tüccar", "icon": "🏪", "color": Color(0.95, 0.85, 0.3)},
	{"type": "CAMP", "name": "Kamp Ateşi", "icon": "🔥", "color": Color(0.4, 0.85, 0.4)},
	{"type": "EVENT", "name": "Gizemli Olay", "icon": "📖", "color": Color(0.8, 0.5, 0.95)},
	{"type": "TRIVIA", "name": "Bilgi Yarışması", "icon": "🧩", "color": Color(0.3, 0.8, 0.95)}
]

func _ready():
	_generate_procedural_map()
	_render_map()
	call_deferred("_draw_connection_lines")

func _generate_procedural_map():
	map_graph.clear()
	
	for floor_idx in range(total_floors):
		var floor_nodes = []
		if floor_idx == 0:
			# Floor 0: 3 Starting Combat nodes
			for i in range(3):
				floor_nodes.append({
					"floor": 0, "idx": i,
					"type": "COMBAT", "name": "Kelime Savaşı", "icon": "⚔️",
					"visited": false, "available": true, "connections": []
				})
		elif floor_idx == total_floors - 1:
			# Final Floor: Boss Node
			floor_nodes.append({
				"floor": floor_idx, "idx": 0,
				"type": "BOSS", "name": "KADEME PATRONU: TEPEGÖZ", "icon": "👑",
				"visited": false, "available": false, "connections": []
			})
		else:
			# Middle Floors: 2 to 3 nodes per floor
			var node_count = randi_range(2, 3)
			for i in range(node_count):
				var n_info = node_types[randi() % node_types.size()]
				if floor_idx == 3: # Force rest camp at floor 3
					n_info = node_types[3]
				elif floor_idx == 5: # Force shop at floor 5
					n_info = node_types[2]
					
				floor_nodes.append({
					"floor": floor_idx, "idx": i,
					"type": n_info["type"], "name": n_info["name"], "icon": n_info["icon"],
					"visited": false, "available": false, "connections": []
				})
				
		map_graph.append(floor_nodes)
		
	# Generate connections between floor N and floor N+1
	for f in range(total_floors - 1):
		var current_f = map_graph[f]
		var next_f = map_graph[f + 1]
		for node in current_f:
			var target_idx = clamp(node["idx"], 0, next_f.size() - 1)
			node["connections"].append(target_idx)
			if randf() > 0.5 and target_idx + 1 < next_f.size():
				node["connections"].append(target_idx + 1)

func _render_map():
	for c in floors_vbox.get_children():
		c.queue_free()
		
	# Render from Boss (Top) down to Floor 0 (Bottom)
	for floor_idx in range(total_floors - 1, -1, -1):
		var floor_nodes = map_graph[floor_idx]
		
		var floor_hbox = HBoxContainer.new()
		floor_hbox.alignment = BoxContainer.ALIGNMENT_CENTER
		floor_hbox.custom_minimum_size = Vector2(0, 75)
		floor_hbox.add_theme_constant_override("separation", 50)
		
		for node_data in floor_nodes:
			var btn = _create_node_button(node_data)
			floor_hbox.add_child(btn)
			node_data["button_node"] = btn
			
		floors_vbox.add_child(floor_hbox)

func _create_node_button(node_data: Dictionary) -> Button:
	var btn = Button.new()
	var is_boss = node_data["type"] == "BOSS"
	btn.custom_minimum_size = Vector2(160, 60) if not is_boss else Vector2(300, 70)
	btn.text = node_data["icon"] + " " + node_data["name"]
	
	var style = StyleBoxFlat.new()
	style.corner_radius_top_left = 10
	style.corner_radius_top_right = 10
	style.corner_radius_bottom_left = 10
	style.corner_radius_bottom_right = 10
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	
	if node_data["visited"]:
		style.bg_color = Color(0.1, 0.1, 0.15, 0.7)
		style.border_color = Color(0.3, 0.3, 0.4, 0.5)
		btn.disabled = true
	elif node_data["available"]:
		style.bg_color = Color(0.15, 0.25, 0.45, 0.95)
		style.border_color = Color(0.4, 0.85, 1.0, 1.0)
		style.shadow_color = Color(0.2, 0.7, 1.0, 0.5)
		style.shadow_size = 8
		btn.disabled = false
	else:
		style.bg_color = Color(0.08, 0.1, 0.15, 0.6)
		style.border_color = Color(0.2, 0.25, 0.35, 0.4)
		btn.disabled = true
		
	btn.add_theme_stylebox_override("normal", style)
	btn.connect("pressed", Callable(self, "_on_node_clicked").bind(node_data))
	
	return btn

func _draw_connection_lines():
	for c in lines_container.get_children():
		c.queue_free()
		
	for f in range(total_floors - 1):
		var current_f = map_graph[f]
		var next_f = map_graph[f + 1]
		for node in current_f:
			var btn_start = node.get("button_node")
			if not btn_start: continue
			
			for conn_idx in node["connections"]:
				if conn_idx < next_f.size():
					var target_node = next_f[conn_idx]
					var btn_end = target_node.get("button_node")
					if btn_end:
						var line = Line2D.new()
						line.width = 3.0
						line.default_color = Color(0.3, 0.6, 0.9, 0.4) if not node["visited"] else Color(0.2, 0.8, 0.5, 0.7)
						var start_pos = btn_start.global_position + btn_start.size / 2.0 - map_content.global_position
						var end_pos = btn_end.global_position + btn_end.size / 2.0 - map_content.global_position
						line.add_point(start_pos)
						line.add_point(end_pos)
						lines_container.add_child(line)

func _on_node_clicked(node_data: Dictionary):
	AudioManager.play_sfx("card_select")
	node_data["visited"] = true
	node_data["available"] = false
	
	# Unlock connected nodes on next floor
	var current_f_idx = node_data["floor"]
	if current_f_idx + 1 < total_floors:
		var next_f = map_graph[current_f_idx + 1]
		for conn_idx in node_data["connections"]:
			if conn_idx < next_f.size():
				next_f[conn_idx]["available"] = true
				
	# Switch state based on node type
	match node_data["type"]:
		"COMBAT", "ELITE", "BOSS":
			GameManager.change_state(GameManager.State.COMBAT)
		"SHOP":
			GameManager.change_state(GameManager.State.SHOP)
		"CAMP":
			GameManager.change_state(GameManager.State.CAMP)
		"EVENT":
			GameManager.change_state(GameManager.State.EVENT)
		"TRIVIA":
			GameManager.change_state(GameManager.State.TRIVIA)
'''

with open(os.path.join(ui_dir, "MapScreen.gd"), "w", encoding="utf-8") as f:
    f.write(map_gd)

# -------------------------------------------------------------
# Upgraded MapScreen.tscn
# -------------------------------------------------------------
map_tscn = '''[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scenes/ui/MapScreen.gd" id="1_map"]

[node name="MapScreen" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_map")

[node name="BG" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
color = Color(0.05, 0.07, 0.12, 1)

[node name="HeaderInfo" type="VBoxContainer" parent="."]
layout_mode = 1
anchors_preset = 10
anchor_right = 1.0
offset_top = 10.0
offset_bottom = 70.0
grow_horizontal = 2
alignment = 1

[node name="Title" type="Label" parent="HeaderInfo"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.85, 0.35, 1)
theme_override_font_sizes/font_size = 22
text = "🗺️ YOL HARİTASI — AŞAMA 1: ANADOLU EFSANELERİ"
horizontal_alignment = 1

[node name="BossBanner" type="PanelContainer" parent="HeaderInfo"]
custom_minimum_size = Vector2(0, 24)
layout_mode = 2

[node name="BossLabel" type="Label" parent="HeaderInfo/BossBanner"]
layout_mode = 2
theme_override_colors/font_color = Color(0.95, 0.3, 0.3, 1)
theme_override_font_sizes/font_size = 14
text = "👑 SON PATRON: EFES TEPEGÖZÜ (300 SKOR HEDEFİ)"
horizontal_alignment = 1

[node name="ScrollContainer" type="ScrollContainer" parent="."]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
offset_top = 75.0
offset_bottom = -10.0
grow_horizontal = 2
grow_vertical = 2

[node name="Margin" type="MarginContainer" parent="ScrollContainer"]
layout_mode = 2
size_flags_horizontal = 3
size_flags_vertical = 3
theme_override_constants/margin_top = 20
theme_override_constants/margin_bottom = 30

[node name="MapContent" type="Control" parent="ScrollContainer/Margin"]
layout_mode = 2
size_flags_horizontal = 3
size_flags_vertical = 3

[node name="LinesContainer" type="Control" parent="ScrollContainer/Margin/MapContent"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2

[node name="FloorsVBox" type="VBoxContainer" parent="ScrollContainer/Margin/MapContent"]
layout_mode = 1
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
theme_override_constants/separation = 40
alignment = 1
'''

with open(os.path.join(ui_dir, "MapScreen.tscn"), "w", encoding="utf-8") as f:
    f.write(map_tscn)

print("MapScreen completely redesigned with procedural branching node graph!")
