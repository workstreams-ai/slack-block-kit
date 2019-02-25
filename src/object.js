import { omitBy, isUndefined, isString } from 'lodash'
// text formats
const TEXT_FORMAT_PLAIN = 'plain_text'
const TEXT_FORMAT_MRKDWN = 'mrkdwn'

/**
 * BlockKit Object specific error
 * catch it if you're interested
 * in low level errors treatment
 *
 * @returns {undefined}
 */
class ObjectError extends Error {

}

/**
 * text basic object
 *
 * @param {string} textValue - required text value
 * @param {string} formatting - text format one of `plain_text` or `mrkdwn`
 * @param {object} options - { emoji, verbatim }
 *
 * @returns {object}
 */
const text = (textValue, formatting = TEXT_FORMAT_PLAIN, { emoji, verbatim } = {}) => {
  if (!isString(textValue)) {
    throw new ObjectError(`There is no \`text\` without textValue, even empty string is a value: ${JSON.stringify(textValue)}`)
  }

  if (formatting && ![TEXT_FORMAT_PLAIN, TEXT_FORMAT_MRKDWN].includes(formatting)) {
    throw new ObjectError(`Unsupported formatting value: '${formatting}'`)
  }

  if (!isUndefined(emoji) && typeof emoji !== 'boolean') {
    throw new ObjectError('Emoji has to be boolean')
  }
  
  if (!isUndefined(verbatim) && typeof verbatim !== 'boolean') {
    throw new ObjectError('Verbatim has to be boolean')
  }


  return omitBy({
    type: formatting,
    text: textValue,
    emoji: (formatting === TEXT_FORMAT_PLAIN ? emoji : undefined),
    verbatim,
  }, isUndefined)
}

/**
 * create single option object
 *
 * @param {string} textValue - required text value
 * @param {string} value - required value
 *
 * @returns {object}
 */
const option = (textValue, value) => {
  if (!isString(value)) {
    throw new ObjectError('Value has to be a string')
  }

  return {
    text: text(textValue),
    value,
  }
}

/**
 * Single group of options
 *
 * @param {string} labelText - required label text for option group
 * @param {array} options - required array of available options
 *
 * @returns {undefined}
 */
const optionGroup = (labelText, options = []) => {
  if (!isString(labelText)) {
    throw new ObjectError('Label has to be a string')
  }

  if (!Array.isArray(options)) {
    throw new ObjectError('Options have to be an array')
  }

  return {
    label: text(labelText),
    options: [
      ...options,
    ],
  }
}

/**
 * wrapper structure around mutliple option groups
 *
 * @param {array} optionGroupObject - required array of option groups
 *
 * @returns {object}
 */
const optionGroups = (optionGroupObjects) => {
  if (!Array.isArray(optionGroupObjects) || !optionGroupObjects.length) {
    throw new ObjectError('Option groups have to be not-empty array')
  }

  return {
    option_groups: [
      ...optionGroupObjects,
    ],
  }
}

/**
 * confirm dialog
 *
 * @param {string} titleText - title of confirm dialog
 * @param {string} textType - formatting of text value
 * @param {string} textValue - value of text for confirm dialog
 * @param {string} confirmText - confirm button text value
 * @param {string} denyText - deny button text value
 *
 * @returns {undefined}
 */
const confirm = (titleText, textType, textValue, confirmText, denyText) => {
  if (!isString(titleText)) {
    throw new ObjectError('TitleText has to be a string')
  }

  if (!isString(textType)) {
    throw new ObjectError('TextType has to be a string')
  }

  if (!isString(textValue)) {
    throw new ObjectError('TextValue has to be a string')
  }

  if (!isString(confirmText)) {
    throw new ObjectError('ConfirmText has to be a string')
  }

  if (!isString(denyText)) {
    throw new ObjectError('DenyText has to be a string')
  }

  return {
    title: text(titleText),
    text: text(textValue, textType),
    confirm: text(confirmText),
    deny: text(denyText),
  }
}

export default {
  text,
  confirm,
  option,
  optionGroup,
  optionGroups,
}

export {
  TEXT_FORMAT_PLAIN,
  TEXT_FORMAT_MRKDWN,
}
