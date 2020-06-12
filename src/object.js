import isUndefined from 'lodash.isundefined'
import isBoolean from 'lodash.isboolean'
import isString from 'lodash.isstring'
import { withoutUndefined, isPresentString, typedWithoutUndefined } from './utils'

// text formats
const TEXT_FORMAT_PLAIN = 'plain_text'
const TEXT_FORMAT_MRKDWN = 'mrkdwn'

// conversation types
const CONVERSATION_TYPE_IM = 'im'
const CONVERSATION_TYPE_MPIM = 'im'
const CONVERSATION_TYPE_PRIVATE = 'private'
const CONVERSATION_TYPE_PUBLIC = 'public'

const allowedFilterIncludes = [
  CONVERSATION_TYPE_IM, CONVERSATION_TYPE_MPIM, CONVERSATION_TYPE_PUBLIC, CONVERSATION_TYPE_PRIVATE
]

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

  if (!isUndefined(emoji) && !isBoolean(emoji)) {
    throw new ObjectError('Emoji has to be boolean')
  }

  if (!isUndefined(verbatim) && !isBoolean(verbatim)) {
    throw new ObjectError('Verbatim has to be boolean')
  }


  return typedWithoutUndefined(formatting, {
    text: textValue,
    emoji: (formatting === TEXT_FORMAT_PLAIN ? emoji : undefined),
    verbatim,
  })
}

/**
 * create single option object
 *
 * @param {string} textValue - required text value
 * @param {string} value - required value
 *
 * @returns {object}
 */
const option = (textValue, value, { descriptionText, url } = {}) => {
  let description

  if (!isString(value)) {
    throw new ObjectError('Value has to be a string')
  }

  if (descriptionText) {
    if (!isPresentString(descriptionText, 75)) {
      throw new ObjectError('Option description text has to be string, max 75 characters')
    }

    description = text(descriptionText)
  }

  return withoutUndefined({
    text: text(textValue),
    value,
    description,
    url,
  })
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
 * Filter object
 *
 * @param {array}] include - one or more from CONVERSATIION_TYPE 
 * @param {boolean} excludeSharedChannels - exclude shared channels
 * @param {boolean} excludeBotUsers - exclude bot users
 *
 * @returns {object}
 */

const filter = (include, excludeExternalSharedChannels = false, excludeBotUsers = false) => {
  if (include) {
    if (!Array.isArray(include)) {
      throw new ObjectError('Filter include has to be an array')
    }
    const hasInvalidFields = include.reduce((acc, field) => !allowedFilterIncludes.includes(field), false)
    if (hasInvalidFields) {
      throw new ObjectError(`Filter include has to be one of ${allowedFilterIncludes.join(', ')}`)
    }
  }
  
  if (!isBoolean(excludeBotUsers)) {
    throw new ObjectError('Filter excludeBotUsers has to be boolean')
  }
  if (!isBoolean(excludeExternalSharedChannels)) {
    throw new ObjectError('Filter excludeExternalSharedChannels has to be boolean')
  }

  return withoutUndefined({
    include,
    exclude_external_shared_channels: excludeExternalSharedChannels,
    exclude_bot_users: excludeBotUsers,
  })
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
 * @returns {object}
 */
const confirm = (titleText, textType, textValue, confirmText, denyText) => {
  if (!isPresentString(titleText, 100)) {
    throw new ObjectError('TitleText has to be a string. max 100 characters')
  }

  if (!isString(textType)) {
    throw new ObjectError('TextType has to be a string')
  }

  if (!isPresentString(textValue, 300)) {
    throw new ObjectError('TextValue has to be a string, max 300 characters')
  }

  if (!isPresentString(confirmText, 30)) {
    throw new ObjectError('ConfirmText has to be a string, max 30 characters')
  }

  if (!isPresentString(denyText, 30)) {
    throw new ObjectError('DenyText has to be a string, max 30 charachters')
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
  filter,
}

export {
  text,
  confirm,
  option,
  filter,
  optionGroup,
  optionGroups,
  TEXT_FORMAT_PLAIN,
  TEXT_FORMAT_MRKDWN,
  CONVERSATION_TYPE_IM,
  CONVERSATION_TYPE_MPIM,
  CONVERSATION_TYPE_PUBLIC,
  CONVERSATION_TYPE_PRIVATE,
}
