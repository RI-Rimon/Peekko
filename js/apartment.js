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
    this.width = 1360;
    this.height = 840;
    this.spawn = { x: 680, y: 650 };
    this.botSpawn = { x: 680, y: 720 };

    this.rooms = [
      { id: 'parking_bay', name: 'EXECUTIVE PARKING BAY', x: 40, y: 40, w: 860, h: 480, floor: 'concrete' },
      { id: 'workshop', name: 'MAINTENANCE WORKSHOP', x: 900, y: 40, w: 420, h: 480, floor: 'concrete_dark' },
      { id: 'storage_bay', name: 'CARGO FREIGHT & STORAGE', x: 40, y: 520, w: 460, h: 280, floor: 'concrete_dark' },
      { id: 'security_foyer', name: 'SECURITY DISPATCH & FOYER', x: 500, y: 520, w: 380, h: 280, floor: 'concrete' },
      { id: 'boiler_vault', name: 'POWER & BOILER VAULT', x: 880, y: 520, w: 440, h: 280, floor: 'concrete_dark' }
    ];

    this.parkingLines = [
      { x: 65, y: 60, w: 95, h: 56 },
      { x: 225, y: 60, w: 95, h: 56 },
      { x: 385, y: 60, w: 98, h: 56 },
      { x: 545, y: 60, w: 95, h: 56 },
      { x: 705, y: 60, w: 100, h: 56 },
      { x: 95, y: 420, w: 100, h: 56 },
      { x: 355, y: 420, w: 98, h: 56 },
      { x: 615, y: 420, w: 120, h: 56 }
    ];

    this.walls = [
      // Outer perimeter walls
      { x: 40, y: 40, w: 1280, h: 14 },
      { x: 40, y: 40, w: 14, h: 760 },
      { x: 1306, y: 40, w: 14, h: 760 },
      { x: 40, y: 786, w: 550, h: 14 },
      { x: 770, y: 786, w: 550, h: 14 }, // South entrance portal x: 590..770 (180px wide)

      // Parking to Workshop vertical divider (wide doorway y: 200..340, 140px wide)
      { x: 893, y: 40, w: 14, h: 160 },
      { x: 893, y: 340, w: 14, h: 180 },

      // Parking to Storage & Foyer horizontal divider
      { x: 40, y: 513, w: 180, h: 14 },
      { x: 360, y: 513, w: 230, h: 14 },
      { x: 770, y: 513, w: 130, h: 14 },

      // Storage to Foyer vertical divider (doorway y: 600..700, 100px wide)
      { x: 493, y: 520, w: 14, h: 80 },
      { x: 493, y: 700, w: 14, h: 90 },

      // Workshop to Boiler Vault horizontal divider (doorway x: 1030..1170, 140px wide)
      { x: 900, y: 513, w: 130, h: 14 },
      { x: 1170, y: 513, w: 140, h: 14 },

      // Foyer to Boiler Vault vertical divider (doorway y: 600..700, 100px wide)
      { x: 873, y: 520, w: 14, h: 80 },
      { x: 873, y: 700, w: 14, h: 90 }
    ];

    this.glassWalls = [];
    this.doors = [];

    this.hidingSpots = [
      // 1. Security Dispatch & Foyer (4 Spots - Spaced to perimeter, leaving center wide open)
      { id: 'b_security_desk', name: 'Behind Security Dispatch Desk', roomId: 'security_foyer', roomName: 'Security Dispatch & Foyer', type: 'security_desk', x: 520, y: 545, w: 80, h: 46, hideX: 560, hideY: 568, ix: 560, iy: 615, stealthWeight: 1.1, checked: false },
      { id: 'b_vending_row', name: 'Behind Lobby Vending Machine', roomId: 'security_foyer', roomName: 'Security Dispatch & Foyer', type: 'vending', x: 780, y: 545, w: 75, h: 46, hideX: 817, hideY: 568, ix: 817, iy: 615, stealthWeight: 0.95, checked: false },
      { id: 'b_keycard_alcove', name: 'Behind Keycard Terminal Alcove', roomId: 'security_foyer', roomName: 'Security Dispatch & Foyer', type: 'keycard_rack', x: 520, y: 725, w: 60, h: 45, hideX: 550, hideY: 747, ix: 600, iy: 747, stealthWeight: 0.9, checked: false },
      { id: 'b_elevator_hub', name: 'Inside North Elevator Alcove', roomId: 'security_foyer', roomName: 'Security Dispatch & Foyer', type: 'elevator', x: 780, y: 725, w: 80, h: 46, hideX: 820, hideY: 748, ix: 740, iy: 748, stealthWeight: 0.9, checked: false },

      // 2. Executive Parking Bay (7 Spots)
      { id: 'b_car_red', name: 'Behind Red Sports Coupe', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'compact_car', x: 70, y: 65, w: 85, h: 46, hideX: 112, hideY: 88, ix: 112, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'b_car_silver', name: 'Behind Silver Sedan', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'compact_car', x: 230, y: 65, w: 85, h: 46, hideX: 272, hideY: 88, ix: 272, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'b_car_black', name: 'Behind Black Executive SUV', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'compact_car', x: 390, y: 65, w: 88, h: 48, hideX: 434, hideY: 89, ix: 434, iy: 142, stealthWeight: 1.05, checked: false },
      { id: 'b_car_blue', name: 'Behind Blue Compact', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'compact_car', x: 550, y: 65, w: 85, h: 46, hideX: 592, hideY: 88, ix: 592, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'b_car_white', name: 'Behind White Limousine', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'compact_car', x: 710, y: 65, w: 90, h: 46, hideX: 755, hideY: 88, ix: 755, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'b_car_yellow', name: 'Behind Yellow Service Van', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'compact_car', x: 100, y: 430, w: 90, h: 48, hideX: 145, hideY: 454, ix: 145, iy: 375, stealthWeight: 1.0, checked: false },
      { id: 'b_car_green', name: 'Behind Green Station Wagon', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'compact_car', x: 360, y: 430, w: 88, h: 46, hideX: 404, hideY: 453, ix: 404, iy: 375, stealthWeight: 1.0, checked: false },

      // 3. Maintenance Workshop (5 Spots)
      { id: 'b_workbench', name: 'Behind Heavy Steel Workbench', roomId: 'workshop', roomName: 'Maintenance Workshop', type: 'workbench_prop', x: 930, y: 65, w: 100, h: 48, hideX: 980, hideY: 89, ix: 980, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'b_tool_chest', name: 'Behind Rolling Tool Cabinet', roomId: 'workshop', roomName: 'Maintenance Workshop', type: 'tool_chest', x: 1190, y: 65, w: 90, h: 45, hideX: 1235, hideY: 87, ix: 1235, iy: 138, stealthWeight: 0.95, checked: false },
      { id: 'b_air_compressor', name: 'Behind Industrial Compressor', roomId: 'workshop', roomName: 'Maintenance Workshop', type: 'air_compressor', x: 1190, y: 220, w: 80, h: 55, hideX: 1230, hideY: 247, ix: 1230, iy: 300, stealthWeight: 1.0, checked: false },
      { id: 'b_forklift', name: 'Behind Heavy Electric Forklift', roomId: 'workshop', roomName: 'Maintenance Workshop', type: 'forklift', x: 930, y: 410, w: 100, h: 60, hideX: 980, hideY: 440, ix: 980, iy: 355, stealthWeight: 1.15, checked: false },
      { id: 'b_oil_drums', name: 'Behind Lubricant Drum Pallet', roomId: 'workshop', roomName: 'Maintenance Workshop', type: 'oil_drums', x: 1190, y: 410, w: 85, h: 55, hideX: 1232, hideY: 437, ix: 1232, iy: 355, stealthWeight: 0.9, checked: false },

      // 4. Cargo Freight & Storage (5 Spots)
      { id: 'b_cargo_crates', name: 'Behind Stacked Wooden Crates', roomId: 'storage_bay', roomName: 'Cargo Freight & Storage', type: 'crates', x: 70, y: 545, w: 95, h: 55, hideX: 117, hideY: 572, ix: 117, iy: 625, stealthWeight: 0.95, checked: false },
      { id: 'b_dumpster', name: 'Behind Industrial Steel Dumpster', roomId: 'storage_bay', roomName: 'Cargo Freight & Storage', type: 'dumpster', x: 350, y: 545, w: 100, h: 50, hideX: 400, hideY: 570, ix: 400, iy: 620, stealthWeight: 0.9, checked: false },
      { id: 'b_storage_lockers', name: 'Inside Warehouse Locker Bank', roomId: 'storage_bay', roomName: 'Cargo Freight & Storage', type: 'lockers', x: 70, y: 720, w: 110, h: 45, hideX: 125, hideY: 742, ix: 125, iy: 665, stealthWeight: 0.85, checked: false },
      { id: 'b_pallet_stack', name: 'Behind Pallet Tower', roomId: 'storage_bay', roomName: 'Cargo Freight & Storage', type: 'pallet_stack', x: 230, y: 720, w: 75, h: 50, hideX: 267, hideY: 745, ix: 267, iy: 665, stealthWeight: 0.9, checked: false },
      { id: 'b_pipe_rack', name: 'Behind Steel Conduit Pipe Rack', roomId: 'storage_bay', roomName: 'Cargo Freight & Storage', type: 'pipe_rack', x: 350, y: 720, w: 85, h: 45, hideX: 390, hideY: 742, ix: 390, iy: 665, stealthWeight: 0.95, checked: false },

      // 5. Power & Boiler Vault (4 Spots)
      { id: 'b_boiler', name: 'Behind Commercial Steam Boiler', roomId: 'boiler_vault', roomName: 'Power & Boiler Vault', type: 'boiler', x: 910, y: 545, w: 105, h: 65, hideX: 962, hideY: 577, ix: 962, iy: 640, stealthWeight: 0.9, checked: false },
      { id: 'b_generator', name: 'Behind Backup Diesel Generator', roomId: 'boiler_vault', roomName: 'Power & Boiler Vault', type: 'generator', x: 1170, y: 545, w: 105, h: 65, hideX: 1222, hideY: 577, ix: 1222, iy: 640, stealthWeight: 0.9, checked: false },
      { id: 'b_transformer', name: 'Behind High-Voltage Transformer', roomId: 'boiler_vault', roomName: 'Power & Boiler Vault', type: 'transformer', x: 910, y: 720, w: 90, h: 50, hideX: 955, hideY: 745, ix: 955, iy: 665, stealthWeight: 0.85, checked: false },
      { id: 'b_breaker_panel', name: 'Behind Main Circuit Breaker Panel', roomId: 'boiler_vault', roomName: 'Power & Boiler Vault', type: 'breaker_panel', x: 1170, y: 720, w: 90, h: 48, hideX: 1215, hideY: 744, ix: 1215, iy: 665, stealthWeight: 0.85, checked: false }
    ];

    // Prominent Non-Hiding Decoy Obstacles (Solid cover, realistic, cannot be hidden in or scanned!)
    this.decorProps = [
      { type: 'decoy_truck', name: 'Armored Cash Transport', roomId: 'parking_bay', x: 620, y: 425, w: 110, h: 50 },
      { type: 'security_booth', name: 'Parking Toll Booth', roomId: 'parking_bay', x: 720, y: 240, w: 60, h: 50 },
      { type: 'pillar', roomId: 'parking_bay', x: 230, y: 240, w: 38, h: 38 },
      { type: 'pillar', roomId: 'parking_bay', x: 470, y: 240, w: 38, h: 38 },
      { type: 'decoy_generator', name: 'Industrial Turbine Unit', roomId: 'workshop', x: 930, y: 230, w: 85, h: 55 },
      { type: 'decoy_crates', name: 'High-Security Steel Crate', roomId: 'storage_bay', x: 210, y: 545, w: 80, h: 50 },
      { type: 'decoy_boiler', name: 'Pressure Cylinder Tank', roomId: 'boiler_vault', x: 1040, y: 550, w: 60, h: 55 },
      { type: 'traffic_cone', roomId: 'parking_bay', x: 820, y: 240, w: 24, h: 24 }
    ];

    this.ambientLights = [
      { x: 440, y: 240, r: 180, color: 'rgba(246, 239, 226, 0.08)' },
      { x: 1100, y: 240, r: 150, color: 'rgba(56, 189, 248, 0.09)' },
      { x: 1100, y: 660, r: 140, color: 'rgba(249, 115, 22, 0.11)' },
      { x: 250, y: 660, r: 140, color: 'rgba(246, 239, 226, 0.08)' },
      { x: 680, y: 660, r: 130, color: 'rgba(253, 224, 71, 0.09)' }
    ];

    this.navNodes = {
      foyer_spawn: { x: 680, y: 650, neighbors: ['foyer_bot', 'foyer_north', 'storage_door', 'boiler_door'] },
      foyer_bot: { x: 680, y: 720, neighbors: ['foyer_spawn'] },
      foyer_north: { x: 680, y: 513, neighbors: ['foyer_spawn', 'parking_south'] },
      storage_door: { x: 493, y: 650, neighbors: ['foyer_spawn', 'storage_center'] },
      storage_center: { x: 230, y: 640, neighbors: ['storage_door', 'storage_north'] },
      storage_north: { x: 280, y: 513, neighbors: ['storage_center', 'parking_south'] },
      boiler_door: { x: 873, y: 650, neighbors: ['foyer_spawn', 'boiler_center'] },
      boiler_center: { x: 1060, y: 670, neighbors: ['boiler_door', 'boiler_north'] },
      boiler_north: { x: 1100, y: 513, neighbors: ['boiler_center', 'workshop_center'] },
      parking_south: { x: 680, y: 340, neighbors: ['foyer_north', 'storage_north', 'parking_center', 'parking_east'] },
      parking_center: { x: 350, y: 240, neighbors: ['parking_south', 'parking_north'] },
      parking_north: { x: 470, y: 150, neighbors: ['parking_center', 'parking_east'] },
      parking_east: { x: 800, y: 240, neighbors: ['parking_south', 'parking_north', 'workshop_door'] },
      workshop_door: { x: 893, y: 270, neighbors: ['parking_east', 'workshop_center'] },
      workshop_center: { x: 1080, y: 280, neighbors: ['workshop_door', 'workshop_north', 'boiler_north'] },
      workshop_north: { x: 1080, y: 140, neighbors: ['workshop_center'] }
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
  // ========================================================
  // MAP 4: GRAND SHOPPING MALL (1360 x 840, 25 Spots)
  // Contiguous mall galleria, prominent promotional & architectural decoys
  // ========================================================
  buildMallMap() {
    this.mapName = 'Grand Shopping Mall';
    this.width = 1360;
    this.height = 840;
    this.spawn = { x: 680, y: 715 };
    this.botSpawn = { x: 680, y: 760 };

    this.rooms = [
      { id: 'fashion_wing', name: 'LUXURY BOUTIQUES & FASHION', x: 40, y: 40, w: 380, h: 380, floor: 'tile_warm' },
      { id: 'food_galleria', name: 'GOURMET FOOD GALLERIA', x: 420, y: 40, w: 520, h: 200, floor: 'tile_warm' },
      { id: 'cinema_arcade', name: 'CINEPLEX & VR ARCADE', x: 940, y: 40, w: 380, h: 380, floor: 'tile_warm' },
      { id: 'main_atrium', name: 'GRAND ATRIUM & FOUNTAIN ROTUNDA', x: 420, y: 240, w: 520, h: 380, floor: 'mall_terrazzo' },
      { id: 'tech_hub', name: 'SMART TECH SUPERSTORE', x: 40, y: 420, w: 380, h: 380, floor: 'tile' },
      { id: 'entry_portal', name: 'MAIN PROMENADE ENTRANCE', x: 420, y: 620, w: 520, h: 180, floor: 'mall_terrazzo' },
      { id: 'sports_outlet', name: 'OUTDOOR & SPORTS MEGASTORE', x: 940, y: 420, w: 380, h: 380, floor: 'tile' }
    ];

    this.walls = [
      // Outer perimeter walls
      { x: 40, y: 40, w: 1280, h: 14 },
      { x: 40, y: 40, w: 14, h: 760 },
      { x: 1306, y: 40, w: 14, h: 760 },
      { x: 40, y: 786, w: 550, h: 14 },
      { x: 770, y: 786, w: 550, h: 14 }, // South entrance portal x: 590..770 (180px wide)

      // Solid partitions between stores
      { x: 40, y: 413, w: 380, h: 14 },
      { x: 940, y: 413, w: 380, h: 14 },

      // Structural entrance pillars flanking wide store portals
      { x: 413, y: 40, w: 14, h: 60 },
      { x: 413, y: 360, w: 14, h: 60 },
      { x: 413, y: 420, w: 14, h: 60 },
      { x: 413, y: 740, w: 14, h: 60 },

      { x: 933, y: 40, w: 14, h: 60 },
      { x: 933, y: 360, w: 14, h: 60 },
      { x: 933, y: 420, w: 14, h: 60 },
      { x: 933, y: 740, w: 14, h: 60 },

      { x: 420, y: 233, w: 40, h: 14 },
      { x: 880, y: 233, w: 60, h: 14 }
    ];

    this.glassWalls = [];
    this.doors = [];

    this.hidingSpots = [
      // 1. Luxury Boutiques & Fashion (4 Spots)
      { id: 'm_mannequins', name: 'Behind Designer Mannequin Display', roomId: 'fashion_wing', roomName: 'Luxury Boutiques & Fashion', type: 'wardrobe', x: 70, y: 65, w: 90, h: 48, hideX: 115, hideY: 89, ix: 115, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'm_dressing_cabin', name: 'Inside Velvet Dressing Cabin', roomId: 'fashion_wing', roomName: 'Luxury Boutiques & Fashion', type: 'changing_stall', x: 290, y: 65, w: 90, h: 55, hideX: 335, hideY: 92, ix: 335, iy: 145, stealthWeight: 0.9, checked: false },
      { id: 'm_checkout_counter', name: 'Behind Boutique Cashier Counter', roomId: 'fashion_wing', roomName: 'Luxury Boutiques & Fashion', type: 'mall_counter', x: 70, y: 330, w: 95, h: 46, hideX: 117, hideY: 353, ix: 117, iy: 280, stealthWeight: 1.05, checked: false },
      { id: 'm_handbag_tower', name: 'Behind Luxury Handbag Showcase', roomId: 'fashion_wing', roomName: 'Luxury Boutiques & Fashion', type: 'mall_gondola', x: 290, y: 330, w: 90, h: 48, hideX: 335, hideY: 354, ix: 335, iy: 280, stealthWeight: 0.95, checked: false },

      // 2. Gourmet Food Galleria (4 Spots)
      { id: 'm_espresso_bar', name: 'Behind Italian Espresso Bar', roomId: 'food_galleria', roomName: 'Gourmet Food Galleria', type: 'food_island', x: 450, y: 65, w: 95, h: 50, hideX: 497, hideY: 90, ix: 497, iy: 140, stealthWeight: 1.05, checked: false },
      { id: 'm_sushi_station', name: 'Behind Conveyor Sushi Island', roomId: 'food_galleria', roomName: 'Gourmet Food Galleria', type: 'food_island', x: 630, y: 65, w: 95, h: 50, hideX: 677, hideY: 90, ix: 677, iy: 140, stealthWeight: 1.1, checked: false },
      { id: 'm_bakery_case', name: 'Behind Pastry Glass Display', roomId: 'food_galleria', roomName: 'Gourmet Food Galleria', type: 'mall_gondola', x: 810, y: 65, w: 95, h: 50, hideX: 857, hideY: 90, ix: 857, iy: 140, stealthWeight: 0.95, checked: false },
      { id: 'm_juice_booth', name: 'Behind Smoothie & Gelato Kiosk', roomId: 'food_galleria', roomName: 'Gourmet Food Galleria', type: 'food_kiosk', x: 630, y: 155, w: 95, h: 45, hideX: 677, hideY: 177, ix: 677, iy: 120, stealthWeight: 1.0, checked: false },

      // 3. Cineplex & VR Arcade (4 Spots)
      { id: 'm_cinema_kiosk', name: 'Behind Touchscreen Ticket Terminal', roomId: 'cinema_arcade', roomName: 'Cineplex & VR Arcade', type: 'arcade_unit', x: 970, y: 65, w: 90, h: 45, hideX: 1015, hideY: 87, ix: 1015, iy: 135, stealthWeight: 0.9, checked: false },
      { id: 'm_popcorn_stand', name: 'Behind Gourmet Popcorn Station', roomId: 'cinema_arcade', roomName: 'Cineplex & VR Arcade', type: 'concession_stand', x: 1190, y: 65, w: 95, h: 50, hideX: 1237, hideY: 90, ix: 1237, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'm_vr_capsule', name: 'Inside VR Immersion Simulator Pod', roomId: 'cinema_arcade', roomName: 'Cineplex & VR Arcade', type: 'vr_pod', x: 970, y: 330, w: 90, h: 50, hideX: 1015, hideY: 355, ix: 1015, iy: 280, stealthWeight: 0.95, checked: false },
      { id: 'm_cinema_sofa', name: 'Behind VIP Velvet Cinema Lounge', roomId: 'cinema_arcade', roomName: 'Cineplex & VR Arcade', type: 'cinema_bench', x: 1190, y: 330, w: 95, h: 48, hideX: 1237, hideY: 354, ix: 1237, iy: 280, stealthWeight: 0.9, checked: false },

      // 4. Grand Atrium & Fountain Rotunda (5 Spots)
      { id: 'm_fountain_rotunda', name: 'Behind Grand Marble Atrium Fountain', roomId: 'main_atrium', roomName: 'Grand Atrium & Rotunda', type: 'mall_fountain', x: 630, y: 270, w: 100, h: 60, hideX: 680, hideY: 300, ix: 680, iy: 360, stealthWeight: 1.2, checked: false },
      { id: 'm_palm_island', name: 'Behind Tropical Palm Planter', roomId: 'main_atrium', roomName: 'Grand Atrium & Rotunda', type: 'mall_planter', x: 460, y: 410, w: 75, h: 48, hideX: 497, hideY: 434, ix: 555, iy: 434, stealthWeight: 0.95, checked: false },
      { id: 'm_directory_kiosk', name: 'Behind 3D Wayfinding Interactive Screen', roomId: 'main_atrium', roomName: 'Grand Atrium & Rotunda', type: 'directory_screen', x: 820, y: 410, w: 75, h: 48, hideX: 857, hideY: 434, ix: 800, iy: 434, stealthWeight: 0.9, checked: false },
      { id: 'm_holiday_cart', name: 'Behind Seasonal Specialty Pavilion', roomId: 'main_atrium', roomName: 'Grand Atrium & Rotunda', type: 'mall_cart', x: 460, y: 540, w: 85, h: 48, hideX: 502, hideY: 564, ix: 565, iy: 564, stealthWeight: 1.0, checked: false },
      { id: 'm_glass_elevator', name: 'Behind Panoramic Glass Elevator Bank', roomId: 'main_atrium', roomName: 'Grand Atrium & Rotunda', type: 'glass_elevator', x: 810, y: 540, w: 95, h: 50, hideX: 857, hideY: 565, ix: 790, iy: 565, stealthWeight: 1.0, checked: false },

      // 5. Smart Tech Superstore (4 Spots)
      { id: 'm_phone_island', name: 'Behind Flagship Smartphone Island', roomId: 'tech_hub', roomName: 'Smart Tech Superstore', type: 'tech_island', x: 70, y: 450, w: 95, h: 48, hideX: 117, hideY: 474, ix: 117, iy: 525, stealthWeight: 1.0, checked: false },
      { id: 'm_audio_lounge', name: 'Behind Hi-Fi Sound Experience Booth', roomId: 'tech_hub', roomName: 'Smart Tech Superstore', type: 'audio_booth', x: 290, y: 450, w: 90, h: 50, hideX: 335, hideY: 475, ix: 335, iy: 525, stealthWeight: 0.95, checked: false },
      { id: 'm_gaming_laptops', name: 'Behind RGB Esports Battlestation', roomId: 'tech_hub', roomName: 'Smart Tech Superstore', type: 'gaming_pod', x: 70, y: 715, w: 95, h: 48, hideX: 117, hideY: 739, ix: 117, iy: 665, stealthWeight: 1.05, checked: false },
      { id: 'm_smarthome_hub', name: 'Behind Smart Living Showcase Display', roomId: 'tech_hub', roomName: 'Smart Tech Superstore', type: 'smarthome_display', x: 290, y: 715, w: 90, h: 48, hideX: 335, hideY: 739, ix: 335, iy: 665, stealthWeight: 0.9, checked: false },

      // 6. Outdoor & Sports Megastore (4 Spots)
      { id: 'm_camping_tent', name: 'Inside All-Weather Expedition Tent', roomId: 'sports_outlet', roomName: 'Outdoor & Sports Megastore', type: 'camping_tent', x: 970, y: 450, w: 95, h: 55, hideX: 1017, hideY: 477, ix: 1017, iy: 530, stealthWeight: 1.1, checked: false },
      { id: 'm_kayak_rack', name: 'Behind Vertical Kayak & Surf Display', roomId: 'sports_outlet', roomName: 'Outdoor & Sports Megastore', type: 'kayak_rack', x: 1190, y: 450, w: 90, h: 50, hideX: 1235, hideY: 475, ix: 1235, iy: 525, stealthWeight: 1.0, checked: false },
      { id: 'm_fitness_treadmill', name: 'Behind Pro Cardio Treadmill Station', roomId: 'sports_outlet', roomName: 'Outdoor & Sports Megastore', type: 'gym_rack', x: 970, y: 715, w: 95, h: 48, hideX: 1017, hideY: 739, ix: 1017, iy: 665, stealthWeight: 0.9, checked: false },
      { id: 'm_ski_gear_rack', name: 'Behind Winter Sports Alpine Gear Rack', roomId: 'sports_outlet', roomName: 'Outdoor & Sports Megastore', type: 'ski_rack', x: 1190, y: 715, w: 90, h: 48, hideX: 1235, hideY: 739, ix: 1235, iy: 665, stealthWeight: 0.95, checked: false }
    ];

    // Prominent Non-Hiding Decoy Obstacles (Looks like cover/hiding spot, but cannot be hidden in or scanned!)
    this.decorProps = [
      { type: 'decoy_car_podium', name: 'Luxury Display Coupe on Podium', roomId: 'main_atrium', x: 630, y: 450, w: 100, h: 50 },
      { type: 'decoy_escalator', name: 'Stainless Steel Escalator Bank', roomId: 'main_atrium', x: 550, y: 350, w: 45, h: 80 },
      { type: 'decoy_escalator', name: 'Stainless Steel Escalator Bank', roomId: 'main_atrium', x: 765, y: 350, w: 45, h: 80 },
      { type: 'pillar', roomId: 'main_atrium', x: 550, y: 540, w: 34, h: 34 },
      { type: 'pillar', roomId: 'main_atrium', x: 775, y: 540, w: 34, h: 34 },
      { type: 'bench', roomId: 'entry_portal', x: 640, y: 610, w: 80, h: 28 },
      { type: 'decoy_kiosk', name: 'Guest Information Dome', roomId: 'food_galleria', x: 640, y: 150, w: 80, h: 42 }
    ];

    this.ambientLights = [
      { x: 680, y: 400, r: 240, color: 'rgba(255, 255, 255, 0.12)' },
      { x: 230, y: 230, r: 160, color: 'rgba(253, 224, 71, 0.08)' },
      { x: 1130, y: 230, r: 160, color: 'rgba(168, 85, 247, 0.09)' },
      { x: 230, y: 610, r: 160, color: 'rgba(56, 189, 248, 0.08)' },
      { x: 1130, y: 610, r: 160, color: 'rgba(239, 68, 68, 0.08)' },
      { x: 680, y: 720, r: 140, color: 'rgba(255, 255, 255, 0.09)' }
    ];

    this.navNodes = {
      mall_spawn: { x: 680, y: 715, neighbors: ['mall_bot', 'atrium_south'] },
      mall_bot: { x: 680, y: 760, neighbors: ['mall_spawn'] },
      atrium_south: { x: 680, y: 580, neighbors: ['mall_spawn', 'atrium_center', 'tech_door', 'sports_door'] },
      atrium_center: { x: 680, y: 360, neighbors: ['atrium_south', 'atrium_north', 'fashion_door', 'cinema_door'] },
      atrium_north: { x: 680, y: 220, neighbors: ['atrium_center', 'food_mid'] },
      food_mid: { x: 680, y: 110, neighbors: ['atrium_north'] },
      fashion_door: { x: 413, y: 220, neighbors: ['atrium_center', 'fashion_mid'] },
      fashion_mid: { x: 200, y: 220, neighbors: ['fashion_door'] },
      tech_door: { x: 413, y: 600, neighbors: ['atrium_south', 'tech_mid'] },
      tech_mid: { x: 200, y: 600, neighbors: ['tech_door'] },
      cinema_door: { x: 933, y: 220, neighbors: ['atrium_center', 'cinema_mid'] },
      cinema_mid: { x: 1100, y: 220, neighbors: ['cinema_door'] },
      sports_door: { x: 933, y: 600, neighbors: ['atrium_south', 'sports_mid'] },
      sports_mid: { x: 1100, y: 600, neighbors: ['sports_door'] }
    };

    this.roomHubNode = {
      fashion_wing: 'fashion_mid',
      food_galleria: 'food_mid',
      cinema_arcade: 'cinema_mid',
      main_atrium: 'atrium_center',
      tech_hub: 'tech_mid',
      entry_portal: 'mall_spawn',
      sports_outlet: 'sports_mid'
    };
  }

  // ========================================================
  // MAP 5: WONDERLAND PARK (1360 x 840, 25 Spots)
  // Contiguous themed attractions, prominent carnival decoys
  // ========================================================
  buildAmusementMap() {
    this.mapName = 'Wonderland Park';
    this.width = 1360;
    this.height = 840;
    this.spawn = { x: 680, y: 710 };
    this.botSpawn = { x: 680, y: 760 };

    this.rooms = [
      { id: 'fantasy_court', name: 'FANTASY CAROUSEL & FERRIS MEADOW', x: 40, y: 40, w: 420, h: 460, floor: 'amusement_tile' },
      { id: 'thrill_lagoon', name: 'THUNDER COASTER & PIRATE LAGOON', x: 940, y: 40, w: 380, h: 460, floor: 'amusement_tile' },
      { id: 'wonder_gardens', name: 'GRAND CLOCKTOWER GARDENS', x: 460, y: 40, w: 480, h: 460, floor: 'amusement_tile' },
      { id: 'carnival_midway', name: 'CARNIVAL MIDWAY & SKILL GAMES', x: 40, y: 500, w: 420, h: 300, floor: 'carnival_deck' },
      { id: 'wonder_plaza', name: 'GRAND CLOCKTOWER PLAZA', x: 460, y: 500, w: 480, h: 300, floor: 'amusement_tile' },
      { id: 'arcade_arena', name: 'BUMPER CARS & RETRO ARCADE', x: 940, y: 500, w: 380, h: 300, floor: 'bumper_floor' }
    ];

    this.walls = [
      // Outer park boundary walls
      { x: 40, y: 40, w: 1280, h: 14 },
      { x: 40, y: 40, w: 14, h: 760 },
      { x: 1306, y: 40, w: 14, h: 760 },
      { x: 40, y: 786, w: 550, h: 14 },
      { x: 770, y: 786, w: 550, h: 14 }, // South entrance portal x: 590..770 (180px wide)

      // Midway to Fantasy Court horizontal divider (wide open passage x: 170..330)
      { x: 40, y: 493, w: 130, h: 14 },
      { x: 330, y: 493, w: 130, h: 14 },

      // Thrill to Arcade horizontal divider (wide open passage x: 1040..1200)
      { x: 940, y: 493, w: 100, h: 14 },
      { x: 1200, y: 493, w: 120, h: 14 },

      // Fantasy Court to Plaza vertical portals
      { x: 453, y: 40, w: 14, h: 100 },
      { x: 453, y: 400, w: 14, h: 100 },
      { x: 453, y: 500, w: 14, h: 60 },
      { x: 453, y: 740, w: 14, h: 60 },

      // Thrill Lagoon to Plaza vertical portals
      { x: 933, y: 40, w: 14, h: 100 },
      { x: 933, y: 400, w: 14, h: 100 },
      { x: 933, y: 500, w: 14, h: 60 },
      { x: 933, y: 740, w: 14, h: 60 }
    ];

    this.glassWalls = [];
    this.doors = [];

    this.hidingSpots = [
      // 1. Fantasy Carousel & Ferris Meadow (5 Spots)
      { id: 'p_carousel_organ', name: 'Behind Grand Carousel Band Organ', roomId: 'fantasy_court', roomName: 'Fantasy Carousel & Ferris Meadow', type: 'carousel_center', x: 80, y: 70, w: 95, h: 50, hideX: 127, hideY: 95, ix: 127, iy: 145, stealthWeight: 1.1, checked: false },
      { id: 'p_swan_boat', name: 'Behind Enchanted Swan Paddle Boat', roomId: 'fantasy_court', roomName: 'Fantasy Carousel & Ferris Meadow', type: 'swan_boat', x: 270, y: 70, w: 90, h: 50, hideX: 315, hideY: 95, ix: 315, iy: 145, stealthWeight: 1.0, checked: false },
      { id: 'p_teacup_cart', name: 'Inside Spinning Porcelain Teacup', roomId: 'fantasy_court', roomName: 'Fantasy Carousel & Ferris Meadow', type: 'tea_cup', x: 80, y: 220, w: 85, h: 50, hideX: 122, hideY: 245, ix: 122, iy: 295, stealthWeight: 0.95, checked: false },
      { id: 'p_teddy_booth', name: 'Behind Giant Plush Prize Booth', roomId: 'fantasy_court', roomName: 'Fantasy Carousel & Ferris Meadow', type: 'prize_wall', x: 270, y: 220, w: 90, h: 50, hideX: 315, hideY: 245, ix: 315, iy: 295, stealthWeight: 0.9, checked: false },
      { id: 'p_cotton_wagon', name: 'Behind Pink Cotton Candy Wagon', roomId: 'fantasy_court', roomName: 'Fantasy Carousel & Ferris Meadow', type: 'food_cart', x: 180, y: 390, w: 85, h: 48, hideX: 222, hideY: 414, ix: 222, iy: 345, stealthWeight: 1.0, checked: false },

      // 2. Thunder Coaster & Pirate Lagoon (5 Spots)
      { id: 'p_coaster_cart', name: 'Behind Thunder Coaster Train', roomId: 'thrill_lagoon', roomName: 'Thunder Coaster & Pirate Lagoon', type: 'coaster_train', x: 980, y: 70, w: 95, h: 48, hideX: 1027, hideY: 94, ix: 1027, iy: 145, stealthWeight: 1.05, checked: false },
      { id: 'p_pirate_stern', name: 'Behind Galleon Captain Cabin Stern', roomId: 'thrill_lagoon', roomName: 'Thunder Coaster & Pirate Lagoon', type: 'ship_stern', x: 1180, y: 70, w: 95, h: 55, hideX: 1227, hideY: 97, ix: 1227, iy: 150, stealthWeight: 1.15, checked: false },
      { id: 'p_treasure_chest', name: 'Behind Gilded Sunken Treasure Chest', roomId: 'thrill_lagoon', roomName: 'Thunder Coaster & Pirate Lagoon', type: 'treasure_chest', x: 980, y: 220, w: 85, h: 48, hideX: 1022, hideY: 244, ix: 1022, iy: 295, stealthWeight: 0.9, checked: false },
      { id: 'p_cannon_bunker', name: 'Behind Fortified Iron Cannon Battery', roomId: 'thrill_lagoon', roomName: 'Thunder Coaster & Pirate Lagoon', type: 'cannon_prop', x: 1180, y: 220, w: 90, h: 50, hideX: 1225, hideY: 245, ix: 1225, iy: 295, stealthWeight: 0.95, checked: false },
      { id: 'p_skull_grotto', name: 'Inside Skull Rock Sea Cave Alcove', roomId: 'thrill_lagoon', roomName: 'Thunder Coaster & Pirate Lagoon', type: 'rock_grotto', x: 1080, y: 390, w: 90, h: 50, hideX: 1125, hideY: 415, ix: 1125, iy: 345, stealthWeight: 1.0, checked: false },

      // 3. Carnival Midway & Skill Games (5 Spots)
      { id: 'p_ring_toss', name: 'Behind Carnival Ring Toss Stall', roomId: 'carnival_midway', roomName: 'Carnival Midway & Games', type: 'game_booth', x: 80, y: 535, w: 95, h: 48, hideX: 127, hideY: 559, ix: 127, iy: 610, stealthWeight: 1.0, checked: false },
      { id: 'p_dart_stall', name: 'Behind Neon Balloon Dart Stall', roomId: 'carnival_midway', roomName: 'Carnival Midway & Games', type: 'game_booth', x: 270, y: 535, w: 90, h: 48, hideX: 315, hideY: 559, ix: 315, iy: 610, stealthWeight: 0.95, checked: false },
      { id: 'p_mirror_maze', name: 'Inside Funhouse Hall of Mirrors', roomId: 'carnival_midway', roomName: 'Carnival Midway & Games', type: 'mirror_maze', x: 80, y: 710, w: 95, h: 50, hideX: 127, hideY: 735, ix: 127, iy: 660, stealthWeight: 1.1, checked: false },
      { id: 'p_shooting_booth', name: 'Behind Laser Shooting Gallery Counter', roomId: 'carnival_midway', roomName: 'Carnival Midway & Games', type: 'shooting_gallery', x: 270, y: 710, w: 90, h: 48, hideX: 315, hideY: 734, ix: 315, iy: 660, stealthWeight: 0.9, checked: false },
      { id: 'p_fortune_wagon', name: 'Behind Mystical Fortune Teller Caravan', roomId: 'carnival_midway', roomName: 'Carnival Midway & Games', type: 'fortune_wagon', x: 180, y: 625, w: 85, h: 50, hideX: 222, hideY: 650, ix: 222, iy: 580, stealthWeight: 1.0, checked: false },

      // 4. Bumper Cars & Retro Arcade (5 Spots)
      { id: 'p_bumper_red', name: 'Inside Turbo Red Bumper Car', roomId: 'arcade_arena', roomName: 'Bumper Cars & Retro Arcade', type: 'bumper_car_red', x: 980, y: 535, w: 85, h: 48, hideX: 1022, hideY: 559, ix: 1022, iy: 610, stealthWeight: 1.0, checked: false },
      { id: 'p_bumper_blue', name: 'Inside Cobalt Electric Bumper Car', roomId: 'arcade_arena', roomName: 'Bumper Cars & Retro Arcade', type: 'bumper_car_blue', x: 1180, y: 535, w: 85, h: 48, hideX: 1222, hideY: 559, ix: 1222, iy: 610, stealthWeight: 1.0, checked: false },
      { id: 'p_arcade_row', name: 'Behind Vintage 80s Arcade Cabinets', roomId: 'arcade_arena', roomName: 'Bumper Cars & Retro Arcade', type: 'arcade_cabinet', x: 980, y: 710, w: 95, h: 48, hideX: 1027, hideY: 734, ix: 1027, iy: 660, stealthWeight: 0.95, checked: false },
      { id: 'p_prize_counter', name: 'Behind Arcade Ticket Redemption Counter', roomId: 'arcade_arena', roomName: 'Bumper Cars & Retro Arcade', type: 'redemption_counter', x: 1180, y: 710, w: 90, h: 48, hideX: 1225, hideY: 734, ix: 1225, iy: 660, stealthWeight: 0.9, checked: false },
      { id: 'p_air_hockey', name: 'Behind Neon Air Hockey Table', roomId: 'arcade_arena', roomName: 'Bumper Cars & Retro Arcade', type: 'air_hockey', x: 1080, y: 625, w: 85, h: 48, hideX: 1122, hideY: 649, ix: 1122, iy: 580, stealthWeight: 0.95, checked: false },

      // 5. Grand Clocktower Plaza & Gardens (5 Spots)
      { id: 'p_clock_pavilion', name: 'Behind Grand Victorian Clocktower', roomId: 'wonder_gardens', roomName: 'Clocktower Plaza & Gardens', type: 'clocktower_base', x: 650, y: 70, w: 100, h: 55, hideX: 700, hideY: 97, ix: 700, iy: 150, stealthWeight: 1.2, checked: false },
      { id: 'p_fountain_monument', name: 'Behind Central Tiered Dolphin Fountain', roomId: 'wonder_gardens', roomName: 'Clocktower Plaza & Gardens', type: 'park_fountain', x: 650, y: 300, w: 100, h: 55, hideX: 700, hideY: 327, ix: 700, iy: 380, stealthWeight: 1.1, checked: false },
      { id: 'p_popcorn_vendor', name: 'Behind Golden Kettle Corn Cart', roomId: 'wonder_plaza', roomName: 'Clocktower Plaza & Gardens', type: 'popcorn_cart', x: 500, y: 440, w: 80, h: 45, hideX: 540, hideY: 462, ix: 540, iy: 510, stealthWeight: 0.95, checked: false },
      { id: 'p_photo_kiosk', name: 'Inside Retro Polaroid Photo Booth', roomId: 'wonder_plaza', roomName: 'Clocktower Plaza & Gardens', type: 'photo_booth', x: 820, y: 440, w: 80, h: 48, hideX: 860, hideY: 464, ix: 860, iy: 510, stealthWeight: 0.9, checked: false },
      { id: 'p_info_pagoda', name: 'Behind Park Map & Guest Services Pagoda', roomId: 'wonder_plaza', roomName: 'Clocktower Plaza & Gardens', type: 'info_kiosk', x: 500, y: 560, w: 85, h: 50, hideX: 542, hideY: 585, ix: 600, iy: 585, stealthWeight: 1.0, checked: false }
    ];

    // Prominent Non-Hiding Decoy Obstacles (Solid cover, realistic, cannot be hidden in or scanned!)
    this.decorProps = [
      { type: 'decoy_ship', name: 'Grand Pirate Ship Bow Structure', roomId: 'thrill_lagoon', x: 1070, y: 150, w: 100, h: 52 },
      { type: 'decoy_ticket_booth', name: 'Amusement Castle Ticket Booth', roomId: 'wonder_plaza', x: 810, y: 560, w: 75, h: 50 },
      { type: 'decoy_statue', name: 'Giant Bronze Mascot Statue', roomId: 'wonder_gardens', x: 670, y: 190, w: 60, h: 60 },
      { type: 'decoy_charging_bay', name: 'Bumper Car Substation Generator', roomId: 'arcade_arena', x: 1180, y: 625, w: 85, h: 50 },
      { type: 'decoy_popcorn', name: 'Vintage Popcorn Wagon Trailer', roomId: 'carnival_midway', x: 180, y: 535, w: 75, h: 45 },
      { type: 'bench', roomId: 'wonder_plaza', x: 660, y: 610, w: 80, h: 28 },
      { type: 'pillar', roomId: 'wonder_plaza', x: 520, y: 730, w: 32, h: 32 }
    ];

    this.ambientLights = [
      { x: 700, y: 100, r: 180, color: 'rgba(253, 224, 71, 0.12)' },
      { x: 700, y: 330, r: 150, color: 'rgba(56, 189, 248, 0.10)' },
      { x: 250, y: 250, r: 160, color: 'rgba(244, 63, 94, 0.08)' },
      { x: 1120, y: 250, r: 160, color: 'rgba(56, 189, 248, 0.09)' },
      { x: 250, y: 650, r: 160, color: 'rgba(251, 191, 36, 0.09)' },
      { x: 1120, y: 650, r: 160, color: 'rgba(168, 85, 247, 0.09)' }
    ];

    this.navNodes = {
      plaza_spawn: { x: 680, y: 710, neighbors: ['plaza_bot', 'plaza_mid', 'midway_door', 'arcade_door'] },
      plaza_bot: { x: 680, y: 760, neighbors: ['plaza_spawn'] },
      plaza_mid: { x: 680, y: 500, neighbors: ['plaza_spawn', 'plaza_north', 'midway_mid', 'arcade_mid'] },
      plaza_north: { x: 680, y: 240, neighbors: ['plaza_mid', 'fantasy_mid', 'thrill_mid'] },
      fantasy_mid: { x: 360, y: 240, neighbors: ['plaza_north', 'fantasy_south'] },
      fantasy_south: { x: 360, y: 493, neighbors: ['fantasy_mid', 'midway_north'] },
      midway_north: { x: 360, y: 530, neighbors: ['fantasy_south', 'midway_mid'] },
      midway_mid: { x: 360, y: 640, neighbors: ['midway_north', 'midway_door'] },
      midway_door: { x: 453, y: 650, neighbors: ['midway_mid', 'plaza_spawn', 'plaza_mid'] },
      thrill_mid: { x: 1080, y: 240, neighbors: ['plaza_north', 'thrill_south'] },
      thrill_south: { x: 1080, y: 493, neighbors: ['thrill_mid', 'arcade_north'] },
      arcade_north: { x: 1010, y: 530, neighbors: ['thrill_south', 'arcade_mid'] },
      arcade_mid: { x: 1010, y: 625, neighbors: ['arcade_north', 'arcade_door'] },
      arcade_door: { x: 933, y: 650, neighbors: ['arcade_mid', 'plaza_spawn', 'plaza_mid'] }
    };

    this.roomHubNode = {
      wonder_plaza: 'plaza_spawn',
      wonder_gardens: 'plaza_north',
      carnival_midway: 'midway_mid',
      fantasy_court: 'fantasy_mid',
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

