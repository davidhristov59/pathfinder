import { Platform } from 'react-native';
import { Coordinate } from './distance';

export interface Activity {
  id: number;
  title: string | null;
  date: string;
  distance: number;
  duration: number;
  coordinates: Coordinate[];
}

// ── Web in-memory fallback ──────────────────────────────────────────
// expo-sqlite on web requires SharedArrayBuffer (special COOP/COEP headers).
// Since Metro's dev server doesn't set those headers, we use a simple
// in-memory store on web so the app can still load and be previewed.

let webActivities: Activity[] = [];
let webNextId = 1;

const webDB = {
  async init() {},
  async save(data: Omit<Activity, 'id' | 'title'>): Promise<number> {
    const id = webNextId++;
    webActivities.push({ ...data, id, title: null });
    return id;
  },
  async getAll(): Promise<Activity[]> {
    return [...webActivities].sort((a, b) => b.date.localeCompare(a.date));
  },
  async getById(id: number): Promise<Activity | null> {
    return webActivities.find((a) => a.id === id) ?? null;
  },
  async remove(id: number) {
    webActivities = webActivities.filter((a) => a.id !== id);
  },
  async updateTitle(id: number, title: string) {
    const a = webActivities.find((a) => a.id === id);
    if (a) a.title = title;
  },
};

// ── Native SQLite implementation ────────────────────────────────────

let nativeDB: any = null;

function getDB() {
  if (!nativeDB) {
    const SQLite = require('expo-sqlite');
    nativeDB = SQLite.openDatabaseSync('pathfinder.db');
  }
  return nativeDB;
}

const sqliteDB = {
  async init() {
    await getDB().execAsync(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT DEFAULT NULL,
        date TEXT NOT NULL,
        distance REAL NOT NULL DEFAULT 0,
        duration INTEGER NOT NULL DEFAULT 0,
        coordinates TEXT NOT NULL
      );
    `);
  },
  async save(data: Omit<Activity, 'id' | 'title'>): Promise<number> {
    const result = await getDB().runAsync(
      'INSERT INTO activities (date, distance, duration, coordinates) VALUES (?, ?, ?, ?)',
      data.date,
      data.distance,
      data.duration,
      JSON.stringify(data.coordinates)
    );
    return result.lastInsertRowId;
  },
  async getAll(): Promise<Activity[]> {
    const rows = await getDB().getAllAsync('SELECT * FROM activities ORDER BY date DESC');
    return rows.map((row: any) => ({
      ...row,
      coordinates: JSON.parse(row.coordinates) as Coordinate[],
    }));
  },
  async getById(id: number): Promise<Activity | null> {
    const row: any = await getDB().getFirstAsync('SELECT * FROM activities WHERE id = ?', id);
    if (!row) return null;
    return {
      ...row,
      coordinates: JSON.parse(row.coordinates) as Coordinate[],
    };
  },
  async remove(id: number) {
    await getDB().runAsync('DELETE FROM activities WHERE id = ?', id);
  },
  async updateTitle(id: number, title: string) {
    await getDB().runAsync('UPDATE activities SET title = ? WHERE id = ?', title, id);
  },
};

// ── Pick implementation based on platform ───────────────────────────

const impl = Platform.OS === 'web' ? webDB : sqliteDB;

export async function initDB(): Promise<void> {
  await impl.init();
}

export async function saveActivity(data: Omit<Activity, 'id' | 'title'>): Promise<number> {
  return impl.save(data);
}

export async function getAllActivities(): Promise<Activity[]> {
  return impl.getAll();
}

export async function getActivityById(id: number): Promise<Activity | null> {
  return impl.getById(id);
}

export async function deleteActivity(id: number): Promise<void> {
  await impl.remove(id);
}

export async function updateActivityTitle(id: number, title: string): Promise<void> {
  await impl.updateTitle(id, title);
}