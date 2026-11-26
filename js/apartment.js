/* ========================================================
   Peekko - 4 Distinct Bird's-Eye Maps
   Map 1: Skyglass Penthouse | Map 2: Heritage Manor
   Map 3: Underground Basement | Map 4: Grand Shopping Mall
   ======================================================== */

class ApartmentMap {
  constructor() {
    this.mapId = 1;
    this.mapName = 'Skyglass Penthouse';
    this.width = 1360;
    this.height = 840;
    this.spawn = { x: 680, y: 725 };
    this.botSpawn = { x: 680, y: 755 };
    this.ambientLights = [];
    this.rooms = [];
    this.walls = [];
    this.glassWalls = [];
    this.doors = [];
    this.parkingLines = [];
    this.hidingSpots = [];
    this.decorProps = [];
    this.solidColliders = [];
    this.navNodes = {};
    this.roomHubNode = {};

    this.loadMap(1);
  }

  loadMap(id) {
    this.mapId = Number(id) || 1;
    this.parkingLines = [];
    this.glassWalls = [];
    if (this.mapId === 2) {
      this.buildManorMap();
    } else if (this.mapId === 3) {
      this.buildBasementMap();
    } else if (this.mapId === 4) {
      this.buildMuseumMap();
    } else if (this.mapId === 5) {
      this.buildAmusementMap();
    } else {
      this.buildPenthouseMap();
    }

    this.solidColliders = [
      ...this.walls,
      ...this.glassWalls,
      ...this.hidingSpots.map(s => ({ x: s.x, y: s.y, w: s.w, h: s.h })),
      ...this.decorProps.map(p => ({ x: p.x, y: p.y, w: p.w, h: p.h }))
    ];
  }

  // ========================================================
  // MAP 1: SKYGLASS PENTHOUSE (1360 x 840, 20 Spots)
  // ========================================================
  buildPenthouseMap() {
    this.mapName = 'Skyglass Penthouse';
    this.width = 1360;
    this.height = 840;
    this.spawn = { x: 680, y: 725 };
    this.botSpawn = { x: 680, y: 755 };

    this.rooms = [
      { id: 'terrace', name: 'SKY TERRACE', x: 40, y: 40, w: 860, h: 170, floor: 'tile_warm' },
      { id: 'spa', name: 'SPA BATHROOM', x: 900, y: 40, w: 420, h: 280, floor: 'tile' },
      { id: 'master_loft', name: 'MASTER SUITE', x: 40, y: 210, w: 420, h: 330, floor: 'wood', rug: { x: 180, y: 290, w: 180, h: 120, color: 'blue' } },
      { id: 'gallery', name: 'LOUNGE & BAR', x: 460, y: 210, w: 440, h: 330, floor: 'wood_dark', rug: { x: 560, y: 350, w: 220, h: 130, color: 'crimson' } },
      { id: 'library', name: 'PRIVATE STUDY', x: 900, y: 320, w: 420, h: 240, floor: 'wood', rug: { x: 1030, y: 390, w: 140, h: 90, color: 'amber' } },
      { id: 'theater', name: 'HOME THEATER', x: 40, y: 540, w: 520, h: 260, floor: 'wood_dark', rug: { x: 130, y: 580, w: 260, h: 150, color: 'slate' } },
      { id: 'foyer', name: 'ELEVATOR FOYER', x: 560, y: 540, w: 240, h: 260, floor: 'tile_warm' },
      { id: 'chef_kitchen', name: "CHEF'S KITCHEN", x: 800, y: 560, w: 520, h: 240, floor: 'tile' }
    ];

    this.walls = [
      { x: 40, y: 40, w: 1280, h: 14 },
      { x: 40, y: 40, w: 14, h: 760 },
      { x: 1306, y: 40, w: 14, h: 760 },
      { x: 40, y: 786, w: 590, h: 14 },
      { x: 730, y: 786, w: 590, h: 14 },

      { x: 40, y: 203, w: 200, h: 14 },
      { x: 330, y: 203, w: 290, h: 14 },
      { x: 710, y: 203, w: 190, h: 14 },

      { x: 893, y: 40, w: 14, h: 190 },
      { x: 893, y: 300, w: 14, h: 90 },
      { x: 893, y: 470, w: 14, h: 90 },

      { x: 900, y: 313, w: 160, h: 14 },
      { x: 1140, y: 313, w: 180, h: 14 },

      { x: 453, y: 210, w: 14, h: 130 },
      { x: 453, y: 420, w: 14, h: 120 },

      { x: 40, y: 533, w: 300, h: 14 },
      { x: 430, y: 533, w: 185, h: 14 },
      { x: 745, y: 533, w: 155, h: 14 },

      { x: 900, y: 553, w: 160, h: 14 },
      { x: 1140, y: 553, w: 180, h: 14 },

      { x: 553, y: 540, w: 14, h: 260 },
      { x: 793, y: 540, w: 14, h: 90 },
      { x: 793, y: 710, w: 14, h: 90 }
    ];

    this.doors = [
      { hingeX: 240, hingeY: 210, radius: 75, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.3 },
      { hingeX: 620, hingeY: 210, radius: 75, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.3 },
      { hingeX: 460, hingeY: 340, radius: 72, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.35 },
      { hingeX: 340, hingeY: 540, radius: 75, startAngle: 0, endAngle: Math.PI / 2, leafAngle: 0.35 },
      { hingeX: 800, hingeY: 630, radius: 72, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.4 },
      { hingeX: 1060, hingeY: 320, radius: 72, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.35 }
    ];

    this.hidingSpots = [
      { id: 'p_terrace_lounger1', name: 'Under Sun Lounger', roomId: 'terrace', roomName: 'Sky Terrace', type: 'double_bed', x: 85, y: 72, w: 130, h: 60, hideX: 150, hideY: 102, ix: 150, iy: 154, stealthWeight: 1.0, checked: false },
      { id: 'p_terrace_cabana', name: 'Behind Cabana Curtains', roomId: 'terrace', roomName: 'Sky Terrace', type: 'curtain', x: 405, y: 62, w: 155, h: 42, hideX: 482, hideY: 83, ix: 482, iy: 126, stealthWeight: 0.85, checked: false },
      { id: 'p_terrace_planter', name: 'Behind Bamboo Planter', roomId: 'terrace', roomName: 'Sky Terrace', type: 'cabinet', x: 755, y: 74, w: 112, h: 46, hideX: 811, hideY: 97, ix: 811, iy: 142, stealthWeight: 0.9, checked: false },

      { id: 'p_king_bed', name: 'Under King Canopy Bed', roomId: 'master_loft', roomName: 'Master Suite', type: 'double_bed', x: 74, y: 270, w: 156, h: 122, hideX: 152, hideY: 331, ix: 254, iy: 331, stealthWeight: 0.95, checked: false },
      { id: 'p_walkin_closet', name: 'Inside Walk-In Closet', roomId: 'master_loft', roomName: 'Master Suite', type: 'wardrobe', x: 74, y: 468, w: 165, h: 48, hideX: 156, hideY: 492, ix: 156, iy: 444, stealthWeight: 0.85, checked: false },
      { id: 'p_vanity', name: 'Under Loft Vanity', roomId: 'master_loft', roomName: 'Master Suite', type: 'dressing_table', x: 290, y: 224, w: 126, h: 44, hideX: 353, hideY: 246, ix: 353, iy: 288, stealthWeight: 0.9, checked: false },

      { id: 'p_jacuzzi', name: 'Behind Jacuzzi Screen', roomId: 'spa', roomName: 'Spa Bathroom', type: 'bathtub', x: 940, y: 66, w: 165, h: 82, hideX: 1022, hideY: 107, ix: 1022, iy: 170, stealthWeight: 0.9, checked: false },
      { id: 'p_sauna_cabinet', name: 'Inside Sauna Cabinet', roomId: 'spa', roomName: 'Spa Bathroom', type: 'wardrobe', x: 1232, y: 74, w: 56, h: 124, hideX: 1260, hideY: 136, ix: 1206, iy: 136, stealthWeight: 0.9, checked: false },
      { id: 'p_spa_vanity', name: 'Under Marble Vanity', roomId: 'spa', roomName: 'Spa Bathroom', type: 'vanity_sink', x: 1080, y: 64, w: 112, h: 44, hideX: 1136, hideY: 86, ix: 1136, iy: 130, stealthWeight: 0.95, checked: false },

      { id: 'p_bar_counter', name: 'Behind Cocktail Bar', roomId: 'gallery', roomName: 'Lounge & Bar', type: 'bar_counter', x: 525, y: 280, w: 185, h: 50, hideX: 617, hideY: 305, ix: 617, iy: 350, stealthWeight: 1.15, checked: false },
      { id: 'p_art_console', name: 'Behind Art Console', roomId: 'gallery', roomName: 'Lounge & Bar', type: 'cabinet', x: 474, y: 440, w: 50, h: 74, hideX: 499, hideY: 477, ix: 545, iy: 477, stealthWeight: 0.95, checked: false },

      { id: 'p_exec_desk', name: 'Under Executive Desk', roomId: 'library', roomName: 'Private Study', type: 'desk', x: 940, y: 356, w: 138, h: 54, hideX: 1009, hideY: 383, ix: 1009, iy: 432, stealthWeight: 1.0, checked: false },
      { id: 'p_library_shelf', name: 'Behind Library Shelf', roomId: 'library', roomName: 'Private Study', type: 'bookshelf', x: 1242, y: 345, w: 48, h: 145, hideX: 1266, hideY: 417, ix: 1218, iy: 417, stealthWeight: 0.9, checked: false },
      { id: 'p_reading_sofa', name: 'Behind Reading Sofa', roomId: 'library', roomName: 'Private Study', type: 'sofa', x: 930, y: 484, w: 112, h: 50, hideX: 986, hideY: 509, ix: 986, iy: 462, stealthWeight: 0.95, checked: false },

      { id: 'p_drape_corner', name: 'Behind Theater Drapes', roomId: 'theater', roomName: 'Home Theater', type: 'curtain', x: 68, y: 558, w: 120, h: 32, hideX: 128, hideY: 574, ix: 128, iy: 610, stealthWeight: 0.95, checked: false },
      { id: 'p_cinema_sofa', name: 'Behind Cinema Sofa', roomId: 'theater', roomName: 'Home Theater', type: 'sofa', x: 90, y: 642, w: 205, h: 64, hideX: 192, hideY: 674, ix: 192, iy: 618, stealthWeight: 1.1, checked: false },
      { id: 'p_projector_rack', name: 'Inside Media Rack', roomId: 'theater', roomName: 'Home Theater', type: 'tv_console', x: 478, y: 582, w: 54, h: 124, hideX: 505, hideY: 644, ix: 454, iy: 644, stealthWeight: 0.9, checked: false },

      { id: 'p_kitchen_island', name: 'Under Chef Island', roomId: 'chef_kitchen', roomName: "Chef's Kitchen", type: 'dining_table', x: 928, y: 632, w: 158, h: 72, hideX: 1007, hideY: 668, ix: 904, iy: 668, stealthWeight: 1.15, checked: false },
      { id: 'p_wine_pantry', name: 'Inside Wine Pantry', roomId: 'chef_kitchen', roomName: "Chef's Kitchen", type: 'pantry', x: 1236, y: 590, w: 54, h: 132, hideX: 1263, hideY: 656, ix: 1212, iy: 656, stealthWeight: 0.85, checked: false },
      { id: 'p_breakfast_booth', name: 'Under Breakfast Booth', roomId: 'chef_kitchen', roomName: "Chef's Kitchen", type: 'coffee_table', x: 825, y: 726, w: 146, h: 48, hideX: 898, hideY: 750, ix: 898, iy: 702, stealthWeight: 0.95, checked: false }
    ];

    this.decorProps = [
      { type: 'nightstand', roomId: 'master_loft', x: 74, y: 405, w: 34, h: 34 },
      { type: 'toilet', roomId: 'spa', x: 1235, y: 245, w: 42, h: 48 },
      { type: 'plant', roomId: 'terrace', x: 58, y: 58, w: 34, h: 34 },
      { type: 'plant', roomId: 'gallery', x: 770, y: 215, w: 36, h: 36 },
      { type: 'shoe_rack', roomId: 'foyer', x: 580, y: 730, w: 55, h: 36 },
      { type: 'coat_rack', roomId: 'foyer', x: 735, y: 730, w: 36, h: 36 },
      { type: 'fridge', roomId: 'chef_kitchen', x: 1150, y: 724, w: 68, h: 52 }
    ];

    this.ambientLights = [
      { x: 91, y: 422, r: 95, color: 'rgba(254, 240, 138, 0.10)' },
      { x: 617, y: 277, r: 120, color: 'rgba(245, 158, 11, 0.09)' },
      { x: 505, y: 644, r: 115, color: 'rgba(56, 189, 248, 0.10)' },
      { x: 680, y: 725, r: 100, color: 'rgba(253, 186, 116, 0.08)' }
    ];

    this.navNodes = {
      foyer_spawn: { x: 680, y: 725, neighbors: ['foyer_mid', 'kitchen_entry_left'] },
      foyer_mid: { x: 680, y: 610, neighbors: ['foyer_spawn', 'gallery_south'] },
      gallery_south: { x: 680, y: 520, neighbors: ['foyer_mid', 'gallery_center'] },
      gallery_center: { x: 680, y: 400, neighbors: ['gallery_south', 'gallery_hall_west', 'gallery_door_spa', 'master_door_east', 'library_door_west'] },
      gallery_hall_west: { x: 495, y: 340, neighbors: ['gallery_center', 'gallery_north_west'] },
      gallery_north_west: { x: 495, y: 235, neighbors: ['gallery_hall_west', 'gallery_north'] },
      gallery_north: { x: 665, y: 235, neighbors: ['gallery_north_west', 'terrace_door_east'] },
      terrace_door_east: { x: 665, y: 175, neighbors: ['gallery_north', 'terrace_mid'] },
      terrace_mid: { x: 480, y: 155, neighbors: ['terrace_door_east', 'terrace_door_west'] },
      terrace_door_west: { x: 285, y: 175, neighbors: ['terrace_mid', 'master_north'] },
      master_north: { x: 255, y: 245, neighbors: ['terrace_door_west', 'master_center'] },
      master_center: { x: 285, y: 380, neighbors: ['master_north', 'master_door_east', 'master_south'] },
      master_door_east: { x: 450, y: 380, neighbors: ['master_center', 'gallery_center'] },
      master_south: { x: 385, y: 480, neighbors: ['master_center', 'theater_door_north'] },
      theater_door_north: { x: 385, y: 565, neighbors: ['master_south', 'theater_mid'] },
      theater_mid: { x: 350, y: 616, neighbors: ['theater_door_north', 'theater_west'] },
      theater_west: { x: 220, y: 616, neighbors: ['theater_mid'] },
      gallery_door_spa: { x: 860, y: 265, neighbors: ['gallery_center', 'spa_door_west'] },
      spa_door_west: { x: 925, y: 265, neighbors: ['gallery_door_spa', 'spa_center'] },
      spa_center: { x: 1040, y: 200, neighbors: ['spa_door_west', 'spa_south_door'] },
      spa_south_door: { x: 1100, y: 340, neighbors: ['spa_center', 'library_center'] },
      library_door_west: { x: 925, y: 430, neighbors: ['gallery_center', 'library_center'] },
      library_center: { x: 1100, y: 435, neighbors: ['spa_south_door', 'library_door_west', 'library_south_door'] },
      library_south_door: { x: 1100, y: 580, neighbors: ['library_center', 'kitchen_north'] },
      kitchen_north: { x: 1125, y: 595, neighbors: ['library_south_door', 'kitchen_aisle_north'] },
      kitchen_aisle_north: { x: 870, y: 595, neighbors: ['kitchen_north', 'kitchen_entry_left'] },
      kitchen_entry_left: { x: 840, y: 670, neighbors: ['kitchen_aisle_north', 'foyer_spawn'] }
    };

    this.roomHubNode = {
      terrace: 'terrace_mid',
      spa: 'spa_center',
      master_loft: 'master_center',
      gallery: 'gallery_center',
      library: 'library_center',
      theater: 'theater_mid',
      foyer: 'foyer_mid',
      chef_kitchen: 'kitchen_aisle_north'
    };
  }

