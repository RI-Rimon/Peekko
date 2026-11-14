/* ========================================================
   Peekko - Bird's-Eye Architectural Renderer
   Dark Mode & Light Mode Top-Down Map Rendering
   ======================================================== */

class ApartmentRenderer {
  constructor(canvas, apartment) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.apt = apartment;
    this.theme = 'dark';
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    this._onResize = () => this.resize();
    this.resize();
    window.addEventListener('resize', this._onResize);
    window.addEventListener('orientationchange', () => {
      this.resize();
      setTimeout(this._onResize, 120);
    });
  }

  setTheme(theme) {
    this.theme = theme;
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const pw = parent.clientWidth || window.innerWidth;
    const ph = parent.clientHeight || window.innerHeight;

    this.canvas.width = Math.max(1, Math.floor(pw * dpr));
    this.canvas.height = Math.max(1, Math.floor(ph * dpr));

    const isMobile = pw < 960 || ('ontouchstart' in window);
    const isLandscape = pw >= ph;
    const padX = isMobile ? (isLandscape ? 8 : 6) : 24;
    const padY = isMobile ? (isLandscape ? 6 : 8) : 24;
    const availW = Math.max(100, pw - padX);
    const availH = Math.max(100, ph - padY);

    this.scale = Math.min(availW / this.apt.width, availH / this.apt.height);
    this.offsetX = Math.max(0, (pw - this.apt.width * this.scale) / 2);
    this.offsetY = Math.max(0, (ph - this.apt.height * this.scale) / 2);
    this.dpr = dpr;
  }

  getPalette() {
    if (this.theme === 'light') {
      return {
        voidBg: '#e9dec9',
        wood: '#e8d7bd',
        woodLine: 'rgba(139, 94, 52, 0.16)',
        woodDark: '#dbc4a2',
        tile: '#f1ebe0',
        tileLine: 'rgba(15, 30, 58, 0.12)',
        tileWarm: '#f6efe2',
        mallTerrazzo: '#f7f2e8',
        parkGrass: '#dcfce7',
        carnivalDeck: '#fef3c7',
        amusementTile: '#fdf4ff',
        bumperFloor: '#e0f2fe',
        hauntedCobble: '#cbd5e1',
        concrete: '#b8c4d4',
        concreteDark: '#94a3b8',
        parkingLine: '#f59e0b',
        wall: '#172c54',
        wallEdge: '#eadbc2',
        doorArc: 'rgba(23, 44, 84, 0.25)',
        doorLeaf: '#78350f',
        roomLabel: 'rgba(23, 44, 84, 0.28)',
        furnitureShadow: 'rgba(15, 30, 58, 0.16)',
        woodFurniture: '#854d27',
        woodFurnitureLight: '#a66538',
        bedFrame: '#78350f',
        sheet: '#fcf8f0',
        blanket: '#1e40af',
        sofa: '#2b4168',
        sofaCushion: '#466191',
        porcelain: '#ffffff',
        porcelainRim: '#94a3b8',
        counter: '#d6ccb8',
        counterTop: '#b8ad99',
        metal: '#94a3b8',
        curtain: '#be123c',
        plant: '#15803d',
        highlight: '#173061',
        checkedBadgeBg: 'rgba(23, 44, 84, 0.85)',
        checkedBadgeText: '#f6efe2'
      };
    }

    // Dark Navy Blue & Warm Cream Palette
    return {
      voidBg: '#081124',
      wood: '#142442',
      woodLine: 'rgba(246, 239, 226, 0.05)',
      woodDark: '#101d36',
      tile: '#13223e',
      tileLine: 'rgba(246, 239, 226, 0.07)',
      tileWarm: '#182a4d',
      mallTerrazzo: '#1a2d52',
      parkGrass: '#0f291e',
      carnivalDeck: '#2e1c12',
      amusementTile: '#1f1338',
      bumperFloor: '#0d233a',
      hauntedCobble: '#131926',
      concrete: '#16243e',
      concreteDark: '#111c32',
      parkingLine: 'rgba(246, 239, 226, 0.45)',
      wall: '#2b4470',
      wallEdge: 'rgba(246, 239, 226, 0.35)',
      doorArc: 'rgba(246, 239, 226, 0.24)',
      doorLeaf: '#eadbc2',
      roomLabel: 'rgba(246, 239, 226, 0.20)',
      furnitureShadow: 'rgba(4, 9, 20, 0.48)',
      woodFurniture: '#4a382c',
      woodFurnitureLight: '#664e3e',
      bedFrame: '#362921',
      sheet: '#eadbc2',
      blanket: '#244780',
      sofa: '#223861',
      sofaCushion: '#335085',
      porcelain: '#eadbc2',
      porcelainRim: '#8a7d69',
      counter: '#1e3257',
      counterTop: '#314b7a',
      metal: '#7c90b0',
      curtain: '#9f1239',
      plant: '#15803d',
      highlight: '#f6efe2',
      checkedBadgeBg: 'rgba(11, 22, 44, 0.9)',
      checkedBadgeText: '#eadbc2'
    };
  }

  render(gameState) {
    const ctx = this.ctx;
    const p = this.getPalette();
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = p.voidBg;
    ctx.fillRect(0, 0, cw, ch);

    // Apply responsive transform
    ctx.scale(this.dpr, this.dpr);
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    // 1. Rooms & Floor Textures
    this.drawFloors(ctx, p);

    // 2. Door Swings & Thresholds
    this.drawDoors(ctx, p);

    // 3. Decorative Apartment Props
    for (const prop of this.apt.decorProps) {
      this.drawDecorProp(ctx, prop, p);
    }

    // 4. Hiding Spot Furniture + Interactive Highlights
    for (const spot of this.apt.hidingSpots) {
      const isNearest = gameState.nearestSpot && gameState.nearestSpot.id === spot.id;
      const isPlayerHere = gameState.player && gameState.player.hiddenSpot && gameState.player.hiddenSpot.id === spot.id;
      const isBotRevealedHere = gameState.revealBotSpot && gameState.botHiddenSpot && gameState.botHiddenSpot.id === spot.id;
      const isBeingScanned = (gameState.botSeekers && gameState.botSeekers.some(b => b.active && b.scanningSpotId === spot.id)) ||
        (gameState.botSeeker && gameState.botSeeker.active && gameState.botSeeker.scanningSpotId === spot.id);
      const isSeekerRole = gameState.role === 'seeker' || (gameState.isMultiplayer && gameState.mpRole === 'seeker');

      this.drawHidingSpot(ctx, spot, p, {
        isNearest,
        isPlayerHere,
        isBotRevealedHere,
        isBeingScanned,
        showCheckedBadge: isSeekerRole
      });
    }

    // 5. Structural Walls
    this.drawWalls(ctx, p);

    // 6. Dark Mode Ambient Room Glows (TV, Bedside Lamp, Foyer)
    if (this.theme === 'dark') {
      this.drawAmbientLights(ctx);
    }

    // 7. MULTIPLAYER PLAYERS (if multiplayer active)
    if (gameState.isMultiplayer && gameState.mpPlayers && gameState.mpPlayers.length > 0) {
      const me = gameState.mpPlayers.find(pl => pl.id === gameState.mpLocalId);
      const isMeSeeker = me && me.role === 'seeker';
      const isMeEliminated = me && me.eliminated;
      const isHidingCountdown = gameState.mpPhase === 'mp_hiding_countdown';

      // 7a. Draw Seeker flashlight cone in Dark mode
      const seeker = gameState.mpPlayers.find(pl => pl.role === 'seeker');
      if (seeker && this.theme === 'dark') {
        if (isMeSeeker || !isHidingCountdown || isMeEliminated) {
          this.drawFlashlightCone(
            ctx,
            seeker.x,
            seeker.y,
            seeker.angle,
            'rgba(245, 158, 11, 0.22)'
          );
        }
      }

      // 7b. Draw Characters with Asymmetric Fair Visibility
      for (const pl of gameState.mpPlayers) {
        const isLocal = pl.id === gameState.mpLocalId;
        const label = isLocal ? `YOU (${pl.name})` : pl.name;

        if (pl.role === 'seeker') {
          if (isMeSeeker || !isHidingCountdown || isMeEliminated) {
            this.drawCharacter(ctx, pl.x, pl.y, pl.angle, pl.color, label, false, pl.isMoving);
          }
        } else {
          // Character is a Hider
          if (pl.eliminated) {
            // Eliminated spectator ghost (only visible to fellow hiders/spectators)
            if (!isMeSeeker || isMeEliminated) {
              ctx.save();
              ctx.globalAlpha = 0.35;
              this.drawCharacter(ctx, pl.x, pl.y, pl.angle, '#94a3b8', `[OUT] ${pl.name}`, false, false);
              ctx.restore();
            }
            continue;
          }

          if (isHidingCountdown) {
            // In 25s Countdown Phase: Seeker cannot see any Hiders!
            if (isMeSeeker) {
              continue;
            } else {
              if (pl.isHidden && pl.hiddenSpotId) {
                const spot = this.apt.hidingSpots.find(s => s.id === pl.hiddenSpotId);
                const hx = spot ? spot.hideX : pl.x;
                const hy = spot ? spot.hideY : pl.y;
                this.drawCharacter(ctx, hx, hy, pl.angle, pl.color, label, true, false);
              } else {
                this.drawCharacter(ctx, pl.x, pl.y, pl.angle, pl.color, label, false, pl.isMoving);
              }
            }
          } else {
            // Hunt Phase:
            if (isMeEliminated) {
              // Spectator sees everyone
              if (pl.isHidden && pl.hiddenSpotId) {
                const spot = this.apt.hidingSpots.find(s => s.id === pl.hiddenSpotId);
                const hx = spot ? spot.hideX : pl.x;
                const hy = spot ? spot.hideY : pl.y;
                this.drawCharacter(ctx, hx, hy, pl.angle, pl.color, label, true, false);
              } else {
                this.drawCharacter(ctx, pl.x, pl.y, pl.angle, pl.color, label, false, pl.isMoving);
              }
            } else if (!isMeSeeker) {
              // Local player is a Hider: can see fellow Hiders (stealth if hidden)
              if (pl.isHidden && pl.hiddenSpotId) {
                const spot = this.apt.hidingSpots.find(s => s.id === pl.hiddenSpotId);
                const hx = spot ? spot.hideX : pl.x;
                const hy = spot ? spot.hideY : pl.y;
                this.drawCharacter(ctx, hx, hy, pl.angle, pl.color, label, true, false);
              } else {
                this.drawCharacter(ctx, pl.x, pl.y, pl.angle, pl.color, label, false, pl.isMoving);
              }
            } else {
              // Local player is the Seeker!
              // Rule 1: CANNOT see Hiders who are hidden inside a spot
              if (pl.isHidden) {
                continue;
              }
              // Rule 2: CANNOT see Hiders blocked behind walls
              const hasLOS = this.apt.hasLineOfSight(me.x, me.y, pl.x, pl.y);
              if (!hasLOS) {
                continue;
              }
              // Rule 3: Moving out in open within Line of Sight
              this.drawCharacter(ctx, pl.x, pl.y, pl.angle, pl.color, label, false, pl.isMoving);
            }
          }
        }
      }
    } else {
      // 7. SOLO MODE CHARACTERS (Bot Seekers, Bot Hider when revealed, Player)
      if (gameState.botSeekers && gameState.botSeekers.length > 0) {
        gameState.botSeekers.forEach(bot => {
          if (bot && bot.active) this.drawSeekerBot(ctx, bot);
        });
      } else if (gameState.botSeeker && gameState.botSeeker.active) {
        this.drawSeekerBot(ctx, gameState.botSeeker);
      }

      if (gameState.revealBotSpot && gameState.botHiddenSpot) {
        this.drawCharacter(
          ctx,
          gameState.botHiddenSpot.hideX,
          gameState.botHiddenSpot.hideY,
          0,
          '#f43f5e',
          'BOT',
          false,
          true
        );
      }

      if (gameState.player) {
        const pl = gameState.player;
        if (pl.isHidden && pl.hiddenSpot) {
          // Subtle stealth silhouette showing player tucked inside furniture
          this.drawCharacter(ctx, pl.hiddenSpot.hideX, pl.hiddenSpot.hideY, pl.angle, '#38bdf8', 'YOU', true, false);
        } else {
          this.drawCharacter(ctx, pl.x, pl.y, pl.angle, gameState.role === 'seeker' ? '#f59e0b' : '#38bdf8', 'YOU', false, pl.isMoving);
        }
      }

      // 8. Seeker Player Flashlight Cone (in Dark Mode when user is Seeker)
      if (this.theme === 'dark' && gameState.role === 'seeker' && gameState.player) {
        this.drawFlashlightCone(ctx, gameState.player.x, gameState.player.y, gameState.player.angle, 'rgba(253, 224, 71, 0.14)');
      }
    }

    // 9. Hot / Warm / Cool Proximity Hint Banner (Seeker Mode feedback)
    if (gameState.proximityHint && gameState.proximityHint.timer > 0) {
      this.drawProximityHint(ctx, gameState.proximityHint);
    }

    ctx.restore();
  }

  drawProximityHint(ctx, hint) {
    ctx.save();
    const alpha = Math.min(1, hint.timer / 25);
    ctx.globalAlpha = alpha;
    const bg = hint.type === 'hot' ? 'rgba(239, 68, 68, 0.94)' : (hint.type === 'warm' ? 'rgba(245, 158, 11, 0.94)' : 'rgba(56, 189, 248, 0.94)');
    ctx.fillStyle = bg;
    this.roundRect(ctx, hint.x - 72, hint.y - 42, 144, 28, 8);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(hint.text, hint.x, hint.y - 28);
    ctx.restore();
  }

  drawFloors(ctx, p) {
    for (const r of this.apt.rooms) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(r.x, r.y, r.w, r.h);
      ctx.clip();

      if (r.floor === 'tile') ctx.fillStyle = p.tile;
      else if (r.floor === 'tile_warm') ctx.fillStyle = p.tileWarm;
      else if (r.floor === 'mall_terrazzo') ctx.fillStyle = p.mallTerrazzo;
      else if (r.floor === 'park_grass') ctx.fillStyle = p.parkGrass;
      else if (r.floor === 'carnival_deck') ctx.fillStyle = p.carnivalDeck;
      else if (r.floor === 'amusement_tile') ctx.fillStyle = p.amusementTile;
      else if (r.floor === 'bumper_floor') ctx.fillStyle = p.bumperFloor;
      else if (r.floor === 'haunted_cobble') ctx.fillStyle = p.hauntedCobble;
      else if (r.floor === 'wood_dark') ctx.fillStyle = p.woodDark;
      else if (r.floor === 'concrete') ctx.fillStyle = p.concrete;
      else if (r.floor === 'concrete_dark') ctx.fillStyle = p.concreteDark;
      else ctx.fillStyle = p.wood;

      ctx.fillRect(r.x, r.y, r.w, r.h);

      // Architectural Floor Texture Lines
      if (r.floor === 'tile' || r.floor === 'tile_warm') {
        ctx.strokeStyle = p.tileLine;
        ctx.lineWidth = 1;
        const size = 28;
        for (let tx = r.x; tx <= r.x + r.w; tx += size) {
          ctx.beginPath(); ctx.moveTo(tx, r.y); ctx.lineTo(tx, r.y + r.h); ctx.stroke();
        }
        for (let ty = r.y; ty <= r.y + r.h; ty += size) {
          ctx.beginPath(); ctx.moveTo(r.x, ty); ctx.lineTo(r.x + r.w, ty); ctx.stroke();
        }
      } else if (r.floor === 'mall_terrazzo') {
        ctx.strokeStyle = p.tileLine;
        ctx.lineWidth = 1.2;
        const size = 48;
        for (let tx = r.x; tx <= r.x + r.w; tx += size) {
          ctx.beginPath(); ctx.moveTo(tx, r.y); ctx.lineTo(tx, r.y + r.h); ctx.stroke();
        }
        for (let ty = r.y; ty <= r.y + r.h; ty += size) {
          ctx.beginPath(); ctx.moveTo(r.x, ty); ctx.lineTo(r.x + r.w, ty); ctx.stroke();
        }
        // Subtle polished mall promenade border strip
        ctx.strokeStyle = this.theme === 'dark' ? 'rgba(246, 239, 226, 0.14)' : 'rgba(23, 44, 84, 0.14)';
        ctx.lineWidth = 4;
        ctx.strokeRect(r.x + 12, r.y + 12, r.w - 24, r.h - 24);
      } else if (r.floor === 'park_grass') {
        // Natural lawn with subtle stipples
        ctx.fillStyle = this.theme === 'dark' ? 'rgba(34, 197, 94, 0.10)' : 'rgba(22, 101, 52, 0.08)';
        for (let gx = r.x + 20; gx < r.x + r.w - 10; gx += 40) {
          for (let gy = r.y + 20; gy < r.y + r.h - 10; gy += 40) {
            ctx.beginPath();
            ctx.arc(gx + ((gy % 80 === 0) ? 15 : 0), gy, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (r.floor === 'carnival_deck') {
        // Diagonal festive boardwalk wood planks
        ctx.strokeStyle = this.theme === 'dark' ? 'rgba(245, 158, 11, 0.09)' : 'rgba(180, 83, 9, 0.12)';
        ctx.lineWidth = 1.2;
        for (let dx = r.x - r.h; dx <= r.x + r.w + r.h; dx += 24) {
          ctx.beginPath();
          ctx.moveTo(dx, r.y);
          ctx.lineTo(dx + r.h, r.y + r.h);
          ctx.stroke();
        }
      } else if (r.floor === 'amusement_tile') {
        // Grand amusement plaza decorative grid
        ctx.strokeStyle = this.theme === 'dark' ? 'rgba(246, 239, 226, 0.08)' : 'rgba(168, 85, 247, 0.14)';
        ctx.lineWidth = 1.2;
        const size = 60;
        for (let tx = r.x; tx <= r.x + r.w; tx += size) {
          ctx.beginPath(); ctx.moveTo(tx, r.y); ctx.lineTo(tx, r.y + r.h); ctx.stroke();
        }
        for (let ty = r.y; ty <= r.y + r.h; ty += size) {
          ctx.beginPath(); ctx.moveTo(r.x, ty); ctx.lineTo(r.x + r.w, ty); ctx.stroke();
        }
      } else if (r.floor === 'bumper_floor') {
        // High-tech electric grid
        ctx.strokeStyle = this.theme === 'dark' ? 'rgba(56, 189, 248, 0.14)' : 'rgba(2, 132, 199, 0.16)';
        ctx.lineWidth = 1;
        const size = 32;
        for (let tx = r.x; tx <= r.x + r.w; tx += size) {
          ctx.beginPath(); ctx.moveTo(tx, r.y); ctx.lineTo(tx, r.y + r.h); ctx.stroke();
        }
        for (let ty = r.y; ty <= r.y + r.h; ty += size) {
          ctx.beginPath(); ctx.moveTo(r.x, ty); ctx.lineTo(r.x + r.w, ty); ctx.stroke();
        }
      } else if (r.floor === 'haunted_cobble') {
        // Cobblestones
        ctx.strokeStyle = this.theme === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(51, 65, 85, 0.18)';
        ctx.lineWidth = 1.2;
        const size = 36;
        for (let cy = r.y; cy <= r.y + r.h; cy += size) {
          const shift = (Math.floor(cy / size) % 2) * (size / 2);
          for (let cx = r.x + shift; cx <= r.x + r.w; cx += size) {
            this.roundRect(ctx, cx, cy, size - 4, size - 4, 6);
            ctx.stroke();
          }
        }
      } else if (r.floor === 'concrete' || r.floor === 'concrete_dark') {
        ctx.strokeStyle = p.tileLine;
        ctx.lineWidth = 1.5;
        const size = 72;
        for (let tx = r.x; tx <= r.x + r.w; tx += size) {
          ctx.beginPath(); ctx.moveTo(tx, r.y); ctx.lineTo(tx, r.y + r.h); ctx.stroke();
        }
        for (let ty = r.y; ty <= r.y + r.h; ty += size) {
          ctx.beginPath(); ctx.moveTo(r.x, ty); ctx.lineTo(r.x + r.w, ty); ctx.stroke();
        }
      } else {
        ctx.strokeStyle = p.woodLine;
        ctx.lineWidth = 1;
        for (let py = r.y; py <= r.y + r.h; py += 16) {
          ctx.beginPath(); ctx.moveTo(r.x, py); ctx.lineTo(r.x + r.w, py); ctx.stroke();
        }
      }

      // Rugs
      if (r.rug) {
        const rg = r.rug;
        const rugColors = {
          blue: this.theme === 'dark' ? '#1e293b' : '#cbd5e1',
          amber: this.theme === 'dark' ? '#29221d' : '#fde68a',
          crimson: this.theme === 'dark' ? '#2b1620' : '#fecdd3',
          slate: this.theme === 'dark' ? '#202636' : '#e2e8f0'
        };
        ctx.fillStyle = rugColors[rg.color] || rugColors.slate;
        this.roundRect(ctx, rg.x, rg.y, rg.w, rg.h, 6);
        ctx.fill();
        ctx.strokeStyle = this.theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.12)';
        ctx.lineWidth = 2;
        this.roundRect(ctx, rg.x + 5, rg.y + 5, rg.w - 10, rg.h - 10, 4);
        ctx.stroke();
      }

      // Room Label
      ctx.fillStyle = p.roomLabel;
      ctx.font = '700 13px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(r.name, r.x + r.w / 2, r.y + r.h / 2 + 4);

      ctx.restore();
    }

    // Painted Parking Bays (Basement Map)
    if (this.apt.parkingLines && this.apt.parkingLines.length > 0) {
      ctx.save();
      ctx.strokeStyle = p.parkingLine;
      ctx.lineWidth = 2.5;
      for (const bay of this.apt.parkingLines) {
        ctx.beginPath();
        ctx.moveTo(bay.x, bay.y + bay.h);
        ctx.lineTo(bay.x, bay.y);
        ctx.lineTo(bay.x + bay.w, bay.y);
        ctx.lineTo(bay.x + bay.w, bay.y + bay.h);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  drawDoors(ctx, p) {
    ctx.save();
    for (const d of this.apt.doors) {
      ctx.strokeStyle = p.doorArc;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(d.hingeX, d.hingeY, d.radius, d.startAngle, d.endAngle, d.endAngle < d.startAngle);
      ctx.stroke();
      ctx.setLineDash([]);

      // Open door panel
      ctx.strokeStyle = p.doorLeaf;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(d.hingeX, d.hingeY);
      ctx.lineTo(
        d.hingeX + Math.cos(d.leafAngle) * d.radius,
        d.hingeY + Math.sin(d.leafAngle) * d.radius
      );
      ctx.stroke();
    }

    // Main Entrance Threshold Mat
    ctx.fillStyle = this.theme === 'dark' ? '#334155' : '#94a3b8';
    ctx.fillRect(this.apt.spawn.x - 34, this.apt.height - 64, 68, 18);
    ctx.restore();
  }

  drawWalls(ctx, p) {
    ctx.save();
    for (const w of this.apt.walls) {
      ctx.fillStyle = p.furnitureShadow;
      ctx.fillRect(w.x + 3, w.y + 3, w.w, w.h);

      ctx.fillStyle = p.wall;
      ctx.fillRect(w.x, w.y, w.w, w.h);

      ctx.strokeStyle = p.wallEdge;
      ctx.lineWidth = 1;
      ctx.strokeRect(w.x + 0.5, w.y + 0.5, w.w - 1, w.h - 1);
    }

    // Transparent Glass Storefront Windows (Shopping Mall)
    if (this.apt.glassWalls && this.apt.glassWalls.length > 0) {
      for (const gw of this.apt.glassWalls) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.24)';
        ctx.fillRect(gw.x, gw.y, gw.w, gw.h);
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(gw.x, gw.y, gw.w, gw.h);
        // Glass reflection mullions every 40px
        ctx.fillStyle = p.wallEdge;
        for (let my = gw.y + 38; my < gw.y + gw.h - 10; my += 40) {
          ctx.fillRect(gw.x - 1, my, gw.w + 2, 3);
        }
      }
    }
    ctx.restore();
  }

  drawDecorProp(ctx, prop, p) {
    ctx.save();
    ctx.fillStyle = p.furnitureShadow;
    this.roundRect(ctx, prop.x + 3, prop.y + 4, prop.w, prop.h, 5);
    ctx.fill();

    if (prop.type === 'nightstand') {
      ctx.fillStyle = p.woodFurniture;
      this.roundRect(ctx, prop.x, prop.y, prop.w, prop.h, 4);
      ctx.fill();
      // Bedside Lamp
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(prop.x + prop.w / 2, prop.y + prop.h / 2, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (prop.type === 'toilet') {
      ctx.fillStyle = p.porcelain;
      this.roundRect(ctx, prop.x + 4, prop.y, prop.w - 8, 14, 3);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(prop.x + prop.w / 2, prop.y + 30, 14, 17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p.porcelainRim;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (prop.type === 'plant') {
      const cx = prop.x + prop.w / 2;
      const cy = prop.y + prop.h / 2;
      ctx.fillStyle = '#7c2d12';
      ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = p.plant;
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(a) * 9, cy + Math.sin(a) * 9, 8, 4, a, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (prop.type === 'shoe_rack' || prop.type === 'coat_rack') {
      ctx.fillStyle = p.woodFurniture;
      this.roundRect(ctx, prop.x, prop.y, prop.w, prop.h, 6);
      ctx.fill();
    } else if (prop.type === 'fridge') {
      ctx.fillStyle = p.metal;
      this.roundRect(ctx, prop.x, prop.y, prop.w, prop.h, 5);
      ctx.fill();
      ctx.strokeStyle = p.wall;
      ctx.lineWidth = 2;
      ctx.strokeRect(prop.x + 2, prop.y + 2, prop.w - 4, prop.h - 4);
    } else if (prop.type === 'elec_panel') {
      ctx.fillStyle = '#475569';
      ctx.fillRect(prop.x, prop.y, prop.w, prop.h);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(prop.x + 4, prop.y + prop.h / 2 - 6, prop.w - 8, 12);
    } else if (prop.type === 'traffic_cone') {
      const cx = prop.x + prop.w / 2;
      const cy = prop.y + prop.h / 2;
      ctx.fillStyle = '#f97316';
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(cx, cy, 4.5, 0, Math.PI * 2); ctx.fill();
    } else if (prop.type === 'workbench_prop') {
      ctx.fillStyle = '#78350f';
      this.roundRect(ctx, prop.x, prop.y, prop.w, prop.h, 4);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(prop.x + 14, prop.y + 10, 26, 8);
      ctx.fillRect(prop.x + 68, prop.y + 16, 18, 20);
    } else if (prop.type === 'bistro_prop') {
      const bcx = prop.x + prop.w / 2;
      const bcy = prop.y + prop.h / 2;
      ctx.fillStyle = p.sofaCushion;
      [[0, -24], [0, 24], [-24, 0], [24, 0]].forEach(([ox, oy]) => {
        ctx.beginPath(); ctx.arc(bcx + ox, bcy + oy, 8, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = '#eadbc2';
      ctx.beginPath(); ctx.arc(bcx, bcy, 18, 0, Math.PI * 2); ctx.fill();
    } else if (prop.type === 'gondola_prop') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(prop.x, prop.y, prop.w, prop.h);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(prop.x + 4, prop.y + prop.h / 2 - 2, prop.w - 8, 4);
      const colors = ['#ef4444', '#38bdf8', '#facc15', '#34d399'];
      for (let gx = prop.x + 8, i = 0; gx < prop.x + prop.w - 14; gx += 18, i++) {
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(gx, prop.y + 6, 12, prop.h / 2 - 10);
        ctx.fillRect(gx, prop.y + prop.h / 2 + 4, 12, prop.h / 2 - 10);
      }
    }

    ctx.restore();
  }

  drawHidingSpot(ctx, spot, p, flags) {
    ctx.save();

    // Drop shadow
    ctx.fillStyle = p.furnitureShadow;
    this.roundRect(ctx, spot.x + 4, spot.y + 5, spot.w, spot.h, 6);
    ctx.fill();

    // Furniture specific bird's-eye graphic
    if (spot.type === 'double_bed') {
      ctx.fillStyle = p.bedFrame;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      // Mattress / Sheet
      ctx.fillStyle = p.sheet;
      this.roundRect(ctx, spot.x + 6, spot.y + 10, spot.w - 12, spot.h - 16, 4);
      ctx.fill();
      // Blanket
      ctx.fillStyle = p.blanket;
      this.roundRect(ctx, spot.x + 6, spot.y + 42, spot.w - 12, spot.h - 48, 4);
      ctx.fill();
      // Pillows
      ctx.fillStyle = '#ffffff';
      this.roundRect(ctx, spot.x + 16, spot.y + 15, 48, 22, 4); ctx.fill();
      this.roundRect(ctx, spot.x + spot.w - 64, spot.y + 15, 48, 22, 4); ctx.fill();
    } else if (spot.type === 'wardrobe' || spot.type === 'pantry' || spot.type === 'cabinet') {
      ctx.fillStyle = p.woodFurniture;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      ctx.strokeStyle = p.woodFurnitureLight;
      ctx.lineWidth = 2;
      ctx.strokeRect(spot.x + 4, spot.y + 4, spot.w - 8, spot.h - 8);
      // Center seam
      ctx.beginPath();
      ctx.moveTo(spot.x + spot.w / 2, spot.y + 4);
      ctx.lineTo(spot.x + spot.w / 2, spot.y + spot.h - 4);
      ctx.stroke();
    } else if (spot.type === 'dressing_table' || spot.type === 'desk') {
      ctx.fillStyle = p.woodFurnitureLight;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      if (spot.type === 'dressing_table') {
        // Vanity mirror edge + stool
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(spot.x + 20, spot.y + spot.h - 7, spot.w - 40, 4);
        ctx.fillStyle = p.sofaCushion;
        ctx.beginPath();
        ctx.arc(spot.x + spot.w / 2, spot.y - 12, 11, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Desk monitor & chair
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(spot.x + 36, spot.y + 8, 54, 8);
        ctx.fillStyle = p.sofa;
        ctx.beginPath();
        ctx.arc(spot.x + spot.w / 2, spot.y + spot.h + 10, 13, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (spot.type === 'bathtub') {
      ctx.fillStyle = p.porcelain;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 12);
      ctx.fill();
      ctx.fillStyle = this.theme === 'dark' ? '#1e3a5f' : '#bae6fd';
      this.roundRect(ctx, spot.x + 12, spot.y + 10, spot.w - 24, spot.h - 20, 10);
      ctx.fill();
      // Shower curtain line
      ctx.strokeStyle = p.curtain;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(spot.x + 4, spot.y + spot.h);
      ctx.lineTo(spot.x + spot.w - 4, spot.y + spot.h);
      ctx.stroke();
    } else if (spot.type === 'bookshelf') {
      ctx.fillStyle = p.woodFurniture;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      // Books stack texture
      const colors = ['#ef4444', '#3b82f6', '#eab308', '#10b981'];
      for (let by = spot.y + 10, idx = 0; by < spot.y + spot.h - 14; by += 14, idx++) {
        ctx.fillStyle = colors[idx % colors.length];
        ctx.fillRect(spot.x + 8, by, spot.w - 16, 10);
      }
    } else if (spot.type === 'curtain') {
      ctx.fillStyle = p.curtain;
      for (let cx = spot.x; cx < spot.x + spot.w; cx += 16) {
        ctx.beginPath();
        ctx.ellipse(cx + 8, spot.y + spot.h / 2, 9, spot.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (spot.type === 'sofa') {
      ctx.fillStyle = p.sofa;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 8);
      ctx.fill();
      ctx.fillStyle = p.sofaCushion;
      const cushions = Math.max(2, Math.floor((spot.w - 16) / 50));
      const cWidth = (spot.w - 16 - (cushions - 1) * 4) / cushions;
      for (let i = 0; i < cushions; i++) {
        this.roundRect(ctx, spot.x + 8 + i * (cWidth + 4), spot.y + 10, cWidth, spot.h - 16, 5);
        ctx.fill();
      }
      ctx.fillStyle = this.theme === 'dark' ? '#1e293b' : '#334155';
      this.roundRect(ctx, spot.x + 4, spot.y + spot.h - 13, spot.w - 8, 11, 4);
      ctx.fill();
    } else if (spot.type === 'dining_table') {
      ctx.fillStyle = p.woodFurniture;
      const chairCount = Math.max(2, Math.floor(spot.w / 65));
      for (let i = 0; i < chairCount; i++) {
        const cx = spot.x + 22 + i * ((spot.w - 44) / Math.max(1, chairCount - 1)) - 11;
        ctx.fillRect(cx, spot.y - 10, 22, 12);
        ctx.fillRect(cx, spot.y + spot.h - 2, 22, 12);
      }
      ctx.fillStyle = p.woodFurnitureLight;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 8);
      ctx.fill();
    } else if (spot.type === 'chest') {
      ctx.fillStyle = p.woodFurniture;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 5);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(spot.x + 12, spot.y + 4, spot.w - 24, spot.h - 8);
    } else if (spot.type === 'vanity_sink') {
      ctx.fillStyle = p.counter;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      ctx.fillStyle = p.porcelain;
      ctx.beginPath();
      ctx.ellipse(spot.x + spot.w / 2, spot.y + spot.h / 2 + 3, 20, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.metal;
      ctx.beginPath();
      ctx.arc(spot.x + spot.w / 2, spot.y + 10, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (spot.type === 'coffee_table') {
      ctx.fillStyle = p.woodFurnitureLight;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(spot.x + 18, spot.y + 14, 24, 18);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(spot.x + 64, spot.y + 26, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (spot.type === 'tv_console') {
      ctx.fillStyle = p.woodFurniture;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(spot.x + 8, spot.y + 14, 8, spot.h - 28);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(spot.x + 6, spot.y + 18, 2, spot.h - 36);
    } else if (spot.type === 'bar_counter') {
      ctx.fillStyle = p.woodFurniture;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      ctx.fillStyle = p.counterTop;
      this.roundRect(ctx, spot.x + 6, spot.y + 6, spot.w - 12, spot.h - 12, 4);
      ctx.fill();
      // Bar stools in front
      ctx.fillStyle = p.sofaCushion;
      [0.2, 0.5, 0.8].forEach(r => {
        ctx.beginPath();
        ctx.arc(spot.x + spot.w * r, spot.y + spot.h + 12, 9, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (spot.type === 'piano') {
      ctx.fillStyle = '#0f172a';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 14);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(spot.x + spot.w - 16, spot.y + 10, 12, spot.h - 20);
      ctx.fillStyle = '#020617';
      for (let ky = spot.y + 14; ky < spot.y + spot.h - 14; ky += 10) {
        ctx.fillRect(spot.x + spot.w - 16, ky, 7, 4);
      }
    } else if (spot.type.startsWith('car_')) {
      // Compact Top-Down Parked Vehicle
      const carColors = {
        car_red: '#dc2626',
        car_silver: '#94a3b8',
        car_black: '#1e293b',
        car_blue: '#2563eb',
        car_yellow: '#eab308',
        car_green: '#16a34a',
        car_navy: '#1e3a8a',
        car_van: '#e2e8f0'
      };
      ctx.fillStyle = '#090d16';
      [spot.x + 12, spot.x + spot.w - 26].forEach(tx => {
        ctx.fillRect(tx, spot.y - 2.5, 14, 4);
        ctx.fillRect(tx, spot.y + spot.h - 1.5, 14, 4);
      });
      ctx.fillStyle = carColors[spot.type] || '#64748b';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 10);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      this.roundRect(ctx, spot.x + 14, spot.y + 6, spot.w - 32, spot.h - 12, 5);
      ctx.fill();
      ctx.fillStyle = carColors[spot.type] || '#64748b';
      const roofPad = spot.type === 'car_van' ? spot.w * 0.18 : spot.w * 0.26;
      this.roundRect(ctx, spot.x + roofPad, spot.y + 7, spot.w - roofPad * 1.9, spot.h - 14, 3);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(spot.x + spot.w - 3.5, spot.y + 6, 3.5, 8);
      ctx.fillRect(spot.x + spot.w - 3.5, spot.y + spot.h - 14, 3.5, 8);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(spot.x, spot.y + 6, 3, 8);
      ctx.fillRect(spot.x, spot.y + spot.h - 14, 3, 8);
    } else if (spot.type === 'fire_cabinet') {
      ctx.fillStyle = '#b91c1c';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 2;
      ctx.strokeRect(spot.x + 6, spot.y + 6, spot.w - 12, spot.h - 12);
      ctx.fillStyle = '#f6efe2';
      ctx.beginPath(); ctx.arc(spot.x + spot.w / 2, spot.y + spot.h / 2, 7, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'bike_rack') {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      for (let bx = spot.x + 12; bx < spot.x + spot.w - 6; bx += 22) {
        ctx.beginPath(); ctx.arc(bx, spot.y + spot.h / 2, 9, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(bx - 2, spot.y + 4, 4, spot.h - 8);
      }
    } else if (spot.type === 'oil_drums') {
      const drumColors = ['#dc2626', '#2563eb', '#eab308'];
      [[0.25, 0.35], [0.65, 0.35], [0.45, 0.72]].forEach(([rx, ry], idx) => {
        const dx = spot.x + spot.w * rx;
        const dy = spot.y + spot.h * ry;
        ctx.fillStyle = drumColors[idx % drumColors.length];
        ctx.beginPath(); ctx.arc(dx, dy, 14, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#090d16';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    } else if (spot.type === 'lockers') {
      ctx.fillStyle = '#334155';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 3);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      for (let lx = spot.x + 20; lx < spot.x + spot.w; lx += 20) {
        ctx.beginPath(); ctx.moveTo(lx, spot.y + 4); ctx.lineTo(lx, spot.y + spot.h - 4); ctx.stroke();
      }
    } else if (spot.type === 'fitting_stall') {
      ctx.fillStyle = p.counter;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      ctx.strokeStyle = p.wallEdge;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(spot.x + spot.w / 2, spot.y);
      ctx.lineTo(spot.x + spot.w / 2, spot.y + spot.h);
      ctx.stroke();
      // Curtain tracks on front
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(spot.x + 6, spot.y + spot.h);
      ctx.lineTo(spot.x + spot.w - 6, spot.y + spot.h);
      ctx.stroke();
    } else if (spot.type === 'clothing_carousel') {
      const ccx = spot.x + spot.w / 2;
      const ccy = spot.y + spot.h / 2;
      const colors = ['#ec4899', '#38bdf8', '#facc15', '#34d399', '#f97316', '#c084fc'];
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.ellipse(ccx + Math.cos(a) * 18, ccy + Math.sin(a) * 18, 10, 6, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath(); ctx.arc(ccx, ccy, 12, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'mannequin_stage') {
      ctx.fillStyle = '#eadbc2';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 10);
      ctx.fill();
      [0.32, 0.68].forEach(rx => {
        const mx = spot.x + spot.w * rx;
        const my = spot.y + spot.h / 2;
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.ellipse(mx, my, 12, 6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.arc(mx, my, 6, 0, Math.PI * 2); ctx.fill();
      });
    } else if (spot.type === 'checkout_lane') {
      ctx.fillStyle = p.counter;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 5);
      ctx.fill();
      // Conveyor belt & POS Register
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(spot.x + 12, spot.y + 10, spot.w * 0.55, spot.h - 20);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(spot.x + spot.w * 0.74, spot.y + 12, 22, spot.h - 24);
    } else if (spot.type === 'food_counter') {
      ctx.fillStyle = p.counter;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      // Illuminated menu header strip + serving trays
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(spot.x + 12, spot.y + 6, spot.w - 24, 6);
      ctx.fillStyle = '#f6efe2';
      [0.25, 0.5, 0.75].forEach(rx => {
        ctx.fillRect(spot.x + spot.w * rx - 10, spot.y + spot.h - 18, 20, 12);
      });
    } else if (spot.type === 'bistro_table') {
      const bcx = spot.x + spot.w / 2;
      const bcy = spot.y + spot.h / 2;
      ctx.fillStyle = p.sofaCushion;
      [[0, -24], [0, 24], [-24, 0], [24, 0]].forEach(([ox, oy]) => {
        ctx.beginPath(); ctx.arc(bcx + ox, bcy + oy, 8, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = '#eadbc2';
      ctx.beginPath(); ctx.arc(bcx, bcy, 19, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'mall_kiosk') {
      // Striped commercial mall kiosk canopy
      ctx.fillStyle = '#eadbc2';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 8);
      ctx.fill();
      ctx.fillStyle = '#be123c';
      for (let kx = spot.x + 8; kx < spot.x + spot.w - 10; kx += 22) {
        ctx.fillRect(kx, spot.y + 4, 11, spot.h - 8);
      }
      ctx.strokeStyle = '#0f1e3a';
      ctx.lineWidth = 2;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 8);
      ctx.stroke();
    } else if (spot.type === 'mall_bench') {
      ctx.fillStyle = p.woodFurnitureLight;
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 8);
      ctx.fill();
      ctx.fillStyle = p.plant;
      ctx.beginPath(); ctx.arc(spot.x + spot.w / 2, spot.y + spot.h / 2, 13, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'cart_corral') {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(spot.x + 2, spot.y + 2, spot.w - 4, spot.h - 4);
      // Nested shopping carts
      for (let cx = spot.x + 14; cx < spot.x + spot.w - 18; cx += 18) {
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(cx, spot.y + 10, 12, spot.h - 20);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(cx, spot.y + 10, 12, 4);
      }
    } else if (spot.type === 'glass_showcase') {
      ctx.fillStyle = '#1e3a5f';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.fillRect(spot.x + 8, spot.y + 8, spot.w - 16, spot.h - 16);
      ctx.fillStyle = '#f8fafc';
      for (let tx = spot.x + 22; tx < spot.x + spot.w - 20; tx += 30) {
        ctx.fillRect(tx, spot.y + 18, 16, 22);
      }
    } else if (spot.type === 'gondola_aisle') {
      ctx.fillStyle = '#334155';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      if (spot.w >= spot.h) {
        ctx.fillRect(spot.x + 4, spot.y + spot.h / 2 - 2, spot.w - 8, 4);
        const colors = ['#ef4444', '#38bdf8', '#facc15', '#34d399'];
        for (let gx = spot.x + 8, i = 0; gx < spot.x + spot.w - 14; gx += 18, i++) {
          ctx.fillStyle = colors[i % colors.length];
          ctx.fillRect(gx, spot.y + 6, 12, spot.h / 2 - 10);
          ctx.fillRect(gx, spot.y + spot.h / 2 + 4, 12, spot.h / 2 - 10);
        }
      } else {
        ctx.fillRect(spot.x + spot.w / 2 - 2, spot.y + 4, 4, spot.h - 8);
        const colors = ['#ef4444', '#38bdf8', '#facc15', '#34d399'];
        for (let gy = spot.y + 8, i = 0; gy < spot.y + spot.h - 14; gy += 18, i++) {
          ctx.fillStyle = colors[i % colors.length];
          ctx.fillRect(spot.x + 6, gy, spot.w / 2 - 10, 12);
          ctx.fillRect(spot.x + spot.w / 2 + 4, gy, spot.w / 2 - 10, 12);
        }
      }
    } else if (spot.type === 'pillar') {
      ctx.fillStyle = '#475569';
      ctx.fillRect(spot.x, spot.y, spot.w, spot.h);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.strokeRect(spot.x + 4, spot.y + 4, spot.w - 8, spot.h - 8);
    } else if (spot.type === 'elevator') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(spot.x, spot.y, spot.w, spot.h);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(spot.x + 8, spot.y + 6, spot.w - 16, spot.h - 12);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(spot.x + spot.w / 2, spot.y + 6);
      ctx.lineTo(spot.x + spot.w / 2, spot.y + spot.h - 6);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(spot.x + spot.w / 2 - 10, spot.y + spot.h - 3, 20, 3);
    } else if (spot.type === 'stairs') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(spot.x, spot.y, spot.w, spot.h);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      for (let sy = spot.y + 10; sy < spot.y + spot.h; sy += 12) {
        ctx.beginPath();
        ctx.moveTo(spot.x + 4, sy);
        ctx.lineTo(spot.x + spot.w - 4, sy);
        ctx.stroke();
      }
    } else if (spot.type === 'vending') {
      ctx.fillStyle = '#1e293b';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(spot.x + 6, spot.y + spot.h - 6, spot.w - 12, 4);
    } else if (spot.type === 'dumpster') {
      ctx.fillStyle = '#14532d';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      ctx.strokeStyle = '#166534';
      ctx.lineWidth = 2;
      ctx.strokeRect(spot.x + 6, spot.y + 6, spot.w / 2 - 8, spot.h - 12);
      ctx.strokeRect(spot.x + spot.w / 2 + 2, spot.y + 6, spot.w / 2 - 8, spot.h - 12);
    } else if (spot.type === 'crates') {
      ctx.fillStyle = '#92400e';
      ctx.fillRect(spot.x, spot.y, spot.w, spot.h);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.strokeRect(spot.x + 4, spot.y + 4, spot.w - 8, spot.h - 8);
      ctx.beginPath();
      ctx.moveTo(spot.x + 4, spot.y + 4);
      ctx.lineTo(spot.x + spot.w - 4, spot.y + spot.h - 4);
      ctx.stroke();
    } else if (spot.type === 'tires') {
      ctx.fillStyle = '#090d16';
      [0.25, 0.52, 0.78].forEach(rx => {
        ctx.beginPath();
        ctx.arc(spot.x + spot.w * rx, spot.y + spot.h / 2, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(spot.x + spot.w * rx, spot.y + spot.h / 2, 7, 0, Math.PI * 2);
        ctx.stroke();
      });
    } else if (spot.type === 'booth') {
      ctx.fillStyle = '#1e293b';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(spot.x + 5, spot.y + 5, spot.w - 10, spot.h - 10);
    } else if (spot.type === 'boiler') {
      ctx.fillStyle = '#475569';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 16);
      ctx.fill();
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(spot.x + spot.w / 2, spot.y + spot.h / 2, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(spot.x + 15, spot.y + 12);
      ctx.lineTo(spot.x + spot.w - 15, spot.y + 12);
      ctx.stroke();
    } else if (spot.type === 'generator') {
      ctx.fillStyle = '#ca8a04';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      for (let gx = spot.x + 14; gx < spot.x + spot.w - 14; gx += 16) {
        ctx.fillRect(gx, spot.y + 12, 8, spot.h - 24);
      }
    } else if (spot.type === 'escalator') {
      ctx.fillStyle = '#334155';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(spot.x + 6, spot.y + 6, spot.w - 12, spot.h / 2 - 9);
      ctx.fillRect(spot.x + 6, spot.y + spot.h / 2 + 3, spot.w - 12, spot.h / 2 - 9);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      for (let ex = spot.x + 14; ex < spot.x + spot.w - 10; ex += 14) {
        ctx.beginPath();
        ctx.moveTo(ex, spot.y + 6);
        ctx.lineTo(ex, spot.y + spot.h - 6);
        ctx.stroke();
      }
    } else if (spot.type === 'fountain') {
      const fcx = spot.x + spot.w / 2;
      const fcy = spot.y + spot.h / 2;
      ctx.fillStyle = '#94a3b8';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 28);
      ctx.fill();
      ctx.fillStyle = this.theme === 'dark' ? '#0284c7' : '#38bdf8';
      this.roundRect(ctx, spot.x + 10, spot.y + 10, spot.w - 20, spot.h - 20, 22);
      ctx.fill();
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.arc(fcx, fcy, 12, 0, Math.PI * 2);
      ctx.fill();
    } else if (spot.type === 'tent') {
      ctx.fillStyle = '#059669';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 10);
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(spot.x, spot.y);
      ctx.lineTo(spot.x + spot.w, spot.y + spot.h);
      ctx.moveTo(spot.x + spot.w, spot.y);
      ctx.lineTo(spot.x, spot.y + spot.h);
      ctx.stroke();
    } else if (spot.type === 'carousel_ride') {
      const ccx = spot.x + spot.w / 2;
      const ccy = spot.y + spot.h / 2;
      const rad = Math.min(spot.w, spot.h) / 2 - 4;
      // Scalloped outer circus canopy
      ctx.fillStyle = '#be123c';
      ctx.beginPath(); ctx.arc(ccx, ccy, rad, 0, Math.PI * 2); ctx.fill();
      const numWedges = 12;
      for (let i = 0; i < numWedges; i++) {
        const a1 = (i * 2 * Math.PI) / numWedges;
        const a2 = ((i + 1) * 2 * Math.PI) / numWedges;
        if (i % 2 === 0) {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.moveTo(ccx, ccy);
          ctx.arc(ccx, ccy, rad, a1, a2);
          ctx.closePath();
          ctx.fill();
        }
      }
      // Golden deck rim
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(ccx, ccy, rad - 6, 0, Math.PI * 2); ctx.stroke();
      // Horses on brass poles
      const horseColors = ['#ffffff', '#f43f5e', '#38bdf8', '#fbbf24', '#a855f7', '#34d399'];
      for (let i = 0; i < 6; i++) {
        const a = (i * 2 * Math.PI) / 6;
        const hx = ccx + Math.cos(a) * (rad * 0.58);
        const hy = ccy + Math.sin(a) * (rad * 0.58);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(hx, hy, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = horseColors[i];
        ctx.beginPath(); ctx.ellipse(hx, hy, 9, 5, a + Math.PI / 2, 0, Math.PI * 2); ctx.fill();
      }
      // Center mirrored pillar
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath(); ctx.arc(ccx, ccy, rad * 0.28, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(ccx, ccy, rad * 0.12, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'ferris_wheel') {
      const fwx = spot.x + spot.w / 2;
      const fwy = spot.y + spot.h / 2;
      const rad = Math.min(spot.w, spot.h) / 2 - 4;
      // Steel foundation pylons
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(spot.x + 10, spot.y + spot.h - 6); ctx.lineTo(fwx, fwy);
      ctx.moveTo(spot.x + spot.w - 10, spot.y + spot.h - 6); ctx.lineTo(fwx, fwy);
      ctx.stroke();
      // Outer ring
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(fwx, fwy, rad, 0, Math.PI * 2); ctx.stroke();
      // Spokes
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(fwx - Math.cos(a) * rad, fwy - Math.sin(a) * rad);
        ctx.lineTo(fwx + Math.cos(a) * rad, fwy + Math.sin(a) * rad);
        ctx.stroke();
      }
      // Gondola cabins
      const cabinColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const gx = fwx + Math.cos(a) * rad;
        const gy = fwy + Math.sin(a) * rad;
        ctx.fillStyle = cabinColors[i];
        this.roundRect(ctx, gx - 8, gy - 8, 16, 16, 4);
        ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(gx - 4, gy - 4, 8, 8);
      }
      // Hub
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath(); ctx.arc(fwx, fwy, 10, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'coaster_station') {
      ctx.fillStyle = '#334155';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      // Track rails
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(spot.x + 8, spot.y + spot.h * 0.4); ctx.lineTo(spot.x + spot.w - 8, spot.y + spot.h * 0.4);
      ctx.moveTo(spot.x + 8, spot.y + spot.h * 0.65); ctx.lineTo(spot.x + spot.w - 8, spot.y + spot.h * 0.65);
      ctx.stroke();
      // Yellow hazard caution stripes
      ctx.fillStyle = '#facc15';
      for (let sx = spot.x + 12; sx < spot.x + spot.w - 14; sx += 20) {
        ctx.fillRect(sx, spot.y + 6, 10, 4);
      }
    } else if (spot.type === 'coaster_car') {
      ctx.fillStyle = '#dc2626';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 10);
      ctx.fill();
      // Sleek racing stripe
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(spot.x + 6, spot.y + spot.h / 2 - 2, spot.w - 12, 4);
      // Passenger cockpit bays
      ctx.fillStyle = '#0f172a';
      const bays = [0.22, 0.5, 0.78];
      bays.forEach(rx => {
        this.roundRect(ctx, spot.x + spot.w * rx - 10, spot.y + 6, 20, spot.h - 12, 3);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(spot.x + spot.w * rx - 7, spot.y + spot.h / 2 - 2, 14, 4);
        ctx.fillStyle = '#0f172a';
      });
    } else if (spot.type === 'pirate_ship') {
      ctx.fillStyle = '#5c3a21';
      // Ship hull curved profile
      ctx.beginPath();
      ctx.moveTo(spot.x + 14, spot.y + spot.h / 2);
      ctx.lineTo(spot.x + 30, spot.y + 4);
      ctx.lineTo(spot.x + spot.w - 30, spot.y + 4);
      ctx.lineTo(spot.x + spot.w - 14, spot.y + spot.h / 2);
      ctx.lineTo(spot.x + spot.w - 30, spot.y + spot.h - 4);
      ctx.lineTo(spot.x + 30, spot.y + spot.h - 4);
      ctx.closePath();
      ctx.fill();
      // Timber deck planks
      ctx.strokeStyle = '#854d27';
      ctx.lineWidth = 1.5;
      for (let px = spot.x + 36; px < spot.x + spot.w - 36; px += 16) {
        ctx.beginPath(); ctx.moveTo(px, spot.y + 8); ctx.lineTo(px, spot.y + spot.h - 8); ctx.stroke();
      }
      // Skull medallion at center
      const pcx = spot.x + spot.w / 2;
      const pcy = spot.y + spot.h / 2;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(pcx, pcy, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(pcx, pcy - 2, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(pcx - 4, pcy + 3, 8, 4);
    } else if (spot.type === 'bumper_arena') {
      ctx.fillStyle = '#1e293b';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 8);
      ctx.fill();
      // Outer rubber cushion ring
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.strokeRect(spot.x + 4, spot.y + 4, spot.w - 8, spot.h - 8);
      // Floor charging grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      for (let bx = spot.x + 20; bx < spot.x + spot.w; bx += 24) {
        ctx.beginPath(); ctx.moveTo(bx, spot.y + 6); ctx.lineTo(bx, spot.y + spot.h - 6); ctx.stroke();
      }
    } else if (spot.type === 'bumper_car') {
      const bcx = spot.x + spot.w / 2;
      const bcy = spot.y + spot.h / 2;
      // Thick rubber bumper
      ctx.fillStyle = '#090d16';
      ctx.beginPath(); ctx.ellipse(bcx, bcy, spot.w / 2, spot.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      // Painted body
      ctx.fillStyle = (spot.id && spot.id.includes('red')) ? '#ef4444' : '#3b82f6';
      ctx.beginPath(); ctx.ellipse(bcx, bcy, spot.w / 2 - 5, spot.h / 2 - 5, 0, 0, Math.PI * 2); ctx.fill();
      // Seat cockpit & steering wheel
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(bcx, bcy + 2, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath(); ctx.arc(bcx, bcy - 5, 5, 0, Math.PI * 2); ctx.fill();
      // Antenna pole
      ctx.fillStyle = '#facc15';
      ctx.beginPath(); ctx.arc(bcx, bcy + spot.h / 2 - 6, 3, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'ticket_booth') {
      ctx.fillStyle = '#b91c1c';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      // White striped awning
      ctx.fillStyle = '#fef2f2';
      for (let tx = spot.x + 6; tx < spot.x + spot.w - 8; tx += 16) {
        ctx.fillRect(tx, spot.y + 4, 8, spot.h * 0.4);
      }
      // Service counter
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(spot.x + 8, spot.y + spot.h * 0.65, spot.w - 16, 6);
    } else if (spot.type === 'turnstiles') {
      ctx.fillStyle = '#475569';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      // Chrome metal turnstile arms
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.5;
      [0.25, 0.5, 0.75].forEach(rx => {
        const gx = spot.x + spot.w * rx;
        const gy = spot.y + spot.h / 2;
        ctx.beginPath(); ctx.arc(gx, gy, 5, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(gx - 8, gy); ctx.lineTo(gx + 8, gy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(gx, gy - 8); ctx.lineTo(gx, gy + 8); ctx.stroke();
      });
    } else if (spot.type === 'info_kiosk') {
      ctx.fillStyle = '#0284c7';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('i', spot.x + spot.w / 2, spot.y + spot.h / 2 + 5);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      this.roundRect(ctx, spot.x + 3, spot.y + 3, spot.w - 6, spot.h - 6, 10);
      ctx.stroke();
    } else if (spot.type === 'mascot_statue') {
      ctx.fillStyle = '#64748b';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 8);
      ctx.fill();
      // Polished gold mascot figure
      const mcx = spot.x + spot.w / 2;
      const mcy = spot.y + spot.h / 2;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(mcx, mcy - 6, 12, 0, Math.PI * 2); ctx.fill();
      // Mascot ears
      ctx.beginPath(); ctx.arc(mcx - 10, mcy - 16, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(mcx + 10, mcy - 16, 5, 0, Math.PI * 2); ctx.fill();
      // Star badge on pedestal
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(mcx, mcy + 10, 5, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'balloon_cart') {
      ctx.fillStyle = '#d97706';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      // Floating cluster of balloons
      const bColors = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'];
      const offsets = [[-12, -8], [0, -12], [12, -8], [-6, 6], [8, 6]];
      const bcx = spot.x + spot.w / 2;
      const bcy = spot.y + spot.h / 2;
      offsets.forEach(([ox, oy], idx) => {
        ctx.fillStyle = bColors[idx % bColors.length];
        ctx.beginPath(); ctx.arc(bcx + ox, bcy + oy, 8, 0, Math.PI * 2); ctx.fill();
      });
    } else if (spot.type === 'balloon_booth') {
      ctx.fillStyle = '#b45309';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      // Grid of target balloons on backboard
      const bColors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#ec4899'];
      let ci = 0;
      for (let bx = spot.x + 10; bx < spot.x + spot.w - 10; bx += 14) {
        for (let by = spot.y + 8; by < spot.y + spot.h - 10; by += 14) {
          ctx.fillStyle = bColors[ci++ % bColors.length];
          ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.strokeRect(spot.x + 4, spot.y + 4, spot.w - 8, spot.h - 8);
    } else if (spot.type === 'ring_toss_booth') {
      ctx.fillStyle = '#78350f';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      // Array of soda bottles
      for (let rx = spot.x + 12; rx < spot.x + spot.w - 10; rx += 14) {
        for (let ry = spot.y + 10; ry < spot.y + spot.h - 10; ry += 14) {
          ctx.fillStyle = '#059669';
          ctx.beginPath(); ctx.arc(rx, ry, 4, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(rx, ry, 6, 0, Math.PI * 2); ctx.stroke();
        }
      }
    } else if (spot.type === 'duck_pond') {
      ctx.fillStyle = '#0284c7';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 14);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      this.roundRect(ctx, spot.x + 2, spot.y + 2, spot.w - 4, spot.h - 4, 12);
      ctx.stroke();
      // Floating yellow rubber ducks
      const ducks = [[0.25, 0.4], [0.65, 0.3], [0.45, 0.7], [0.8, 0.65], [0.18, 0.72]];
      ducks.forEach(([rx, ry]) => {
        const dx = spot.x + spot.w * rx;
        const dy = spot.y + spot.h * ry;
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f97316';
        ctx.beginPath(); ctx.arc(dx + 3, dy - 1, 2, 0, Math.PI * 2); ctx.fill();
      });
    } else if (spot.type === 'popcorn_cart') {
      ctx.fillStyle = '#dc2626';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      // Glass box full of fluffy popcorn
      ctx.fillStyle = '#fef08a';
      this.roundRect(ctx, spot.x + 8, spot.y + 6, spot.w - 16, spot.h - 12, 4);
      ctx.fill();
      ctx.fillStyle = '#ca8a04';
      for (let px = spot.x + 12; px < spot.x + spot.w - 14; px += 8) {
        ctx.beginPath(); ctx.arc(px, spot.y + spot.h / 2, 3, 0, Math.PI * 2); ctx.fill();
      }
      // Red wheels
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath(); ctx.arc(spot.x + 6, spot.y + spot.h / 2, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(spot.x + spot.w - 6, spot.y + spot.h / 2, 5, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'cotton_candy_cart') {
      ctx.fillStyle = '#38bdf8';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      // Fluffy pastel pink & blue candy clouds
      const ccx = spot.x + spot.w / 2;
      const ccy = spot.y + spot.h / 2;
      ctx.fillStyle = '#f472b6';
      ctx.beginPath(); ctx.arc(ccx - 10, ccy, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#a5f3fc';
      ctx.beginPath(); ctx.arc(ccx + 10, ccy, 11, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'ice_cream_stand') {
      ctx.fillStyle = '#fef3c7';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(spot.x + 6, spot.y + 4, spot.w - 12, 6);
      // Ice cream tubs
      const tubColors = ['#f43f5e', '#a855f7', '#10b981', '#f59e0b'];
      tubColors.forEach((col, idx) => {
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(spot.x + 16 + idx * 18, spot.y + spot.h / 2 + 2, 6, 0, Math.PI * 2); ctx.fill();
      });
    } else if (spot.type === 'pretzel_cart') {
      ctx.fillStyle = '#b45309';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      ctx.fillStyle = '#fde68a';
      this.roundRect(ctx, spot.x + 8, spot.y + 6, spot.w - 16, spot.h - 12, 4);
      ctx.fill();
      // Twisted pretzel graphics
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      [0.32, 0.68].forEach(rx => {
        const prx = spot.x + spot.w * rx;
        const pry = spot.y + spot.h / 2;
        ctx.beginPath(); ctx.arc(prx, pry, 6, 0, Math.PI * 2); ctx.stroke();
      });
    } else if (spot.type === 'park_bench') {
      ctx.fillStyle = '#78350f';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      // Wood slats
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 1.5;
      for (let by = spot.y + 8; by < spot.y + spot.h; by += 9) {
        ctx.beginPath(); ctx.moveTo(spot.x + 4, by); ctx.lineTo(spot.x + spot.w - 4, by); ctx.stroke();
      }
      // Cast iron armrests
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(spot.x + 4, spot.y + 4, 5, spot.h - 8);
      ctx.fillRect(spot.x + spot.w - 9, spot.y + 4, 5, spot.h - 8);
    } else if (spot.type === 'tiered_fountain') {
      const fcx = spot.x + spot.w / 2;
      const fcy = spot.y + spot.h / 2;
      const rad = Math.min(spot.w, spot.h) / 2 - 4;
      // Stone base
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath(); ctx.arc(fcx, fcy, rad, 0, Math.PI * 2); ctx.fill();
      // Outer water pool
      ctx.fillStyle = '#0284c7';
      ctx.beginPath(); ctx.arc(fcx, fcy, rad - 6, 0, Math.PI * 2); ctx.fill();
      // Middle stone tier
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath(); ctx.arc(fcx, fcy, rad * 0.58, 0, Math.PI * 2); ctx.fill();
      // Middle water tier
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(fcx, fcy, rad * 0.48, 0, Math.PI * 2); ctx.fill();
      // Center fountain plume
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(fcx, fcy, rad * 0.22, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'park_gazebo') {
      const gcx = spot.x + spot.w / 2;
      const gcy = spot.y + spot.h / 2;
      const rad = Math.min(spot.w, spot.h) / 2 - 4;
      // Octagonal timber deck
      ctx.fillStyle = '#a16207';
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const px = gcx + Math.cos(a) * rad;
        const py = gcy + Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      // Roof struts
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(gcx, gcy);
        ctx.lineTo(gcx + Math.cos(a) * rad, gcy + Math.sin(a) * rad);
        ctx.stroke();
      }
      ctx.fillStyle = '#fef08a';
      ctx.beginPath(); ctx.arc(gcx, gcy, 8, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'operator_booth') {
      ctx.fillStyle = '#334155';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      // Glass window & console buttons
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(spot.x + 6, spot.y + 4, spot.w - 12, spot.h * 0.35);
      // Red emergency stop button
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(spot.x + spot.w / 2, spot.y + spot.h * 0.72, 4, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'boarding_ramp') {
      ctx.fillStyle = '#475569';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      // Tread plates / slats
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      for (let rx = spot.x + 8; rx < spot.x + spot.w - 6; rx += 12) {
        ctx.beginPath(); ctx.moveTo(rx, spot.y + 4); ctx.lineTo(rx, spot.y + spot.h - 4); ctx.stroke();
      }
    } else if (spot.type === 'photo_booth') {
      ctx.fillStyle = '#1e293b';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      // Red curtain
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(spot.x + 6, spot.y + spot.h - 10, spot.w - 12, 6);
      // Camera flash icon
      ctx.fillStyle = '#facc15';
      ctx.beginPath(); ctx.arc(spot.x + spot.w / 2, spot.y + spot.h * 0.4, 6, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'souvenir_stall') {
      ctx.fillStyle = '#7c2d12';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      // Shelves with colorful plushies and souvenirs
      const itemColors = ['#f43f5e', '#3b82f6', '#fbbf24', '#10b981', '#a855f7'];
      let ii = 0;
      for (let sx = spot.x + 10; sx < spot.x + spot.w - 10; sx += 14) {
        ctx.fillStyle = itemColors[ii++ % itemColors.length];
        ctx.beginPath(); ctx.arc(sx, spot.y + spot.h / 2, 5, 0, Math.PI * 2); ctx.fill();
      }
    } else if (spot.type === 'safety_lockers') {
      ctx.fillStyle = '#ca8a04';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 1.5;
      for (let lx = spot.x + 14; lx < spot.x + spot.w - 10; lx += 14) {
        ctx.strokeRect(lx - 6, spot.y + 4, 12, spot.h - 8);
      }
    } else if (spot.type === 'claw_machine') {
      ctx.fillStyle = '#9333ea';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      // Illuminated showcase window
      ctx.fillStyle = 'rgba(236, 72, 153, 0.4)';
      ctx.fillRect(spot.x + 6, spot.y + 6, spot.w - 12, spot.h - 18);
      // Mechanical claw
      const cmx = spot.x + spot.w / 2;
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cmx, spot.y + 6); ctx.lineTo(cmx, spot.y + 16); ctx.stroke();
      ctx.beginPath(); ctx.arc(cmx, spot.y + 18, 4, 0, Math.PI); ctx.stroke();
      // Joystick
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath(); ctx.arc(cmx, spot.y + spot.h - 6, 3, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'arcade_cabinets') {
      ctx.fillStyle = '#0f172a';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      // Glowing neon CRT screens
      const screens = [0.28, 0.72];
      screens.forEach(rx => {
        const scx = spot.x + spot.w * rx;
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(scx - 12, spot.y + 6, 24, spot.h - 20);
        // Illuminated marquee
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(scx - 12, spot.y + 4, 24, 3);
        // Joystick
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.arc(scx, spot.y + spot.h - 8, 3, 0, Math.PI * 2); ctx.fill();
      });
    } else if (spot.type === 'prize_counter') {
      ctx.fillStyle = '#1e293b';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      // Glass display cases with big plush toys
      ctx.fillStyle = '#f472b6';
      ctx.beginPath(); ctx.arc(spot.x + 22, spot.y + spot.h / 2, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(spot.x + spot.w - 22, spot.y + spot.h / 2, 9, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'haunted_castle') {
      ctx.fillStyle = '#1e1b4b';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 8);
      ctx.fill();
      // Gothic stone battlements
      ctx.strokeStyle = '#4338ca';
      ctx.lineWidth = 3;
      this.roundRect(ctx, spot.x + 3, spot.y + 3, spot.w - 6, spot.h - 6, 6);
      ctx.stroke();
      // Glowing eerie doorway
      ctx.fillStyle = '#a855f7';
      const hcx = spot.x + spot.w / 2;
      ctx.beginPath();
      ctx.arc(hcx, spot.y + spot.h - 8, 10, Math.PI, 0);
      ctx.fill();
    } else if (spot.type === 'ghost_cart') {
      ctx.fillStyle = '#18181b';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 6);
      ctx.fill();
      // Glowing skull headlights
      ctx.fillStyle = '#22c55e';
      ctx.beginPath(); ctx.arc(spot.x + 8, spot.y + 8, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(spot.x + spot.w - 8, spot.y + 8, 4, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'fortune_tent') {
      const fcx = spot.x + spot.w / 2;
      const fcy = spot.y + spot.h / 2;
      ctx.fillStyle = '#581c87';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 12);
      ctx.fill();
      // Golden mystical stars
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(spot.x + 12, spot.y + 12, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(spot.x + spot.w - 12, spot.y + 12, 3, 0, Math.PI * 2); ctx.fill();
      // Glowing crystal ball
      ctx.fillStyle = '#c084fc';
      ctx.beginPath(); ctx.arc(fcx, fcy, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(fcx - 3, fcy - 3, 4, 0, Math.PI * 2); ctx.fill();
    } else if (spot.type === 'cemetery_prop') {
      ctx.fillStyle = '#334155';
      this.roundRect(ctx, spot.x, spot.y, spot.w, spot.h, 4);
      ctx.fill();
      // Gravestones
      [0.25, 0.72].forEach(rx => {
        const gx = spot.x + spot.w * rx;
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(gx, spot.y + 14, 8, Math.PI, 0);
        ctx.lineTo(gx + 8, spot.y + spot.h - 6);
        ctx.lineTo(gx - 8, spot.y + spot.h - 6);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(gx - 4, spot.y + 18, 8, 2);
      });
    } else if (spot.type === 'cauldron_prop') {
      const cx = spot.x + spot.w / 2;
      const cy = spot.y + spot.h / 2;
      // Black cast-iron pot
      ctx.fillStyle = '#09090b';
      ctx.beginPath(); ctx.arc(cx, cy, spot.w / 2 - 2, 0, Math.PI * 2); ctx.fill();
      // Glowing green bubbling potion
      ctx.fillStyle = '#22c55e';
      ctx.beginPath(); ctx.arc(cx, cy, spot.w / 2 - 8, 0, Math.PI * 2); ctx.fill();
      // Bubbles
      ctx.fillStyle = '#86efac';
      ctx.beginPath(); ctx.arc(cx - 5, cy - 4, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 6, cy + 3, 3, 0, Math.PI * 2); ctx.fill();
    }

    // Highlight border if player is right next to this object
    if (flags.isNearest) {
      ctx.strokeStyle = p.highlight;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      this.roundRect(ctx, spot.x - 4, spot.y - 4, spot.w + 8, spot.h + 8, 8);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Highlight if player is currently hidden here
    if (flags.isPlayerHere) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      this.roundRect(ctx, spot.x - 3, spot.y - 3, spot.w + 6, spot.h + 6, 8);
      ctx.stroke();
    }

    // Highlight if Bot is scanning this spot right now
    if (flags.isBeingScanned) {
      const pulse = 3 + Math.sin(performance.now() * 0.015) * 2;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = pulse;
      this.roundRect(ctx, spot.x - 5, spot.y - 5, spot.w + 10, spot.h + 10, 9);
      ctx.stroke();
    }

    // Highlight if Bot Hider was revealed here
    if (flags.isBotRevealedHere) {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3.5;
      this.roundRect(ctx, spot.x - 5, spot.y - 5, spot.w + 10, spot.h + 10, 9);
      ctx.stroke();
    }

    // Checked badge for Seeker (only shown in Seeker mode, never spoils in Hider mode)
    if (flags.showCheckedBadge && spot.checked && !flags.isBotRevealedHere) {
      ctx.fillStyle = p.checkedBadgeBg;
      this.roundRect(ctx, spot.x + spot.w / 2 - 28, spot.y + spot.h / 2 - 10, 56, 20, 6);
      ctx.fill();
      ctx.fillStyle = p.checkedBadgeText;
      ctx.font = '700 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('EMPTY ✕', spot.x + spot.w / 2, spot.y + spot.h / 2 + 3.5);
    }

    ctx.restore();
  }

  drawAmbientLights(ctx) {
    const lights = this.apt.ambientLights || [];
    for (const l of lights) {
      const grad = ctx.createRadialGradient(l.x, l.y, 4, l.x, l.y, l.r);
      grad.addColorStop(0, l.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawFlashlightCone(ctx, x, y, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const grad = ctx.createRadialGradient(0, 0, 8, 0, 0, 195);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 195, -0.45, 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawSeekerBot(ctx, bot) {
    // Flashlight cone
    const defaultCone = this.theme === 'dark' ? 'rgba(245, 158, 11, 0.24)' : 'rgba(245, 158, 11, 0.16)';
    this.drawFlashlightCone(
      ctx,
      bot.x,
      bot.y,
      bot.angle,
      bot.coneColor || defaultCone
    );
    this.drawCharacter(ctx, bot.x, bot.y, bot.angle, bot.color || '#f59e0b', bot.name || 'SEEKER BOT', false, bot.isMoving);

    // Alert indicator badge above bot
    if (bot.isAlerted || (bot.alertTimer && bot.alertTimer > 0)) {
      ctx.save();
      ctx.fillStyle = bot.color || '#f59e0b';
      ctx.beginPath();
      ctx.arc(bot.x, bot.y - 28, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0b162c';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#0b162c';
      ctx.font = '900 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', bot.x, bot.y - 27);
      ctx.restore();
    }
  }

  drawCharacter(ctx, x, y, angle, color, label, isStealth, isMoving) {
    ctx.save();
    ctx.translate(x, y);

    if (isStealth) {
      ctx.globalAlpha = 0.65;
    }

    // Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(2, 3, 14, 0, Math.PI * 2);
    ctx.fill();

    // Walking swing
    const swing = isMoving ? Math.sin(performance.now() * 0.018) * 4 : 0;

    ctx.save();
    ctx.rotate(angle);

    // Shoulders & Arms (Bird's-Eye Top-Down)
    ctx.fillStyle = color;
    this.roundRect(ctx, -7, -14, 14, 28, 7);
    ctx.fill();

    // Hands
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(7 + swing, -11, 3.8, 0, Math.PI * 2);
    ctx.arc(7 - swing, 11, 3.8, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = this.theme === 'dark' ? '#0f172a' : '#1e293b';
    ctx.beginPath();
    ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Forward Direction Visor / Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(6.5, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Name Tag Pill above character
    ctx.globalAlpha = 1;
    ctx.font = '700 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    const textW = ctx.measureText(label).width + 12;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    this.roundRect(ctx, -textW / 2, -29, textW, 15, 5);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.fillText(label, 0, -18.5);

    ctx.restore();
  }

  roundRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }
}
