const base = import.meta.env.BASE_URL;

const img = (name: string) => `${base}images/${name}`;

export const images = {
  bride: img("bride.png"),
  groom: img("groom.png"),
  coupleHero: img("couple-1.jpg"),
  couple1: img("couple-1.jpg"),
  couple2: img("couple-2.jpg"),
  couple3: img("couple-3.jpg"),
  cartoon: img("cartoon.png"),
  garland: img("garland.png"),
  floralCorner: img("floral-corner.png"),
  mandala: img("mandala-texture.jpg"),
  mapPreview: img("map-preview.jpg"),
};

