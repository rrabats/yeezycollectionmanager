export type ShoeModel = '350 V2' | '350 V2 CMPCT'

export interface Shoe {
  /** adidas style code, unique per shoe (restocks reuse the original code) */
  id: string
  /** colorway name, e.g. "Black Reflective" */
  name: string
  model: ShoeModel
  releaseYear: number
  /** false for shoes that never had a general release */
  released: boolean
  /** code of the reflective / non-reflective version of the same colorway, if there is one */
  counterpart?: string
  /** path relative to the app base, e.g. "images/shoes/FU9007.webp" */
  image: string
}
