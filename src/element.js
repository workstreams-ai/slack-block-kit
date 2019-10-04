import omit from 'lodash.omit'
import omitBy from 'lodash.omitby'
import isString from 'lodash.isstring'
import isUndefined from 'lodash.isundefined'

import basicObject from './object'

const { text } = basicObject

// element types
export const ELEMENT_IMAGE = 'image'
export const ELEMENT_BUTTON = 'button'

// selects
export const ELEMENT_STATIC_SELECT = 'static_select'
export const ELEMENT_EXTERNAL_SELECT = 'external_select'
export const ELEMENT_USERS_SELECT = 'users_select'
export const ELEMENT_CONVERSATIONS_SELECT = 'conversations_select'
export const ELEMENT_CHANNELS_SELECT = 'channels_select'

// multi-selects
export const ELEMENT_STATIC_MULTI_SELECT = 'multi_static_select'
export const ELEMENT_EXTERNAL_MULTI_SELECT = 'multi_external_select'
export const ELEMENT_USERS_MULTI_SELECT = 'multi_users_select'
export const ELEMENT_CONVERSATIONS_MULTI_SELECT = 'multi_conversations_select'
export const ELEMENT_CHANNELS_MULTI_SELECT = 'multi_channels_select'

export const ELEMENT_OVERFLOW = 'overflow'
export const ELEMENT_DATEPICKER = 'datepicker'
export const ELEMENT_PLAIN_TEXT_INPUT = 'plain_text_input'

/**
 * BlockKit Element specific errors
 *
 * @returns {ElementError}
 */
export class ElementError extends Error {

}
const isPresentString = (value, maxLength = 255) =>
  value && isString(value) && (maxLength === 0 || value.length <= maxLength)

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

  if (!isPresentString(placeholderText, 150)) {
    throw new ElementError('Placeholder text is required')
  }

  return true
}

const isValidImage = (imageUrl, altText) => {
  if (!isPresentString(imageUrl, 0)) {
    throw new ElementError('Image url is required as string')
  }

  if (!isPresentString(altText, 0)) {
    throw new ElementError('Alt text is required as string')
  }

  return true
}
const isValidButton = (actionId, textValue) => {
  checkActionIdProp(actionId)

  if (!isPresentString(textValue, 75)) {
    throw new ElementError('Button needs some text')
  }

  return true
}
const checkPlainInputText = ({
  placeholderText, initialValue, multiLine, minLength, maxLength,
}) => {
  if (placeholderText) {
    if (!isPresentString(placeholderText, 150)) {
      throw new ElementError('placeholderText has to be string with max length of 150 characters')
    }
  }

  if (initialValue) {
    if (!isPresentString(initialValue, 0)) {
      throw new ElementError('initialValue has to be a string')
    }
  }

  if (multiLine) {
    if (!(typeof multiLine === 'boolean')) {
      throw new ElementError('Multiline parameter has to be boolean')
    }
  }

  if (minLength) {
    if (!(typeof minLength === 'number') || minLength > 3000) {
      throw new ElementError('minLength parameter has to be number lower than 3000')
    }
  }

  if (maxLength) {
    if (!(typeof maxLength === 'number')) {
      throw new ElementError('maxLength parameter has to be a number')
    }
  }

  return true
}

const buildBasicStaticSelect = (actionId, placeholderText, options, { optionGroups }) => {
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

  return element
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
) => checkSelectRequiredProps(actionId, placeholderText)
  && buildElement(ELEMENT_STATIC_SELECT, {
    ...buildBasicStaticSelect(actionId, placeholderText, options, { optionGroups }),
    initial_option: initialOption,
    confirm,
  })

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

/**
 * PlainTextInput element
 *
 * @param {string} actionId - required actionId
 * @param {object} opts - { placeholderText, initialValue, multiLine, maxLength, minLength }
 *
 * @returns {object}
 */
const plainTextInput = (actionId, {
  placeholderText, initialValue, multiLine, minLength, maxLength,
} = {}) => checkActionIdProp(actionId)
  && checkPlainInputText({
    placeholderText, initialValue, multiLine, minLength, maxLength,
  })
  && buildElement(ELEMENT_PLAIN_TEXT_INPUT, {
    action_id: actionId,
    placeholder: placeholderText ? text(placeholderText) : undefined,
    initial_value: initialValue,
    multiline: multiLine,
    min_length: minLength,
    max_length: maxLength,
  })

