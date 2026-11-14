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
      this.buildMallMap();
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
      { type: 'plant', roomId: 'gallery', x: 820, y: 235, w: 36, h: 36 },
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
  // MAP 2: HERITAGE MANOR (1360 x 840, 20 Spots)
  // ========================================================
  buildManorMap() {
    this.mapName = 'Heritage Manor';
    this.width = 1360;
    this.height = 840;
    this.spawn = { x: 680, y: 725 };
    this.botSpawn = { x: 680, y: 755 };

    this.rooms = [
      { id: 'west_bed', name: 'WEST SUITE', x: 40, y: 40, w: 370, h: 370, floor: 'wood', rug: { x: 110, y: 205, w: 140, h: 90, color: 'blue' } },
      { id: 'parlor', name: 'GRAND PARLOR', x: 40, y: 410, w: 370, h: 390, floor: 'wood', rug: { x: 105, y: 500, w: 185, h: 120, color: 'crimson' } },
      { id: 'banquet', name: 'BANQUET HALL', x: 410, y: 40, w: 540, h: 260, floor: 'wood_dark', rug: { x: 510, y: 100, w: 340, h: 120, color: 'crimson' } },
      { id: 'atrium', name: 'CENTRAL ATRIUM', x: 410, y: 300, w: 540, h: 300, floor: 'tile_warm', rug: { x: 580, y: 370, w: 200, h: 150, color: 'amber' } },
      { id: 'powder', name: 'POWDER BATH', x: 410, y: 600, w: 150, h: 200, floor: 'tile' },
      { id: 'vestibule', name: 'MANOR FOYER', x: 560, y: 600, w: 240, h: 200, floor: 'tile_warm' },
      { id: 'kitchenette', name: 'PANTRY & PREP', x: 800, y: 600, w: 150, h: 200, floor: 'tile' },
      { id: 'east_bed', name: 'EAST SUITE', x: 950, y: 40, w: 370, h: 370, floor: 'wood', rug: { x: 1050, y: 195, w: 150, h: 95, color: 'amber' } },
      { id: 'archive', name: 'ARCHIVE LIBRARY', x: 950, y: 410, w: 370, h: 390, floor: 'wood_dark', rug: { x: 1020, y: 540, w: 160, h: 130, color: 'slate' } }
    ];

    this.walls = [
      { x: 40, y: 40, w: 1280, h: 14 },
      { x: 40, y: 40, w: 14, h: 760 },
      { x: 1306, y: 40, w: 14, h: 760 },
      { x: 40, y: 786, w: 590, h: 14 },
      { x: 730, y: 786, w: 590, h: 14 },

      { x: 403, y: 40, w: 14, h: 170 },
      { x: 403, y: 293, w: 14, h: 227 },
      { x: 403, y: 600, w: 14, h: 200 },
      { x: 40, y: 403, w: 370, h: 14 },

      { x: 943, y: 40, w: 14, h: 170 },
      { x: 943, y: 293, w: 14, h: 227 },
      { x: 943, y: 600, w: 14, h: 200 },
      { x: 950, y: 403, w: 370, h: 14 },

      { x: 410, y: 293, w: 230, h: 14 },
      { x: 720, y: 293, w: 230, h: 14 },

      { x: 410, y: 593, w: 45, h: 14 },
      { x: 520, y: 593, w: 100, h: 14 },
      { x: 740, y: 593, w: 100, h: 14 },
      { x: 905, y: 593, w: 45, h: 14 },

      { x: 553, y: 600, w: 14, h: 200 },
      { x: 793, y: 600, w: 14, h: 200 }
    ];

    this.doors = [
      { hingeX: 410, hingeY: 210, radius: 80, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.35 },
      { hingeX: 410, hingeY: 520, radius: 75, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.35 },
      { hingeX: 950, hingeY: 210, radius: 80, startAngle: Math.PI / 2, endAngle: Math.PI, leafAngle: 2.75 },
      { hingeX: 950, hingeY: 520, radius: 75, startAngle: Math.PI / 2, endAngle: Math.PI, leafAngle: 2.75 },
      { hingeX: 640, hingeY: 300, radius: 75, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.35 }
    ];

    this.hidingSpots = [
      { id: 'm_west_bed', name: 'Under Four-Poster Bed', roomId: 'west_bed', roomName: 'West Suite', type: 'double_bed', x: 74, y: 72, w: 150, h: 114, hideX: 149, hideY: 129, ix: 149, iy: 212, stealthWeight: 0.9, checked: false },
      { id: 'm_west_armoire', name: 'Inside Oak Armoire', roomId: 'west_bed', roomName: 'West Suite', type: 'wardrobe', x: 278, y: 62, w: 108, h: 48, hideX: 332, hideY: 86, ix: 332, iy: 132, stealthWeight: 0.85, checked: false },
      { id: 'm_west_vanity', name: 'Under Antique Vanity', roomId: 'west_bed', roomName: 'West Suite', type: 'dressing_table', x: 72, y: 325, w: 118, h: 48, hideX: 131, hideY: 349, ix: 131, iy: 300, stealthWeight: 0.9, checked: false },

      { id: 'm_parlor_curtain', name: 'Behind Velvet Drapes', roomId: 'parlor', roomName: 'Grand Parlor', type: 'curtain', x: 74, y: 428, w: 120, h: 32, hideX: 134, hideY: 444, ix: 134, iy: 482, stealthWeight: 0.95, checked: false },
      { id: 'm_parlor_sofa', name: 'Behind Parlor Sofa', roomId: 'parlor', roomName: 'Grand Parlor', type: 'sofa', x: 105, y: 540, w: 170, h: 60, hideX: 190, hideY: 570, ix: 190, iy: 515, stealthWeight: 1.1, checked: false },
      { id: 'm_piano', name: 'Behind Grand Piano', roomId: 'parlor', roomName: 'Grand Parlor', type: 'piano', x: 74, y: 678, w: 128, h: 86, hideX: 138, hideY: 721, ix: 228, iy: 721, stealthWeight: 0.9, checked: false },

      { id: 'm_sideboard', name: 'Inside Silver Sideboard', roomId: 'banquet', roomName: 'Banquet Hall', type: 'cabinet', x: 432, y: 62, w: 122, h: 44, hideX: 493, hideY: 84, ix: 493, iy: 128, stealthWeight: 0.95, checked: false },
      { id: 'm_banquet_table', name: 'Under Banquet Table', roomId: 'banquet', roomName: 'Banquet Hall', type: 'dining_table', x: 545, y: 125, w: 270, h: 80, hideX: 680, hideY: 165, ix: 680, iy: 230, stealthWeight: 1.15, checked: false },
      { id: 'm_china_hutch', name: 'Inside China Hutch', roomId: 'banquet', roomName: 'Banquet Hall', type: 'wardrobe', x: 805, y: 62, w: 120, h: 44, hideX: 865, hideY: 84, ix: 865, iy: 128, stealthWeight: 0.9, checked: false },

      { id: 'm_clock_alcove', name: 'Behind Grandfather Clock', roomId: 'atrium', roomName: 'Central Atrium', type: 'cabinet', x: 432, y: 325, w: 50, h: 58, hideX: 457, hideY: 354, ix: 506, iy: 354, stealthWeight: 1.0, checked: false },
      { id: 'm_atrium_table', name: 'Under Atrium Table', roomId: 'atrium', roomName: 'Central Atrium', type: 'coffee_table', x: 630, y: 405, w: 100, h: 82, hideX: 680, hideY: 446, ix: 598, iy: 446, stealthWeight: 1.2, checked: false },

      { id: 'm_clawfoot_tub', name: 'Behind Bath Curtain', roomId: 'powder', roomName: 'Powder Bath', type: 'bathtub', x: 428, y: 702, w: 112, h: 66, hideX: 484, hideY: 735, ix: 484, iy: 676, stealthWeight: 0.9, checked: false },
      { id: 'm_manor_pantry', name: 'Inside Spice Pantry', roomId: 'kitchenette', roomName: 'Pantry & Prep', type: 'pantry', x: 820, y: 724, w: 110, h: 48, hideX: 875, hideY: 748, ix: 875, iy: 698, stealthWeight: 0.9, checked: false },

      { id: 'm_east_closet', name: 'Inside Carved Wardrobe', roomId: 'east_bed', roomName: 'East Suite', type: 'wardrobe', x: 974, y: 62, w: 112, h: 48, hideX: 1030, hideY: 86, ix: 1030, iy: 132, stealthWeight: 0.85, checked: false },
      { id: 'm_east_bed', name: 'Under Royal Bed', roomId: 'east_bed', roomName: 'East Suite', type: 'double_bed', x: 1135, y: 72, w: 152, h: 114, hideX: 1211, hideY: 129, ix: 1108, iy: 129, stealthWeight: 0.9, checked: false },
      { id: 'm_east_chest', name: 'Inside Heirloom Trunk', roomId: 'east_bed', roomName: 'East Suite', type: 'chest', x: 1175, y: 325, w: 108, h: 48, hideX: 1229, hideY: 349, ix: 1229, iy: 300, stealthWeight: 0.9, checked: false },

      { id: 'm_scholar_desk', name: 'Under Scholar Desk', roomId: 'archive', roomName: 'Archive Library', type: 'desk', x: 990, y: 455, w: 132, h: 60, hideX: 1056, hideY: 485, ix: 1056, iy: 540, stealthWeight: 1.0, checked: false },
      { id: 'm_arch_shelf1', name: 'Behind North Bookcase', roomId: 'archive', roomName: 'Archive Library', type: 'bookshelf', x: 1244, y: 440, w: 48, h: 145, hideX: 1268, hideY: 512, ix: 1218, iy: 512, stealthWeight: 0.9, checked: false },
      { id: 'm_arch_shelf2', name: 'Behind South Bookcase', roomId: 'archive', roomName: 'Archive Library', type: 'bookshelf', x: 1244, y: 620, w: 48, h: 145, hideX: 1268, hideY: 692, ix: 1218, iy: 692, stealthWeight: 0.9, checked: false },
      { id: 'm_globe_curtain', name: 'Behind Study Curtains', roomId: 'archive', roomName: 'Archive Library', type: 'curtain', x: 995, y: 736, w: 132, h: 36, hideX: 1061, hideY: 754, ix: 1061, iy: 710, stealthWeight: 0.95, checked: false }
    ];

    this.decorProps = [
      { type: 'nightstand', roomId: 'west_bed', x: 74, y: 198, w: 34, h: 34 },
      { type: 'nightstand', roomId: 'east_bed', x: 1254, y: 198, w: 34, h: 34 },
      { type: 'toilet', roomId: 'powder', x: 428, y: 615, w: 38, h: 44 },
      { type: 'plant', roomId: 'atrium', x: 890, y: 325, w: 36, h: 36 },
      { type: 'plant', roomId: 'parlor', x: 348, y: 428, w: 34, h: 34 },
      { type: 'shoe_rack', roomId: 'vestibule', x: 576, y: 734, w: 54, h: 34 },
      { type: 'coat_rack', roomId: 'vestibule', x: 735, y: 732, w: 36, h: 36 },
      { type: 'fridge', roomId: 'kitchenette', x: 878, y: 612, w: 54, h: 48 }
    ];

    this.ambientLights = [
      { x: 91, y: 215, r: 95, color: 'rgba(254, 240, 138, 0.10)' },
      { x: 1271, y: 215, r: 95, color: 'rgba(254, 240, 138, 0.10)' },
      { x: 680, y: 446, r: 140, color: 'rgba(245, 158, 11, 0.08)' },
      { x: 680, y: 725, r: 100, color: 'rgba(253, 186, 116, 0.08)' }
    ];

    this.navNodes = {
      vestibule_entry: { x: 680, y: 725, neighbors: ['vestibule_mid'] },
      vestibule_mid: { x: 680, y: 640, neighbors: ['vestibule_entry', 'atrium_south'] },
      atrium_south: { x: 680, y: 550, neighbors: ['vestibule_mid', 'atrium_west', 'atrium_east', 'powder_door_out', 'kitchenette_door_out'] },
      atrium_west: { x: 480, y: 480, neighbors: ['atrium_south', 'atrium_north', 'parlor_door_out'] },
      atrium_east: { x: 880, y: 480, neighbors: ['atrium_south', 'atrium_north', 'archive_door_out'] },
      atrium_north: { x: 680, y: 350, neighbors: ['atrium_west', 'atrium_east', 'banquet_door_south'] },

      powder_door_out: { x: 485, y: 550, neighbors: ['atrium_south', 'powder_door_in'] },
      powder_door_in: { x: 485, y: 630, neighbors: ['powder_door_out', 'powder_center'] },
      powder_center: { x: 490, y: 660, neighbors: ['powder_door_in'] },

      kitchenette_door_out: { x: 858, y: 550, neighbors: ['atrium_south', 'kitchenette_door_in'] },
      kitchenette_door_in: { x: 858, y: 630, neighbors: ['kitchenette_door_out', 'kitchenette_center'] },
      kitchenette_center: { x: 858, y: 685, neighbors: ['kitchenette_door_in'] },

      parlor_door_out: { x: 450, y: 540, neighbors: ['atrium_west', 'parlor_door_in'] },
      parlor_door_in: { x: 370, y: 540, neighbors: ['parlor_door_out', 'parlor_center'] },
      parlor_center: { x: 330, y: 530, neighbors: ['parlor_door_in', 'parlor_south'] },
      parlor_south: { x: 330, y: 690, neighbors: ['parlor_center'] },

      archive_door_out: { x: 910, y: 560, neighbors: ['atrium_east', 'archive_door_in'] },
      archive_door_in: { x: 990, y: 560, neighbors: ['archive_door_out', 'archive_center'] },
      archive_center: { x: 1120, y: 560, neighbors: ['archive_door_in', 'archive_south'] },
      archive_south: { x: 1120, y: 690, neighbors: ['archive_center'] },

      banquet_door_south: { x: 680, y: 330, neighbors: ['atrium_north', 'banquet_door_north'] },
      banquet_door_north: { x: 680, y: 250, neighbors: ['banquet_door_south', 'banquet_center', 'banquet_west', 'banquet_east'] },
      banquet_center: { x: 680, y: 225, neighbors: ['banquet_door_north', 'banquet_west', 'banquet_east'] },
      banquet_west: { x: 480, y: 225, neighbors: ['banquet_door_north', 'banquet_center', 'west_bed_door_out'] },
      banquet_east: { x: 880, y: 225, neighbors: ['banquet_door_north', 'banquet_center', 'east_bed_door_out'] },

      west_bed_door_out: { x: 450, y: 250, neighbors: ['banquet_west', 'west_bed_door_in'] },
      west_bed_door_in: { x: 360, y: 250, neighbors: ['west_bed_door_out', 'west_bed_center'] },
      west_bed_center: { x: 260, y: 250, neighbors: ['west_bed_door_in', 'west_bed_north'] },
      west_bed_north: { x: 260, y: 140, neighbors: ['west_bed_center'] },

      east_bed_door_out: { x: 900, y: 250, neighbors: ['banquet_east', 'east_bed_door_in'] },
      east_bed_door_in: { x: 990, y: 250, neighbors: ['east_bed_door_out', 'east_bed_center'] },
      east_bed_center: { x: 1080, y: 250, neighbors: ['east_bed_door_in', 'east_bed_north'] },
      east_bed_north: { x: 1080, y: 140, neighbors: ['east_bed_center'] }
    };

    this.roomHubNode = {
      west_bed: 'west_bed_center',
      parlor: 'parlor_center',
      banquet: 'banquet_center',
      atrium: 'atrium_south',
      powder: 'powder_center',
      vestibule: 'vestibule_entry',
      kitchenette: 'kitchenette_center',
      east_bed: 'east_bed_center',
      archive: 'archive_center'
    };
  }

  // ========================================================
  // MAP 3: UNDERGROUND BASEMENT (1360 x 840, 26 Spots)
  // 10 Compact Cars, Elevators, Boiler, Lockers, Drums & Pillars
  // ========================================================
  buildBasementMap() {
    this.mapName = 'Underground Basement';
    this.width = 1360;
    this.height = 840;
    this.spawn = { x: 750, y: 735 };
    this.botSpawn = { x: 750, y: 760 };

    this.rooms = [
      { id: 'parking_a', name: 'PARKING DECK A', x: 40, y: 40, w: 860, h: 440, floor: 'concrete' },
      { id: 'lift_lobby', name: 'ELEVATOR & STAIRS', x: 900, y: 40, w: 420, h: 380, floor: 'concrete_dark' },
      { id: 'loading_bay', name: 'PARKING BAY B', x: 40, y: 480, w: 580, h: 320, floor: 'concrete' },
      { id: 'security_entry', name: 'BASEMENT ENTRY', x: 620, y: 480, w: 260, h: 320, floor: 'concrete_dark' },
      { id: 'boiler_room', name: 'BOILER & STORAGE', x: 880, y: 420, w: 440, h: 380, floor: 'concrete' }
    ];

    // Compact painted parking bay stalls for 10 cars
    this.parkingLines = [
      { x: 68, y: 64, w: 112, h: 74 },
      { x: 188, y: 64, w: 112, h: 74 },
      { x: 308, y: 64, w: 112, h: 74 },
      { x: 428, y: 64, w: 112, h: 74 },
      { x: 548, y: 64, w: 112, h: 74 },
      { x: 68, y: 310, w: 112, h: 76 },
      { x: 188, y: 310, w: 124, h: 76 },
      { x: 324, y: 310, w: 116, h: 76 },
      { x: 64, y: 528, w: 122, h: 76 },
      { x: 194, y: 528, w: 112, h: 76 }
    ];

    this.walls = [
      { x: 40, y: 40, w: 1280, h: 14 },
      { x: 40, y: 40, w: 14, h: 760 },
      { x: 1306, y: 40, w: 14, h: 760 },
      { x: 40, y: 786, w: 650, h: 14 },
      { x: 810, y: 786, w: 510, h: 14 },

      { x: 893, y: 40, w: 14, h: 165 },
      { x: 893, y: 315, w: 14, h: 105 },

      { x: 900, y: 413, w: 160, h: 14 },
      { x: 1160, y: 413, w: 160, h: 14 },

      { x: 40, y: 473, w: 180, h: 14 },
      { x: 380, y: 473, w: 240, h: 14 },

      { x: 613, y: 480, w: 14, h: 110 },
      { x: 613, y: 695, w: 14, h: 105 },

      { x: 873, y: 420, w: 14, h: 140 },
      { x: 873, y: 660, w: 14, h: 140 }
    ];

    this.doors = [
      { hingeX: 900, hingeY: 205, radius: 85, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.3 },
      { hingeX: 1060, hingeY: 420, radius: 75, startAngle: 0, endAngle: -Math.PI / 2, leafAngle: -0.3 },
      { hingeX: 880, hingeY: 560, radius: 75, startAngle: Math.PI / 2, endAngle: 0, leafAngle: 0.3 }
    ];

    this.hidingSpots = [
      // Top Row: 5 Compact Cars in Parking Deck A
      { id: 'b_car_red', name: 'Behind Red Sedan', roomId: 'parking_a', roomName: 'Parking Deck A', type: 'car_red', x: 80, y: 74, w: 88, h: 46, hideX: 124, hideY: 97, ix: 124, iy: 146, stealthWeight: 1.0, checked: false },
      { id: 'b_car_silver', name: 'Behind Silver Compact', roomId: 'parking_a', roomName: 'Parking Deck A', type: 'car_silver', x: 200, y: 74, w: 88, h: 46, hideX: 244, hideY: 97, ix: 244, iy: 146, stealthWeight: 1.0, checked: false },
      { id: 'b_car_black', name: 'Behind Black Coupe', roomId: 'parking_a', roomName: 'Parking Deck A', type: 'car_black', x: 320, y: 74, w: 88, h: 46, hideX: 364, hideY: 97, ix: 364, iy: 146, stealthWeight: 1.0, checked: false },
      { id: 'b_car_blue', name: 'Behind Blue Hatchback', roomId: 'parking_a', roomName: 'Parking Deck A', type: 'car_blue', x: 440, y: 74, w: 88, h: 46, hideX: 484, hideY: 97, ix: 484, iy: 146, stealthWeight: 1.0, checked: false },
      { id: 'b_car_yellow', name: 'Behind Yellow Taxi', roomId: 'parking_a', roomName: 'Parking Deck A', type: 'car_yellow', x: 560, y: 74, w: 88, h: 46, hideX: 604, hideY: 97, ix: 604, iy: 146, stealthWeight: 1.0, checked: false },

      // Second Row: 3 Compact Vehicles in Parking Deck A
      { id: 'b_car_green', name: 'Behind Green Wagon', roomId: 'parking_a', roomName: 'Parking Deck A', type: 'car_green', x: 80, y: 326, w: 88, h: 46, hideX: 124, hideY: 349, ix: 124, iy: 298, stealthWeight: 1.0, checked: false },
      { id: 'b_car_van', name: 'Behind Cargo Van', roomId: 'parking_a', roomName: 'Parking Deck A', type: 'car_van', x: 198, y: 322, w: 104, h: 50, hideX: 250, hideY: 347, ix: 250, iy: 294, stealthWeight: 0.95, checked: false },
      { id: 'b_car_navy', name: 'Behind Navy SUV', roomId: 'parking_a', roomName: 'Parking Deck A', type: 'car_navy', x: 336, y: 324, w: 92, h: 48, hideX: 382, hideY: 348, ix: 382, iy: 296, stealthWeight: 1.0, checked: false },

      // Garage Pillars, Bike Rack & Fire Hose Cabinet
      { id: 'b_pillar_n', name: 'Behind North Pillar', roomId: 'parking_a', roomName: 'Parking Deck A', type: 'pillar', x: 710, y: 185, w: 48, h: 48, hideX: 734, hideY: 209, ix: 734, iy: 250, stealthWeight: 1.1, checked: false },
      { id: 'b_pillar_s', name: 'Behind South Pillar', roomId: 'parking_a', roomName: 'Parking Deck A', type: 'pillar', x: 500, y: 200, w: 48, h: 48, hideX: 524, hideY: 224, ix: 524, iy: 175, stealthWeight: 1.1, checked: false },
      { id: 'b_fire_cab', name: 'Behind Fire Hose Box', roomId: 'parking_a', roomName: 'Parking Deck A', type: 'fire_cabinet', x: 755, y: 62, w: 100, h: 36, hideX: 805, hideY: 80, ix: 805, iy: 124, stealthWeight: 0.9, checked: false },
      { id: 'b_bike_rack', name: 'Behind Bike Rack', roomId: 'parking_a', roomName: 'Parking Deck A', type: 'bike_rack', x: 590, y: 350, w: 116, h: 40, hideX: 648, hideY: 370, ix: 648, iy: 322, stealthWeight: 0.95, checked: false },

      // Elevator & Stairs Lobby
      { id: 'b_vending', name: 'Behind Lobby Machine', roomId: 'lift_lobby', roomName: 'Elevator & Stairs', type: 'vending', x: 930, y: 64, w: 54, h: 60, hideX: 957, hideY: 94, ix: 957, iy: 150, stealthWeight: 0.95, checked: false },
      { id: 'b_elev1', name: 'Elevator 1 Side Niche', roomId: 'lift_lobby', roomName: 'Elevator & Stairs', type: 'elevator', x: 1020, y: 62, w: 106, h: 54, hideX: 1073, hideY: 89, ix: 1073, iy: 142, stealthWeight: 0.95, checked: false },
      { id: 'b_elev2', name: 'Elevator 2 Service Alcove', roomId: 'lift_lobby', roomName: 'Elevator & Stairs', type: 'elevator', x: 1165, y: 62, w: 106, h: 54, hideX: 1218, hideY: 89, ix: 1218, iy: 142, stealthWeight: 0.95, checked: false },
      { id: 'b_stairs', name: 'Under Basement Stairs', roomId: 'lift_lobby', roomName: 'Elevator & Stairs', type: 'stairs', x: 1190, y: 210, w: 96, h: 132, hideX: 1238, hideY: 276, ix: 1162, iy: 276, stealthWeight: 0.85, checked: false },

      // Parking Bay B (2 More Compact Vehicles + Basement Gear)
      { id: 'b_car_pickup', name: 'Behind Utility Pickup', roomId: 'loading_bay', roomName: 'Parking Bay B', type: 'car_silver', x: 74, y: 542, w: 102, h: 48, hideX: 125, hideY: 566, ix: 125, iy: 514, stealthWeight: 1.0, checked: false },
      { id: 'b_car_maroon', name: 'Behind Maroon Sedan', roomId: 'loading_bay', roomName: 'Parking Bay B', type: 'car_red', x: 205, y: 542, w: 88, h: 46, hideX: 249, hideY: 565, ix: 249, iy: 514, stealthWeight: 1.0, checked: false },
      { id: 'b_dumpster', name: 'Behind Steel Dumpster', roomId: 'loading_bay', roomName: 'Parking Bay B', type: 'dumpster', x: 74, y: 706, w: 128, h: 56, hideX: 138, hideY: 734, ix: 138, iy: 678, stealthWeight: 0.9, checked: false },
      { id: 'b_drums', name: 'Behind Oil Drum Stack', roomId: 'loading_bay', roomName: 'Parking Bay B', type: 'oil_drums', x: 245, y: 704, w: 92, h: 56, hideX: 291, hideY: 732, ix: 291, iy: 676, stealthWeight: 0.95, checked: false },
      { id: 'b_crates', name: 'Behind Cargo Crates', roomId: 'loading_bay', roomName: 'Parking Bay B', type: 'crates', x: 425, y: 535, w: 96, h: 72, hideX: 473, hideY: 571, ix: 396, iy: 571, stealthWeight: 1.0, checked: false },
      { id: 'b_tires', name: 'Behind Tire Stack', roomId: 'loading_bay', roomName: 'Parking Bay B', type: 'tires', x: 445, y: 706, w: 106, h: 54, hideX: 498, hideY: 733, ix: 498, iy: 678, stealthWeight: 0.95, checked: false },

      // Security Entry
      { id: 'b_guard_booth', name: 'Behind Security Booth', roomId: 'security_entry', roomName: 'Basement Entry', type: 'booth', x: 645, y: 585, w: 74, h: 68, hideX: 682, hideY: 619, ix: 746, iy: 619, stealthWeight: 1.1, checked: false },

      // Boiler & Storage Room
      { id: 'b_boiler', name: 'Behind Industrial Boiler', roomId: 'boiler_room', roomName: 'Boiler & Storage', type: 'boiler', x: 925, y: 465, w: 130, h: 86, hideX: 990, hideY: 508, ix: 990, iy: 576, stealthWeight: 0.9, checked: false },
      { id: 'b_generator', name: 'Behind Power Generator', roomId: 'boiler_room', roomName: 'Boiler & Storage', type: 'generator', x: 1145, y: 465, w: 130, h: 80, hideX: 1210, hideY: 505, ix: 1210, iy: 570, stealthWeight: 0.9, checked: false },
      { id: 'b_lockers', name: 'Inside Storage Lockers', roomId: 'boiler_room', roomName: 'Boiler & Storage', type: 'lockers', x: 915, y: 724, w: 160, h: 46, hideX: 995, hideY: 747, ix: 995, iy: 696, stealthWeight: 0.85, checked: false }
    ];

    this.decorProps = [
      { type: 'elec_panel', roomId: 'boiler_room', x: 892, y: 465, w: 20, h: 90 },
      { type: 'workbench_prop', roomId: 'boiler_room', x: 1148, y: 718, w: 130, h: 52 },
      { type: 'traffic_cone', roomId: 'parking_a', x: 760, y: 380, w: 26, h: 26 },
      { type: 'traffic_cone', roomId: 'security_entry', x: 650, y: 740, w: 26, h: 26 }
    ];

    this.ambientLights = [
      { x: 1080, y: 180, r: 120, color: 'rgba(246, 239, 226, 0.08)' },
      { x: 990, y: 508, r: 115, color: 'rgba(249, 115, 22, 0.11)' },
      { x: 750, y: 720, r: 110, color: 'rgba(253, 224, 71, 0.08)' },
      { x: 350, y: 225, r: 140, color: 'rgba(246, 239, 226, 0.06)' }
    ];

    this.navNodes = {
      entry_spawn: { x: 750, y: 730, neighbors: ['entry_south', 'boiler_door'] },
      entry_south: { x: 740, y: 674, neighbors: ['entry_spawn', 'entry_mid', 'loading_booth_south'] },
      loading_booth_south: { x: 655, y: 674, neighbors: ['entry_south', 'loading_door'] },
      entry_mid: { x: 730, y: 530, neighbors: ['entry_south', 'parking_drive_south'] },
      parking_drive_south: { x: 730, y: 425, neighbors: ['entry_mid', 'parking_lane_east', 'parking_drive_mid'] },
      parking_drive_mid: { x: 300, y: 425, neighbors: ['parking_drive_south', 'ramp_door'] },
      parking_lane_east: { x: 730, y: 270, neighbors: ['parking_drive_south', 'parking_west', 'lift_door'] },
      parking_west: { x: 240, y: 270, neighbors: ['parking_lane_east'] },
      ramp_door: { x: 300, y: 475, neighbors: ['parking_drive_mid', 'loading_center'] },
      loading_center: { x: 335, y: 635, neighbors: ['ramp_door', 'loading_door'] },
      loading_door: { x: 585, y: 674, neighbors: ['loading_center', 'loading_booth_south'] },
      lift_door: { x: 900, y: 260, neighbors: ['parking_lane_east', 'lift_center'] },
      lift_center: { x: 1080, y: 260, neighbors: ['lift_door', 'boiler_top_door'] },
      boiler_top_door: { x: 1110, y: 415, neighbors: ['lift_center', 'boiler_center'] },
      boiler_door: { x: 875, y: 610, neighbors: ['entry_spawn', 'boiler_center'] },
      boiler_center: { x: 1100, y: 635, neighbors: ['boiler_door', 'boiler_top_door'] }
    };

    this.roomHubNode = {
      parking_a: 'parking_lane_east',
      lift_lobby: 'lift_center',
      loading_bay: 'loading_center',
      security_entry: 'entry_spawn',
      boiler_room: 'boiler_center'
    };
  }

  // ========================================================
  // MAP 4: GRAND SHOPPING MALL (1560 x 940, 26 Spots)
  // Glass Storefronts, Escalators, Fountain, Kiosks, Carousels,
  // Gondola Aisles, Checkout Lanes & Food Court Counters
  // ========================================================
  buildMallMap() {
    this.mapName = 'Grand Shopping Mall';
    this.width = 1560;
    this.height = 940;
    this.spawn = { x: 780, y: 825 };
    this.botSpawn = { x: 780, y: 855 };

    this.rooms = [
      { id: 'fashion', name: 'FASHION STORE', x: 40, y: 40, w: 380, h: 420, floor: 'tile_warm' },
      { id: 'food_court', name: 'FOOD COURT', x: 420, y: 40, w: 720, h: 240, floor: 'tile_warm' },
      { id: 'book_toy', name: 'BOOK & TOY EMPORIUM', x: 1140, y: 40, w: 380, h: 420, floor: 'tile_warm' },
      { id: 'concourse', name: 'MALL CONCOURSE', x: 420, y: 280, w: 720, h: 400, floor: 'mall_terrazzo' },
      { id: 'tech_zone', name: 'TECH SUPERSTORE', x: 40, y: 460, w: 520, h: 440, floor: 'tile' },
      { id: 'mall_entry', name: 'MAIN ENTRANCE', x: 560, y: 680, w: 440, h: 220, floor: 'mall_terrazzo' },
      { id: 'supermarket', name: 'MARKET & SPORTS', x: 1000, y: 460, w: 520, h: 440, floor: 'tile' }
    ];

    this.walls = [
      // Outer mall concrete shell
      { x: 40, y: 40, w: 1480, h: 14 },
      { x: 40, y: 40, w: 14, h: 860 },
      { x: 1506, y: 40, w: 14, h: 860 },
      { x: 40, y: 886, w: 660, h: 14 },
      { x: 860, y: 886, w: 660, h: 14 },

      // Solid dividers between neighboring stores
      { x: 40, y: 453, w: 380, h: 14 },
      { x: 1140, y: 453, w: 380, h: 14 },

      // Short pillar anchors flanking store open portals
      { x: 413, y: 40, w: 14, h: 36 },
      { x: 413, y: 410, w: 14, h: 50 },
      { x: 1133, y: 40, w: 14, h: 36 },
      { x: 1133, y: 410, w: 14, h: 50 },

      { x: 553, y: 460, w: 14, h: 40 },
      { x: 553, y: 850, w: 14, h: 50 },
      { x: 993, y: 460, w: 14, h: 40 },
      { x: 993, y: 850, w: 14, h: 50 }
    ];

    // Transparent Glass Storefront Windows facing the Mall Concourse (walk-blocking, see-through!)
    this.glassWalls = [
      { x: 415, y: 76, w: 10, h: 194 },     // Fashion Boutique window (open portal y:270..410)
      { x: 1135, y: 76, w: 10, h: 194 },    // Book & Toy window (open portal y:270..410)
      { x: 555, y: 650, w: 10, h: 200 },    // Tech Superstore window (wide open portal y:500..650)
      { x: 995, y: 650, w: 10, h: 200 }     // Market & Sports window (wide open portal y:500..650)
    ];

    // No residential wooden swing doors in a shopping mall!
    this.doors = [];

    this.hidingSpots = [
      // Fashion Boutique (4 Retail Spots)
      { id: 'mall_fitting', name: 'Inside Fitting Stall', roomId: 'fashion', roomName: 'Fashion Store', type: 'fitting_stall', x: 68, y: 68, w: 132, h: 58, hideX: 134, hideY: 97, ix: 134, iy: 154, stealthWeight: 0.85, checked: false },
      { id: 'mall_carousel', name: 'Inside Clothing Carousel', roomId: 'fashion', roomName: 'Fashion Store', type: 'clothing_carousel', x: 256, y: 92, w: 72, h: 72, hideX: 292, hideY: 128, ix: 292, iy: 190, stealthWeight: 1.0, checked: false },
      { id: 'mall_mannequin', name: 'Behind Mannequin Podium', roomId: 'fashion', roomName: 'Fashion Store', type: 'mannequin_stage', x: 82, y: 245, w: 96, h: 62, hideX: 130, hideY: 276, ix: 130, iy: 220, stealthWeight: 1.05, checked: false },
      { id: 'mall_fashion_pos', name: 'Behind Boutique Checkout', roomId: 'fashion', roomName: 'Fashion Store', type: 'checkout_lane', x: 220, y: 374, w: 146, h: 48, hideX: 293, hideY: 398, ix: 293, iy: 348, stealthWeight: 0.95, checked: false },

      // Food Court (4 Commercial Food Spots)
      { id: 'mall_burger_bay', name: 'Behind Fast Food Counter', roomId: 'food_court', roomName: 'Food Court', type: 'food_counter', x: 455, y: 64, w: 195, h: 50, hideX: 552, hideY: 89, ix: 552, iy: 142, stealthWeight: 1.0, checked: false },
      { id: 'mall_coffee_bay', name: 'Behind Espresso Counter', roomId: 'food_court', roomName: 'Food Court', type: 'food_counter', x: 695, y: 64, w: 185, h: 50, hideX: 787, hideY: 89, ix: 787, iy: 142, stealthWeight: 1.0, checked: false },
      { id: 'mall_vending_row', name: 'Behind Vending Machine Row', roomId: 'food_court', roomName: 'Food Court', type: 'vending', x: 940, y: 64, w: 155, h: 48, hideX: 1017, hideY: 88, ix: 1017, iy: 138, stealthWeight: 0.95, checked: false },
      { id: 'mall_bistro1', name: 'Under Food Court Bistro', roomId: 'food_court', roomName: 'Food Court', type: 'bistro_table', x: 650, y: 175, w: 68, h: 68, hideX: 684, hideY: 209, ix: 616, iy: 209, stealthWeight: 1.15, checked: false },

      // Central Mall Promenade (6 Mall Centerpieces)
      { id: 'mall_escalator', name: 'Under Mall Escalators', roomId: 'concourse', roomName: 'Mall Concourse', type: 'escalator', x: 700, y: 295, w: 160, h: 66, hideX: 780, hideY: 328, ix: 780, iy: 386, stealthWeight: 1.05, checked: false },
      { id: 'mall_fountain', name: 'Behind Atrium Fountain', roomId: 'concourse', roomName: 'Mall Concourse', type: 'fountain', x: 710, y: 440, w: 140, h: 112, hideX: 780, hideY: 496, ix: 682, iy: 496, stealthWeight: 1.2, checked: false },
      { id: 'mall_kiosk_w', name: 'Inside Sunglass Kiosk', roomId: 'concourse', roomName: 'Mall Concourse', type: 'mall_kiosk', x: 475, y: 465, w: 92, h: 56, hideX: 521, hideY: 493, ix: 521, iy: 546, stealthWeight: 1.05, checked: false },
      { id: 'mall_kiosk_e', name: 'Inside Crepe Stand', roomId: 'concourse', roomName: 'Mall Concourse', type: 'mall_kiosk', x: 935, y: 465, w: 92, h: 56, hideX: 981, hideY: 493, ix: 981, iy: 546, stealthWeight: 1.05, checked: false },
      { id: 'mall_bench_w', name: 'Behind Mall Planter Bench', roomId: 'concourse', roomName: 'Mall Concourse', type: 'mall_bench', x: 585, y: 615, w: 122, h: 42, hideX: 646, hideY: 636, ix: 646, iy: 588, stealthWeight: 1.1, checked: false },
      { id: 'mall_elev_atrium', name: 'Behind Glass Mall Lift', roomId: 'concourse', roomName: 'Mall Concourse', type: 'elevator', x: 990, y: 315, w: 96, h: 56, hideX: 1038, hideY: 343, ix: 1038, iy: 396, stealthWeight: 0.95, checked: false },

      // Main Entrance Lobby (2)
      { id: 'mall_info_desk', name: 'Behind Mall Info Desk', roomId: 'mall_entry', roomName: 'Main Entrance', type: 'checkout_lane', x: 590, y: 745, w: 118, h: 50, hideX: 649, hideY: 770, ix: 649, iy: 718, stealthWeight: 1.05, checked: false },
      { id: 'mall_carts', name: 'Behind Shopping Cart Corral', roomId: 'mall_entry', roomName: 'Main Entrance', type: 'cart_corral', x: 870, y: 745, w: 100, h: 54, hideX: 920, hideY: 772, ix: 920, iy: 718, stealthWeight: 1.0, checked: false },

      // Tech Superstore (4)
      { id: 'mall_led_wall', name: 'Behind LED Screen Wall', roomId: 'tech_zone', roomName: 'Tech Superstore', type: 'tv_console', x: 70, y: 520, w: 46, h: 160, hideX: 93, hideY: 600, ix: 142, iy: 600, stealthWeight: 0.95, checked: false },
      { id: 'mall_showcase', name: 'Behind Glass Phone Showcase', roomId: 'tech_zone', roomName: 'Tech Superstore', type: 'glass_showcase', x: 205, y: 555, w: 160, h: 58, hideX: 285, hideY: 584, ix: 285, iy: 528, stealthWeight: 1.1, checked: false },
      { id: 'mall_vr_pod', name: 'Inside Arcade VR Pod', roomId: 'tech_zone', roomName: 'Tech Superstore', type: 'booth', x: 72, y: 765, w: 128, h: 84, hideX: 136, hideY: 807, ix: 136, iy: 736, stealthWeight: 0.85, checked: false },
      { id: 'mall_tech_gondola', name: 'Behind Tech Shelf Aisle', roomId: 'tech_zone', roomName: 'Tech Superstore', type: 'gondola_aisle', x: 350, y: 785, w: 150, h: 48, hideX: 425, hideY: 809, ix: 425, iy: 758, stealthWeight: 0.95, checked: false },

      // Book & Toy Emporium (3)
      { id: 'mall_toy_aisle', name: 'Behind Toy Gondola Aisle', roomId: 'book_toy', roomName: 'Book & Toy Emporium', type: 'gondola_aisle', x: 1185, y: 98, w: 145, h: 48, hideX: 1257, hideY: 122, ix: 1257, iy: 174, stealthWeight: 0.95, checked: false },
      { id: 'mall_book_aisle', name: 'Behind Bookstore Shelving', roomId: 'book_toy', roomName: 'Book & Toy Emporium', type: 'gondola_aisle', x: 1410, y: 80, w: 56, h: 155, hideX: 1438, hideY: 157, ix: 1380, iy: 157, stealthWeight: 0.9, checked: false },
      { id: 'mall_plush_bin', name: 'Behind Toy Display Bin', roomId: 'book_toy', roomName: 'Book & Toy Emporium', type: 'crates', x: 1365, y: 315, w: 110, h: 88, hideX: 1420, hideY: 359, ix: 1336, iy: 359, stealthWeight: 0.9, checked: false },

      // Market & Sports Outlet (3)
      { id: 'mall_checkout1', name: 'Behind Market Cashier Lane', roomId: 'supermarket', roomName: 'Market & Sports', type: 'checkout_lane', x: 1055, y: 545, w: 130, h: 48, hideX: 1120, hideY: 569, ix: 1120, iy: 518, stealthWeight: 1.0, checked: false },
      { id: 'mall_tent', name: 'Inside Camping Tent Display', roomId: 'supermarket', roomName: 'Market & Sports', type: 'tent', x: 1345, y: 515, w: 130, h: 110, hideX: 1410, hideY: 570, ix: 1316, iy: 570, stealthWeight: 0.85, checked: false },
      { id: 'mall_sneaker_aisle', name: 'Behind Sneaker Display Aisle', roomId: 'supermarket', roomName: 'Market & Sports', type: 'gondola_aisle', x: 1135, y: 785, w: 185, h: 52, hideX: 1227, hideY: 811, ix: 1227, iy: 758, stealthWeight: 0.95, checked: false }
    ];

    this.decorProps = [
      { type: 'plant', roomId: 'concourse', x: 455, y: 200, w: 36, h: 36 },
      { type: 'plant', roomId: 'concourse', x: 1065, y: 200, w: 36, h: 36 },
      { type: 'plant', roomId: 'mall_entry', x: 860, y: 700, w: 36, h: 36 },
      { type: 'bistro_prop', roomId: 'food_court', x: 870, y: 175, w: 68, h: 68 },
      { type: 'gondola_prop', roomId: 'supermarket', x: 1065, y: 675, w: 145, h: 48 }
    ];

    this.ambientLights = [
      { x: 780, y: 496, r: 175, color: 'rgba(56, 189, 248, 0.11)' },
      { x: 552, y: 89, r: 130, color: 'rgba(246, 239, 226, 0.09)' },
      { x: 93, y: 600, r: 130, color: 'rgba(56, 189, 248, 0.11)' },
      { x: 780, y: 825, r: 125, color: 'rgba(246, 239, 226, 0.09)' }
    ];

    this.navNodes = {
      mall_spawn: { x: 780, y: 825, neighbors: ['concourse_south'] },
      concourse_south: { x: 780, y: 580, neighbors: ['mall_spawn', 'concourse_south_west', 'concourse_south_east'] },
      concourse_south_west: { x: 640, y: 580, neighbors: ['concourse_south', 'concourse_mid_west', 'tech_door'] },
      concourse_south_east: { x: 890, y: 580, neighbors: ['concourse_south', 'concourse_mid_east', 'sports_door'] },
      concourse_mid_west: { x: 640, y: 400, neighbors: ['concourse_south_west', 'concourse_north', 'fashion_door', 'fc_west'] },
      concourse_mid_east: { x: 890, y: 400, neighbors: ['concourse_south_east', 'concourse_north', 'book_door'] },
      concourse_north: { x: 780, y: 400, neighbors: ['concourse_mid_west', 'concourse_mid_east'] },
      fc_west: { x: 600, y: 145, neighbors: ['concourse_mid_west', 'fc_center'] },
      fc_center: { x: 780, y: 145, neighbors: ['fc_west'] },
      fashion_door: { x: 380, y: 340, neighbors: ['concourse_mid_west', 'fashion_center'] },
      fashion_center: { x: 215, y: 245, neighbors: ['fashion_door'] },
      tech_door: { x: 520, y: 565, neighbors: ['concourse_south_west', 'tech_center'] },
      tech_center: { x: 280, y: 700, neighbors: ['tech_door'] },
      book_door: { x: 1140, y: 395, neighbors: ['concourse_mid_east', 'book_center'] },
      book_center: { x: 1260, y: 245, neighbors: ['book_door'] },
      sports_door: { x: 1020, y: 635, neighbors: ['concourse_south_east', 'sports_center'] },
      sports_center: { x: 1260, y: 635, neighbors: ['sports_door'] }
    };

    this.roomHubNode = {
      fashion: 'fashion_center',
      food_court: 'fc_center',
      book_toy: 'book_center',
      concourse: 'concourse_south',
      tech_zone: 'tech_center',
      mall_entry: 'mall_spawn',
      supermarket: 'sports_center'
    };
  }

  // ========================================================
  // MAP 5: WONDERLAND PARK (1840 x 1080, 40 Spots)
  // Grand Amusement Park with Rides, Carnival Midway & Open Plazas
  // ========================================================
  buildAmusementMap() {
    this.mapName = 'Wonderland Park';
    this.width = 1840;
    this.height = 1080;
    this.spawn = { x: 920, y: 930 };
    this.botSpawn = { x: 920, y: 1000 };

    this.rooms = [
      { id: 'entry_plaza', name: 'GRAND ENTRANCE PLAZA', x: 620, y: 840, w: 600, h: 200, floor: 'amusement_tile' },
      { id: 'food_fair', name: 'CENTRAL FOUNTAIN & PICNIC LAWN', x: 620, y: 440, w: 600, h: 400, floor: 'park_grass' },
      { id: 'carnival_midway', name: 'CARNIVAL MIDWAY', x: 40, y: 640, w: 580, h: 400, floor: 'carnival_deck' },
      { id: 'wonder_rides', name: 'FERRIS & CAROUSEL PLAZA', x: 40, y: 40, w: 760, h: 600, floor: 'amusement_tile' },
      { id: 'thrill_zone', name: 'THUNDER COASTER & PIRATE COVE', x: 800, y: 40, w: 1000, h: 400, floor: 'amusement_tile' },
      { id: 'arcade_arena', name: 'BUMPER CARS & RETRO ARCADE', x: 1220, y: 440, w: 580, h: 360, floor: 'bumper_floor' },
      { id: 'haunted_zone', name: 'MYSTERY HAUNTED CASTLE', x: 1220, y: 800, w: 580, h: 240, floor: 'haunted_cobble' }
    ];

    this.walls = [
      // Outer park boundary walls
      { x: 40, y: 40, w: 1760, h: 14 },
      { x: 40, y: 40, w: 14, h: 1000 },
      { x: 1786, y: 40, w: 14, h: 1000 },
      { x: 40, y: 1026, w: 760, h: 14 },
      { x: 1040, y: 1026, w: 760, h: 14 }, // South entrance portal (x: 760..1040)

      // Decorative divider piers leaving generous promenades
      { x: 620, y: 840, w: 14, h: 70 },
      { x: 620, y: 980, w: 14, h: 60 },
      { x: 1206, y: 840, w: 14, h: 70 },
      { x: 1206, y: 980, w: 14, h: 60 },

      // Midway to North rides dividing arch pillars
      { x: 40, y: 633, w: 160, h: 14 },
      { x: 460, y: 633, w: 160, h: 14 },

      // Wonder Rides to Thrill Zone archway pillars
      { x: 793, y: 40, w: 14, h: 130 },
      { x: 793, y: 310, w: 14, h: 130 },

      // Central fountain lawn decorative boundary balustrades
      { x: 620, y: 440, w: 14, h: 140 },
      { x: 620, y: 700, w: 14, h: 140 },
      { x: 1206, y: 440, w: 14, h: 140 },
      { x: 1206, y: 700, w: 14, h: 140 },

      // Arcade to Haunted zone partition
      { x: 1220, y: 793, w: 180, h: 14 },
      { x: 1600, y: 793, w: 186, h: 14 }
    ];

    // Transparent safety glass barriers around Bumper Cars and Coaster Queue
    this.glassWalls = [
      { x: 1280, y: 470, w: 220, h: 8 },  // Bumper Cars top railing
      { x: 900, y: 88, w: 180, h: 8 }     // Coaster platform safety railing
    ];

    this.hidingSpots = [
      // 1. Entrance & Ticket Plaza (6 spots) - Clear central entrance foyer
      { id: 'ap_turnstiles', name: 'Brass Turnstile Barrier', roomId: 'entry_plaza', roomName: 'GRAND ENTRANCE PLAZA', x: 670, y: 960, w: 65, h: 36, ix: 755, iy: 978, hideX: 702, hideY: 978, stealthWeight: 1.2, type: 'turnstiles' },
      { id: 'ap_ticket_w', name: 'West Ticket Kiosk', roomId: 'entry_plaza', roomName: 'GRAND ENTRANCE PLAZA', x: 670, y: 860, w: 70, h: 50, ix: 705, iy: 820, hideX: 705, hideY: 885, stealthWeight: 1.4, type: 'ticket_booth' },
      { id: 'ap_info_kiosk', name: 'Guest Information Booth', roomId: 'entry_plaza', roomName: 'GRAND ENTRANCE PLAZA', x: 770, y: 860, w: 75, h: 50, ix: 807, iy: 940, hideX: 807, hideY: 885, stealthWeight: 1.3, type: 'info_kiosk' },
      { id: 'ap_mascot_statue', name: 'Giant Peekko Bear Mascot Statue', roomId: 'entry_plaza', roomName: 'GRAND ENTRANCE PLAZA', x: 1050, y: 860, w: 65, h: 65, ix: 1082, iy: 955, hideX: 1082, hideY: 892, stealthWeight: 1.6, type: 'mascot_statue' },
      { id: 'ap_ticket_e', name: 'East Ticket Kiosk', roomId: 'entry_plaza', roomName: 'GRAND ENTRANCE PLAZA', x: 1135, y: 860, w: 65, h: 50, ix: 1167, iy: 820, hideX: 1167, hideY: 885, stealthWeight: 1.4, type: 'ticket_booth' },
      { id: 'ap_balloon_vendor', name: 'Entrance Balloon Cluster Cart', roomId: 'entry_plaza', roomName: 'GRAND ENTRANCE PLAZA', x: 1135, y: 955, w: 65, h: 50, ix: 1080, iy: 980, hideX: 1167, hideY: 980, stealthWeight: 1.3, type: 'balloon_cart' },

      // 2. Festival Carnival Midway (6 spots)
      { id: 'ap_balloon_darts', name: 'Balloon Darts Game Booth', roomId: 'carnival_midway', roomName: 'CARNIVAL MIDWAY', x: 90, y: 680, w: 110, h: 70, ix: 145, iy: 780, hideX: 145, hideY: 715, stealthWeight: 1.5, type: 'balloon_booth' },
      { id: 'ap_ring_toss', name: 'Ring Toss Prize Booth', roomId: 'carnival_midway', roomName: 'CARNIVAL MIDWAY', x: 250, y: 680, w: 110, h: 70, ix: 305, iy: 780, hideX: 305, hideY: 715, stealthWeight: 1.5, type: 'ring_toss_booth' },
      { id: 'ap_duck_pond', name: 'Lucky Duck Fishing Stall', roomId: 'carnival_midway', roomName: 'CARNIVAL MIDWAY', x: 410, y: 680, w: 110, h: 70, ix: 465, iy: 780, hideX: 465, hideY: 715, stealthWeight: 1.4, type: 'duck_pond' },
      { id: 'ap_popcorn_wagon', name: 'Vintage Popcorn Wagon', roomId: 'carnival_midway', roomName: 'CARNIVAL MIDWAY', x: 110, y: 880, w: 85, h: 60, ix: 152, iy: 835, hideX: 152, hideY: 910, stealthWeight: 1.4, type: 'popcorn_cart' },
      { id: 'ap_cotton_candy', name: 'Cotton Candy Floss Cart', roomId: 'carnival_midway', roomName: 'CARNIVAL MIDWAY', x: 270, y: 880, w: 80, h: 55, ix: 310, iy: 835, hideX: 310, hideY: 907, stealthWeight: 1.3, type: 'cotton_candy_cart' },
      { id: 'ap_midway_planter', name: 'Midway Floral Planter & Bench', roomId: 'carnival_midway', roomName: 'CARNIVAL MIDWAY', x: 430, y: 880, w: 85, h: 50, ix: 472, iy: 835, hideX: 472, hideY: 905, stealthWeight: 1.2, type: 'park_bench' },

      // 3. Fantasy Carousel & Ferris Plaza (6 spots)
      { id: 'ap_carousel', name: 'Grand Musical Carousel', roomId: 'wonder_rides', roomName: 'FERRIS & CAROUSEL PLAZA', x: 150, y: 150, w: 170, h: 170, ix: 235, iy: 350, hideX: 235, hideY: 235, stealthWeight: 1.8, type: 'carousel_ride' },
      { id: 'ap_carousel_control', name: 'Carousel Operator Console', roomId: 'wonder_rides', roomName: 'FERRIS & CAROUSEL PLAZA', x: 370, y: 200, w: 60, h: 50, ix: 400, iy: 280, hideX: 400, hideY: 225, stealthWeight: 1.3, type: 'operator_booth' },
      { id: 'ap_ferris_wheel', name: 'Giant Star Ferris Wheel Hub', roomId: 'wonder_rides', roomName: 'FERRIS & CAROUSEL PLAZA', x: 520, y: 100, w: 190, h: 190, ix: 475, iy: 195, hideX: 615, hideY: 195, stealthWeight: 1.8, type: 'ferris_wheel' },
      { id: 'ap_ferris_ramp', name: 'Ferris Wheel Boarding Queue', roomId: 'wonder_rides', roomName: 'FERRIS & CAROUSEL PLAZA', x: 540, y: 310, w: 110, h: 50, ix: 595, iy: 385, hideX: 595, hideY: 335, stealthWeight: 1.4, type: 'boarding_ramp' },
      { id: 'ap_photo_booth', name: 'Park Memory Photo Booth', roomId: 'wonder_rides', roomName: 'FERRIS & CAROUSEL PLAZA', x: 120, y: 440, w: 75, h: 60, ix: 157, iy: 525, hideX: 157, hideY: 470, stealthWeight: 1.5, type: 'photo_booth' },
      { id: 'ap_souvenir_kiosk', name: 'Carousel Plush Toy Stall', roomId: 'wonder_rides', roomName: 'FERRIS & CAROUSEL PLAZA', x: 270, y: 440, w: 90, h: 60, ix: 315, iy: 525, hideX: 315, hideY: 470, stealthWeight: 1.4, type: 'souvenir_stall' },

      // 4. Thunder Coaster & Pirate Cove (6 spots)
      { id: 'ap_coaster_station', name: 'Thunder Coaster Boarding Deck', roomId: 'thrill_zone', roomName: 'THUNDER COASTER & PIRATE COVE', x: 900, y: 100, w: 170, h: 75, ix: 985, iy: 205, hideX: 985, hideY: 137, stealthWeight: 1.6, type: 'coaster_station' },
      { id: 'ap_coaster_train_1', name: 'Coaster Train Front Engine Car', roomId: 'thrill_zone', roomName: 'THUNDER COASTER & PIRATE COVE', x: 1110, y: 105, w: 105, h: 65, ix: 1162, iy: 195, hideX: 1162, hideY: 137, stealthWeight: 1.5, type: 'coaster_car' },
      { id: 'ap_coaster_train_2', name: 'Coaster Train Passenger Car', roomId: 'thrill_zone', roomName: 'THUNDER COASTER & PIRATE COVE', x: 1250, y: 105, w: 105, h: 65, ix: 1302, iy: 195, hideX: 1302, hideY: 137, stealthWeight: 1.5, type: 'coaster_car' },
      { id: 'ap_pirate_ship', name: 'Buccaneer Pirate Galleon Swing', roomId: 'thrill_zone', roomName: 'THUNDER COASTER & PIRATE COVE', x: 1470, y: 110, w: 210, h: 135, ix: 1575, iy: 275, hideX: 1575, hideY: 177, stealthWeight: 1.8, type: 'pirate_ship' },
      { id: 'ap_pirate_gangplank', name: 'Pirate Ship Boarding Gangplank', roomId: 'thrill_zone', roomName: 'THUNDER COASTER & PIRATE COVE', x: 1410, y: 265, w: 95, h: 50, ix: 1457, iy: 345, hideX: 1457, hideY: 290, stealthWeight: 1.4, type: 'boarding_ramp' },
      { id: 'ap_coaster_lockers', name: 'Ride Safety Lockers Bank', roomId: 'thrill_zone', roomName: 'THUNDER COASTER & PIRATE COVE', x: 930, y: 250, w: 85, h: 45, ix: 972, iy: 320, hideX: 972, hideY: 272, stealthWeight: 1.3, type: 'safety_lockers' },

      // 5. Bumper Cars & Retro Arcade (6 spots)
      { id: 'ap_bumper_arena', name: 'Electric Bumper Cars Arena Buffer', roomId: 'arcade_arena', roomName: 'BUMPER CARS & RETRO ARCADE', x: 1280, y: 490, w: 210, h: 135, ix: 1385, iy: 440, hideX: 1385, hideY: 557, stealthWeight: 1.7, type: 'bumper_arena' },
      { id: 'ap_bumper_car_red', name: 'Red Bumper Car (#7)', roomId: 'arcade_arena', roomName: 'BUMPER CARS & RETRO ARCADE', x: 1560, y: 500, w: 70, h: 50, ix: 1660, iy: 525, hideX: 1595, hideY: 525, stealthWeight: 1.4, type: 'bumper_car' },
      { id: 'ap_bumper_car_blue', name: 'Blue Bumper Car (#12)', roomId: 'arcade_arena', roomName: 'BUMPER CARS & RETRO ARCADE', x: 1560, y: 580, w: 70, h: 50, ix: 1660, iy: 605, hideX: 1595, hideY: 605, stealthWeight: 1.4, type: 'bumper_car' },
      { id: 'ap_claw_machine', name: 'Giant Plush Claw Machine', roomId: 'arcade_arena', roomName: 'BUMPER CARS & RETRO ARCADE', x: 1260, y: 705, w: 90, h: 50, ix: 1305, iy: 660, hideX: 1305, hideY: 730, stealthWeight: 1.4, type: 'claw_machine' },
      { id: 'ap_racing_cabs', name: 'Twin VR Racing Arcade Cabs', roomId: 'arcade_arena', roomName: 'BUMPER CARS & RETRO ARCADE', x: 1410, y: 705, w: 100, h: 55, ix: 1460, iy: 660, hideX: 1460, hideY: 732, stealthWeight: 1.5, type: 'arcade_cabinets' },
      { id: 'ap_prize_counter', name: 'Arcade Prize & Token Counter', roomId: 'arcade_arena', roomName: 'BUMPER CARS & RETRO ARCADE', x: 1580, y: 705, w: 85, h: 50, ix: 1622, iy: 660, hideX: 1622, hideY: 730, stealthWeight: 1.3, type: 'prize_counter' },

      // 6. Mystery Haunted Castle (5 spots)
      { id: 'ap_haunted_facade', name: 'Gothic Castle Crypt Gate', roomId: 'haunted_zone', roomName: 'MYSTERY HAUNTED CASTLE', x: 1260, y: 840, w: 130, h: 70, ix: 1325, iy: 935, hideX: 1325, hideY: 875, stealthWeight: 1.7, type: 'haunted_castle' },
      { id: 'ap_ghost_cart', name: 'Spooky Ghost Train Minecart', roomId: 'haunted_zone', roomName: 'MYSTERY HAUNTED CASTLE', x: 1440, y: 840, w: 85, h: 55, ix: 1482, iy: 925, hideX: 1482, hideY: 867, stealthWeight: 1.5, type: 'ghost_cart' },
      { id: 'ap_fortune_tent', name: 'Madame Zora Mystic Tent', roomId: 'haunted_zone', roomName: 'MYSTERY HAUNTED CASTLE', x: 1640, y: 850, w: 85, h: 85, ix: 1682, iy: 960, hideX: 1682, hideY: 892, stealthWeight: 1.6, type: 'fortune_tent' },
      { id: 'ap_cemetery_tomb', name: 'Gargoyle Pillar & Coffin Prop', roomId: 'haunted_zone', roomName: 'MYSTERY HAUNTED CASTLE', x: 1290, y: 970, w: 75, h: 45, ix: 1327, iy: 935, hideX: 1327, hideY: 992, stealthWeight: 1.4, type: 'cemetery_prop' },
      { id: 'ap_witch_cauldron', name: 'Witch Cauldron & Potion Stand', roomId: 'haunted_zone', roomName: 'MYSTERY HAUNTED CASTLE', x: 1510, y: 970, w: 70, h: 45, ix: 1545, iy: 935, hideX: 1545, hideY: 992, stealthWeight: 1.3, type: 'cauldron_prop' },

      // 7. Central Fountain & Picnic Lawn (5 spots)
      { id: 'ap_ice_cream', name: 'Sweet Scoops Ice Cream Parlor', roomId: 'food_fair', roomName: 'CENTRAL FOUNTAIN & PICNIC LAWN', x: 700, y: 490, w: 105, h: 60, ix: 752, iy: 575, hideX: 752, hideY: 520, stealthWeight: 1.4, type: 'ice_cream_stand' },
      { id: 'ap_pretzel_cart', name: 'Warm Pretzels & Churros Cart', roomId: 'food_fair', roomName: 'CENTRAL FOUNTAIN & PICNIC LAWN', x: 860, y: 490, w: 80, h: 50, ix: 900, iy: 565, hideX: 900, hideY: 515, stealthWeight: 1.3, type: 'pretzel_cart' },
      { id: 'ap_central_fountain', name: 'Grand Tiered Fountain Pool', roomId: 'food_fair', roomName: 'CENTRAL FOUNTAIN & PICNIC LAWN', x: 870, y: 620, w: 100, h: 100, ix: 920, iy: 745, hideX: 920, hideY: 670, stealthWeight: 1.7, type: 'tiered_fountain' },
      { id: 'ap_gazebo', name: 'Victorian Garden Gazebo', roomId: 'food_fair', roomName: 'CENTRAL FOUNTAIN & PICNIC LAWN', x: 1040, y: 490, w: 110, h: 90, ix: 1095, iy: 605, hideX: 1095, hideY: 535, stealthWeight: 1.6, type: 'park_gazebo' },
      { id: 'ap_garden_bench', name: 'Rose Garden Park Bench', roomId: 'food_fair', roomName: 'CENTRAL FOUNTAIN & PICNIC LAWN', x: 1040, y: 650, w: 100, h: 45, ix: 1090, iy: 720, hideX: 1090, hideY: 672, stealthWeight: 1.3, type: 'park_bench' }
    ];

    this.decorProps = [];

    this.navNodes = {
      entry_gate: { x: 920, y: 1000, neighbors: ['entry_main'] },
      entry_main: { x: 920, y: 930, neighbors: ['entry_gate', 'promenade_s_center'] },
      promenade_s_center: { x: 920, y: 810, neighbors: ['entry_main', 'promenade_sw', 'promenade_se', 'fountain_south'] },
      promenade_sw: { x: 500, y: 810, neighbors: ['promenade_s_center', 'midway_center'] },
      promenade_se: { x: 1350, y: 810, neighbors: ['promenade_s_center', 'arcade_w', 'haunted_gateway'] },
      midway_center: { x: 300, y: 810, neighbors: ['promenade_sw', 'midway_north'] },
      midway_north: { x: 300, y: 620, neighbors: ['midway_center', 'wonder_plaza_s'] },
      fountain_south: { x: 920, y: 745, neighbors: ['promenade_s_center', 'fountain_center'] },
      fountain_center: { x: 770, y: 620, neighbors: ['fountain_south', 'fountain_north', 'gazebo_east', 'wonder_plaza_s'] },
      fountain_north: { x: 920, y: 440, neighbors: ['fountain_center', 'thrill_w'] },
      gazebo_east: { x: 1100, y: 620, neighbors: ['fountain_center', 'arcade_w'] },
      wonder_plaza_s: { x: 420, y: 480, neighbors: ['midway_north', 'fountain_center', 'wonder_plaza_c'] },
      wonder_plaza_c: { x: 420, y: 260, neighbors: ['wonder_plaza_s', 'carousel_s', 'carousel_w', 'ferris_s', 'ferris_e'] },
      carousel_s: { x: 235, y: 350, neighbors: ['wonder_plaza_c'] },
      carousel_w: { x: 110, y: 235, neighbors: ['wonder_plaza_c'] },
      ferris_s: { x: 595, y: 385, neighbors: ['wonder_plaza_c'] },
      ferris_e: { x: 740, y: 220, neighbors: ['wonder_plaza_c', 'thrill_w'] },
      thrill_w: { x: 920, y: 220, neighbors: ['ferris_e', 'fountain_north', 'thrill_coaster'] },
      thrill_coaster: { x: 1180, y: 220, neighbors: ['thrill_w', 'thrill_pirate'] },
      thrill_pirate: { x: 1460, y: 345, neighbors: ['thrill_coaster'] },
      arcade_w: { x: 1250, y: 620, neighbors: ['gazebo_east', 'promenade_se', 'arcade_c'] },
      arcade_c: { x: 1450, y: 620, neighbors: ['arcade_w', 'arcade_e', 'haunted_gateway'] },
      arcade_e: { x: 1660, y: 620, neighbors: ['arcade_c'] },
      haunted_gateway: { x: 1480, y: 793, neighbors: ['promenade_se', 'arcade_c', 'haunted_plaza_c'] },
      haunted_plaza_c: { x: 1480, y: 925, neighbors: ['haunted_gateway'] }
    };

    this.roomHubNode = {
      entry_plaza: 'entry_main',
      food_fair: 'fountain_center',
      carnival_midway: 'midway_center',
      wonder_rides: 'wonder_plaza_c',
      thrill_zone: 'thrill_coaster',
      arcade_arena: 'arcade_c',
      haunted_zone: 'haunted_plaza_c'
    };
  }

  resetSpots() {
    for (const spot of this.hidingSpots) {
      spot.checked = false;
    }
  }

  getNearestSpot(x, y, maxDist = 64) {
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

