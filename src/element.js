import omit from 'lodash.omit'
import omitBy from 'lodash.omitby'
import isString from 'lodash.isstring'
import isUndefined from 'lodash.isundefined'

import basicObject from './object'

const { text } = basicObject

// element types
export const ELEMENT_IMAGE = 'image'
export const ELEMENT_BUTTON = 'button'
export const ELEMENT_STATIC_SELECT = 'static_select'
export const ELEMENT_EXTERNAL_SELECT = 'external_select'
export const ELEMENT_USERS_SELECT = 'users_select'
export const ELEMENT_CONVERSATIONS_SELECT = 'conversations_select'
export const ELEMENT_CHANNELS_SELECT = 'channels_select'
export const ELEMENT_OVERFLOW = 'overflow'
export const ELEMENT_DATEPICKER = 'datepicker'

/**
 * BlockKit Element specific errors
 *
 * @returns {ElementError}
 */
export class ElementError extends Error {

}
const isPresentString = value =>
  value && isString(value)

const checkActionIdProp = (actionId) => {
  if (!isPresentString(actionId)) {
    throw new ElementError('ActionId is required')
  }
  return true
}

const checkOptionsArray = (options) => {
  if (!Array.isArray(options) || !options.length) {
    throw new ElementError('Options have to be not-empty array of options objects')
  }

  return true
}

const checkSelectRequiredProps = (actionId, placeholderText) => {
  checkActionIdProp(actionId)

  if (!isPresentString(placeholderText)) {
    throw new ElementError('Placeholder text is required')
  }

  return true
}

const isValidImage = (imageUrl, altText) => {
  if (!isPresentString(imageUrl)) {
    throw new ElementError('Image url is required as string')
  }

  if (!isPresentString(altText)) {
    throw new ElementError('Alt text is required as string')
  }

  return true
}
const isValidButton = (actionId, textValue) => {
  checkActionIdProp(actionId)

  if (!isPresentString(textValue)) {
    throw new ElementError('Button needs some text')
  }

  return true
}

const buildElement = (type, props) => omitBy({
  type,
  ...props,
}, isUndefined)

/**
 * image element
 *
 * @param {string} imageUrl - required valid url for image
 * @Param {string} altText - required alt text for image
 *
 * @returns {object}
 */
const image = (imageUrl, altText) =>
  isValidImage(imageUrl, altText) && buildElement(ELEMENT_IMAGE, {
    type: ELEMENT_IMAGE,
    image_url: imageUrl,
    alt_text: altText,
  })


/**
 * button element
 *
 * @param {string} actionId - required actionId
 * @param {string} textValue - required text for button
 * @param {object} options - { url, value, confirm }
 *
 * @returns {object}
 */
const button = (actionId, textValue, { url, value, confirm } = {}) =>
  isValidButton(actionId, textValue) && buildElement(ELEMENT_BUTTON, {
    action_id: actionId,
    text: text(textValue),
    url,
    value,
    confirm,
  })

/**
 * Static select menu
 *
 * @param {string} actionId - required actionId
 * @param {string} placeholderText - required placeholder text
 * @param {array} options - required options
 * @param {object} opts - { optionGroups, initialOption, confirm }
 *
 * @returns {object}
 */
const staticSelect = (
  actionId, placeholderText, options,
  { optionGroups, initialOption, confirm } = {},
) => {
  checkSelectRequiredProps(actionId, placeholderText)

  if (!optionGroups) {
    checkOptionsArray(options)
  }

  let element = {
    action_id: actionId,
    placeholder: text(placeholderText),
    options,
  }

  if (optionGroups) {
    // T0D0 add check for optionGroups
    element = {
      ...omit(element, ['options']),
      ...optionGroups,
    }
  }

  return buildElement(ELEMENT_STATIC_SELECT, {
    ...element,
    initial_option: initialOption,
    confirm,
  })
}

/**
 * External select menu
 *
 * @param {string} actionId - required actionId
 * @param {string} placeholderText - required placeholder text
 * @param {object} opts - { initialOption, minQueryLength, confirm }
 *
 * @returns {object}
 */
const externalSelect = (
  actionId, placeholderText,
  { initialOption, minQueryLength, confirm } = {},
) => checkSelectRequiredProps(actionId, placeholderText)
  && buildElement(ELEMENT_EXTERNAL_SELECT, {
    action_id: actionId,
    placeholder: text(placeholderText),
    initial_option: initialOption,
    min_query_length: minQueryLength,
    confirm,
  })

/**
 * Users select menu
 *
 * @param {string} actionId - required actionId
 * @param {string} placeholderText - required placeholder text
 * @param {object} opts - { initialUser, confirm }
 *
 * @returns {object}
 */
const usersSelect = (actionId, placeholderText, { initialUser, confirm } = {}) =>
  checkSelectRequiredProps(actionId, placeholderText) && buildElement(ELEMENT_USERS_SELECT, {
    action_id: actionId,
    placeholder: text(placeholderText),
    initial_user: initialUser,
    confirm,
  })

/**
 * Conversations select menu
 *
 * @param {string} actionId - required actionId
 * @param {string} placeholderText - required placeholder text
 * @param {object} opts - { initialConversation, confirm }
 *
 * @returns {object}
 */
const conversationsSelect = (actionId, placeholderText, { initialConversation, confirm } = {}) =>
  checkSelectRequiredProps(actionId, placeholderText)
    && buildElement(ELEMENT_CONVERSATIONS_SELECT, {
      action_id: actionId,
      placeholder: text(placeholderText),
      initial_conversation: initialConversation,
      confirm,
    })

/**
 * Channels select menu
 *
 * @param {string} actionId - required actionId
 * @param {string} placeholderText - required placeholder text
 * @param {object} opts - { initialChannel, confirm }
 *
 * @returns {object}
 */
const channelsSelect = (actionId, placeholderText, { initialChannel, confirm } = {}) =>
  checkSelectRequiredProps(actionId, placeholderText)
    && buildElement(ELEMENT_CHANNELS_SELECT, {
      action_id: actionId,
      placeholder: text(placeholderText),
      initial_channel: initialChannel,
      confirm,
    })

/**
 * Overflow menu element
 *
 * @param {string} actionId - required actionId
 * @param {array} options - required array of option objects
 * @param {object} opts - { confirm }
 *
 * @returns {object}
 */
const overflow = (actionId, options, { confirm } = {}) =>
  checkActionIdProp(actionId)
    && checkOptionsArray(options)
    && buildElement(ELEMENT_OVERFLOW, {
      action_id: actionId,
      options,
      confirm,
    })

/**
 * DatePicker element
 *
 * @param {string} actionId - required actionId
 * @param {object} opts - { placeholderText, initialDate, confirm }
 *
 * @returns {object}
 */
const datePicker = (actionId, { placeholderText, initialDate, confirm } = {}) =>
  checkActionIdProp(actionId)
    && buildElement(ELEMENT_DATEPICKER, {
      type: ELEMENT_DATEPICKER,
      action_id: actionId,
      placeholder: placeholderText ? text(placeholderText) : undefined,
      initial_date: initialDate,
      confirm,
    })

export default {
  image,
  button,
  staticSelect,
  externalSelect,
  usersSelect,
  conversationsSelect,
  channelsSelect,
  overflow,
  datePicker,
}
