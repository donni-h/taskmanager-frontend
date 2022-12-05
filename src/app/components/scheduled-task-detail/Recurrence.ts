export enum Recurrence {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly"
}

export function getRecurrenceFromString(value: string): Recurrence {
  switch (value.toLowerCase()){
    case Recurrence.Daily.toString(): {
      return Recurrence.Daily
    }
    case Recurrence.Weekly.toString(): {
      return Recurrence.Weekly
    }
    case Recurrence.Monthly.toString(): {
      return Recurrence.Monthly
    }
    case Recurrence.Yearly.toString(): {
      return Recurrence.Yearly
    }
  }
  throw new Error("Illegal state")
}