  // ========================================================
  // MAP 2: HERITAGE MANOR (2200 x 1400, 20 Spots)
  // ========================================================
  buildManorMap() {
    this.mapName = 'Heritage Manor';
    this.width = 2200;
    this.height = 1400;
    this.spawn = { x: 380, y: 1260 };
    this.botSpawn = { x: 380, y: 1290 };

    this.rooms = [
      { id: 'library', name: 'ROYAL LIBRARY', x: 40, y: 40, w: 680, h: 780, floor: 'wood', rug: { x: 200, y: 260, w: 340, h: 240, color: 'blue' } },
      { id: 'banquet', name: 'BANQUET DINING HALL', x: 720, y: 40, w: 760, h: 780, floor: 'wood_dark', rug: { x: 860, y: 200, w: 480, h: 400, color: 'crimson' } },
      { id: 'conservatory', name: 'MASTER CONSERVATORY', x: 1480, y: 40, w: 680, h: 780, floor: 'tile', rug: { x: 1680, y: 270, w: 280, h: 220, color: 'amber' } },
      { id: 'foyer', name: 'GRAND FOYER', x: 40, y: 820, w: 680, h: 540, floor: 'tile_warm', rug: { x: 230, y: 980, w: 300, h: 200, color: 'amber' } },
      { id: 'parlor', name: 'PARLOUR & DRAWING ROOM', x: 720, y: 820, w: 1440, h: 540, floor: 'wood', rug: { x: 1120, y: 960, w: 560, h: 240, color: 'crimson' } }
    ];

    this.walls = [
      // Outer perimeter (bottom foyer entrance gap at x: 320..440)
      { x: 40, y: 40, w: 2120, h: 14 },
      { x: 40, y: 40, w: 14, h: 1320 },
      { x: 2146, y: 40, w: 14, h: 1320 },
      { x: 40, y: 1346, w: 280, h: 14 },
      { x: 440, y: 1346, w: 1720, h: 14 },

      // Vertical wall x=713 (library | banquet, door y: 360..480; foyer | parlor, door y: 1020..1140)
      { x: 713, y: 40, w: 14, h: 320 },
      { x: 713, y: 480, w: 14, h: 540 },
      { x: 713, y: 1140, w: 14, h: 220 },

      // Vertical wall x=1473 (banquet | conservatory, door y: 360..480)
      { x: 1473, y: 40, w: 14, h: 320 },
      { x: 1473, y: 480, w: 14, h: 340 },

      // Horizontal wall y=813 (doors at x: 320..440, 1040..1160, 1760..1880)
      { x: 40, y: 813, w: 280, h: 14 },
      { x: 440, y: 813, w: 600, h: 14 },
      { x: 1160, y: 813, w: 600, h: 14 },
      { x: 1880, y: 813, w: 280, h: 14 }
    ];

    this.doors = [
      { hingeX: 720, hingeY: 360, radius: 90, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.35 },
      { hingeX: 1480, hingeY: 360, radius: 90, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.35 },
      { hingeX: 320, hingeY: 820, radius: 90, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.35 },
      { hingeX: 1040, hingeY: 820, radius: 90, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.35 },
      { hingeX: 1760, hingeY: 820, radius: 90, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.35 },
      { hingeX: 720, hingeY: 1020, radius: 90, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.35 }
    ];

    this.hidingSpots = [
      // Royal Library (4 spots)
      { id: 'm2_lib_shelf1', name: 'Behind North Bookshelf', roomId: 'library', roomName: 'Royal Library', type: 'bookshelf', x: 100, y: 76, w: 190, h: 52, hideX: 195, hideY: 102, ix: 195, iy: 160, stealthWeight: 1.0, checked: false },
      { id: 'm2_lib_shelf2', name: 'Behind East Bookshelf', roomId: 'library', roomName: 'Royal Library', type: 'bookshelf', x: 460, y: 76, w: 190, h: 52, hideX: 555, hideY: 102, ix: 555, iy: 160, stealthWeight: 1.0, checked: false },
      { id: 'm2_lib_desk', name: 'Under Scholar Desk', roomId: 'library', roomName: 'Royal Library', type: 'desk', x: 110, y: 360, w: 150, h: 72, hideX: 185, hideY: 396, ix: 185, iy: 466, stealthWeight: 0.9, checked: false },
      { id: 'm2_lib_chest', name: 'Inside Manuscript Chest', roomId: 'library', roomName: 'Royal Library', type: 'chest', x: 110, y: 650, w: 120, h: 58, hideX: 170, hideY: 679, ix: 170, iy: 618, stealthWeight: 0.95, checked: false },

      // Banquet Dining Hall (4 spots)
      { id: 'm2_banq_table', name: 'Under Mahogany Dining Table', roomId: 'banquet', roomName: 'Banquet Hall', type: 'dining_table', x: 930, y: 310, w: 340, h: 110, hideX: 1100, hideY: 365, ix: 1100, iy: 454, stealthWeight: 1.0, checked: false },
      { id: 'm2_banq_sideboard1', name: 'Inside Silverware Sideboard', roomId: 'banquet', roomName: 'Banquet Hall', type: 'cabinet', x: 800, y: 76, w: 180, h: 54, hideX: 890, hideY: 103, ix: 890, iy: 162, stealthWeight: 0.9, checked: false },
      { id: 'm2_banq_sideboard2', name: 'Inside Wine Sideboard', roomId: 'banquet', roomName: 'Banquet Hall', type: 'pantry', x: 1220, y: 76, w: 180, h: 54, hideX: 1310, hideY: 103, ix: 1310, iy: 162, stealthWeight: 0.9, checked: false },
      { id: 'm2_banq_curtain', name: 'Behind Banquet Drapes', roomId: 'banquet', roomName: 'Banquet Hall', type: 'curtain', x: 760, y: 680, w: 170, h: 48, hideX: 845, hideY: 704, ix: 845, iy: 648, stealthWeight: 0.85, checked: false },

      // Master Conservatory (4 spots)
      { id: 'm2_cons_piano', name: 'Behind Grand Piano', roomId: 'conservatory', roomName: 'Master Conservatory', type: 'piano', x: 1740, y: 260, w: 160, h: 120, hideX: 1820, hideY: 320, ix: 1706, iy: 320, stealthWeight: 1.0, checked: false },
      { id: 'm2_cons_curtain', name: 'Behind Conservatory Curtains', roomId: 'conservatory', roomName: 'Master Conservatory', type: 'curtain', x: 1640, y: 76, w: 220, h: 48, hideX: 1750, hideY: 100, ix: 1750, iy: 158, stealthWeight: 0.85, checked: false },
      { id: 'm2_cons_sofa', name: 'Behind Velvet Settee', roomId: 'conservatory', roomName: 'Master Conservatory', type: 'sofa', x: 1920, y: 540, w: 170, h: 66, hideX: 2005, hideY: 573, ix: 2005, iy: 506, stealthWeight: 0.9, checked: false },
      { id: 'm2_cons_wardrobe', name: 'Inside Coat Armoire', roomId: 'conservatory', roomName: 'Master Conservatory', type: 'wardrobe', x: 1530, y: 650, w: 140, h: 64, hideX: 1600, hideY: 682, ix: 1600, iy: 616, stealthWeight: 0.95, checked: false },

      // Grand Foyer (3 spots)
      { id: 'm2_foy_sofa', name: 'Behind Foyer Velvet Sofa', roomId: 'foyer', roomName: 'Grand Foyer', type: 'sofa', x: 96, y: 920, w: 180, h: 66, hideX: 186, hideY: 953, ix: 186, iy: 1020, stealthWeight: 0.9, checked: false },
      { id: 'm2_foy_wardrobe', name: 'Inside Cloak Wardrobe', roomId: 'foyer', roomName: 'Grand Foyer', type: 'wardrobe', x: 510, y: 870, w: 140, h: 62, hideX: 580, hideY: 901, ix: 580, iy: 964, stealthWeight: 0.95, checked: false },
      { id: 'm2_foy_chest', name: 'Inside Luggage Trunk', roomId: 'foyer', roomName: 'Grand Foyer', type: 'chest', x: 96, y: 1210, w: 130, h: 62, hideX: 161, hideY: 1241, ix: 161, iy: 1178, stealthWeight: 0.9, checked: false },

      // Parlour & Drawing Room (5 spots)
      { id: 'm2_par_sofa1', name: 'Behind Crimson Sofa', roomId: 'parlor', roomName: 'Parlour', type: 'sofa', x: 920, y: 930, w: 200, h: 68, hideX: 1020, hideY: 964, ix: 1020, iy: 1030, stealthWeight: 0.95, checked: false },
      { id: 'm2_par_sofa2', name: 'Behind Lounge Divan', roomId: 'parlor', roomName: 'Parlour', type: 'sofa', x: 1340, y: 1220, w: 200, h: 68, hideX: 1440, hideY: 1254, ix: 1440, iy: 1188, stealthWeight: 0.95, checked: false },
      { id: 'm2_par_bed', name: 'Under Daybed Canopy', roomId: 'parlor', roomName: 'Parlour', type: 'double_bed', x: 1930, y: 900, w: 170, h: 110, hideX: 2015, hideY: 955, ix: 1894, iy: 955, stealthWeight: 1.0, checked: false },
      { id: 'm2_par_curtain', name: 'Behind Parlour Drapes', roomId: 'parlor', roomName: 'Parlour', type: 'curtain', x: 1920, y: 1230, w: 180, h: 52, hideX: 2010, hideY: 1256, ix: 2010, iy: 1196, stealthWeight: 0.85, checked: false },
      { id: 'm2_par_shelf', name: 'Behind Parlour Bookcase', roomId: 'parlor', roomName: 'Parlour', type: 'bookshelf', x: 820, y: 1220, w: 180, h: 56, hideX: 910, hideY: 1248, ix: 910, iy: 1188, stealthWeight: 0.95, checked: false }
    ];

    this.decorProps = [
      { type: 'plant', x: 90, y: 220, w: 48, h: 48 },
      { type: 'fireplace', x: 1030, y: 66, w: 140, h: 50 },
      { type: 'plant', x: 1520, y: 80, w: 48, h: 48 },
      { type: 'plant', x: 2040, y: 80, w: 48, h: 48 },
      { type: 'coffee_table', x: 1280, y: 1120, w: 130, h: 66 },
      { type: 'fireplace', x: 1580, y: 1260, w: 150, h: 52 },
      { type: 'plant', x: 610, y: 1250, w: 48, h: 48 }
    ];

    this.navNodes = {
      foyer_spawn: { x: 380, y: 1220, neighbors: ['foyer_mid', 'foyer_west', 'foyer_door_parlor'] },
      foyer_mid: { x: 380, y: 1080, neighbors: ['foyer_spawn', 'foyer_west', 'foyer_door_lib', 'foyer_door_parlor'] },
      foyer_west: { x: 186, y: 1100, neighbors: ['foyer_spawn', 'foyer_mid'] },
      foyer_door_lib: { x: 380, y: 820, neighbors: ['foyer_mid', 'lib_south'] },
      foyer_door_parlor: { x: 720, y: 1080, neighbors: ['foyer_mid', 'foyer_spawn', 'parlor_west'] },

      lib_south: { x: 380, y: 680, neighbors: ['foyer_door_lib', 'lib_mid', 'lib_sw'] },
      lib_sw: { x: 185, y: 580, neighbors: ['lib_south', 'lib_mid'] },
      lib_mid: { x: 380, y: 420, neighbors: ['lib_south', 'lib_sw', 'lib_north', 'lib_door_banq'] },
      lib_north: { x: 380, y: 200, neighbors: ['lib_mid'] },
      lib_door_banq: { x: 720, y: 420, neighbors: ['lib_mid', 'banq_west'] },

      banq_west: { x: 845, y: 420, neighbors: ['lib_door_banq', 'banq_nw', 'banq_south'] },
      banq_nw: { x: 845, y: 200, neighbors: ['banq_west', 'banq_north'] },
      banq_north: { x: 1100, y: 200, neighbors: ['banq_nw', 'banq_ne'] },
      banq_ne: { x: 1360, y: 200, neighbors: ['banq_north', 'banq_east'] },
      banq_south: { x: 1100, y: 540, neighbors: ['banq_west', 'banq_east', 'banq_door_parlor'] },
      banq_east: { x: 1360, y: 420, neighbors: ['banq_south', 'banq_ne', 'banq_door_cons'] },
      banq_door_cons: { x: 1480, y: 420, neighbors: ['banq_east', 'cons_west'] },
      banq_door_parlor: { x: 1100, y: 820, neighbors: ['banq_south', 'parlor_mid'] },

      cons_west: { x: 1620, y: 420, neighbors: ['banq_door_cons', 'cons_south', 'cons_north'] },
      cons_north: { x: 1820, y: 180, neighbors: ['cons_west', 'cons_ne'] },
      cons_ne: { x: 2010, y: 180, neighbors: ['cons_north', 'cons_east'] },
      cons_east: { x: 2010, y: 420, neighbors: ['cons_ne'] },
      cons_south: { x: 1820, y: 640, neighbors: ['cons_west', 'cons_door_parlor'] },
      cons_door_parlor: { x: 1820, y: 820, neighbors: ['cons_south', 'parlor_east'] },

      parlor_west: { x: 910, y: 1050, neighbors: ['foyer_door_parlor', 'parlor_mid'] },
      parlor_mid: { x: 1180, y: 1050, neighbors: ['parlor_west', 'banq_door_parlor', 'parlor_center_e'] },
      parlor_center_e: { x: 1520, y: 1050, neighbors: ['parlor_mid', 'parlor_east'] },
      parlor_east: { x: 1820, y: 1050, neighbors: ['parlor_center_e', 'cons_door_parlor'] }
    };

    this.roomHubNode = {
      library: 'lib_mid',
      banquet: 'banq_south',
      conservatory: 'cons_west',
      foyer: 'foyer_mid',
      parlor: 'parlor_mid'
    };
  }

