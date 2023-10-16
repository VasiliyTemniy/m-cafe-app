/**
 * Contains id, translations and timestamps
 */
export class LocString {
  constructor(
    readonly id: number,
    readonly mainStr: string,
    readonly secStr?: string,
    readonly altStr?: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}

/**
 * Contains only translations itself, no id
 */
export class LocStringS {
  constructor(
    readonly mainStr: string,
    readonly secStr?: string,
    readonly altStr?: string
  ) {}
}