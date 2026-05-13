import Dexie, { Table } from 'dexie';
import { Song } from '../types';

export interface CachedWaveform {
  songId: string;
  peaks: number[];
}

export class MinilamDatabase extends Dexie {
  songs!: Table<Song & { audioBlob?: Blob }>;
  waveforms!: Table<CachedWaveform>;

  constructor() {
    super('MinilamDB');
    this.version(1).stores({
      songs: 'id, title, artist, album, genre',
      waveforms: 'songId'
    });
  }
}

export const db = new MinilamDatabase();