  // ========================================================
  // MAP 3: UNDERGROUND BASEMENT (2200 x 1400, 25 Spots)
  // ========================================================
  buildBasementMap() {
    this.mapName = 'Underground Basement';
    this.width = 2200;
    this.height = 1400;
    this.spawn = { x: 560, y: 1260 };
    this.botSpawn = { x: 560, y: 1290 };

    this.rooms = [
      { id: 'parking', name: 'UNDERGROUND PARKING BAYS', x: 40, y: 40, w: 1320, h: 780, floor: 'concrete' },
      { id: 'generator', name: 'GENERATOR & POWER ROOM', x: 1360, y: 40, w: 800, h: 780, floor: 'concrete_dark' },
      { id: 'tunnel', name: 'MAINTENANCE TUNNEL', x: 40, y: 820, w: 1040, h: 540, floor: 'concrete_dark' },
      { id: 'storage', name: 'STORAGE VAULT', x: 1080, y: 820, w: 1080, h: 540, floor: 'concrete' }
    ];

    this.parkingLines = [
      { x: 100, y: 80, w: 220, h: 120 },
      { x: 420, y: 80, w: 220, h: 120 },
      { x: 740, y: 80, w: 220, h: 120 },
      { x: 100, y: 360, w: 220, h: 120 },
      { x: 420, y: 360, w: 220, h: 120 },
      { x: 740, y: 360, w: 220, h: 120 }
    ];

    this.walls = [
      // Outer perimeter (bottom tunnel entrance gap at x: 500..620)
      { x: 40, y: 40, w: 2120, h: 14 },
      { x: 40, y: 40, w: 14, h: 1320 },
      { x: 2146, y: 40, w: 14, h: 1320 },
      { x: 40, y: 1346, w: 460, h: 14 },
      { x: 620, y: 1346, w: 1540, h: 14 },

      // Vertical wall x=1353 (parking | generator, door y: 360..500)
      { x: 1353, y: 40, w: 14, h: 320 },
      { x: 1353, y: 500, w: 14, h: 320 },

      // Vertical wall x=1073 (tunnel | storage, door y: 1020..1160)
      { x: 1073, y: 820, w: 14, h: 200 },
      { x: 1073, y: 1160, w: 14, h: 200 },

      // Horizontal wall y=813 (doors at x: 480..620, 1160..1280, 1700..1840)
      { x: 40, y: 813, w: 440, h: 14 },
      { x: 620, y: 813, w: 540, h: 14 },
      { x: 1280, y: 813, w: 420, h: 14 },
      { x: 1840, y: 813, w: 320, h: 14 }
    ];

    this.doors = [
      { hingeX: 1360, hingeY: 360, radius: 95, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.3 },
      { hingeX: 480, hingeY: 820, radius: 95, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.35 },
      { hingeX: 1160, hingeY: 820, radius: 95, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.35 },
      { hingeX: 1700, hingeY: 820, radius: 95, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.35 },
      { hingeX: 1080, hingeY: 1020, radius: 95, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.3 }
    ];

    this.hidingSpots = [
      // Parking Bays (9 spots)
      { id: 'b_car_red', name: 'Behind Crimson Sedan', roomId: 'parking', roomName: 'Parking Bays', type: 'car_red', x: 120, y: 98, w: 180, h: 84, hideX: 210, hideY: 140, ix: 210, iy: 222, stealthWeight: 1.0, checked: false },
      { id: 'b_car_silver', name: 'Behind Silver SUV', roomId: 'parking', roomName: 'Parking Bays', type: 'car_silver', x: 440, y: 98, w: 180, h: 84, hideX: 530, hideY: 140, ix: 530, iy: 222, stealthWeight: 1.0, checked: false },
      { id: 'b_car_blue', name: 'Behind Blue Coupe', roomId: 'parking', roomName: 'Parking Bays', type: 'car_blue', x: 760, y: 98, w: 180, h: 84, hideX: 850, hideY: 140, ix: 850, iy: 222, stealthWeight: 1.0, checked: false },
      { id: 'b_car_van', name: 'Inside Utility Van', roomId: 'parking', roomName: 'Parking Bays', type: 'car_van', x: 1080, y: 96, w: 200, h: 92, hideX: 1180, hideY: 142, ix: 1180, iy: 226, stealthWeight: 1.0, checked: false },
      { id: 'b_car_black', name: 'Behind Black SUV', roomId: 'parking', roomName: 'Parking Bays', type: 'car_black', x: 120, y: 378, w: 180, h: 84, hideX: 210, hideY: 420, ix: 210, iy: 340, stealthWeight: 1.0, checked: false },
      { id: 'b_car_yellow', name: 'Behind Yellow Taxi', roomId: 'parking', roomName: 'Parking Bays', type: 'car_yellow', x: 440, y: 378, w: 180, h: 84, hideX: 530, hideY: 420, ix: 530, iy: 340, stealthWeight: 1.0, checked: false },
      { id: 'b_car_green', name: 'Behind Green Sedan', roomId: 'parking', roomName: 'Parking Bays', type: 'car_green', x: 760, y: 378, w: 180, h: 84, hideX: 850, hideY: 420, ix: 850, iy: 340, stealthWeight: 1.0, checked: false },
      { id: 'b_park_elev', name: 'Inside Service Elevator', roomId: 'parking', roomName: 'Parking Bays', type: 'elevator', x: 100, y: 640, w: 150, h: 96, hideX: 175, hideY: 688, ix: 175, iy: 604, stealthWeight: 0.95, checked: false },
      { id: 'b_park_fire', name: 'Behind Fire Hose Cabinet', roomId: 'parking', roomName: 'Parking Bays', type: 'fire_cabinet', x: 1060, y: 670, w: 140, h: 66, hideX: 1130, hideY: 703, ix: 1130, iy: 632, stealthWeight: 0.85, checked: false },

      // Generator & Power Room (6 spots)
      { id: 'b_gen_1', name: 'Behind Diesel Generator A', roomId: 'generator', roomName: 'Generator Room', type: 'generator_unit', x: 1460, y: 96, w: 180, h: 96, hideX: 1550, hideY: 144, ix: 1550, iy: 230, stealthWeight: 1.0, checked: false },
      { id: 'b_gen_2', name: 'Behind Diesel Generator B', roomId: 'generator', roomName: 'Generator Room', type: 'generator_unit', x: 1840, y: 96, w: 180, h: 96, hideX: 1930, hideY: 144, ix: 1930, iy: 230, stealthWeight: 1.0, checked: false },
      { id: 'b_gen_drums1', name: 'Behind Fuel Drums', roomId: 'generator', roomName: 'Generator Room', type: 'oil_drums', x: 1960, y: 340, w: 120, h: 88, hideX: 2020, hideY: 384, ix: 1924, iy: 384, stealthWeight: 0.9, checked: false },
      { id: 'b_gen_rack', name: 'Behind Server Switchgear', roomId: 'generator', roomName: 'Generator Room', type: 'server_rack', x: 1540, y: 380, w: 170, h: 70, hideX: 1625, hideY: 415, ix: 1625, iy: 486, stealthWeight: 0.95, checked: false },
      { id: 'b_gen_locker', name: 'Inside Engineer Lockers', roomId: 'generator', roomName: 'Generator Room', type: 'lockers', x: 1420, y: 670, w: 170, h: 64, hideX: 1505, hideY: 702, ix: 1505, iy: 634, stealthWeight: 0.95, checked: false },
      { id: 'b_gen_drums2', name: 'Behind Coolant Drums', roomId: 'generator', roomName: 'Generator Room', type: 'oil_drums', x: 1950, y: 640, w: 120, h: 88, hideX: 2010, hideY: 684, ix: 1914, iy: 684, stealthWeight: 0.9, checked: false },

      // Maintenance Tunnel (5 spots)
      { id: 'b_tun_bench1', name: 'Under Maintenance Workbench', roomId: 'tunnel', roomName: 'Maintenance Tunnel', type: 'restoration_desk', x: 100, y: 890, w: 180, h: 72, hideX: 190, hideY: 926, ix: 190, iy: 998, stealthWeight: 0.9, checked: false },
      { id: 'b_tun_bike', name: 'Behind Bike Rack', roomId: 'tunnel', roomName: 'Maintenance Tunnel', type: 'bike_rack', x: 760, y: 890, w: 180, h: 66, hideX: 850, hideY: 923, ix: 850, iy: 990, stealthWeight: 0.85, checked: false },
      { id: 'b_tun_lockers', name: 'Inside Staff Lockers', roomId: 'tunnel', roomName: 'Maintenance Tunnel', type: 'lockers', x: 96, y: 1210, w: 180, h: 64, hideX: 186, hideY: 1242, ix: 186, iy: 1174, stealthWeight: 0.95, checked: false },
      { id: 'b_tun_fire', name: 'Behind Emergency Hose Box', roomId: 'tunnel', roomName: 'Maintenance Tunnel', type: 'fire_cabinet', x: 840, y: 1210, w: 140, h: 66, hideX: 910, hideY: 1243, ix: 910, iy: 1174, stealthWeight: 0.85, checked: false },
      { id: 'b_tun_drums', name: 'Behind Tunnel Oil Drums', roomId: 'tunnel', roomName: 'Maintenance Tunnel', type: 'oil_drums', x: 380, y: 1020, w: 116, h: 84, hideX: 438, hideY: 1062, ix: 344, iy: 1062, stealthWeight: 0.9, checked: false },

      // Storage Vault (5 spots)
      { id: 'b_sto_crates1', name: 'Behind Cargo Crates West', roomId: 'storage', roomName: 'Storage Vault', type: 'crate_stack', x: 1380, y: 890, w: 170, h: 80, hideX: 1465, hideY: 930, ix: 1465, iy: 1006, stealthWeight: 0.95, checked: false },
      { id: 'b_sto_crates2', name: 'Behind Cargo Crates East', roomId: 'storage', roomName: 'Storage Vault', type: 'crate_stack', x: 1920, y: 890, w: 170, h: 80, hideX: 2005, hideY: 930, ix: 2005, iy: 1006, stealthWeight: 0.95, checked: false },
      { id: 'b_sto_safe', name: 'Inside Vault Safe', roomId: 'storage', roomName: 'Storage Vault', type: 'archive_safe', x: 1950, y: 1200, w: 140, h: 78, hideX: 2020, hideY: 1239, ix: 1912, iy: 1239, stealthWeight: 1.0, checked: false },
      { id: 'b_sto_rack', name: 'Behind Cargo Rack South', roomId: 'storage', roomName: 'Storage Vault', type: 'gondola_aisle', x: 1380, y: 1210, w: 220, h: 66, hideX: 1490, hideY: 1243, ix: 1490, iy: 1174, stealthWeight: 0.95, checked: false },
      { id: 'b_sto_cab', name: 'Inside Supply Cabinet', roomId: 'storage', roomName: 'Storage Vault', type: 'cabinet', x: 1140, y: 1210, w: 150, h: 64, hideX: 1215, hideY: 1242, ix: 1215, iy: 1174, stealthWeight: 0.9, checked: false }
    ];

    this.decorProps = [
      { type: 'pillar', x: 355, y: 620, w: 48, h: 48 },
      { type: 'pillar', x: 675, y: 620, w: 48, h: 48 },
      { type: 'security_booth', x: 760, y: 620, w: 120, h: 84 },
      { type: 'decoy_boiler', x: 1740, y: 360, w: 110, h: 90 },
      { type: 'pillar', x: 640, y: 1020, w: 48, h: 48 },
      { type: 'decoy_crates', x: 1650, y: 950, w: 120, h: 76 },
      { type: 'pillar', x: 1220, y: 1020, w: 48, h: 48 }
    ];

    this.navNodes = {
      tun_spawn: { x: 560, y: 1220, neighbors: ['tun_mid', 'tun_west', 'tun_east'] },
      tun_mid: { x: 560, y: 1050, neighbors: ['tun_spawn', 'tun_door_park', 'tun_west', 'tun_east'] },
      tun_west: { x: 200, y: 1080, neighbors: ['tun_spawn', 'tun_mid'] },
      tun_east: { x: 880, y: 1080, neighbors: ['tun_spawn', 'tun_mid', 'tun_door_sto'] },
      tun_door_park: { x: 550, y: 820, neighbors: ['tun_mid', 'park_south_c'] },
      tun_door_sto: { x: 1080, y: 1090, neighbors: ['tun_east', 'sto_west'] },

      park_south_c: { x: 550, y: 550, neighbors: ['tun_door_park', 'park_south_w', 'park_south_e', 'park_lane_c'] },
      park_south_w: { x: 370, y: 530, neighbors: ['park_south_c', 'park_lane_w', 'park_elev'] },
      park_elev: { x: 175, y: 560, neighbors: ['park_south_w'] },
      park_south_e: { x: 1000, y: 550, neighbors: ['park_south_c', 'park_door_sto', 'park_lane_e'] },
      park_lane_w: { x: 370, y: 280, neighbors: ['park_south_w', 'park_lane_c'] },
      park_lane_c: { x: 690, y: 280, neighbors: ['park_south_c', 'park_lane_w', 'park_lane_e'] },
      park_lane_e: { x: 1000, y: 280, neighbors: ['park_south_e', 'park_lane_c', 'park_east'] },
      park_east: { x: 1240, y: 430, neighbors: ['park_lane_e', 'park_door_gen', 'park_door_sto'] },
      park_door_gen: { x: 1360, y: 430, neighbors: ['park_east', 'gen_west'] },
      park_door_sto: { x: 1220, y: 820, neighbors: ['park_south_e', 'park_east', 'sto_nw'] },

      gen_west: { x: 1480, y: 430, neighbors: ['park_door_gen', 'gen_north', 'gen_south'] },
      gen_north: { x: 1740, y: 260, neighbors: ['gen_west', 'gen_east'] },
      gen_east: { x: 1920, y: 460, neighbors: ['gen_north', 'gen_south'] },
      gen_south: { x: 1740, y: 620, neighbors: ['gen_west', 'gen_east', 'gen_door_sto'] },
      gen_door_sto: { x: 1770, y: 820, neighbors: ['gen_south', 'sto_ne'] },

      sto_west: { x: 1180, y: 1090, neighbors: ['tun_door_sto', 'sto_nw', 'sto_mid'] },
      sto_nw: { x: 1300, y: 980, neighbors: ['park_door_sto', 'sto_west', 'sto_mid'] },
      sto_mid: { x: 1520, y: 1120, neighbors: ['sto_west', 'sto_nw', 'sto_east'] },
      sto_ne: { x: 1830, y: 960, neighbors: ['gen_door_sto', 'sto_east'] },
      sto_east: { x: 1830, y: 1120, neighbors: ['sto_mid', 'sto_ne'] }
    };

    this.roomHubNode = {
      parking: 'park_south_c',
      generator: 'gen_west',
      tunnel: 'tun_mid',
      storage: 'sto_mid'
    };
  }

