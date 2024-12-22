declare module "local-vault/src/adapter/idb";
declare module "local-vault/src/adapter/local-storage";
declare module "local-vault/src/adapter/session-storage";
declare module "local-vault/src/adapter/cookie";
declare module "local-vault/src/adapter/opfs";
declare module "local-vault/src/adapter/opfs-worker";
declare module "@lo-fi/local-vault";

declare module "local-vault/src" {
  export function supportsWebAuthn(): boolean;
  export function supportsWAUserVerification(): boolean;
  export function rawStorage(type: string): Storage;
  export function connect(options: ConnectOptions): Promise<Vault>;
  export function removeAll(): void;
  export function listLocalIdentities(): Promise<string[]>;
  export function removeLocalAccount(identity: string): Promise<void>;
}

declare module "@lo-fi/local-data-lock" {
  export function clearLockKeyCache(): void;
}

interface Storage {
  storageType: string;
  has(key: string): Promise<boolean>;
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<boolean>;
  keys(): Promise<string[]>;
  entries(): Promise<[string, unknown][]>;
  remove(key: string): Promise<boolean>;
}

interface ConnectOptions {
  addNewVault?: boolean;
  storageType: string;
  vaultID?: string;
  keyOptions?: KeyOptions;
  signal?: AbortSignal;
}

interface KeyOptions {
  relyingPartyName: string;
  username: string;
  displayName: string;
}

interface Vault {
  id: string;
  storageType: string;
  lock(): void;
  addPasskey(options: KeyOptions): Promise<boolean>;
  resetLockKey(options: KeyOptions): Promise<void>;
  entries(): Promise<[string, unknown][]>;
  set(key: string, value: unknown): Promise<boolean>;
  has(key: string): Promise<boolean>;
  get(key: string): Promise<string>;
  remove(key: string): Promise<boolean>;
}
