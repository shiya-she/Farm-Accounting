declare module 'nativescript-sqlite' {
  class Sqlite {
    constructor(name: string);
    execSQL(sql: string, params?: unknown[]): Promise<void>;
    get(sql: string, params?: unknown[]): Promise<any>;
    all(sql: string, params?: unknown[]): Promise<any[]>;
    close(): Promise<void>;
  }
  export = Sqlite;
}