  // ========================================================
  // MAP 4: GRAND ART MUSEUM (2200 x 1400, 25 Spots)
  // ========================================================
  buildMuseumMap() {
    this.mapName = 'Grand Art Museum';
    this.width = 2200;
    this.height = 1400;
    this.spawn = { x: 1100, y: 1260 };
    this.botSpawn = { x: 1100, y: 1290 };

    this.rooms = [
      { id: 'renaissance', name: 'RENAISSANCE PAINTING GALLERY', x: 40, y: 40, w: 640, h: 860, floor: 'museum_carpet_red' },
      { id: 'rotunda', name: 'SCULPTURE ROTUNDA', x: 680, y: 40, w: 840, h: 740, floor: 'museum_marble' },
      { id: 'artifacts', name: 'MODERN ARTIFACT WING', x: 1520, y: 40, w: 640, h: 860, floor: 'museum_carpet_green' },
      { id: 'restoration', name: 'RESTORATION & ARCHIVE', x: 40, y: 900, w: 640, h: 460, floor: 'wood_dark' },
      { id: 'atrium', name: 'MAIN MARBLE ATRIUM', x: 680, y: 780, w: 840, h: 580, floor: 'museum_marble' },
      { id: 'vault', name: 'CURATOR VAULT', x: 1520, y: 900, w: 640, h: 460, floor: 'concrete_dark' }
    ];

    this.walls = [
      // Outer perimeter (atrium entrance gap at x: 1030..1170)
      { x: 40, y: 40, w: 2120, h: 14 },
      { x: 40, y: 40, w: 14, h: 1320 },
      { x: 2146, y: 40, w: 14, h: 1320 },
      { x: 40, y: 1346, w: 990, h: 14 },
      { x: 1170, y: 1346, w: 990, h: 14 },

      // Left vertical wall x=673 (doors at y: 360..480, 1040..1160)
      { x: 673, y: 40, w: 14, h: 320 },
      { x: 673, y: 480, w: 14, h: 560 },
      { x: 673, y: 1160, w: 14, h: 200 },

      // Right vertical wall x=1513 (doors at y: 360..480, 1040..1160)
      { x: 1513, y: 40, w: 14, h: 320 },
      { x: 1513, y: 480, w: 14, h: 560 },
      { x: 1513, y: 1160, w: 14, h: 200 },

      // Rotunda | Atrium wall y=773 (door at x: 1030..1170)
      { x: 680, y: 773, w: 350, h: 14 },
      { x: 1170, y: 773, w: 350, h: 14 },

      // Renaissance | Restoration wall y=893 (door at x: 300..420)
      { x: 40, y: 893, w: 260, h: 14 },
      { x: 420, y: 893, w: 260, h: 14 },

      // Artifacts | Vault wall y=893 (door at x: 1780..1900)
      { x: 1520, y: 893, w: 260, h: 14 },
      { x: 1900, y: 893, w: 260, h: 14 }
    ];

    this.doors = [
      { hingeX: 680, hingeY: 360, radius: 90, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.35 },
      { hingeX: 1520, hingeY: 360, radius: 90, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.35 },
      { hingeX: 1030, hingeY: 780, radius: 95, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.35 },
      { hingeX: 300, hingeY: 900, radius: 90, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.35 },
      { hingeX: 1780, hingeY: 900, radius: 90, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.35 },
      { hingeX: 680, hingeY: 1040, radius: 90, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.35 },
      { hingeX: 1520, hingeY: 1040, radius: 90, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.35 }
    ];

    this.hidingSpots = [
      // Main Marble Atrium (4 spots)
      { id: 'm4_atr_desk', name: 'Behind Curved Reception Desk', roomId: 'atrium', roomName: 'Main Atrium', type: 'curved_reception', x: 960, y: 940, w: 280, h: 74, hideX: 1100, hideY: 977, ix: 1100, iy: 1052, stealthWeight: 1.0, checked: false },
      { id: 'm4_atr_cloak', name: 'Behind Cloakroom Rack', roomId: 'atrium', roomName: 'Main Atrium', type: 'cloakroom_rack', x: 740, y: 840, w: 140, h: 58, hideX: 810, hideY: 869, ix: 810, iy: 932, stealthWeight: 0.9, checked: false },
      { id: 'm4_atr_bench_w', name: 'Under West Atrium Bench', roomId: 'atrium', roomName: 'Main Atrium', type: 'museum_bench', x: 750, y: 1200, w: 150, h: 54, hideX: 825, hideY: 1227, ix: 825, iy: 1166, stealthWeight: 0.85, checked: false },
      { id: 'm4_atr_bench_e', name: 'Under East Atrium Bench', roomId: 'atrium', roomName: 'Main Atrium', type: 'museum_bench', x: 1300, y: 1200, w: 150, h: 54, hideX: 1375, hideY: 1227, ix: 1375, iy: 1166, stealthWeight: 0.85, checked: false },

      // Sculpture Rotunda (6 spots)
      { id: 'm4_rot_statue_nw', name: 'Behind Winged Victory Statue', roomId: 'rotunda', roomName: 'Sculpture Rotunda', type: 'sculpture_winged', x: 790, y: 140, w: 106, h: 106, hideX: 843, hideY: 193, ix: 843, iy: 280, stealthWeight: 1.0, checked: false },
      { id: 'm4_rot_statue_ne', name: 'Behind Roman Bust Pedestal', roomId: 'rotunda', roomName: 'Sculpture Rotunda', type: 'sculpture_roman', x: 1300, y: 140, w: 106, h: 106, hideX: 1353, hideY: 193, ix: 1353, iy: 280, stealthWeight: 1.0, checked: false },
      { id: 'm4_rot_statue_sw', name: 'Behind Marble Torso Pedestal', roomId: 'rotunda', roomName: 'Sculpture Rotunda', type: 'sculpture_statue', x: 790, y: 550, w: 106, h: 106, hideX: 843, hideY: 603, ix: 843, iy: 516, stealthWeight: 1.0, checked: false },
      { id: 'm4_rot_statue_se', name: 'Behind Bronze Discus Pedestal', roomId: 'rotunda', roomName: 'Sculpture Rotunda', type: 'sculpture_statue', x: 1300, y: 550, w: 106, h: 106, hideX: 1353, hideY: 603, ix: 1353, iy: 516, stealthWeight: 1.0, checked: false },
      { id: 'm4_rot_bench_n', name: 'Under Rotunda Bench', roomId: 'rotunda', roomName: 'Sculpture Rotunda', type: 'museum_bench', x: 1025, y: 90, w: 150, h: 52, hideX: 1100, hideY: 116, ix: 1100, iy: 176, stealthWeight: 0.85, checked: false },
      { id: 'm4_rot_case', name: 'Behind Rotunda Reliquary', roomId: 'rotunda', roomName: 'Sculpture Rotunda', type: 'glass_pedestal', x: 1040, y: 580, w: 120, h: 80, hideX: 1100, hideY: 620, ix: 1100, iy: 544, stealthWeight: 0.95, checked: false },

      // Renaissance Painting Gallery (5 spots)
      { id: 'm4_ren_curtain', name: 'Behind Velvet Gallery Drapes', roomId: 'renaissance', roomName: 'Renaissance Gallery', type: 'museum_curtain', x: 96, y: 80, w: 200, h: 48, hideX: 196, hideY: 104, ix: 196, iy: 162, stealthWeight: 0.9, checked: false },
      { id: 'm4_ren_part1', name: 'Behind Fresco Partition', roomId: 'renaissance', roomName: 'Renaissance Gallery', type: 'gallery_partition', x: 240, y: 240, w: 220, h: 52, hideX: 350, hideY: 266, ix: 350, iy: 326, stealthWeight: 0.95, checked: false },
      { id: 'm4_ren_easel', name: 'Behind Master Easel', roomId: 'renaissance', roomName: 'Renaissance Gallery', type: 'artist_easel', x: 110, y: 450, w: 96, h: 88, hideX: 158, hideY: 494, ix: 242, iy: 494, stealthWeight: 0.9, checked: false },
      { id: 'm4_ren_part2', name: 'Behind Portrait Partition', roomId: 'renaissance', roomName: 'Renaissance Gallery', type: 'gallery_partition', x: 240, y: 630, w: 220, h: 52, hideX: 350, hideY: 656, ix: 350, iy: 596, stealthWeight: 0.95, checked: false },
      { id: 'm4_ren_chest', name: 'Inside Gilded Frame Chest', roomId: 'renaissance', roomName: 'Renaissance Gallery', type: 'antique_chest', x: 100, y: 770, w: 130, h: 60, hideX: 165, hideY: 800, ix: 165, iy: 736, stealthWeight: 0.9, checked: false },

      // Modern Artifact Wing (5 spots)
      { id: 'm4_art_idol', name: 'Behind Golden Idol Case', roomId: 'artifacts', roomName: 'Artifact Wing', type: 'golden_idol_case', x: 1780, y: 110, w: 130, h: 96, hideX: 1845, hideY: 158, ix: 1845, iy: 244, stealthWeight: 1.0, checked: false },
      { id: 'm4_art_sarc', name: 'Inside Royal Sarcophagus', roomId: 'artifacts', roomName: 'Artifact Wing', type: 'sarcophagus', x: 1940, y: 310, w: 140, h: 76, hideX: 2010, hideY: 348, ix: 1906, iy: 348, stealthWeight: 1.0, checked: false },
      { id: 'm4_art_case1', name: 'Behind Crown Glass Case', roomId: 'artifacts', roomName: 'Artifact Wing', type: 'glass_pedestal', x: 1620, y: 520, w: 130, h: 86, hideX: 1685, hideY: 563, ix: 1685, iy: 486, stealthWeight: 0.95, checked: false },
      { id: 'm4_art_case2', name: 'Behind Jade Relic Case', roomId: 'artifacts', roomName: 'Artifact Wing', type: 'glass_pedestal', x: 1920, y: 520, w: 130, h: 86, hideX: 1985, hideY: 563, ix: 1985, iy: 486, stealthWeight: 0.95, checked: false },
      { id: 'm4_art_bench', name: 'Under Artifact Gallery Bench', roomId: 'artifacts', roomName: 'Artifact Wing', type: 'museum_bench', x: 1610, y: 770, w: 150, h: 54, hideX: 1685, hideY: 797, ix: 1685, iy: 736, stealthWeight: 0.85, checked: false },

      // Restoration & Archive (2 spots)
      { id: 'm4_res_desk', name: 'Under Restoration Workbench', roomId: 'restoration', roomName: 'Restoration Wing', type: 'restoration_desk', x: 100, y: 960, w: 180, h: 72, hideX: 190, hideY: 996, ix: 190, iy: 1068, stealthWeight: 0.9, checked: false },
      { id: 'm4_res_book', name: 'Behind Rare Bookcase', roomId: 'restoration', roomName: 'Restoration Wing', type: 'rare_bookcase', x: 100, y: 1210, w: 200, h: 64, hideX: 200, hideY: 1242, ix: 200, iy: 1174, stealthWeight: 0.95, checked: false },

      // Curator Vault (3 spots)
      { id: 'm4_vlt_safe', name: 'Inside Curator Safe', roomId: 'vault', roomName: 'Curator Vault', type: 'archive_safe', x: 1940, y: 960, w: 150, h: 82, hideX: 2015, hideY: 1001, ix: 1906, iy: 1001, stealthWeight: 1.0, checked: false },
      { id: 'm4_vlt_lock', name: 'Inside Guard Lockers', roomId: 'vault', roomName: 'Curator Vault', type: 'security_lockers', x: 1920, y: 1210, w: 170, h: 64, hideX: 2005, hideY: 1242, ix: 2005, iy: 1174, stealthWeight: 0.95, checked: false },
      { id: 'm4_vlt_surv', name: 'Under Surveillance Console', roomId: 'vault', roomName: 'Curator Vault', type: 'surveillance_desk', x: 1600, y: 1210, w: 180, h: 66, hideX: 1690, hideY: 1243, ix: 1690, iy: 1174, stealthWeight: 0.9, checked: false }
    ];

    this.decorProps = [
      { type: 'museum_fountain', x: 1040, y: 310, w: 120, h: 120 },
      { type: 'museum_column', x: 740, y: 960, w: 48, h: 48 },
      { type: 'museum_column', x: 1410, y: 960, w: 48, h: 48 },
      { type: 'velvet_stanchions', x: 960, y: 1110, w: 280, h: 24 },
      { type: 'velvet_stanchions', x: 1760, y: 310, w: 110, h: 24 },
      { type: 'flat_file', x: 430, y: 1210, w: 160, h: 72 },
      { type: 'museum_column', x: 560, y: 560, w: 48, h: 48 }
    ];

    this.navNodes = {
      atr_spawn: { x: 1100, y: 1220, neighbors: ['atr_sw', 'atr_se'] },
      atr_sw: { x: 930, y: 1220, neighbors: ['atr_spawn', 'atr_west'] },
      atr_se: { x: 1270, y: 1220, neighbors: ['atr_spawn', 'atr_east'] },
      atr_west: { x: 880, y: 1100, neighbors: ['atr_sw', 'atr_door_res', 'atr_mid_w'] },
      atr_east: { x: 1320, y: 1100, neighbors: ['atr_se', 'atr_door_vlt', 'atr_mid_e'] },
      atr_mid_w: { x: 900, y: 920, neighbors: ['atr_west', 'atr_door_rot'] },
      atr_mid_e: { x: 1300, y: 920, neighbors: ['atr_east', 'atr_door_rot'] },
      atr_door_rot: { x: 1100, y: 780, neighbors: ['atr_mid_w', 'atr_mid_e', 'rot_sw', 'rot_se'] },
      atr_door_res: { x: 680, y: 1100, neighbors: ['atr_west', 'res_mid'] },
      atr_door_vlt: { x: 1520, y: 1100, neighbors: ['atr_east', 'vlt_mid'] },

      rot_sw: { x: 960, y: 660, neighbors: ['atr_door_rot', 'rot_west'] },
      rot_se: { x: 1240, y: 660, neighbors: ['atr_door_rot', 'rot_east'] },
      rot_south: { x: 1100, y: 500, neighbors: ['rot_west', 'rot_east'] },
      rot_west: { x: 940, y: 420, neighbors: ['rot_sw', 'rot_south', 'rot_north', 'rot_door_ren'] },
      rot_east: { x: 1260, y: 420, neighbors: ['rot_se', 'rot_south', 'rot_north', 'rot_door_art'] },
      rot_north: { x: 1100, y: 210, neighbors: ['rot_west', 'rot_east'] },
      rot_door_ren: { x: 680, y: 420, neighbors: ['rot_west', 'ren_east'] },
      rot_door_art: { x: 1520, y: 420, neighbors: ['rot_east', 'art_west'] },

      ren_east: { x: 580, y: 420, neighbors: ['rot_door_ren', 'ren_east_n', 'ren_east_s', 'ren_mid'] },
      ren_east_n: { x: 560, y: 180, neighbors: ['ren_east', 'ren_north'] },
      ren_east_s: { x: 560, y: 740, neighbors: ['ren_east', 'ren_south'] },
      ren_north: { x: 350, y: 180, neighbors: ['ren_east_n'] },
      ren_mid: { x: 350, y: 480, neighbors: ['ren_east'] },
      ren_south: { x: 360, y: 740, neighbors: ['ren_east_s', 'ren_door_res'] },
      ren_door_res: { x: 360, y: 900, neighbors: ['ren_south', 'res_mid'] },

      res_mid: { x: 360, y: 1100, neighbors: ['ren_door_res', 'atr_door_res'] },

      art_west: { x: 1640, y: 420, neighbors: ['rot_door_art', 'art_nw', 'art_sw'] },
      art_nw: { x: 1640, y: 240, neighbors: ['art_west', 'art_north'] },
      art_north: { x: 1845, y: 240, neighbors: ['art_nw'] },
      art_sw: { x: 1640, y: 720, neighbors: ['art_west', 'art_south'] },
      art_south: { x: 1840, y: 720, neighbors: ['art_sw', 'art_door_vlt'] },
      art_door_vlt: { x: 1840, y: 900, neighbors: ['art_south', 'vlt_mid'] },

      vlt_mid: { x: 1760, y: 1100, neighbors: ['art_door_vlt', 'atr_door_vlt'] }
    };

    this.roomHubNode = {
      atrium: 'atr_mid_w',
      rotunda: 'rot_south',
      renaissance: 'ren_mid',
      artifacts: 'art_west',
      restoration: 'res_mid',
      vault: 'vlt_mid'
    };
  }

