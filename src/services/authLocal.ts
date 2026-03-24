import type { LoginResponse } from './auth';
import { storage } from './storage';

export type StoredUser = LoginResponse;

export function setSolicitanteId(id: string) {
  storage.set('idSolicitante', id);
}
export function setCurrentUser(u: StoredUser) {
  storage.setJSON('currentUser', u);
}
export function logout() {
  storage.remove('idSolicitante');
  storage.remove('currentUser');
}