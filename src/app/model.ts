export class User {
  id?: string;
  username?: string;
  password?: string;
  token?: string;
}

export class FoodEntryResponse {
  foodList?: FoodEntry []
}

export class FoodEntry {
  id?: number;
  foodEntry?: string;
  foodEntryDate?: Date;
  updatedTime?: string
  foodTagList?: FoodTag []
}

export class FoodTag {
  id?: number;
  foodTagName?: string;
  foodTagColor?: string;
  activeInd?: boolean
}

export class CreationFoodTag {
  foodTagName?: string;
  foodTagColor?: string;
}

export class UserRegister {
  email?: string;
  password?: string;
}

export class Alert {
  id?: string;
  type?: AlertType;
  message?: string;
  autoClose?: boolean;
  keepAfterRouteChange?: boolean;
  fade?: boolean;

  constructor(init?: Partial<Alert>) {
    Object.assign(this, init);
  }
}

export enum AlertType {
  Success,
  Error,
  Info,
  Warning
}

export class AlertOptions {
  id?: string;
  autoClose?: boolean;
  keepAfterRouteChange?: boolean;
}

export const tagLookUp = new Map<string, string>([
  ['Blue', 'bg-info'],
  ['Red', 'bg-danger'],
  ['Green', 'bg-success'],
  ['Yellow', 'bg-warning'],
  ['Black', 'bg-dark']
]);