  // ========================================================
  // MAP 5: WONDERLAND PARK (2200 x 1400, 25 Spots)
  // ========================================================
  buildAmusementMap() {
    this.mapName = 'Wonderland Park';
    this.width = 2200;
    this.height = 1400;
    this.spawn = { x: 1100, y: 1260 };
    this.botSpawn = { x: 1100, y: 1290 };

    this.rooms = [
      { id: 'carousel_plaza', name: 'GRAND CAROUSEL PLAZA', x: 40, y: 40, w: 720, h: 740, floor: 'carousel_floor' },
      { id: 'fountain_garden', name: 'CENTRAL FOUNTAIN GARDEN', x: 760, y: 40, w: 680, h: 740, floor: 'park_grass' },
      { id: 'bumper_arena', name: 'BUMPER CAR ARENA', x: 1440, y: 40, w: 720, h: 740, floor: 'bumper_floor' },
      { id: 'ferris_deck', name: 'FERRIS WHEEL BOARDING DECK', x: 40, y: 780, w: 720, h: 580, floor: 'amusement_tile' },
      { id: 'carnival_street', name: 'CARNIVAL FOOD & GAME STREET', x: 760, y: 780, w: 1400, h: 580, floor: 'carnival_deck' }
    ];

    this.walls = [
      // Outer perimeter (carnival gate gap at x: 1030..1170)
      { x: 40, y: 40, w: 2120, h: 14 },
      { x: 40, y: 40, w: 14, h: 1320 },
      { x: 2146, y: 40, w: 14, h: 1320 },
      { x: 40, y: 1346, w: 990, h: 14 },
      { x: 1170, y: 1346, w: 990, h: 14 },

      // Vertical fence/wall x=753 (gates at y: 340..480, 1000..1140)
      { x: 753, y: 40, w: 14, h: 300 },
      { x: 753, y: 480, w: 14, h: 520 },
      { x: 753, y: 1140, w: 14, h: 220 },

      // Vertical fence/wall x=1433 (gate at y: 340..480)
      { x: 1433, y: 40, w: 14, h: 300 },
      { x: 1433, y: 480, w: 14, h: 300 },

      // Horizontal fence/wall y=773 (gates at x: 330..470, 1030..1170, 1730..1870)
      { x: 40, y: 773, w: 290, h: 14 },
      { x: 470, y: 773, w: 560, h: 14 },
      { x: 1170, y: 773, w: 560, h: 14 },
      { x: 1870, y: 773, w: 290, h: 14 }
    ];

    this.doors = [
      { hingeX: 760, hingeY: 340, radius: 95, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.3 },
      { hingeX: 1440, hingeY: 340, radius: 95, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.3 },
      { hingeX: 330, hingeY: 780, radius: 95, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.35 },
      { hingeX: 1030, hingeY: 780, radius: 95, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.35 },
      { hingeX: 1730, hingeY: 780, radius: 95, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.35 },
      { hingeX: 760, hingeY: 1000, radius: 95, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.3 }
    ];

    this.hidingSpots = [
      // Grand Carousel Plaza (5 spots)
      { id: 'p5_car_center', name: 'Inside Grand Carousel', roomId: 'carousel_plaza', roomName: 'Carousel Plaza', type: 'carousel_center', x: 310, y: 290, w: 180, h: 180, hideX: 400, hideY: 380, ix: 400, iy: 506, stealthWeight: 1.0, checked: false },
      { id: 'p5_car_horse1', name: 'Behind Painted Carousel Horse', roomId: 'carousel_plaza', roomName: 'Carousel Plaza', type: 'carousel_horse', x: 110, y: 110, w: 96, h: 72, hideX: 158, hideY: 146, ix: 158, iy: 214, stealthWeight: 0.9, checked: false },
      { id: 'p5_car_swan', name: 'Inside Royal Swan Chariot', roomId: 'carousel_plaza', roomName: 'Carousel Plaza', type: 'swan_chariot', x: 540, y: 110, w: 110, h: 76, hideX: 595, hideY: 148, ix: 595, iy: 218, stealthWeight: 0.95, checked: false },
      { id: 'p5_car_ticket', name: 'Behind Carousel Ticket Kiosk', roomId: 'carousel_plaza', roomName: 'Carousel Plaza', type: 'ticket_kiosk', x: 100, y: 610, w: 120, h: 80, hideX: 160, hideY: 650, ix: 160, iy: 576, stealthWeight: 0.95, checked: false },
      { id: 'p5_car_organ', name: 'Behind Band Organ', roomId: 'carousel_plaza', roomName: 'Carousel Plaza', type: 'carousel_organ', x: 540, y: 610, w: 130, h: 74, hideX: 605, hideY: 647, ix: 605, iy: 576, stealthWeight: 0.9, checked: false },

      // Central Fountain Garden (5 spots)
      { id: 'p5_fnt_hedge1', name: 'Inside West Hedge Maze', roomId: 'fountain_garden', roomName: 'Fountain Garden', type: 'topiary_hedge', x: 830, y: 120, w: 150, h: 60, hideX: 905, hideY: 150, ix: 905, iy: 216, stealthWeight: 0.95, checked: false },
      { id: 'p5_fnt_hedge2', name: 'Inside East Hedge Maze', roomId: 'fountain_garden', roomName: 'Fountain Garden', type: 'topiary_hedge', x: 1220, y: 120, w: 150, h: 60, hideX: 1295, hideY: 150, ix: 1295, iy: 216, stealthWeight: 0.95, checked: false },
      { id: 'p5_fnt_pergola', name: 'Under Garden Pergola', roomId: 'fountain_garden', roomName: 'Fountain Garden', type: 'park_pergola', x: 830, y: 580, w: 140, h: 90, hideX: 900, hideY: 625, ix: 900, iy: 546, stealthWeight: 0.9, checked: false },
      { id: 'p5_fnt_bench', name: 'Under Fountain Park Bench', roomId: 'fountain_garden', roomName: 'Fountain Garden', type: 'museum_bench', x: 1210, y: 600, w: 150, h: 54, hideX: 1285, hideY: 627, ix: 1285, iy: 564, stealthWeight: 0.85, checked: false },
      { id: 'p5_fnt_teacup', name: 'Inside Spinning Teacup', roomId: 'fountain_garden', roomName: 'Fountain Garden', type: 'tea_cup', x: 1045, y: 120, w: 110, h: 100, hideX: 1100, hideY: 170, ix: 1100, iy: 254, stealthWeight: 0.95, checked: false },

      // Bumper Car Arena (5 spots)
      { id: 'p5_bmp_red', name: 'Inside Red Bumper Car', roomId: 'bumper_arena', roomName: 'Bumper Car Arena', type: 'bumper_car_red', x: 1560, y: 140, w: 110, h: 74, hideX: 1615, hideY: 177, ix: 1615, iy: 248, stealthWeight: 0.95, checked: false },
      { id: 'p5_bmp_blue', name: 'Inside Blue Bumper Car', roomId: 'bumper_arena', roomName: 'Bumper Car Arena', type: 'bumper_car_blue', x: 1920, y: 140, w: 110, h: 74, hideX: 1975, hideY: 177, ix: 1975, iy: 248, stealthWeight: 0.95, checked: false },
      { id: 'p5_bmp_gold', name: 'Inside Gold Bumper Car', roomId: 'bumper_arena', roomName: 'Bumper Car Arena', type: 'bumper_car_gold', x: 1740, y: 360, w: 110, h: 74, hideX: 1795, hideY: 397, ix: 1795, iy: 468, stealthWeight: 0.95, checked: false },
      { id: 'p5_bmp_tires', name: 'Behind Tire Barrier', roomId: 'bumper_arena', roomName: 'Bumper Car Arena', type: 'tire_barrier', x: 1520, y: 600, w: 160, h: 66, hideX: 1600, hideY: 633, ix: 1600, iy: 564, stealthWeight: 0.9, checked: false },
      { id: 'p5_bmp_podium', name: 'Behind Ride Control Podium', roomId: 'bumper_arena', roomName: 'Bumper Car Arena', type: 'ride_podium', x: 1940, y: 590, w: 130, h: 80, hideX: 2005, hideY: 630, ix: 2005, iy: 554, stealthWeight: 0.9, checked: false },

      // Ferris Wheel Boarding Deck (4 spots)
      { id: 'p5_fer_gond1', name: 'Inside Sky Gondola A', roomId: 'ferris_deck', roomName: 'Ferris Deck', type: 'ferris_gondola', x: 110, y: 860, w: 116, h: 84, hideX: 168, hideY: 902, ix: 168, iy: 978, stealthWeight: 1.0, checked: false },
      { id: 'p5_fer_gond2', name: 'Inside Sky Gondola B', roomId: 'ferris_deck', roomName: 'Ferris Deck', type: 'ferris_gondola', x: 520, y: 860, w: 116, h: 84, hideX: 578, hideY: 902, ix: 578, iy: 978, stealthWeight: 1.0, checked: false },
      { id: 'p5_fer_ramp', name: 'Under Boarding Ramp', roomId: 'ferris_deck', roomName: 'Ferris Deck', type: 'boarding_ramp', x: 110, y: 1190, w: 170, h: 72, hideX: 195, hideY: 1226, ix: 195, iy: 1154, stealthWeight: 0.9, checked: false },
      { id: 'p5_fer_cart', name: 'Behind Souvenir Cart', roomId: 'ferris_deck', roomName: 'Ferris Deck', type: 'souvenir_cart', x: 480, y: 1200, w: 150, h: 66, hideX: 555, hideY: 1233, ix: 555, iy: 1166, stealthWeight: 0.9, checked: false },

      // Carnival Food & Game Street (6 spots)
      { id: 'p5_crn_food', name: 'Behind Carnival Food Stall', roomId: 'carnival_street', roomName: 'Carnival Street', type: 'concession_stand', x: 840, y: 840, w: 180, h: 74, hideX: 930, hideY: 877, ix: 930, iy: 950, stealthWeight: 0.95, checked: false },
      { id: 'p5_crn_game', name: 'Behind Ring-Toss Booth', roomId: 'carnival_street', roomName: 'Carnival Street', type: 'game_booth', x: 1260, y: 840, w: 180, h: 74, hideX: 1350, hideY: 877, ix: 1350, iy: 950, stealthWeight: 0.95, checked: false },
      { id: 'p5_crn_booth', name: 'Behind Balloon Dart Stall', roomId: 'carnival_street', roomName: 'Carnival Street', type: 'carnival_booth', x: 1520, y: 840, w: 170, h: 74, hideX: 1605, hideY: 877, ix: 1605, iy: 950, stealthWeight: 0.95, checked: false },
      { id: 'p5_crn_wagon', name: 'Inside Fortune Teller Wagon', roomId: 'carnival_street', roomName: 'Carnival Street', type: 'fortune_wagon', x: 1920, y: 840, w: 180, h: 86, hideX: 2010, hideY: 883, ix: 2010, iy: 960, stealthWeight: 1.0, checked: false },
      { id: 'p5_crn_snack', name: 'Behind Popcorn Snack Wagon', roomId: 'carnival_street', roomName: 'Carnival Street', type: 'snack_wagon', x: 1420, y: 1210, w: 170, h: 72, hideX: 1505, hideY: 1246, ix: 1505, iy: 1174, stealthWeight: 0.9, checked: false },
      { id: 'p5_crn_prize', name: 'Behind Prize Counter', roomId: 'carnival_street', roomName: 'Carnival Street', type: 'redemption_counter', x: 1880, y: 1210, w: 190, h: 72, hideX: 1975, hideY: 1246, ix: 1975, iy: 1174, stealthWeight: 0.95, checked: false }
    ];

    this.decorProps = [
      { type: 'park_water_fountain', x: 1030, y: 340, w: 140, h: 140 },
      { type: 'park_tree', x: 830, y: 260, w: 64, h: 64 },
      { type: 'park_tree', x: 1300, y: 260, w: 64, h: 64 },
      { type: 'ferris_support_leg', x: 240, y: 880, w: 100, h: 70 },
      { type: 'ice_cream_cart', x: 840, y: 1210, w: 96, h: 64 },
      { type: 'park_lamp_post', x: 1220, y: 1060, w: 32, h: 32 },
      { type: 'park_tree', x: 1740, y: 1060, w: 64, h: 64 }
    ];

    this.navNodes = {
      crn_spawn: { x: 1100, y: 1210, neighbors: ['crn_mid', 'crn_west', 'crn_east'] },
      crn_mid: { x: 1100, y: 1040, neighbors: ['crn_spawn', 'crn_door_fnt', 'crn_west', 'crn_east'] },
      crn_west: { x: 900, y: 1060, neighbors: ['crn_spawn', 'crn_mid', 'crn_door_fer'] },
      crn_east: { x: 1520, y: 1060, neighbors: ['crn_spawn', 'crn_mid', 'crn_far_e'] },
      crn_far_e: { x: 1840, y: 980, neighbors: ['crn_east', 'crn_door_bmp'] },
      crn_door_fnt: { x: 1100, y: 780, neighbors: ['crn_mid', 'fnt_south'] },
      crn_door_fer: { x: 760, y: 1070, neighbors: ['crn_west', 'fer_mid'] },
      crn_door_bmp: { x: 1800, y: 780, neighbors: ['crn_far_e', 'bmp_south'] },

      fer_mid: { x: 400, y: 1070, neighbors: ['crn_door_fer', 'fer_door_car', 'fer_west'] },
      fer_west: { x: 200, y: 1070, neighbors: ['fer_mid'] },
      fer_door_car: { x: 400, y: 780, neighbors: ['fer_mid', 'car_south'] },

      car_south: { x: 400, y: 580, neighbors: ['fer_door_car', 'car_west', 'car_east'] },
      car_west: { x: 180, y: 380, neighbors: ['car_south', 'car_north'] },
      car_north: { x: 400, y: 200, neighbors: ['car_west', 'car_east'] },
      car_east: { x: 610, y: 410, neighbors: ['car_south', 'car_north', 'car_door_fnt'] },
      car_door_fnt: { x: 760, y: 410, neighbors: ['car_east', 'fnt_west'] },

      fnt_west: { x: 930, y: 410, neighbors: ['car_door_fnt', 'fnt_nw', 'fnt_south'] },
      fnt_nw: { x: 950, y: 280, neighbors: ['fnt_west', 'fnt_north'] },
      fnt_north: { x: 1100, y: 280, neighbors: ['fnt_nw', 'fnt_ne'] },
      fnt_ne: { x: 1250, y: 280, neighbors: ['fnt_north', 'fnt_east'] },
      fnt_south: { x: 1100, y: 580, neighbors: ['fnt_west', 'fnt_east', 'crn_door_fnt'] },
      fnt_east: { x: 1260, y: 410, neighbors: ['fnt_ne', 'fnt_south', 'fnt_door_bmp'] },
      fnt_door_bmp: { x: 1440, y: 410, neighbors: ['fnt_east', 'bmp_west'] },

      bmp_west: { x: 1580, y: 410, neighbors: ['fnt_door_bmp', 'bmp_north', 'bmp_south'] },
      bmp_north: { x: 1800, y: 260, neighbors: ['bmp_west', 'bmp_east'] },
      bmp_east: { x: 1980, y: 410, neighbors: ['bmp_north', 'bmp_south'] },
      bmp_south: { x: 1800, y: 560, neighbors: ['bmp_west', 'bmp_east', 'crn_door_bmp'] }
    };

    this.roomHubNode = {
      carousel_plaza: 'car_south',
      fountain_garden: 'fnt_south',
      bumper_arena: 'bmp_south',
      ferris_deck: 'fer_mid',
      carnival_street: 'crn_mid'
    };
  }

