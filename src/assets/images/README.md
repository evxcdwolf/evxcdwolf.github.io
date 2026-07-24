# Image Assets Directory (`src/assets/images/`)

Place all your background wallpapers and foxgirl PNG mascot images in this directory.

## How to add new images to the project pools:

### 1. Add your files to `src/assets/images/`
For example:
- `my_custom_wallpaper.jpg`
- `my_custom_foxgirl.png`

### 2. Import them in `src/data/defaultProfile.ts`
```typescript
import myCustomWallpaper from '../assets/images/my_custom_wallpaper.jpg';
import myCustomFoxgirl from '../assets/images/my_custom_foxgirl.png';
```

### 3. Add them to the pool arrays in `src/data/defaultProfile.ts`:

**Background Wallpapers Pool:**
```typescript
export const DEFAULT_BACKGROUND_CONFIG: BackgroundConfig = {
  activeBgUrl: myCustomWallpaper,
  backgroundPool: [
    myCustomWallpaper,
    cyberpunkBg1,
    darkSkyBg2,
    monochromeBg,
  ],
  randomBgOnReload: true,
  overlayOpacity: 0.65,
  blurAmount: 2,
};
```

**Mascot Stickers Pool:**
```typescript
export const DEFAULT_STICKER_CONFIG: StickerConfig = {
  enabled: true,
  presetId: 'fox-4',
  imageUrl: myCustomFoxgirl,
  stickerPool: [
    myCustomFoxgirl,
    foxgirlImage4,
    foxgirlImage1,
    foxgirlImage2,
    foxgirlImage3,
  ],
  randomOnReload: true,
  // ...
};
```