/**
 * MultiStaticSelect element
 *
 * @param {string} actionId - required actionId
 * @param {string} placeholderText - required placeholder text
 * @param [{option}] options - required options objects
 * @param {object} opts - { optionGroups, initialOptions, confirm, maxSelectedItems}
 * @returns {object}
 */
const multiStaticSelect = (
  actionId,
  placeholderText,
  options, {
    optionGroups,
    initialOptions,
    confirm,
    maxSelectedItems,
  } = {},
) => checkSelectRequiredProps(actionId, placeholderText)
    && buildElement(ELEMENT_STATIC_MULTI_SELECT, {
      ...buildBasicStaticSelect(actionId, placeholderText, options, { optionGroups }),
      initial_options: initialOptions,
      confirm,
      max_selected_items: maxSelectedItems,
    })
/**
 * MultiChannelsSelect element
 *
 * @param {string} actionId - required actionId
 * @param {string} placeholderText - required placeholder text
 * @param {object} opts - { initialChannels, confirm, maxSelectedItems}
 * @returns {object}
 */
const multiChannelsSelect = (
  actionId,
  placeholderText,
  { initialChannels, confirm, maxSelectedItems } = {},
) =>
  checkSelectRequiredProps(actionId, placeholderText)
    && buildElement(ELEMENT_CHANNELS_MULTI_SELECT, {
      action_id: actionId,
      placeholder: text(placeholderText),
      initial_channels: initialChannels,
      confirm,
      max_selected_items: maxSelectedItems,
    })

/**
 * MultiConversationsSelect element
 *
 * @param {string} actionId - required actionId
 * @param {string} placeholderText - required placeholder text
 * @param {object} opts - { initialConversations, confirm, maxSelectedItems}
 * @returns {object}
 */
const multiConversationsSelect = (
  actionId,
  placeholderText,
  { initialConversations, maxSelectedItems, confirm } = {},
) => checkSelectRequiredProps(actionId, placeholderText)
  && buildElement(ELEMENT_CONVERSATIONS_MULTI_SELECT, {
    action_id: actionId,
    placeholder: text(placeholderText),
    initial_conversations: initialConversations,
    confirm,
    max_selected_items: maxSelectedItems,
  })

/**
 * MultiExternalSelect element
 *
 * @param {string} actionId - required actionId
 * @param {string} placeholderText - required placeholder text
 * @param {object} opts - { initialOptions, confirm, maxSelectedItems, minQueryLength }
 * @returns {object}
 */
const multiExternalSelect = (
  actionId,
  placeholderText,
  {
    minQueryLength,
    initialOptions,
    confirm,
    maxSelectedItems,
  } = {},
) => checkSelectRequiredProps(actionId, placeholderText)
  && buildElement(ELEMENT_EXTERNAL_MULTI_SELECT, {
    action_id: actionId,
    placeholder: text(placeholderText),
    initial_options: initialOptions,
    confirm,
    min_query_length: minQueryLength,
    max_selected_items: maxSelectedItems,
  })

/**
 * MultiUsersSelect element
 *
 * @param {string} actionId - required actionId
 * @param {string} placeholderText - required placeholder text
 * @param {object} opts - { initialUsers, confirm, maxSelectedItems}
 * @returns {object}
 */
const multiUsersSelect = (
  actionId,
  placeholderText, {
    initialUsers,
    confirm,
    maxSelectedItems,
  } = {},
) => checkSelectRequiredProps(actionId, placeholderText)
  && buildElement(ELEMENT_USERS_MULTI_SELECT, {
    action_id: actionId,
    placeholder: text(placeholderText),
    initial_users: initialUsers,
    confirm,
    max_selected_items: maxSelectedItems,
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
  plainTextInput,
  multiStaticSelect,
  multiChannelsSelect,
  multiExternalSelect,
  multiUsersSelect,
  multiConversationsSelect,
}