  resetSpots() {
    for (const spot of this.hidingSpots) {
      spot.checked = false;
    }
  }

  getNearestSpot(x, y, maxDist = 85) {
    let best = null;
    let bestDist = Infinity;

    for (const spot of this.hidingSpots) {
      const cx = Math.max(spot.x, Math.min(x, spot.x + spot.w));
      const cy = Math.max(spot.y, Math.min(y, spot.y + spot.h));
      const d = Math.hypot(x - cx, y - cy);

      if (d <= maxDist && d < bestDist) {
        bestDist = d;
        best = spot;
      }
    }
    return best;
  }

  resolveMovement(x, y, radius, dx, dy) {
    let nx = x + dx;
    let ny = y;

    for (const box of this.solidColliders) {
      if (this.circleIntersectsRect(nx, ny, radius, box)) {
        if (dx > 0) nx = box.x - radius - 0.1;
        else if (dx < 0) nx = box.x + box.w + radius + 0.1;
      }
    }

    ny = y + dy;
    for (const box of this.solidColliders) {
      if (this.circleIntersectsRect(nx, ny, radius, box)) {
        if (dy > 0) ny = box.y - radius - 0.1;
        else if (dy < 0) ny = box.y + box.h + radius + 0.1;
      }
    }

    nx = Math.max(60, Math.min(this.width - 60, nx));
    ny = Math.max(60, Math.min(this.height - 40, ny));

    return { x: nx, y: ny };
  }

