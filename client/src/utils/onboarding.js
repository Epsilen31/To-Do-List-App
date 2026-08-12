import { STORAGE_KEYS } from '../constants';

export function hasCompletedOnboarding() {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE) === 'true';
}

export function completeOnboarding() {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
}
