// types.ts
// Geçerli kategori tipleri
export type PlaceCategory =
  | "library"
  | "mosque"
  | "cafe"
  | "market"
  | "park"
  | "atm"
  | "bank"
  | "bus_stop"
  | "post_office"
  | "square"
  | "faculty"
  | "administration"
  | "institute"
  | "restaurant"
  | "hospital"
  | "police"
  | "institute"
  | "health_center";

// Tek bir mekanın yapısını tanımlayan tip
export type Place = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: PlaceCategory; // Kategoriyi daha güvenli hale getirdik
  description: string;
  image: string;
  maps_link: string;
  address?: string;
};

// Sayfalar arası veri aktarımı için navigasyon tipleri
export type RootStackParamList = {
  Splash: undefined;
  Home: { ar?: boolean };
  Onboarding: undefined;
  PlaceDetail: { place: Place; dist: number };
  AllPlaces: undefined;
};
