type EventName =
  | 'view_coach'
  | 'start_chat'
  | 'paywall_view'
  | 'purchase_success'
  | 'restore_success'
  | 'create_coach'
  | 'profile_updated'
  | 'onboarding_complete';

const eventLog: Record<EventName, string> = {
  view_coach: '[Analytics] view_coach',
  start_chat: '[Analytics] start_chat',
  paywall_view: '[Analytics] paywall_view',
  purchase_success: '[Analytics] purchase_success',
  restore_success: '[Analytics] restore_success',
  create_coach: '[Analytics] create_coach',
  profile_updated: '[Analytics] profile_updated',
  onboarding_complete: '[Analytics] onboarding_complete',
};

export function track(event: EventName, props?: Record<string, unknown>): void {
  if (__DEV__) {
    console.log(eventLog[event], props ?? '');
  }
}
