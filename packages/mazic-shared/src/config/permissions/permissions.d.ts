export interface Permissions {
  administration: Administration
  habit: Habit
  habit_check_in: HabitCheckIn
  dashboard: Dashboard
}

export interface Administration {
  all_actions: string
}

export interface Dashboard {
  view: string
}

export interface Habit {
  view: string
  create: string
  update: string
  delete: string
}

export interface HabitCheckIn {
  save: string
  delete: string
}
