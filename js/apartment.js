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
  // MAP 3: UNDERGROUND BASEMENT (1320 x 800, 25 Spots)
  // Wide open entrance, spaced out rooms & non-hiding decoy props
  // ========================================================
  buildBasementMap() {
    this.mapName = 'Underground Basement';
    this.width = 1320;
    this.height = 800;
    // South central foyer spawn with wide 180px clear turning radius!
    this.spawn = { x: 660, y: 640 };
    this.botSpawn = { x: 660, y: 700 };

    this.rooms = [
      { id: 'parking_bay', name: 'EXECUTIVE PARKING BAY', x: 40, y: 40, w: 780, h: 440, floor: 'concrete' },
      { id: 'workshop', name: 'MAINTENANCE WORKSHOP', x: 860, y: 40, w: 420, h: 440, floor: 'concrete_dark' },
      { id: 'storage_bay', name: 'CARGO FREIGHT & STORAGE', x: 40, y: 520, w: 400, h: 240, floor: 'concrete_dark' },
      { id: 'security_foyer', name: 'SECURITY DISPATCH & FOYER', x: 480, y: 520, w: 360, h: 240, floor: 'concrete' },
      { id: 'boiler_vault', name: 'POWER & BOILER VAULT', x: 880, y: 520, w: 400, h: 240, floor: 'concrete' }
    ];

    this.parkingLines = [
      { x: 75, y: 58, w: 95, h: 60 },
      { x: 255, y: 58, w: 95, h: 60 },
      { x: 435, y: 58, w: 98, h: 60 },
      { x: 615, y: 58, w: 95, h: 60 },
      { x: 135, y: 382, w: 100, h: 60 },
      { x: 475, y: 382, w: 95, h: 60 }
    ];

    this.walls = [
      // Outer perimeter walls
      { x: 40, y: 40, w: 1240, h: 14 },
      { x: 40, y: 40, w: 14, h: 720 },
      { x: 1266, y: 40, w: 14, h: 720 },
      { x: 40, y: 746, w: 550, h: 14 },
      { x: 770, y: 746, w: 510, h: 14 }, // South entrance portal x: 590..770 (180px wide!)

      // Parking to Workshop vertical divider (wide open doorway y: 190..330)
      { x: 833, y: 40, w: 14, h: 150 },
      { x: 833, y: 330, w: 14, h: 150 },

      // Parking to Storage & Foyer horizontal divider (passages at x: 210..330 & x: 580..740)
      { x: 40, y: 493, w: 170, h: 14 },
      { x: 330, y: 493, w: 250, h: 14 },
      { x: 740, y: 493, w: 107, h: 14 },

      // Storage to Foyer vertical divider (wide passage y: 580..680)
      { x: 457, y: 500, w: 14, h: 80 },
      { x: 457, y: 680, w: 14, h: 66 },

      // Workshop to Boiler Vault horizontal divider (doorway at x: 990..1130)
      { x: 840, y: 493, w: 150, h: 14 },
      { x: 1130, y: 493, w: 150, h: 14 },

      // Foyer to Boiler Vault vertical divider (doorway at y: 580..680)
      { x: 857, y: 500, w: 14, h: 80 },
      { x: 857, y: 680, w: 14, h: 66 }
    ];

    this.glassWalls = [];
    this.doors = [];

    this.hidingSpots = [
      // 1. Security Dispatch & Foyer (4 Spots - Spaced to perimeter, leaving center 100% open)
      { id: 'b_security_desk', name: 'Behind Security Dispatch Desk', roomId: 'security_foyer', roomName: 'Security Dispatch & Foyer', type: 'security_desk', x: 500, y: 540, w: 85, h: 48, hideX: 542, hideY: 564, ix: 542, iy: 615, stealthWeight: 1.1, checked: false },
      { id: 'b_vending_row', name: 'Behind Lobby Vending Machine', roomId: 'security_foyer', roomName: 'Security Dispatch & Foyer', type: 'vending', x: 730, y: 540, w: 75, h: 48, hideX: 767, hideY: 564, ix: 767, iy: 615, stealthWeight: 0.95, checked: false },
      { id: 'b_keycard_alcove', name: 'Behind Keycard Terminal Alcove', roomId: 'security_foyer', roomName: 'Security Dispatch & Foyer', type: 'keycard_rack', x: 500, y: 675, w: 60, h: 45, hideX: 530, hideY: 697, ix: 585, iy: 697, stealthWeight: 0.9, checked: false },
      { id: 'b_elevator_hub', name: 'Inside North Elevator Alcove', roomId: 'security_foyer', roomName: 'Security Dispatch & Foyer', type: 'elevator', x: 740, y: 675, w: 85, h: 48, hideX: 782, hideY: 699, ix: 700, iy: 699, stealthWeight: 0.9, checked: false },

      // 2. Executive Parking Bay (6 Spots - Widely spaced cars)
      { id: 'b_car_red', name: 'Behind Red Sports Coupe', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'compact_car', x: 80, y: 65, w: 85, h: 46, hideX: 122, hideY: 88, ix: 122, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'b_car_silver', name: 'Behind Silver Sedan', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'compact_car', x: 260, y: 65, w: 85, h: 46, hideX: 302, hideY: 88, ix: 302, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'b_car_black', name: 'Behind Black Executive SUV', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'compact_car', x: 440, y: 65, w: 88, h: 48, hideX: 484, hideY: 89, ix: 484, iy: 142, stealthWeight: 1.05, checked: false },
      { id: 'b_car_blue', name: 'Behind Blue Compact', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'compact_car', x: 620, y: 65, w: 85, h: 46, hideX: 662, hideY: 88, ix: 662, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'b_car_yellow', name: 'Behind Yellow Service Van', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'compact_car', x: 140, y: 390, w: 90, h: 46, hideX: 185, hideY: 413, ix: 185, iy: 345, stealthWeight: 1.0, checked: false },
      { id: 'b_car_green', name: 'Behind Green Station Wagon', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'compact_car', x: 480, y: 390, w: 85, h: 46, hideX: 522, hideY: 413, ix: 522, iy: 345, stealthWeight: 1.0, checked: false },

      // 3. Maintenance Workshop (5 Spots)
      { id: 'b_workbench', name: 'Behind Heavy Steel Workbench', roomId: 'workshop', roomName: 'Maintenance Workshop', type: 'workbench_prop', x: 890, y: 65, w: 100, h: 48, hideX: 940, hideY: 89, ix: 940, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'b_tool_chest', name: 'Behind Rolling Tool Cabinet', roomId: 'workshop', roomName: 'Maintenance Workshop', type: 'tool_chest', x: 1140, y: 65, w: 90, h: 45, hideX: 1185, hideY: 87, ix: 1185, iy: 138, stealthWeight: 0.95, checked: false },
      { id: 'b_air_compressor', name: 'Behind Industrial Compressor', roomId: 'workshop', roomName: 'Maintenance Workshop', type: 'air_compressor', x: 1150, y: 220, w: 80, h: 55, hideX: 1190, hideY: 247, ix: 1190, iy: 300, stealthWeight: 1.0, checked: false },
      { id: 'b_forklift', name: 'Behind Heavy Electric Forklift', roomId: 'workshop', roomName: 'Maintenance Workshop', type: 'forklift', x: 890, y: 360, w: 100, h: 60, hideX: 940, hideY: 390, ix: 940, iy: 315, stealthWeight: 1.15, checked: false },
      { id: 'b_oil_drums', name: 'Behind Lubricant Drum Pallet', roomId: 'workshop', roomName: 'Maintenance Workshop', type: 'oil_drums', x: 1140, y: 360, w: 85, h: 55, hideX: 1182, hideY: 387, ix: 1182, iy: 315, stealthWeight: 0.9, checked: false },

      // 4. Cargo Freight & Storage (5 Spots)
      { id: 'b_cargo_crates', name: 'Behind Stacked Wooden Crates', roomId: 'storage_bay', roomName: 'Cargo Freight & Storage', type: 'crates', x: 80, y: 540, w: 95, h: 55, hideX: 127, hideY: 567, ix: 127, iy: 620, stealthWeight: 0.95, checked: false },
      { id: 'b_dumpster', name: 'Behind Industrial Steel Dumpster', roomId: 'storage_bay', roomName: 'Cargo Freight & Storage', type: 'dumpster', x: 290, y: 540, w: 100, h: 50, hideX: 340, hideY: 565, ix: 340, iy: 615, stealthWeight: 0.9, checked: false },
      { id: 'b_storage_lockers', name: 'Inside Warehouse Locker Bank', roomId: 'storage_bay', roomName: 'Cargo Freight & Storage', type: 'lockers', x: 80, y: 670, w: 110, h: 45, hideX: 135, hideY: 692, ix: 135, iy: 635, stealthWeight: 0.85, checked: false },
      { id: 'b_pallet_stack', name: 'Behind Pallet Tower', roomId: 'storage_bay', roomName: 'Cargo Freight & Storage', type: 'pallet_stack', x: 220, y: 670, w: 75, h: 50, hideX: 257, hideY: 695, ix: 257, iy: 635, stealthWeight: 0.9, checked: false },
      { id: 'b_pipe_rack', name: 'Behind Steel Conduit Pipe Rack', roomId: 'storage_bay', roomName: 'Cargo Freight & Storage', type: 'pipe_rack', x: 320, y: 670, w: 80, h: 45, hideX: 360, hideY: 692, ix: 360, iy: 635, stealthWeight: 0.95, checked: false },

      // 5. Power & Boiler Vault (5 Spots - Well spaced out around perimeter with wide central corridor)
      { id: 'b_boiler', name: 'Behind Commercial Steam Boiler', roomId: 'boiler_vault', roomName: 'Power & Boiler Vault', type: 'boiler', x: 910, y: 540, w: 105, h: 65, hideX: 962, hideY: 572, ix: 962, iy: 635, stealthWeight: 0.9, checked: false },
      { id: 'b_generator', name: 'Behind Backup Diesel Generator', roomId: 'boiler_vault', roomName: 'Power & Boiler Vault', type: 'generator', x: 1140, y: 540, w: 105, h: 65, hideX: 1192, hideY: 572, ix: 1192, iy: 635, stealthWeight: 0.9, checked: false },
      { id: 'b_transformer', name: 'Behind High-Voltage Transformer', roomId: 'boiler_vault', roomName: 'Power & Boiler Vault', type: 'transformer', x: 910, y: 670, w: 85, h: 48, hideX: 952, hideY: 694, ix: 952, iy: 635, stealthWeight: 0.85, checked: false },
      { id: 'b_breaker_panel', name: 'Behind Main Circuit Breaker Panel', roomId: 'boiler_vault', roomName: 'Power & Boiler Vault', type: 'breaker_panel', x: 1040, y: 670, w: 85, h: 45, hideX: 1082, hideY: 692, ix: 1082, iy: 635, stealthWeight: 0.85, checked: false },
      { id: 'b_vent_duct', name: 'Behind Galvanized Air Intake Duct', roomId: 'boiler_vault', roomName: 'Power & Boiler Vault', type: 'vent_duct', x: 1160, y: 670, w: 80, h: 48, hideX: 1200, hideY: 694, ix: 1200, iy: 635, stealthWeight: 0.95, checked: false }
    ];

    // Non-Hiding Decoy Obstacles (Solid collision, look realistic, cannot be hidden in!)
    this.decorProps = [
      { type: 'pillar', roomId: 'parking_bay', x: 280, y: 230, w: 34, h: 34 },
      { type: 'pillar', roomId: 'parking_bay', x: 580, y: 230, w: 34, h: 34 },
      { type: 'traffic_cone', roomId: 'parking_bay', x: 740, y: 230, w: 24, h: 24 },
      { type: 'elec_panel', roomId: 'workshop', x: 865, y: 220, w: 18, h: 60 },
      { type: 'pillar', roomId: 'storage_bay', x: 230, y: 570, w: 32, h: 32 },
      { type: 'workbench_prop', roomId: 'storage_bay', x: 55, y: 615, w: 20, h: 38 },
      { type: 'traffic_cone', roomId: 'boiler_vault', x: 1050, y: 560, w: 24, h: 24 },
      { type: 'plant', roomId: 'security_foyer', x: 780, y: 610, w: 28, h: 28 }
    ];

    this.ambientLights = [
      { x: 420, y: 240, r: 160, color: 'rgba(246, 239, 226, 0.08)' },
      { x: 1070, y: 240, r: 140, color: 'rgba(56, 189, 248, 0.09)' },
      { x: 1070, y: 640, r: 130, color: 'rgba(249, 115, 22, 0.11)' },
      { x: 240, y: 640, r: 130, color: 'rgba(246, 239, 226, 0.08)' },
      { x: 660, y: 640, r: 120, color: 'rgba(253, 224, 71, 0.09)' }
    ];

    this.navNodes = {
      foyer_spawn: { x: 660, y: 640, neighbors: ['foyer_north', 'storage_door', 'boiler_door'] },
      foyer_north: { x: 660, y: 493, neighbors: ['foyer_spawn', 'parking_south'] },
      storage_door: { x: 457, y: 630, neighbors: ['foyer_spawn', 'storage_center'] },
      storage_center: { x: 240, y: 630, neighbors: ['storage_door', 'storage_north'] },
      storage_north: { x: 260, y: 493, neighbors: ['storage_center', 'parking_south'] },
      boiler_door: { x: 857, y: 630, neighbors: ['foyer_spawn', 'boiler_center'] },
      boiler_center: { x: 1060, y: 630, neighbors: ['boiler_door', 'boiler_north'] },
      boiler_north: { x: 1060, y: 493, neighbors: ['boiler_center', 'workshop_center'] },
      parking_south: { x: 480, y: 340, neighbors: ['foyer_north', 'storage_north', 'parking_center', 'parking_east'] },
      parking_center: { x: 260, y: 230, neighbors: ['parking_south', 'parking_north'] },
      parking_north: { x: 480, y: 150, neighbors: ['parking_center', 'parking_east'] },
      parking_east: { x: 720, y: 240, neighbors: ['parking_south', 'parking_north', 'workshop_door'] },
      workshop_door: { x: 833, y: 260, neighbors: ['parking_east', 'workshop_center'] },
      workshop_center: { x: 1060, y: 260, neighbors: ['workshop_door', 'workshop_north', 'boiler_north'] },
      workshop_north: { x: 1060, y: 140, neighbors: ['workshop_center'] }
    };

    this.roomHubNode = {
      parking_bay: 'parking_center',
      workshop: 'workshop_center',
      storage_bay: 'storage_center',
      security_foyer: 'foyer_spawn',
      boiler_vault: 'boiler_center'
    };
  }

  // ========================================================
  // MAP 4: GRAND SHOPPING MALL (1520 x 920, 25 Spots)
  // Grand Atrium, Galleria Wings & Non-Hiding Architectural Props
  // ========================================================
  buildMallMap() {
    this.mapName = 'Grand Shopping Mall';
    this.width = 1520;
    this.height = 920;
    this.spawn = { x: 760, y: 780 };
    this.botSpawn = { x: 760, y: 840 };

    this.rooms = [
      { id: 'fashion_wing', name: 'LUXURY BOUTIQUES & FASHION', x: 40, y: 40, w: 400, h: 420, floor: 'tile_warm' },
      { id: 'food_galleria', name: 'GOURMET FOOD GALLERIA', x: 460, y: 40, w: 600, h: 200, floor: 'tile_warm' },
      { id: 'cinema_arcade', name: 'CINEPLEX & VR ARCADE', x: 1080, y: 40, w: 400, h: 420, floor: 'tile_warm' },
      { id: 'main_atrium', name: 'GRAND ATRIUM & FOUNTAIN ROTUNDA', x: 460, y: 260, w: 600, h: 420, floor: 'mall_terrazzo' },
      { id: 'tech_hub', name: 'SMART TECH SUPERSTORE', x: 40, y: 480, w: 400, h: 400, floor: 'tile' },
      { id: 'entry_portal', name: 'MAIN PROMENADE ENTRANCE', x: 460, y: 700, w: 600, h: 180, floor: 'mall_terrazzo' },
      { id: 'sports_outlet', name: 'OUTDOOR & SPORTS MEGASTORE', x: 1080, y: 480, w: 400, h: 400, floor: 'tile' }
    ];

    this.walls = [
      // Outer mall concrete perimeter
      { x: 40, y: 40, w: 1440, h: 14 },
      { x: 40, y: 40, w: 14, h: 840 },
      { x: 1466, y: 40, w: 14, h: 840 },
      { x: 40, y: 866, w: 640, h: 14 },
      { x: 840, y: 866, w: 640, h: 14 }, // South entrance portal x: 680..840 (160px wide)

      // Solid partitions between stores
      { x: 40, y: 467, w: 400, h: 14 },
      { x: 1080, y: 467, w: 400, h: 14 },

      // Structural entrance pillars flanking wide store portals
      { x: 433, y: 40, w: 14, h: 60 },
      { x: 433, y: 380, w: 14, h: 90 },
      { x: 1073, y: 40, w: 14, h: 60 },
      { x: 1073, y: 380, w: 14, h: 90 },

      { x: 433, y: 480, w: 14, h: 70 },
      { x: 433, y: 800, w: 14, h: 70 },
      { x: 1073, y: 480, w: 14, h: 70 },
      { x: 1073, y: 800, w: 14, h: 70 }
    ];

    this.glassWalls = [
      { x: 435, y: 100, w: 10, h: 160 },   // Fashion store display window
      { x: 1075, y: 100, w: 10, h: 160 },  // Cinema foyer window
      { x: 435, y: 640, w: 10, h: 160 },   // Tech store window
      { x: 1075, y: 640, w: 10, h: 160 }   // Sports outlet window
    ];

    this.doors = [];

    this.hidingSpots = [
      // 1. Grand Atrium (6 Spots - Centerpieces of the mall)
      { id: 'mall_fountain', name: 'Behind Grand Atrium Fountain', roomId: 'main_atrium', roomName: 'Grand Atrium & Fountain Rotunda', type: 'fountain', x: 700, y: 420, w: 120, h: 100, hideX: 760, hideY: 470, ix: 660, iy: 470, stealthWeight: 1.2, checked: false },
      { id: 'mall_escalator', name: 'Under Glass Escalators', roomId: 'main_atrium', roomName: 'Grand Atrium & Fountain Rotunda', type: 'escalator', x: 500, y: 300, w: 130, h: 60, hideX: 565, hideY: 330, ix: 565, iy: 385, stealthWeight: 1.05, checked: false },
      { id: 'mall_elev_atrium', name: 'Behind Panoramic Lift Capsule', roomId: 'main_atrium', roomName: 'Grand Atrium & Fountain Rotunda', type: 'elevator', x: 890, y: 300, w: 90, h: 54, hideX: 935, hideY: 327, ix: 935, iy: 380, stealthWeight: 0.95, checked: false },
      { id: 'mall_kiosk_coffee', name: 'Inside Espresso Kiosk Island', roomId: 'main_atrium', roomName: 'Grand Atrium & Fountain Rotunda', type: 'mall_kiosk', x: 500, y: 550, w: 85, h: 55, hideX: 542, hideY: 577, ix: 542, iy: 518, stealthWeight: 1.05, checked: false },
      { id: 'mall_kiosk_watches', name: 'Inside Luxury Watch Kiosk', roomId: 'main_atrium', roomName: 'Grand Atrium & Fountain Rotunda', type: 'mall_kiosk', x: 935, y: 550, w: 85, h: 55, hideX: 977, hideY: 577, ix: 977, iy: 518, stealthWeight: 1.05, checked: false },
      { id: 'mall_info_hub', name: 'Behind Concierge Info Hub', roomId: 'main_atrium', roomName: 'Grand Atrium & Fountain Rotunda', type: 'checkout_lane', x: 705, y: 600, w: 110, h: 48, hideX: 760, hideY: 624, ix: 760, iy: 568, stealthWeight: 1.05, checked: false },

      // 2. Luxury Boutiques & Fashion (4 Spots)
      { id: 'mall_fitting', name: 'Inside Fitting Stall Curtains', roomId: 'fashion_wing', roomName: 'Luxury Boutiques & Fashion', type: 'fitting_stall', x: 80, y: 70, w: 110, h: 55, hideX: 135, hideY: 97, ix: 135, iy: 150, stealthWeight: 0.85, checked: false },
      { id: 'mall_clothing_carousel', name: 'Behind Clothing Carousel', roomId: 'fashion_wing', roomName: 'Luxury Boutiques & Fashion', type: 'clothing_carousel', x: 260, y: 80, w: 70, h: 70, hideX: 295, hideY: 115, ix: 295, iy: 175, stealthWeight: 1.0, checked: false },
      { id: 'mall_mannequin', name: 'Behind Haute Couture Podium', roomId: 'fashion_wing', roomName: 'Luxury Boutiques & Fashion', type: 'mannequin_stage', x: 80, y: 250, w: 90, h: 60, hideX: 125, hideY: 280, ix: 125, iy: 220, stealthWeight: 1.05, checked: false },
      { id: 'mall_fashion_pos', name: 'Behind Boutique VIP Register', roomId: 'fashion_wing', roomName: 'Luxury Boutiques & Fashion', type: 'checkout_lane', x: 240, y: 360, w: 130, h: 48, hideX: 305, hideY: 384, ix: 305, iy: 330, stealthWeight: 0.95, checked: false },

      // 3. Gourmet Food Galleria (4 Spots)
      { id: 'mall_burger_bay', name: 'Behind Burger Kitchen Counter', roomId: 'food_galleria', roomName: 'Gourmet Food Galleria', type: 'food_counter', x: 490, y: 65, w: 160, h: 50, hideX: 570, hideY: 90, ix: 570, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'mall_coffee_bay', name: 'Behind Artisan Bakery Counter', roomId: 'food_galleria', roomName: 'Gourmet Food Galleria', type: 'food_counter', x: 710, y: 65, w: 160, h: 50, hideX: 790, hideY: 90, ix: 790, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'mall_vending_row', name: 'Behind Import Vending Bank', roomId: 'food_galleria', roomName: 'Gourmet Food Galleria', type: 'vending', x: 920, y: 65, w: 120, h: 48, hideX: 980, hideY: 89, ix: 980, iy: 138, stealthWeight: 0.95, checked: false },
      { id: 'mall_bistro_booth', name: 'Inside Padded Dining Booth', roomId: 'food_galleria', roomName: 'Gourmet Food Galleria', type: 'bistro_table', x: 715, y: 155, w: 90, h: 65, hideX: 760, hideY: 187, ix: 680, iy: 187, stealthWeight: 1.1, checked: false },

      // 4. Cineplex & VR Arcade (4 Spots)
      { id: 'mall_popcorn_bar', name: 'Behind Movie Snack Concession', roomId: 'cinema_arcade', roomName: 'Cineplex & VR Arcade', type: 'food_counter', x: 1120, y: 70, w: 120, h: 50, hideX: 1180, hideY: 95, ix: 1180, iy: 145, stealthWeight: 1.0, checked: false },
      { id: 'mall_vr_pod', name: 'Inside Twin VR Immersion Pod', roomId: 'cinema_arcade', roomName: 'Cineplex & VR Arcade', type: 'booth', x: 1320, y: 70, w: 110, h: 75, hideX: 1375, hideY: 107, ix: 1375, iy: 170, stealthWeight: 0.9, checked: false },
      { id: 'mall_racing_cabs', name: 'Behind Twin Racing Arcades', roomId: 'cinema_arcade', roomName: 'Cineplex & VR Arcade', type: 'arcade_cabinets', x: 1120, y: 250, w: 100, h: 55, hideX: 1170, hideY: 277, ix: 1170, iy: 330, stealthWeight: 1.0, checked: false },
      { id: 'mall_claw_machine', name: 'Behind Giant Plush Crane Game', roomId: 'cinema_arcade', roomName: 'Cineplex & VR Arcade', type: 'claw_machine', x: 1330, y: 250, w: 85, h: 55, hideX: 1372, hideY: 277, ix: 1372, iy: 330, stealthWeight: 0.95, checked: false },

      // 5. Smart Tech Superstore (3 Spots)
      { id: 'mall_led_wall', name: 'Behind OLED Display Screen Wall', roomId: 'tech_hub', roomName: 'Smart Tech Superstore', type: 'tv_console', x: 70, y: 530, w: 45, h: 140, hideX: 92, hideY: 600, ix: 140, iy: 600, stealthWeight: 0.95, checked: false },
      { id: 'mall_showcase', name: 'Behind Flagship Phone Island', roomId: 'tech_hub', roomName: 'Smart Tech Superstore', type: 'glass_showcase', x: 190, y: 560, w: 140, h: 55, hideX: 260, hideY: 587, ix: 260, iy: 530, stealthWeight: 1.1, checked: false },
      { id: 'mall_tech_gondola', name: 'Behind Gaming Hardware Aisle', roomId: 'tech_hub', roomName: 'Smart Tech Superstore', type: 'gondola_aisle', x: 220, y: 760, w: 140, h: 48, hideX: 290, hideY: 784, ix: 290, iy: 730, stealthWeight: 0.95, checked: false },

      // 6. Outdoor & Sports Megastore (4 Spots)
      { id: 'mall_checkout', name: 'Behind Sports Outlet Cashier', roomId: 'sports_outlet', roomName: 'Outdoor & Sports Megastore', type: 'checkout_lane', x: 1120, y: 540, w: 120, h: 48, hideX: 1180, hideY: 564, ix: 1180, iy: 512, stealthWeight: 1.0, checked: false },
      { id: 'mall_tent', name: 'Inside 4-Person Camping Tent', roomId: 'sports_outlet', roomName: 'Outdoor & Sports Megastore', type: 'tent', x: 1310, y: 530, w: 120, h: 100, hideX: 1370, hideY: 580, ix: 1280, iy: 580, stealthWeight: 0.85, checked: false },
      { id: 'mall_sneaker_aisle', name: 'Behind Sneaker Wall Gondola', roomId: 'sports_outlet', roomName: 'Outdoor & Sports Megastore', type: 'gondola_aisle', x: 1120, y: 760, w: 150, h: 50, hideX: 1195, hideY: 785, ix: 1195, iy: 730, stealthWeight: 0.95, checked: false },
      { id: 'mall_cart_corral', name: 'Behind Entrance Trolley Corral', roomId: 'entry_portal', roomName: 'Main Promenade Entrance', type: 'cart_corral', x: 890, y: 760, w: 100, h: 50, hideX: 940, hideY: 785, ix: 940, iy: 730, stealthWeight: 1.0, checked: false }
    ];

    // Non-Hiding Decoy Obstacles (Solid collision, look realistic, cannot be hidden in!)
    this.decorProps = [
      { type: 'plant', roomId: 'main_atrium', x: 670, y: 310, w: 32, h: 32 },
      { type: 'plant', roomId: 'main_atrium', x: 820, y: 310, w: 32, h: 32 },
      { type: 'bistro_prop', roomId: 'food_galleria', x: 570, y: 155, w: 50, h: 50 },
      { type: 'bistro_prop', roomId: 'food_galleria', x: 890, y: 155, w: 50, h: 50 },
      { type: 'workbench_prop', roomId: 'main_atrium', x: 745, y: 540, w: 30, h: 20 },
      { type: 'bistro_prop', roomId: 'fashion_wing', x: 180, y: 260, w: 46, h: 46 },
      { type: 'gondola_prop', roomId: 'sports_outlet', x: 1310, y: 760, w: 120, h: 45 }
    ];

    this.ambientLights = [
      { x: 760, y: 470, r: 180, color: 'rgba(56, 189, 248, 0.11)' },
      { x: 240, y: 240, r: 140, color: 'rgba(246, 239, 226, 0.09)' },
      { x: 1280, y: 240, r: 140, color: 'rgba(168, 85, 247, 0.10)' },
      { x: 240, y: 680, r: 140, color: 'rgba(56, 189, 248, 0.10)' },
      { x: 1280, y: 680, r: 140, color: 'rgba(16, 185, 129, 0.09)' },
      { x: 760, y: 800, r: 130, color: 'rgba(253, 224, 71, 0.09)' }
    ];

    this.navNodes = {
      mall_spawn: { x: 760, y: 780, neighbors: ['atrium_south'] },
      atrium_south: { x: 760, y: 600, neighbors: ['mall_spawn', 'atrium_center', 'tech_door', 'sports_door'] },
      atrium_center: { x: 760, y: 470, neighbors: ['atrium_south', 'atrium_north', 'atrium_west', 'atrium_east'] },
      atrium_west: { x: 580, y: 470, neighbors: ['atrium_center', 'fashion_door'] },
      atrium_east: { x: 940, y: 470, neighbors: ['atrium_center', 'cinema_door'] },
      atrium_north: { x: 760, y: 310, neighbors: ['atrium_center', 'food_west', 'food_east'] },
      food_west: { x: 600, y: 155, neighbors: ['atrium_north', 'food_east'] },
      food_east: { x: 920, y: 155, neighbors: ['atrium_north', 'food_west'] },
      fashion_door: { x: 433, y: 320, neighbors: ['atrium_west', 'fashion_center'] },
      fashion_center: { x: 240, y: 240, neighbors: ['fashion_door'] },
      cinema_door: { x: 1073, y: 320, neighbors: ['atrium_east', 'cinema_center'] },
      cinema_center: { x: 1280, y: 240, neighbors: ['cinema_door'] },
      tech_door: { x: 433, y: 680, neighbors: ['atrium_south', 'tech_center'] },
      tech_center: { x: 240, y: 680, neighbors: ['tech_door'] },
      sports_door: { x: 1073, y: 680, neighbors: ['atrium_south', 'sports_center'] },
      sports_center: { x: 1280, y: 680, neighbors: ['sports_door'] }
    };

    this.roomHubNode = {
      fashion_wing: 'fashion_center',
      food_galleria: 'food_west',
      cinema_arcade: 'cinema_center',
      main_atrium: 'atrium_center',
      tech_hub: 'tech_center',
      entry_portal: 'mall_spawn',
      sports_outlet: 'sports_center'
    };
  }

  // ========================================================
  // MAP 5: WONDERLAND PARK (1320 x 800, 25 Spots)
  // Grand Promenades, Spacious Theme Attractions & Non-Hiding Props
  // ========================================================
  buildAmusementMap() {
    this.mapName = 'Wonderland Park';
    this.width = 1320;
    this.height = 800;
    this.spawn = { x: 660, y: 640 };
    this.botSpawn = { x: 660, y: 700 };

    this.rooms = [
      { id: 'wonder_plaza', name: 'GRAND CLOCKTOWER PLAZA', x: 460, y: 500, w: 400, h: 260, floor: 'amusement_tile' },
      { id: 'carnival_midway', name: 'CARNIVAL MIDWAY & GAMES', x: 40, y: 460, w: 400, h: 300, floor: 'carnival_deck' },
      { id: 'fantasy_court', name: 'FANTASY CAROUSEL & FERRIS MEADOW', x: 40, y: 40, w: 580, h: 400, floor: 'amusement_tile' },
      { id: 'thrill_lagoon', name: 'THUNDER COASTER & PIRATE LAGOON', x: 640, y: 40, w: 640, h: 400, floor: 'amusement_tile' },
      { id: 'arcade_arena', name: 'BUMPER CARS & RETRO ARCADE', x: 880, y: 460, w: 400, h: 300, floor: 'bumper_floor' }
    ];

    this.walls = [
      // Outer park boundary walls
      { x: 40, y: 40, w: 1240, h: 14 },
      { x: 40, y: 40, w: 14, h: 720 },
      { x: 1266, y: 40, w: 14, h: 720 },
      { x: 40, y: 746, w: 550, h: 14 },
      { x: 770, y: 746, w: 510, h: 14 }, // South entrance portal x: 590..770 (180px wide)

      // Fantasy Court to Thrill Lagoon vertical divider (wide open doorway y: 150..290)
      { x: 627, y: 40, w: 14, h: 110 },
      { x: 627, y: 290, w: 14, h: 150 },

      // Midway to Fantasy Court horizontal divider (wide open passage x: 170..330)
      { x: 40, y: 447, w: 130, h: 14 },
      { x: 330, y: 447, w: 110, h: 14 },

      // Thrill to Arcade horizontal divider (wide open passage x: 960..1120)
      { x: 880, y: 447, w: 80, h: 14 },
      { x: 1120, y: 447, w: 160, h: 14 },

      // Plaza west arch to Midway (passage y: 530..670)
      { x: 447, y: 460, w: 14, h: 70 },
      { x: 447, y: 670, w: 14, h: 90 },

      // Plaza east arch to Arcade (passage y: 530..670)
      { x: 867, y: 460, w: 14, h: 70 },
      { x: 867, y: 670, w: 14, h: 90 }
    ];

    this.glassWalls = [];
    this.doors = [];

    this.hidingSpots = [
      // 1. Grand Clocktower Plaza (4 Spots)
      { id: 'ap_turnstiles', name: 'Brass Entrance Turnstiles', roomId: 'wonder_plaza', roomName: 'Grand Clocktower Plaza', type: 'turnstiles', x: 510, y: 690, w: 65, h: 36, hideX: 542, hideY: 708, ix: 600, iy: 708, stealthWeight: 1.2, checked: false },
      { id: 'ap_ticket_box', name: 'Victorian Ticket Kiosk', roomId: 'wonder_plaza', roomName: 'Grand Clocktower Plaza', type: 'ticket_booth', x: 490, y: 530, w: 75, h: 50, hideX: 527, hideY: 555, ix: 527, iy: 610, stealthWeight: 1.4, type: 'ticket_booth', checked: false },
      { id: 'ap_mascot_bear', name: 'Golden Peekko Mascot Monument', roomId: 'wonder_plaza', roomName: 'Grand Clocktower Plaza', type: 'mascot_statue', x: 740, y: 530, w: 70, h: 70, hideX: 775, hideY: 565, ix: 775, iy: 625, stealthWeight: 1.6, checked: false },
      { id: 'ap_balloon_cart', name: 'Festive Balloon Cluster Wagon', roomId: 'wonder_plaza', roomName: 'Grand Clocktower Plaza', type: 'balloon_cart', x: 740, y: 685, w: 65, h: 48, hideX: 772, hideY: 709, ix: 690, iy: 709, stealthWeight: 1.3, checked: false },

      // 2. Carnival Midway & Games (5 Spots)
      { id: 'ap_balloon_darts', name: 'Balloon Darts Game Booth', roomId: 'carnival_midway', roomName: 'Carnival Midway & Games', type: 'balloon_booth', x: 70, y: 480, w: 100, h: 65, hideX: 120, hideY: 512, ix: 120, iy: 570, stealthWeight: 1.5, checked: false },
      { id: 'ap_ring_toss', name: 'Giant Plush Ring Toss Booth', roomId: 'carnival_midway', roomName: 'Carnival Midway & Games', type: 'ring_toss_booth', x: 195, y: 480, w: 100, h: 65, hideX: 245, hideY: 512, ix: 245, iy: 570, stealthWeight: 1.5, checked: false },
      { id: 'ap_duck_pond', name: 'Spinning Lucky Duck Pond Stall', roomId: 'carnival_midway', roomName: 'Carnival Midway & Games', type: 'duck_pond', x: 320, y: 480, w: 90, h: 65, hideX: 365, hideY: 512, ix: 365, iy: 570, stealthWeight: 1.4, checked: false },
      { id: 'ap_popcorn_wagon', name: 'Vintage Brass Popcorn Wagon', roomId: 'carnival_midway', roomName: 'Carnival Midway & Games', type: 'popcorn_cart', x: 90, y: 670, w: 85, h: 55, hideX: 132, hideY: 697, ix: 132, iy: 630, stealthWeight: 1.4, checked: false },
      { id: 'ap_cotton_candy', name: 'Cotton Candy Floss Cart', roomId: 'carnival_midway', roomName: 'Carnival Midway & Games', type: 'cotton_candy_cart', x: 280, y: 670, w: 80, h: 55, hideX: 320, hideY: 697, ix: 320, iy: 630, stealthWeight: 1.3, checked: false },

      // 3. Fantasy Carousel & Ferris Meadow (6 Spots)
      { id: 'ap_carousel', name: 'Grand Musical Carousel', roomId: 'fantasy_court', roomName: 'Fantasy Carousel & Ferris Meadow', type: 'carousel_ride', x: 70, y: 70, w: 150, h: 150, hideX: 145, hideY: 145, ix: 145, iy: 245, stealthWeight: 1.8, checked: false },
      { id: 'ap_carousel_control', name: 'Carousel Control Console', roomId: 'fantasy_court', roomName: 'Fantasy Carousel & Ferris Meadow', type: 'operator_booth', x: 245, y: 130, w: 55, h: 45, hideX: 272, hideY: 152, ix: 272, iy: 195, stealthWeight: 1.3, checked: false },
      { id: 'ap_ferris_wheel', name: 'Giant Starlight Ferris Wheel', roomId: 'fantasy_court', roomName: 'Fantasy Carousel & Ferris Meadow', type: 'ferris_wheel', x: 360, y: 65, w: 170, h: 170, hideX: 445, hideY: 150, ix: 330, iy: 150, stealthWeight: 1.8, checked: false },
      { id: 'ap_photo_booth', name: 'Park Memory Photo Booth', roomId: 'fantasy_court', roomName: 'Fantasy Carousel & Ferris Meadow', type: 'photo_booth', x: 75, y: 310, w: 75, h: 60, hideX: 112, hideY: 340, ix: 112, iy: 265, stealthWeight: 1.5, checked: false },
      { id: 'ap_toy_stall', name: 'Plush Toy Souvenir Emporium', roomId: 'fantasy_court', roomName: 'Fantasy Carousel & Ferris Meadow', type: 'souvenir_stall', x: 220, y: 310, w: 85, h: 60, hideX: 262, hideY: 340, ix: 262, iy: 265, stealthWeight: 1.4, checked: false },
      { id: 'ap_fortune_tent', name: 'Madame Zora Mystic Tent', roomId: 'fantasy_court', roomName: 'Fantasy Carousel & Ferris Meadow', type: 'fortune_tent', x: 430, y: 290, w: 85, h: 85, hideX: 472, hideY: 332, ix: 472, iy: 245, stealthWeight: 1.6, checked: false },

      // 4. Thunder Coaster & Pirate Lagoon (5 Spots)
      { id: 'ap_coaster_station', name: 'Roller Coaster Boarding Deck', roomId: 'thrill_lagoon', roomName: 'Thunder Coaster & Pirate Lagoon', type: 'coaster_station', x: 670, y: 65, w: 150, h: 70, hideX: 745, hideY: 100, ix: 745, iy: 160, stealthWeight: 1.6, checked: false },
      { id: 'ap_coaster_car', name: 'Coaster Rocket Front Engine Car', roomId: 'thrill_lagoon', roomName: 'Thunder Coaster & Pirate Lagoon', type: 'coaster_car', x: 850, y: 70, w: 100, h: 60, hideX: 900, hideY: 100, ix: 900, iy: 155, stealthWeight: 1.5, checked: false },
      { id: 'ap_pirate_ship', name: 'Buccaneer Galleon Swing Ship', roomId: 'thrill_lagoon', roomName: 'Thunder Coaster & Pirate Lagoon', type: 'pirate_ship', x: 1030, y: 70, w: 180, h: 120, hideX: 1120, hideY: 130, ix: 1120, iy: 220, stealthWeight: 1.8, checked: false },
      { id: 'ap_pirate_gangplank', name: 'Pirate Boarding Gangplank', roomId: 'thrill_lagoon', roomName: 'Thunder Coaster & Pirate Lagoon', type: 'boarding_ramp', x: 1030, y: 230, w: 90, h: 48, hideX: 1075, hideY: 254, ix: 1075, iy: 300, stealthWeight: 1.4, checked: false },
      { id: 'ap_coaster_lockers', name: 'Thrill Ride Safety Lockers', roomId: 'thrill_lagoon', roomName: 'Thunder Coaster & Pirate Lagoon', type: 'safety_lockers', x: 680, y: 220, w: 80, h: 45, hideX: 720, hideY: 242, ix: 720, iy: 290, stealthWeight: 1.3, checked: false },

      // 5. Bumper Cars & Retro Arcade (5 Spots)
      { id: 'ap_bumper_arena', name: 'Electric Bumper Cars Arena', roomId: 'arcade_arena', roomName: 'Bumper Cars & Retro Arcade', type: 'bumper_arena', x: 920, y: 480, w: 160, h: 110, hideX: 1000, hideY: 535, ix: 1000, iy: 615, stealthWeight: 1.7, checked: false },
      { id: 'ap_bumper_car', name: 'Red Racing Bumper Car (#7)', roomId: 'arcade_arena', roomName: 'Bumper Cars & Retro Arcade', type: 'bumper_car', x: 1180, y: 500, w: 65, h: 48, hideX: 1212, hideY: 524, ix: 1130, iy: 524, stealthWeight: 1.4, checked: false },
      { id: 'ap_claw_machine', name: 'Giant Plush Claw Machine', roomId: 'arcade_arena', roomName: 'Bumper Cars & Retro Arcade', type: 'claw_machine', x: 920, y: 670, w: 80, h: 50, hideX: 960, hideY: 695, ix: 960, iy: 630, stealthWeight: 1.4, checked: false },
      { id: 'ap_racing_cabs', name: 'Twin VR Racing Simulator Cabs', roomId: 'arcade_arena', roomName: 'Bumper Cars & Retro Arcade', type: 'arcade_cabinets', x: 1030, y: 670, w: 90, h: 50, hideX: 1075, hideY: 695, ix: 1075, iy: 630, stealthWeight: 1.5, checked: false },
      { id: 'ap_prize_counter', name: 'Arcade Prize & Token Counter', roomId: 'arcade_arena', roomName: 'Bumper Cars & Retro Arcade', type: 'prize_counter', x: 1150, y: 670, w: 85, h: 48, hideX: 1192, hideY: 694, ix: 1192, iy: 630, stealthWeight: 1.3, checked: false }
    ];

    // Non-Hiding Decoy Obstacles (Solid collision, look realistic, cannot be hidden in!)
    this.decorProps = [
      { type: 'plant', roomId: 'wonder_plaza', x: 500, y: 620, w: 32, h: 32 },
      { type: 'plant', roomId: 'wonder_plaza', x: 800, y: 620, w: 32, h: 32 },
      { type: 'workbench_prop', roomId: 'wonder_plaza', x: 500, y: 710, w: 40, h: 20 },
      { type: 'bench', roomId: 'fantasy_court', x: 250, y: 230, w: 60, h: 24 },
      { type: 'bistro_prop', roomId: 'fantasy_court', x: 330, y: 310, w: 50, h: 50 },
      { type: 'traffic_cone', roomId: 'thrill_lagoon', x: 1150, y: 230, w: 26, h: 26 },
      { type: 'bistro_prop', roomId: 'carnival_midway', x: 195, y: 670, w: 50, h: 40 }
    ];

    this.ambientLights = [
      { x: 660, y: 620, r: 150, color: 'rgba(253, 224, 71, 0.09)' },
      { x: 240, y: 620, r: 140, color: 'rgba(249, 115, 22, 0.10)' },
      { x: 260, y: 240, r: 160, color: 'rgba(56, 189, 248, 0.10)' },
      { x: 960, y: 220, r: 160, color: 'rgba(244, 63, 94, 0.10)' },
      { x: 1080, y: 600, r: 150, color: 'rgba(168, 85, 247, 0.10)' }
    ];

    this.navNodes = {
      plaza_spawn: { x: 660, y: 640, neighbors: ['plaza_north', 'plaza_west', 'plaza_east'] },
      plaza_north: { x: 660, y: 447, neighbors: ['plaza_spawn', 'plaza_west', 'plaza_east', 'thrill_mid'] },
      plaza_west: { x: 447, y: 600, neighbors: ['plaza_spawn', 'plaza_north', 'midway_east'] },
      plaza_east: { x: 867, y: 600, neighbors: ['plaza_spawn', 'plaza_north', 'arcade_west'] },
      midway_east: { x: 380, y: 600, neighbors: ['plaza_west', 'midway_center', 'wonder_door_s'] },
      midway_center: { x: 240, y: 600, neighbors: ['midway_east', 'midway_west'] },
      midway_west: { x: 100, y: 600, neighbors: ['midway_center'] },
      wonder_door_s: { x: 250, y: 447, neighbors: ['midway_east', 'wonder_mid'] },
      wonder_mid: { x: 250, y: 250, neighbors: ['wonder_door_s', 'wonder_carousel', 'wonder_ferris', 'thrill_door_w'] },
      wonder_carousel: { x: 145, y: 245, neighbors: ['wonder_mid'] },
      wonder_ferris: { x: 440, y: 240, neighbors: ['wonder_mid', 'thrill_door_w'] },
      thrill_door_w: { x: 627, y: 220, neighbors: ['wonder_ferris', 'wonder_mid', 'thrill_mid'] },
      thrill_mid: { x: 780, y: 220, neighbors: ['thrill_door_w', 'thrill_east', 'plaza_north'] },
      thrill_east: { x: 1100, y: 220, neighbors: ['thrill_mid', 'arcade_door_n'] },
      arcade_door_n: { x: 1040, y: 447, neighbors: ['thrill_east', 'arcade_mid'] },
      arcade_mid: { x: 1040, y: 600, neighbors: ['arcade_door_n', 'arcade_west', 'arcade_east'] },
      arcade_west: { x: 910, y: 600, neighbors: ['arcade_mid', 'plaza_east'] },
      arcade_east: { x: 1180, y: 600, neighbors: ['arcade_mid'] }
    };

    this.roomHubNode = {
      wonder_plaza: 'plaza_spawn',
      carnival_midway: 'midway_center',
      fantasy_court: 'wonder_mid',
      thrill_lagoon: 'thrill_mid',
      arcade_arena: 'arcade_mid'
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

