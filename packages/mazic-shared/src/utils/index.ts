import { z } from 'zod'

export const getShapeBySchema = (schema: z.ZodObject<any> | z.ZodEffects<any>) => {
  let shape = {}
  if (schema instanceof z.ZodEffects) {
    shape = schema._def.schema.shape
  }
  if (schema instanceof z.ZodObject) {
    shape = schema.shape
  }
  return shape
}

export const getDefaultsBySchema = (schema: z.ZodObject<any> | z.ZodEffects<any>, data?: any) => {
  const shape = getShapeBySchema(schema)
  return Object.fromEntries(
    Object.entries(shape).map(([key, value]) => {
      if (typeof data?.[key] !== 'undefined') {
        return [key, data[key]]
      }
      if (value instanceof z.ZodDefault) {
        return [key, value._def.defaultValue()]
      }
      return [key, undefined]
    })
  )
}