  circleIntersectsRect(cx, cy, r, rect) {
    const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
    const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
    const distX = cx - closestX;
    const distY = cy - closestY;
    return (distX * distX + distY * distY) < (r * r);
  }

  segmentIntersectsBox(x1, y1, x2, y2, b, margin = 2) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(1, Math.ceil(dist / 4));
    const minX = b.x + margin;
    const maxX = b.x + b.w - margin;
    const minY = b.y + margin;
    const maxY = b.y + b.h - margin;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;
      if (px >= minX && px <= maxX && py >= minY && py <= maxY) {
        return true;
      }
    }
    return false;
  }

  hasLineOfSight(x1, y1, x2, y2, margin = 2) {
    for (const wall of this.walls) {
      if (this.segmentIntersectsBox(x1, y1, x2, y2, wall, margin)) {
        return false;
      }
    }
    return true;
  }

  hasWalkClearance(x1, y1, x2, y2, radius = 9.5) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(1, Math.ceil(dist / 4));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;
      for (const box of this.solidColliders) {
        if (this.circleIntersectsRect(px, py, radius, box)) {
          return false;
        }
      }
    }
    return true;
  }

  getRoomAt(x, y) {
    for (const r of this.rooms) {
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
        return r;
      }
    }
    return this.rooms[0];
  }

  dijkstra(startId, goalId) {
    if (startId === goalId) return [startId];
    const dist = {};
    const prev = {};
    const unvisited = new Set(Object.keys(this.navNodes));

    for (const id of unvisited) dist[id] = Infinity;
    dist[startId] = 0;

    while (unvisited.size > 0) {
      let curr = null;
      let minD = Infinity;
      for (const id of unvisited) {
        if (dist[id] < minD) {
          minD = dist[id];
          curr = id;
        }
      }
      if (!curr || minD === Infinity) break;
      if (curr === goalId) break;

      unvisited.delete(curr);
      const node = this.navNodes[curr];
      if (!node) continue;

      for (const nbrId of node.neighbors) {
        if (!unvisited.has(nbrId)) continue;
        const nbr = this.navNodes[nbrId];
        if (!nbr) continue;
        const d = Math.hypot(node.x - nbr.x, node.y - nbr.y);
        const alt = dist[curr] + d;
        if (alt < dist[nbrId]) {
          dist[nbrId] = alt;
          prev[nbrId] = curr;
        }
      }
    }

    if (!prev[goalId] && startId !== goalId) return [startId, goalId];

    const path = [];
    let u = goalId;
    while (u) {
      path.unshift(u);
      u = prev[u];
    }
    return path;
  }

  findBestNodeWithLOS(x, y) {
    return this.findBestNodeWithClearance(x, y, 9.5);
  }

  findBestNodeWithClearance(x, y, radius = 9.5) {
    let bestId = null;
    let bestDist = Infinity;
    let fallbackId = null;
    let fallbackDist = Infinity;

    for (const [id, node] of Object.entries(this.navNodes)) {
      const d = Math.hypot(x - node.x, y - node.y);
      if (d < fallbackDist) {
        fallbackDist = d;
        fallbackId = id;
      }
      if (this.hasWalkClearance(x, y, node.x, node.y, radius)) {
        if (d < bestDist) {
          bestDist = d;
          bestId = id;
        }
      }
    }
    return bestId || fallbackId;
  }

  findPathToSpot(fromX, fromY, targetSpot) {
    const targetX = targetSpot.ix;
    const targetY = targetSpot.iy;

    if (this.hasWalkClearance(fromX, fromY, targetX, targetY, 14)) {
      return [{ x: targetX, y: targetY }];
    }

    const startNodeId = this.findBestNodeWithClearance(fromX, fromY, 12);
    const goalNodeId = this.findBestNodeWithClearance(targetX, targetY, 12);

    const nodePath = this.dijkstra(startNodeId, goalNodeId);

    // Doorway, entry and gate nodes must be stepped through perpendicularly, not skipped diagonally
    const unskippable = new Set();
    for (let i = 0; i < nodePath.length; i++) {
      const id = nodePath[i];
      if (id.includes('door') || id.includes('entry') || id.includes('gate') || id.includes('portal')) {
        unskippable.add(i + 1);
      }
    }

    const waypoints = nodePath.map(id => ({ x: this.navNodes[id].x, y: this.navNodes[id].y }));
    const full = [{ x: fromX, y: fromY }, ...waypoints, { x: targetX, y: targetY }];
    const smoothed = [full[0]];
    let currIdx = 0;
    while (currIdx < full.length - 1) {
      let nextIdx = full.length - 1;
      for (; nextIdx > currIdx + 1; nextIdx--) {
        let skipsDoorway = false;
        for (let k = currIdx + 1; k < nextIdx; k++) {
          if (unskippable.has(k)) {
            skipsDoorway = true;
            break;
          }
        }
        if (skipsDoorway) continue;

        if (this.hasWalkClearance(full[currIdx].x, full[currIdx].y, full[nextIdx].x, full[nextIdx].y, 14)) {
          break;
        }
      }
      smoothed.push(full[nextIdx]);
      currIdx = nextIdx;
    }

    return smoothed.slice(1);
  }

  findClosestNode(x, y) {
    return this.findBestNodeWithClearance(x, y, 9.5);
  }
}

if (typeof window !== 'undefined') {
  window.ApartmentMap = ApartmentMap;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApartmentMap;
}

