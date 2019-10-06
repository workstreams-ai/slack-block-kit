import isString from 'lodash.isstring'
import omitBy from 'lodash.omitby'
import isUndefined from 'lodash.isundefined'

export const isPresentString = (value, maxLength = 255) =>
  value && isString(value) && (maxLength === 0 || value.length <= maxLength)

export const typedWithoutUndefined = (type, props) => omitBy({
  type,
  ...props,
}, isUndefined)
