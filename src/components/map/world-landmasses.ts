/*
 * SVG vector paths representing major world landmasses on an 800x420 equirectangular canvas.
 * Projection formula: x = (lon + 180) * (800 / 360), y = (90 - lat) * (420 / 180).
 * Curated to provide geometric grounding for territory beacons in dark mode.
 */

export interface Landmass {
  id: string;
  name: string;
  path: string;
}

export const WORLD_LANDMASSES: Landmass[] = [
  // North America (Alaska, Canada, USA, Mexico, Central America)
  {
    id: 'north-america',
    name: 'North America',
    path: `
      M 33 63
      C 40 50, 70 45, 95 48
      C 120 40, 155 35, 195 42
      C 220 38, 250 48, 268 62
      C 278 75, 270 95, 258 108
      C 255 125, 245 138, 236 148
      C 230 160, 215 175, 205 188
      C 198 198, 185 205, 178 200
      C 165 192, 160 178, 150 165
      C 142 152, 130 145, 125 130
      C 118 115, 110 98, 95 88
      C 75 80, 50 82, 33 75
      Z
    `.replace(/\s+/g, ' ').trim(),
  },
  // Greenland
  {
    id: 'greenland',
    name: 'Greenland',
    path: `
      M 265 24
      C 290 18, 330 20, 345 32
      C 355 45, 340 68, 325 78
      C 305 85, 280 72, 270 58
      C 260 45, 255 32, 265 24
      Z
    `.replace(/\s+/g, ' ').trim(),
  },
  // South America
  {
    id: 'south-america',
    name: 'South America',
    path: `
      M 226 195
      C 245 190, 275 192, 295 208
      C 315 220, 325 242, 320 265
      C 310 290, 290 320, 275 350
      C 265 370, 250 395, 242 388
      C 238 375, 245 345, 246 325
      C 240 300, 232 270, 225 245
      C 218 220, 215 202, 226 195
      Z
    `.replace(/\s+/g, ' ').trim(),
  },
  // Europe (Western, Central, Eastern, Scandinavia, British Isles)
  {
    id: 'europe',
    name: 'Europe',
    path: `
      M 375 125
      C 370 108, 382 92, 395 90
      C 408 85, 415 70, 425 58
      C 435 48, 452 45, 460 55
      C 468 70, 455 85, 450 95
      C 462 102, 478 100, 490 105
      C 498 120, 485 135, 470 140
      C 455 142, 440 148, 428 142
      C 415 146, 400 148, 388 140
      C 378 135, 375 128, 375 125
      Z
    `.replace(/\s+/g, ' ').trim(),
  },
  // British Isles (UK & Ireland)
  {
    id: 'british-isles',
    name: 'British Isles',
    path: `
      M 378 82
      C 385 75, 395 76, 396 85
      C 395 95, 386 102, 380 98
      C 375 92, 374 85, 378 82
      Z
    `.replace(/\s+/g, ' ').trim(),
  },
  // Africa & Madagascar
  {
    id: 'africa',
    name: 'Africa',
    path: `
      M 368 145
      C 390 140, 430 142, 455 148
      C 475 155, 495 170, 508 190
      C 515 210, 505 235, 495 255
      C 485 280, 470 310, 455 330
      C 445 342, 432 345, 425 335
      C 412 315, 405 285, 400 260
      C 395 240, 380 230, 365 220
      C 350 205, 348 185, 355 168
      C 358 155, 362 148, 368 145
      Z
    `.replace(/\s+/g, ' ').trim(),
  },
  // Madagascar
  {
    id: 'madagascar',
    name: 'Madagascar',
    path: `
      M 498 250
      C 504 245, 510 252, 508 268
      C 505 280, 498 285, 495 278
      C 494 268, 495 255, 498 250
      Z
    `.replace(/\s+/g, ' ').trim(),
  },
  // Asia (Northern, Central, East Asia, Middle East, India, Southeast Asia)
  {
    id: 'asia',
    name: 'Asia',
    path: `
      M 485 105
      C 520 85, 580 65, 650 62
      C 710 60, 770 70, 795 85
      C 790 105, 760 120, 740 135
      C 730 150, 715 168, 700 178
      C 685 188, 665 192, 650 205
      C 635 220, 620 225, 610 215
      C 600 200, 585 185, 575 170
      C 560 185, 545 200, 535 195
      C 525 185, 530 165, 520 152
      C 505 145, 490 135, 485 120
      Z
    `.replace(/\s+/g, ' ').trim(),
  },
  // Japan Archipelago
  {
    id: 'japan',
    name: 'Japan',
    path: `
      M 708 118
      C 715 110, 725 120, 722 135
      C 718 148, 708 152, 704 145
      C 702 135, 704 125, 708 118
      Z
    `.replace(/\s+/g, ' ').trim(),
  },
  // Australia & New Zealand
  {
    id: 'australia',
    name: 'Australia',
    path: `
      M 655 248
      C 680 238, 720 242, 742 258
      C 755 272, 748 295, 735 310
      C 718 322, 690 325, 668 318
      C 650 305, 642 285, 645 268
      C 648 255, 650 250, 655 248
      Z
    `.replace(/\s+/g, ' ').trim(),
  },
  // New Zealand
  {
    id: 'new-zealand',
    name: 'New Zealand',
    path: `
      M 765 305
      C 772 298, 780 305, 778 318
      C 774 328, 765 330, 762 322
      C 760 315, 762 308, 765 305
      Z
    `.replace(/\s+/g, ' ').trim(),
  },
  // Indonesian Archipelago
  {
    id: 'indonesia-archipelago',
    name: 'Maritime Southeast Asia',
    path: `
      M 615 218
      C 630 215, 655 220, 675 222
      C 668 230, 645 228, 630 228
      C 620 226, 615 222, 615 218
      Z
    `.replace(/\s+/g, ' ').trim(),
  },
];
