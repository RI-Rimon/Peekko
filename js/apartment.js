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
      { id: 'b_car_red', name: 'Behind Red Sports Coupe', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'car_red', x: 70, y: 65, w: 85, h: 46, hideX: 112, hideY: 88, ix: 112, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'b_car_silver', name: 'Behind Silver Sedan', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'car_silver', x: 230, y: 65, w: 85, h: 46, hideX: 272, hideY: 88, ix: 272, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'b_car_black', name: 'Behind Black Executive SUV', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'car_black', x: 390, y: 65, w: 88, h: 48, hideX: 434, hideY: 89, ix: 434, iy: 142, stealthWeight: 1.05, checked: false },
      { id: 'b_car_blue', name: 'Behind Blue Compact', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'car_blue', x: 550, y: 65, w: 85, h: 46, hideX: 592, hideY: 88, ix: 592, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'b_car_white', name: 'Behind White Limousine', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'car_van', x: 710, y: 65, w: 90, h: 46, hideX: 755, hideY: 88, ix: 755, iy: 140, stealthWeight: 1.0, checked: false },
      { id: 'b_car_yellow', name: 'Behind Yellow Service Van', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'car_yellow', x: 100, y: 430, w: 90, h: 48, hideX: 145, hideY: 454, ix: 145, iy: 375, stealthWeight: 1.0, checked: false },
      { id: 'b_car_green', name: 'Behind Green Station Wagon', roomId: 'parking_bay', roomName: 'Executive Parking Bay', type: 'car_green', x: 360, y: 430, w: 88, h: 46, hideX: 404, hideY: 453, ix: 404, iy: 375, stealthWeight: 1.0, checked: false },

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
      { type: 'decoy_truck', name: 'Armored Cash Transport', roomId: 'parking_bay', x: 70, y: 230, w: 110, h: 50 },
      { type: 'security_booth', name: 'Parking Toll Booth', roomId: 'parking_bay', x: 810, y: 350, w: 60, h: 50 },
      { type: 'pillar', roomId: 'parking_bay', x: 230, y: 240, w: 38, h: 38 },
      { type: 'pillar', roomId: 'parking_bay', x: 470, y: 170, w: 38, h: 38 },
      { type: 'decoy_generator', name: 'Industrial Turbine Unit', roomId: 'workshop', x: 1060, y: 65, w: 80, h: 50 },
      { type: 'decoy_crates', name: 'High-Security Steel Crate', roomId: 'storage_bay', x: 210, y: 545, w: 80, h: 50 },
      { type: 'decoy_boiler', name: 'Pressure Cylinder Tank', roomId: 'boiler_vault', x: 1070, y: 735, w: 60, h: 55 },
      { type: 'traffic_cone', roomId: 'parking_bay', x: 870, y: 70, w: 24, h: 24 }
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
      boiler_center: { x: 1070, y: 640, neighbors: ['boiler_door', 'boiler_north'] },
      boiler_north: { x: 1100, y: 513, neighbors: ['boiler_center', 'workshop_south'] },
      parking_south: { x: 680, y: 340, neighbors: ['foyer_north', 'storage_north', 'parking_center', 'parking_east'] },
      parking_center: { x: 350, y: 240, neighbors: ['parking_south', 'parking_north'] },
      parking_north: { x: 470, y: 150, neighbors: ['parking_center', 'parking_east'] },
      parking_east: { x: 800, y: 240, neighbors: ['parking_south', 'parking_north', 'workshop_door'] },
      workshop_door: { x: 893, y: 270, neighbors: ['parking_east', 'workshop_center'] },
      workshop_center: { x: 1080, y: 260, neighbors: ['workshop_door', 'workshop_north', 'workshop_south'] },
      workshop_north: { x: 1080, y: 160, neighbors: ['workshop_center'] },
      workshop_south: { x: 1080, y: 370, neighbors: ['workshop_center', 'boiler_north'] }
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
  // MAP 4: GRAND ART MUSEUM (1360 x 840, 25 Spots / 32 Total Obstacles)
  // Sculpture Hall, Vaults & Velvet Galleries
  // ========================================================
  buildMallMap() {
    return this.buildMuseumMap();
  }

  buildMuseumMap() {
    this.mapName = 'Grand Art Museum';
    this.width = 1360;
    this.height = 840;
    this.spawn = { x: 680, y: 715 };
    this.botSpawn = { x: 680, y: 760 };

    this.rooms = [
      { id: 'west_gallery', name: 'WEST VELVET WING (Renaissance Masters)', x: 40, y: 40, w: 380, h: 420, floor: 'museum_carpet_red' },
      { id: 'sculpture_rotunda', name: 'CENTRAL SCULPTURE ROTUNDA', x: 420, y: 40, w: 520, h: 420, floor: 'museum_marble' },
      { id: 'east_gallery', name: 'EAST EMERALD WING (Antiquities & Artifacts)', x: 940, y: 40, w: 380, h: 420, floor: 'museum_carpet_green' },
      { id: 'curator_vault', name: "CURATORS' ARCHIVE & RESTORATION VAULT", x: 40, y: 460, w: 380, h: 340, floor: 'wood_dark' },
      { id: 'museum_atrium', name: 'GRAND MARBLE ATRIUM & RECEPTION', x: 420, y: 460, w: 520, h: 340, floor: 'museum_marble' },
      { id: 'security_suite', name: 'SECURITY & SURVEILLANCE SUITE', x: 940, y: 460, w: 380, h: 340, floor: 'concrete_dark' }
    ];

    this.walls = [
      // Outer perimeter
      { x: 40, y: 40, w: 1280, h: 14 },
      { x: 40, y: 40, w: 14, h: 760 },
      { x: 1306, y: 40, w: 14, h: 760 },
      { x: 40, y: 786, w: 550, h: 14 },
      { x: 770, y: 786, w: 550, h: 14 }, // South entrance portal x: 590..770

      // West Gallery <-> Curator Vault (doorway x: 170..290)
      { x: 40, y: 453, w: 130, h: 14 },
      { x: 290, y: 453, w: 130, h: 14 },

      // East Gallery <-> Security Suite (doorway x: 1070..1190)
      { x: 940, y: 453, w: 130, h: 14 },
      { x: 1190, y: 453, w: 130, h: 14 },

      // Rotunda <-> Atrium Colonnade (wide opening x: 500..860)
      { x: 420, y: 453, w: 80, h: 14 },
      { x: 860, y: 453, w: 80, h: 14 },

      // West Gallery <-> Rotunda vertical divider (arch y: 170..310)
      { x: 413, y: 40, w: 14, h: 130 },
      { x: 413, y: 310, w: 14, h: 150 },

      // Curator Vault <-> Atrium vertical divider (doorway y: 580..680)
      { x: 413, y: 460, w: 14, h: 120 },
      { x: 413, y: 680, w: 14, h: 120 },

      // East Gallery <-> Rotunda vertical divider (arch y: 170..310)
      { x: 933, y: 40, w: 14, h: 130 },
      { x: 933, y: 310, w: 14, h: 150 },

      // Security Suite <-> Atrium vertical divider (doorway y: 580..680)
      { x: 933, y: 460, w: 14, h: 120 },
      { x: 933, y: 680, w: 14, h: 120 }
    ];

    this.glassWalls = [];
    this.doors = [];

    // EXACTLY 25 HIDING SPOTS
    this.hidingSpots = [
      // 1. Central Classical Sculpture Rotunda (5 Spots)
      { id: 'gm_sculpture_david', name: 'Behind Classical Marble David Statue', roomId: 'sculpture_rotunda', roomName: 'Classical Sculpture Rotunda', type: 'sculpture_statue', x: 490, y: 70, w: 55, h: 55, hideX: 517, hideY: 97, ix: 517, iy: 150, stealthWeight: 1.1, checked: false },
      { id: 'gm_sculpture_venus', name: 'Behind Alabaster Venus de Milo', roomId: 'sculpture_rotunda', roomName: 'Classical Sculpture Rotunda', type: 'sculpture_statue', x: 815, y: 70, w: 55, h: 55, hideX: 842, hideY: 97, ix: 842, iy: 150, stealthWeight: 1.1, checked: false },
      { id: 'gm_winged_victory', name: 'Behind Winged Victory of Samothrace', roomId: 'sculpture_rotunda', roomName: 'Classical Sculpture Rotunda', type: 'sculpture_winged', x: 645, y: 65, w: 70, h: 55, hideX: 680, hideY: 92, ix: 680, iy: 150, stealthWeight: 1.15, checked: false },
      { id: 'gm_roman_centurion', name: 'Behind Bronze Imperial Centurion', roomId: 'sculpture_rotunda', roomName: 'Classical Sculpture Rotunda', type: 'sculpture_roman', x: 490, y: 345, w: 55, h: 55, hideX: 517, hideY: 372, ix: 517, iy: 280, stealthWeight: 1.0, checked: false },
      { id: 'gm_glass_vitrine_gem', name: 'Behind Prismatic Crystal Vitrine', roomId: 'sculpture_rotunda', roomName: 'Classical Sculpture Rotunda', type: 'glass_pedestal', x: 815, y: 345, w: 55, h: 55, hideX: 842, hideY: 372, ix: 842, iy: 280, stealthWeight: 0.95, checked: false },

      // 2. West Velvet Gallery (Renaissance Masters) (5 Spots)
      { id: 'gm_monet_wall', name: 'Behind Impressionist Mobile Exhibition Wall', roomId: 'west_gallery', roomName: 'West Velvet Wing', type: 'gallery_partition', x: 70, y: 70, w: 85, h: 45, hideX: 112, hideY: 92, ix: 112, iy: 145, stealthWeight: 1.05, checked: false },
      { id: 'gm_velvet_drape_west', name: 'Behind Heavy Crimson Velvet Drapery', roomId: 'west_gallery', roomName: 'West Velvet Wing', type: 'museum_curtain', x: 285, y: 70, w: 80, h: 45, hideX: 325, hideY: 92, ix: 325, iy: 145, stealthWeight: 0.95, checked: false },
      { id: 'gm_renaissance_easel', name: 'Behind Gilded Studio Painting Easel', roomId: 'west_gallery', roomName: 'West Velvet Wing', type: 'artist_easel', x: 70, y: 220, w: 75, h: 45, hideX: 107, hideY: 242, ix: 107, iy: 295, stealthWeight: 0.95, checked: false },
      { id: 'gm_renaissance_chest', name: 'Behind Carved Florentine Cassone Chest', roomId: 'west_gallery', roomName: 'West Velvet Wing', type: 'antique_chest', x: 285, y: 220, w: 80, h: 45, hideX: 325, hideY: 242, ix: 325, iy: 295, stealthWeight: 1.0, checked: false },
      { id: 'gm_bench_west', name: 'Behind Velvet Upholstered Gallery Bench', roomId: 'west_gallery', roomName: 'West Velvet Wing', type: 'museum_bench', x: 70, y: 380, w: 80, h: 36, hideX: 110, hideY: 398, ix: 110, iy: 335, stealthWeight: 0.9, checked: false },

      // 3. Curators' Archive & Restoration Vault (4 Spots)
      { id: 'gm_manuscript_safe', name: 'Behind Fireproof Manuscript Vault', roomId: 'curator_vault', roomName: "Curators' Archive & Vault", type: 'archive_safe', x: 70, y: 490, w: 85, h: 50, hideX: 112, hideY: 515, ix: 112, iy: 565, stealthWeight: 1.1, checked: false },
      { id: 'gm_curator_plan_chest', name: 'Behind Steel Architectural Plan Chest', roomId: 'curator_vault', roomName: "Curators' Archive & Vault", type: 'flat_file', x: 285, y: 490, w: 80, h: 50, hideX: 325, hideY: 515, ix: 325, iy: 565, stealthWeight: 1.0, checked: false },
      { id: 'gm_rare_book_cabinet', name: 'Behind Antiquarian Folio Bookcase', roomId: 'curator_vault', roomName: "Curators' Archive & Vault", type: 'rare_bookcase', x: 70, y: 715, w: 85, h: 48, hideX: 112, hideY: 739, ix: 112, iy: 665, stealthWeight: 0.95, checked: false },
      { id: 'gm_restoration_table', name: 'Behind Canvas Restoration Workstation', roomId: 'curator_vault', roomName: "Curators' Archive & Vault", type: 'restoration_desk', x: 285, y: 715, w: 80, h: 48, hideX: 325, hideY: 739, ix: 325, iy: 665, stealthWeight: 0.95, checked: false },

      // 4. East Emerald Gallery (Antiquities & Artifacts) (5 Spots)
      { id: 'gm_egyptian_sarcophagus', name: 'Behind Gilded Pharaoh Sarcophagus', roomId: 'east_gallery', roomName: 'East Emerald Wing', type: 'sarcophagus', x: 980, y: 70, w: 85, h: 50, hideX: 1022, hideY: 95, ix: 1022, iy: 145, stealthWeight: 1.15, checked: false },
      { id: 'gm_greek_amphora_case', name: 'Behind Hellenic Terracotta Urn Vitrine', roomId: 'east_gallery', roomName: 'East Emerald Wing', type: 'glass_pedestal', x: 1195, y: 70, w: 80, h: 50, hideX: 1235, hideY: 95, ix: 1235, iy: 145, stealthWeight: 0.95, checked: false },
      { id: 'gm_golden_idol', name: 'Behind Pre-Columbian Sun Idol Pedestal', roomId: 'east_gallery', roomName: 'East Emerald Wing', type: 'golden_idol_case', x: 980, y: 220, w: 80, h: 48, hideX: 1020, hideY: 244, ix: 1020, iy: 295, stealthWeight: 1.0, checked: false },
      { id: 'gm_velvet_drape_east', name: 'Behind Emerald Velvet Tapestry Portiere', roomId: 'east_gallery', roomName: 'East Emerald Wing', type: 'museum_curtain', x: 1195, y: 220, w: 80, h: 48, hideX: 1235, hideY: 244, ix: 1235, iy: 295, stealthWeight: 0.95, checked: false },
      { id: 'gm_bench_east', name: 'Behind Gilded Rococo Gallery Settee', roomId: 'east_gallery', roomName: 'East Emerald Wing', type: 'museum_bench', x: 1200, y: 380, w: 75, h: 36, hideX: 1237, hideY: 398, ix: 1237, iy: 335, stealthWeight: 0.9, checked: false },

      // 5. Grand Marble Atrium & Reception (4 Spots)
      { id: 'gm_reception_counter', name: 'Behind Curved Marble Information Desk', roomId: 'museum_atrium', roomName: 'Grand Marble Atrium', type: 'curved_reception', x: 625, y: 550, w: 110, h: 46, hideX: 680, hideY: 573, ix: 680, iy: 505, stealthWeight: 1.1, checked: false },
      { id: 'gm_audio_tour_depot', name: 'Behind Audioguide Charging Tower', roomId: 'museum_atrium', roomName: 'Grand Marble Atrium', type: 'kiosk_prop', x: 450, y: 490, w: 70, h: 45, hideX: 485, hideY: 512, ix: 545, iy: 512, stealthWeight: 0.95, checked: false },
      { id: 'gm_cloakroom_rack', name: 'Behind Brass Visitor Cloakroom Rack', roomId: 'museum_atrium', roomName: 'Grand Marble Atrium', type: 'cloakroom_rack', x: 840, y: 490, w: 70, h: 45, hideX: 875, hideY: 512, ix: 785, iy: 512, stealthWeight: 0.9, checked: false },
      { id: 'gm_atrium_bench', name: 'Behind Grand Central Atrium Settee', roomId: 'museum_atrium', roomName: 'Grand Marble Atrium', type: 'museum_bench', x: 450, y: 645, w: 70, h: 38, hideX: 485, hideY: 664, ix: 545, iy: 664, stealthWeight: 0.9, checked: false },

      // 6. Security & Surveillance Suite (2 Spots)
      { id: 'gm_surveillance_desk', name: 'Behind Multi-Monitor CCTV Console', roomId: 'security_suite', roomName: 'Security & Surveillance Suite', type: 'surveillance_desk', x: 980, y: 510, w: 85, h: 48, hideX: 1022, hideY: 534, ix: 1022, iy: 585, stealthWeight: 1.05, checked: false },
      { id: 'gm_security_lockers', name: 'Behind Keycard Evidence Locker Bank', roomId: 'security_suite', roomName: 'Security & Surveillance Suite', type: 'security_lockers', x: 980, y: 715, w: 85, h: 48, hideX: 1022, hideY: 739, ix: 1022, iy: 665, stealthWeight: 0.95, checked: false }
    ];

    // EXACTLY 7 NON-HIDABLE SOLID DECORATIVE OBSTACLES (decorProps)
    this.decorProps = [
      { type: 'museum_fountain', name: 'Central Marble Tiered Water Basin', roomId: 'sculpture_rotunda', x: 635, y: 215, w: 90, h: 55 },
      { type: 'museum_column', name: 'Classical Fluted Doric Column', roomId: 'west_gallery', x: 285, y: 380, w: 28, h: 28 },
      { type: 'museum_column', name: 'Classical Fluted Doric Column', roomId: 'east_gallery', x: 980, y: 380, w: 28, h: 28 },
      { type: 'museum_column', name: 'Classical Fluted Ionic Column', roomId: 'museum_atrium', x: 450, y: 735, w: 28, h: 28 },
      { type: 'museum_column', name: 'Classical Fluted Ionic Column', roomId: 'museum_atrium', x: 882, y: 735, w: 28, h: 28 },
      { type: 'velvet_stanchions', name: 'Polished Brass Velvet Stanchion Line', roomId: 'museum_atrium', x: 835, y: 660, w: 75, h: 22 },
      { type: 'server_rack', name: 'High-Security Mainframe Server Tower', roomId: 'security_suite', x: 1205, y: 600, w: 65, h: 48 }
    ];

    this.ambientLights = [
      { x: 680, y: 220, r: 240, color: 'rgba(255, 255, 255, 0.14)' },
      { x: 230, y: 230, r: 160, color: 'rgba(244, 63, 94, 0.08)' },
      { x: 1130, y: 230, r: 160, color: 'rgba(52, 211, 153, 0.09)' },
      { x: 230, y: 630, r: 160, color: 'rgba(251, 191, 36, 0.08)' },
      { x: 1130, y: 630, r: 160, color: 'rgba(56, 189, 248, 0.08)' },
      { x: 680, y: 680, r: 170, color: 'rgba(255, 255, 255, 0.10)' }
    ];

    // NAV NODES FOR MAP 4:
    this.navNodes = {
      // Entrance & Atrium
      atrium_spawn: { x: 680, y: 715, neighbors: ['atrium_bot', 'atrium_center', 'atrium_west', 'atrium_east'] },
      atrium_bot: { x: 680, y: 760, neighbors: ['atrium_spawn'] },
      atrium_center: { x: 680, y: 620, neighbors: ['atrium_spawn', 'atrium_west', 'atrium_east'] },
      atrium_west: { x: 570, y: 620, neighbors: ['atrium_spawn', 'atrium_center', 'atrium_north_west', 'vault_door'] },
      atrium_east: { x: 790, y: 620, neighbors: ['atrium_spawn', 'atrium_center', 'atrium_north_east', 'security_door'] },
      atrium_north_west: { x: 570, y: 490, neighbors: ['atrium_west', 'rotunda_south_west'] },
      atrium_north_east: { x: 790, y: 490, neighbors: ['atrium_east', 'rotunda_south_east'] },

      // Rotunda
      rotunda_south_west: { x: 570, y: 390, neighbors: ['atrium_north_west', 'rotunda_west', 'rotunda_mid'] },
      rotunda_south_east: { x: 790, y: 390, neighbors: ['atrium_north_east', 'rotunda_east', 'rotunda_mid'] },
      rotunda_mid: { x: 680, y: 390, neighbors: ['rotunda_south_west', 'rotunda_south_east'] },
      rotunda_west: { x: 570, y: 220, neighbors: ['rotunda_south_west', 'rotunda_north_west', 'west_gallery_door'] },
      rotunda_east: { x: 790, y: 220, neighbors: ['rotunda_south_east', 'rotunda_north_east', 'east_gallery_door'] },
      rotunda_north_west: { x: 570, y: 150, neighbors: ['rotunda_west', 'rotunda_north'] },
      rotunda_north_east: { x: 790, y: 150, neighbors: ['rotunda_east', 'rotunda_north'] },
      rotunda_north: { x: 680, y: 150, neighbors: ['rotunda_north_west', 'rotunda_north_east'] },

      // West Gallery
      west_gallery_door: { x: 413, y: 220, neighbors: ['rotunda_west', 'west_gallery_mid'] },
      west_gallery_mid: { x: 230, y: 220, neighbors: ['west_gallery_door', 'west_gallery_north', 'west_gallery_south'] },
      west_gallery_north: { x: 230, y: 145, neighbors: ['west_gallery_mid'] },
      west_gallery_south: { x: 230, y: 310, neighbors: ['west_gallery_mid', 'west_vault_door'] },
      west_vault_door: { x: 230, y: 453, neighbors: ['west_gallery_south', 'vault_north'] },

      // Curator Vault
      vault_north: { x: 230, y: 550, neighbors: ['west_vault_door', 'vault_mid'] },
      vault_mid: { x: 230, y: 640, neighbors: ['vault_north', 'vault_door', 'vault_south'] },
      vault_south: { x: 230, y: 720, neighbors: ['vault_mid'] },
      vault_door: { x: 413, y: 630, neighbors: ['vault_mid', 'atrium_west'] },

      // East Gallery
      east_gallery_door: { x: 933, y: 220, neighbors: ['rotunda_east', 'east_gallery_mid'] },
      east_gallery_mid: { x: 1110, y: 220, neighbors: ['east_gallery_door', 'east_gallery_north', 'east_gallery_south'] },
      east_gallery_north: { x: 1110, y: 145, neighbors: ['east_gallery_mid'] },
      east_gallery_south: { x: 1110, y: 310, neighbors: ['east_gallery_mid', 'east_security_door'] },
      east_security_door: { x: 1110, y: 453, neighbors: ['east_gallery_south', 'security_north'] },

      // Security Suite
      security_north: { x: 1110, y: 550, neighbors: ['east_security_door', 'security_mid'] },
      security_mid: { x: 1110, y: 640, neighbors: ['security_north', 'security_door', 'security_south'] },
      security_south: { x: 1110, y: 720, neighbors: ['security_mid'] },
      security_door: { x: 933, y: 630, neighbors: ['security_mid', 'atrium_east'] }
    };

    this.roomHubNode = {
      west_gallery: 'west_gallery_mid',
      sculpture_rotunda: 'rotunda_mid',
      east_gallery: 'east_gallery_mid',
      curator_vault: 'vault_mid',
      museum_atrium: 'atrium_center',
      security_suite: 'security_mid'
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
      { id: 'carousel_meadow', name: 'GRAND CAROUSEL & MERRY-GO-ROUND', x: 40, y: 40, w: 420, h: 420, floor: 'carousel_floor' },
      { id: 'wonder_gardens', name: 'CENTRAL FOUNTAIN & GARDEN HEDGES', x: 460, y: 40, w: 480, h: 420, floor: 'park_grass' },
      { id: 'ferris_plaza', name: 'FERRIS WHEEL PLAZA & BOARDING DECK', x: 940, y: 40, w: 380, h: 420, floor: 'amusement_tile' },
      { id: 'carnival_midway', name: 'CARNIVAL GAME & SNACK BOOTHS', x: 40, y: 460, w: 420, h: 340, floor: 'carnival_deck' },
      { id: 'wonder_plaza', name: 'GRAND CLOCKTOWER PLAZA & PROMENADE', x: 460, y: 460, w: 480, h: 340, floor: 'amusement_tile' },
      { id: 'bumper_arena', name: 'BUMPER CAR ARENA & RETRO ARCADE', x: 940, y: 460, w: 380, h: 340, floor: 'bumper_floor' }
    ];

    this.walls = [
      // Outer park boundaries
      { x: 40, y: 40, w: 1280, h: 14 },
      { x: 40, y: 40, w: 14, h: 760 },
      { x: 1306, y: 40, w: 14, h: 760 },
      { x: 40, y: 786, w: 550, h: 14 },
      { x: 770, y: 786, w: 550, h: 14 }, // South entrance portal x: 590..770

      // Carousel Meadow <-> Carnival Midway (walkway x: 170..290)
      { x: 40, y: 453, w: 130, h: 14 },
      { x: 290, y: 453, w: 170, h: 14 },

      // Ferris Plaza <-> Bumper Arena (walkway x: 1070..1190)
      { x: 940, y: 453, w: 130, h: 14 },
      { x: 1190, y: 453, w: 130, h: 14 },

      // Wonder Gardens <-> Wonder Plaza divider (open archway x: 510..850)
      { x: 460, y: 453, w: 50, h: 14 },
      { x: 850, y: 453, w: 90, h: 14 },

      // Carousel <-> Wonder Gardens vertical portals (arch y: 170..310)
      { x: 453, y: 40, w: 14, h: 130 },
      { x: 453, y: 310, w: 14, h: 150 },

      // Carnival <-> Wonder Plaza vertical portals (arch y: 580..680)
      { x: 453, y: 460, w: 14, h: 120 },
      { x: 453, y: 680, w: 14, h: 120 },

      // Ferris Plaza <-> Wonder Gardens vertical portals (arch y: 170..310)
      { x: 933, y: 40, w: 14, h: 130 },
      { x: 933, y: 310, w: 14, h: 150 },

      // Bumper Arena <-> Wonder Plaza vertical portals (arch y: 580..680)
      { x: 933, y: 460, w: 14, h: 120 },
      { x: 933, y: 680, w: 14, h: 120 }
    ];

    this.glassWalls = [];
    this.doors = [];

    // EXACTLY 25 HIDING SPOTS
    this.hidingSpots = [
      // 1. Grand Carousel (Merry-Go-Round) (5 Spots)
      { id: 'wp_carousel_organ', name: 'Behind Grand Wurlitzer Carousel Organ', roomId: 'carousel_meadow', roomName: 'Grand Carousel Meadow', type: 'carousel_organ', x: 70, y: 70, w: 85, h: 50, hideX: 112, hideY: 95, ix: 112, iy: 145, stealthWeight: 1.1, checked: false },
      { id: 'wp_carousel_horse_gold', name: 'Behind Gilded Carousel Stallion', roomId: 'carousel_meadow', roomName: 'Grand Carousel Meadow', type: 'carousel_horse', x: 285, y: 70, w: 80, h: 50, hideX: 325, hideY: 95, ix: 325, iy: 145, stealthWeight: 1.0, checked: false },
      { id: 'wp_carousel_swan', name: 'Inside Enchanted Swan Chariot', roomId: 'carousel_meadow', roomName: 'Grand Carousel Meadow', type: 'swan_chariot', x: 70, y: 220, w: 80, h: 48, hideX: 110, hideY: 244, ix: 110, iy: 295, stealthWeight: 0.95, checked: false },
      { id: 'wp_carousel_horse_blue', name: 'Behind Sapphire Carousel Mare', roomId: 'carousel_meadow', roomName: 'Grand Carousel Meadow', type: 'carousel_horse', x: 285, y: 220, w: 80, h: 48, hideX: 325, hideY: 244, ix: 325, iy: 295, stealthWeight: 1.0, checked: false },
      { id: 'wp_carousel_operator', name: 'Behind Ride Operator Control Podium', roomId: 'carousel_meadow', roomName: 'Grand Carousel Meadow', type: 'ride_podium', x: 70, y: 380, w: 80, h: 36, hideX: 110, hideY: 398, ix: 110, iy: 335, stealthWeight: 0.9, checked: false },

      // 2. Central Fountain & Garden Hedges (5 Spots)
      { id: 'wp_clock_pedestal', name: 'Behind Victorian Park Sunburst Clocktower', roomId: 'wonder_gardens', roomName: 'Central Fountain Gardens', type: 'park_clocktower', x: 645, y: 65, w: 70, h: 55, hideX: 680, hideY: 92, ix: 680, iy: 150, stealthWeight: 1.2, checked: false },
      { id: 'wp_hedge_bear', name: 'Inside Sculpted Bear Topiary Nook', roomId: 'wonder_gardens', roomName: 'Central Fountain Gardens', type: 'topiary_hedge', x: 490, y: 70, w: 55, h: 55, hideX: 517, hideY: 97, ix: 517, iy: 150, stealthWeight: 1.1, checked: false },
      { id: 'wp_hedge_alcove', name: 'Behind Trimmed English Rose Hedge Alcove', roomId: 'wonder_gardens', roomName: 'Central Fountain Gardens', type: 'garden_hedge', x: 815, y: 70, w: 55, h: 55, hideX: 842, hideY: 97, ix: 842, iy: 150, stealthWeight: 1.1, checked: false },
      { id: 'wp_covered_bench_north', name: 'Behind Victorian Shaded Park Pergola', roomId: 'wonder_gardens', roomName: 'Central Fountain Gardens', type: 'park_pergola', x: 490, y: 345, w: 55, h: 55, hideX: 517, hideY: 372, ix: 517, iy: 280, stealthWeight: 1.0, checked: false },
      { id: 'wp_covered_bench_south', name: 'Behind Wrought-Iron Garden Glider Bench', roomId: 'wonder_gardens', roomName: 'Central Fountain Gardens', type: 'park_pergola', x: 815, y: 345, w: 55, h: 55, hideX: 842, hideY: 372, ix: 842, iy: 280, stealthWeight: 0.95, checked: false },

      // 3. Ferris Wheel Plaza & Boarding Deck (5 Spots)
      { id: 'wp_ferris_gondola', name: 'Inside Crimson Observation Gondola', roomId: 'ferris_plaza', roomName: 'Ferris Wheel Plaza', type: 'ferris_gondola', x: 980, y: 70, w: 85, h: 50, hideX: 1022, hideY: 95, ix: 1022, iy: 145, stealthWeight: 1.15, checked: false },
      { id: 'wp_ferris_ramp', name: 'Behind Wheel Boarding Deck Ramp', roomId: 'ferris_plaza', roomName: 'Ferris Wheel Plaza', type: 'boarding_ramp', x: 1195, y: 70, w: 80, h: 50, hideX: 1235, hideY: 95, ix: 1235, iy: 145, stealthWeight: 1.05, checked: false },
      { id: 'wp_ferris_kiosk', name: 'Behind Plaza Ticket & Token Kiosk', roomId: 'ferris_plaza', roomName: 'Ferris Wheel Plaza', type: 'ticket_kiosk', x: 980, y: 220, w: 80, h: 48, hideX: 1020, hideY: 244, ix: 1020, iy: 295, stealthWeight: 1.0, checked: false },
      { id: 'wp_souvenir_stand', name: 'Behind Plush Novelty Souvenir Cart', roomId: 'ferris_plaza', roomName: 'Ferris Wheel Plaza', type: 'souvenir_cart', x: 1195, y: 220, w: 80, h: 48, hideX: 1235, hideY: 244, ix: 1235, iy: 295, stealthWeight: 0.95, checked: false },
      { id: 'wp_photo_pavilion', name: 'Inside On-Ride Action Photo Booth', roomId: 'ferris_plaza', roomName: 'Ferris Wheel Plaza', type: 'photo_booth', x: 1200, y: 380, w: 75, h: 36, hideX: 1237, hideY: 398, ix: 1237, iy: 335, stealthWeight: 0.9, checked: false },

      // 4. Carnival Game & Snack Booths (5 Spots)
      { id: 'wp_ring_toss', name: 'Behind Neon Ring Toss Prize Wall', roomId: 'carnival_midway', roomName: 'Carnival Midway', type: 'carnival_booth', x: 70, y: 490, w: 85, h: 50, hideX: 112, hideY: 515, ix: 112, iy: 565, stealthWeight: 1.1, checked: false },
      { id: 'wp_balloon_dart', name: 'Behind Giant Balloon Dart Backboard', roomId: 'carnival_midway', roomName: 'Carnival Midway', type: 'carnival_booth', x: 285, y: 490, w: 80, h: 50, hideX: 325, hideY: 515, ix: 325, iy: 565, stealthWeight: 1.0, checked: false },
      { id: 'wp_cotton_candy', name: 'Behind Pink Cotton Candy Sugar Wagon', roomId: 'carnival_midway', roomName: 'Carnival Midway', type: 'snack_wagon', x: 70, y: 715, w: 85, h: 48, hideX: 112, hideY: 739, ix: 112, iy: 665, stealthWeight: 0.95, checked: false },
      { id: 'wp_popcorn_trailer', name: 'Behind Antique Kettle Popcorn Cart', roomId: 'carnival_midway', roomName: 'Carnival Midway', type: 'snack_wagon', x: 285, y: 715, w: 80, h: 48, hideX: 325, hideY: 739, ix: 325, iy: 665, stealthWeight: 0.95, checked: false },
      { id: 'wp_fortune_wagon', name: 'Behind Gilded Fortune Caravan Alcove', roomId: 'carnival_midway', roomName: 'Carnival Midway', type: 'fortune_wagon', x: 70, y: 605, w: 85, h: 48, hideX: 112, hideY: 629, ix: 112, iy: 565, stealthWeight: 1.0, checked: false },

      // 5. Bumper Car Arena & Retro Arcade (5 Spots)
      { id: 'wp_bumper_red', name: 'Inside Flame-Red Turbo Bumper Car', roomId: 'bumper_arena', roomName: 'Bumper Car Arena', type: 'bumper_car_red', x: 980, y: 510, w: 85, h: 48, hideX: 1022, hideY: 534, ix: 1022, iy: 585, stealthWeight: 1.05, checked: false },
      { id: 'wp_bumper_blue', name: 'Inside Neon-Blue Cobalt Bumper Car', roomId: 'bumper_arena', roomName: 'Bumper Car Arena', type: 'bumper_car_blue', x: 1200, y: 510, w: 80, h: 48, hideX: 1240, hideY: 534, ix: 1240, iy: 585, stealthWeight: 1.0, checked: false },
      { id: 'wp_bumper_gold', name: 'Inside Golden VIP Star Bumper Car', roomId: 'bumper_arena', roomName: 'Bumper Car Arena', type: 'bumper_car_gold', x: 980, y: 715, w: 85, h: 48, hideX: 1022, hideY: 739, ix: 1022, iy: 665, stealthWeight: 0.95, checked: false },
      { id: 'wp_bumper_tires', name: 'Behind Arena Impact Rubber Bumper Wall', roomId: 'bumper_arena', roomName: 'Bumper Car Arena', type: 'tire_barrier', x: 1200, y: 715, w: 80, h: 48, hideX: 1240, hideY: 739, ix: 1150, iy: 739, stealthWeight: 0.9, checked: false },
      { id: 'wp_arcade_ticket', name: 'Behind Arcade Prize Redemption Counter', roomId: 'bumper_arena', roomName: 'Bumper Car Arena', type: 'redemption_counter', x: 1200, y: 615, w: 80, h: 45, hideX: 1240, hideY: 637, ix: 1150, iy: 637, stealthWeight: 0.95, checked: false }
    ];

    // EXACTLY 7 NON-HIDABLE SOLID DECORATIVE OBSTACLES (decorProps)
    this.decorProps = [
      { type: 'park_water_fountain', name: 'Tiered Stone Dolphin Water Fountain', roomId: 'wonder_gardens', x: 635, y: 215, w: 90, h: 55 },
      { type: 'ferris_support_leg', name: 'Ferris Wheel Heavy Steel A-Frame Leg', roomId: 'carousel_meadow', x: 285, y: 380, w: 28, h: 28 },
      { type: 'ferris_support_leg', name: 'Ferris Wheel Heavy Steel A-Frame Leg', roomId: 'ferris_plaza', x: 980, y: 380, w: 28, h: 28 },
      { type: 'park_lamp_post', name: 'Victorian Wrought-Iron Park Lamp Post', roomId: 'wonder_plaza', x: 450, y: 735, w: 28, h: 28 },
      { type: 'park_lamp_post', name: 'Victorian Wrought-Iron Park Lamp Post', roomId: 'wonder_plaza', x: 882, y: 735, w: 28, h: 28 },
      { type: 'flowerbed_prop', name: 'Ornamental Curved Brick Flowerbed', roomId: 'wonder_plaza', x: 835, y: 660, w: 75, h: 22 },
      { type: 'decoy_pretzel_cart', name: 'Festive Bavarian Pretzel Cart Stand', roomId: 'wonder_plaza', x: 625, y: 550, w: 110, h: 46 }
    ];

    this.ambientLights = [
      { x: 680, y: 220, r: 240, color: 'rgba(255, 255, 255, 0.14)' },
      { x: 230, y: 230, r: 160, color: 'rgba(251, 191, 36, 0.09)' },
      { x: 1130, y: 230, r: 160, color: 'rgba(56, 189, 248, 0.10)' },
      { x: 230, y: 630, r: 160, color: 'rgba(244, 63, 94, 0.08)' },
      { x: 1130, y: 630, r: 160, color: 'rgba(168, 85, 247, 0.09)' },
      { x: 680, y: 680, r: 170, color: 'rgba(255, 255, 255, 0.10)' }
    ];

    // NAV NODES FOR MAP 5:
    this.navNodes = {
      // Entrance & Plaza
      plaza_spawn: { x: 680, y: 710, neighbors: ['plaza_bot', 'plaza_center', 'plaza_west', 'plaza_east'] },
      plaza_bot: { x: 680, y: 760, neighbors: ['plaza_spawn'] },
      plaza_center: { x: 680, y: 620, neighbors: ['plaza_spawn', 'plaza_west', 'plaza_east'] },
      plaza_west: { x: 570, y: 620, neighbors: ['plaza_spawn', 'plaza_center', 'plaza_north_west', 'carnival_door'] },
      plaza_east: { x: 790, y: 620, neighbors: ['plaza_spawn', 'plaza_center', 'plaza_north_east', 'bumper_door'] },
      plaza_north_west: { x: 570, y: 490, neighbors: ['plaza_west', 'gardens_south_west'] },
      plaza_north_east: { x: 790, y: 490, neighbors: ['plaza_east', 'gardens_south_east'] },

      // Gardens
      gardens_south_west: { x: 570, y: 390, neighbors: ['plaza_north_west', 'gardens_west', 'gardens_mid'] },
      gardens_south_east: { x: 790, y: 390, neighbors: ['plaza_north_east', 'gardens_east', 'gardens_mid'] },
      gardens_mid: { x: 680, y: 390, neighbors: ['gardens_south_west', 'gardens_south_east'] },
      gardens_west: { x: 570, y: 220, neighbors: ['gardens_south_west', 'gardens_north_west', 'carousel_door'] },
      gardens_east: { x: 790, y: 220, neighbors: ['gardens_south_east', 'gardens_north_east', 'ferris_door'] },
      gardens_north_west: { x: 570, y: 150, neighbors: ['gardens_west', 'gardens_north'] },
      gardens_north_east: { x: 790, y: 150, neighbors: ['gardens_east', 'gardens_north'] },
      gardens_north: { x: 680, y: 150, neighbors: ['gardens_north_west', 'gardens_north_east'] },

      // Carousel Meadow
      carousel_door: { x: 453, y: 220, neighbors: ['gardens_west', 'carousel_mid'] },
      carousel_mid: { x: 230, y: 220, neighbors: ['carousel_door', 'carousel_north', 'carousel_south'] },
      carousel_north: { x: 230, y: 145, neighbors: ['carousel_mid'] },
      carousel_south: { x: 230, y: 310, neighbors: ['carousel_mid', 'carousel_carnival_door'] },
      carousel_carnival_door: { x: 230, y: 453, neighbors: ['carousel_south', 'carnival_north'] },

      // Carnival Midway
      carnival_north: { x: 230, y: 550, neighbors: ['carousel_carnival_door', 'carnival_mid'] },
      carnival_mid: { x: 230, y: 640, neighbors: ['carnival_north', 'carnival_door', 'carnival_south'] },
      carnival_south: { x: 230, y: 720, neighbors: ['carnival_mid'] },
      carnival_door: { x: 453, y: 630, neighbors: ['carnival_mid', 'plaza_west'] },

      // Ferris Plaza
      ferris_door: { x: 933, y: 220, neighbors: ['gardens_east', 'ferris_mid'] },
      ferris_mid: { x: 1110, y: 220, neighbors: ['ferris_door', 'ferris_north', 'ferris_south'] },
      ferris_north: { x: 1110, y: 145, neighbors: ['ferris_mid'] },
      ferris_south: { x: 1110, y: 310, neighbors: ['ferris_mid', 'ferris_bumper_door'] },
      ferris_bumper_door: { x: 1110, y: 453, neighbors: ['ferris_south', 'bumper_north'] },

      // Bumper Arena
      bumper_north: { x: 1110, y: 550, neighbors: ['ferris_bumper_door', 'bumper_mid'] },
      bumper_mid: { x: 1110, y: 640, neighbors: ['bumper_north', 'bumper_door', 'bumper_south'] },
      bumper_south: { x: 1110, y: 720, neighbors: ['bumper_mid'] },
      bumper_door: { x: 933, y: 630, neighbors: ['bumper_mid', 'plaza_east'] }
    };

    this.roomHubNode = {
      carousel_meadow: 'carousel_mid',
      wonder_gardens: 'gardens_mid',
      ferris_plaza: 'ferris_mid',
      carnival_midway: 'carnival_mid',
      wonder_plaza: 'plaza_center',
      bumper_arena: 'bumper_mid'
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

