import isObject from 'lodash.isobject'
import omit from 'lodash.omit'
import { isPresentString, typedWithoutUndefined } from './utils'

import {
  text, TEXT_FORMAT_MRKDWN, TEXT_FORMAT_PLAIN,
} from './object'

import {
  ELEMENT_IMAGE,
  ELEMENT_BUTTON,
  ELEMENT_OVERFLOW,
  ELEMENT_DATEPICKER,
  ELEMENT_TIMEPICKER,
  ELEMENT_USERS_SELECT,
  ELEMENT_STATIC_SELECT,
  ELEMENT_CHANNELS_SELECT,
  ELEMENT_CONVERSATIONS_SELECT,
  ELEMENT_EXTERNAL_SELECT,
  ELEMENT_STATIC_MULTI_SELECT,
  ELEMENT_EXTERNAL_MULTI_SELECT,
  ELEMENT_USERS_MULTI_SELECT,
  ELEMENT_CONVERSATIONS_MULTI_SELECT,
  ELEMENT_CHANNELS_MULTI_SELECT,
  ELEMENT_PLAIN_TEXT_INPUT,
  ELEMENT_RADIO_BUTTONS,
  ELEMENT_CHECKBOXES,
  image as elImage,
} from './element'

// block types
const BLOCK_SECTION = 'section'
const BLOCK_DIVIDER = 'divider'
const BLOCK_IMAGE = 'image'
const BLOCK_ACTIONS = 'actions'
const BLOCK_CONTEXT = 'context'
const BLOCK_INPUT = 'input'
const BLOCK_HEADER = 'header'

const SUPPORTED_BLOCKS = [
  BLOCK_SECTION, BLOCK_DIVIDER, BLOCK_CONTEXT, BLOCK_ACTIONS, BLOCK_IMAGE, BLOCK_INPUT, BLOCK_HEADER,
]

const VALID_CONTEXT_ELEMENTS = [ELEMENT_IMAGE, TEXT_FORMAT_MRKDWN, TEXT_FORMAT_PLAIN]
const VALID_ACTIONS_ELEMENTS = [
  ELEMENT_BUTTON, ELEMENT_OVERFLOW, ELEMENT_DATEPICKER, ELEMENT_USERS_SELECT,
  ELEMENT_STATIC_SELECT, ELEMENT_CHANNELS_SELECT, ELEMENT_CONVERSATIONS_SELECT,
  ELEMENT_EXTERNAL_SELECT, ELEMENT_CHECKBOXES, ELEMENT_RADIO_BUTTONS, ELEMENT_TIME_PICKER,
]

const VALID_INPUT_ELEMENTS = [
  ELEMENT_PLAIN_TEXT_INPUT, ELEMENT_STATIC_SELECT, ELEMENT_EXTERNAL_SELECT, ELEMENT_USERS_SELECT,
  ELEMENT_CONVERSATIONS_SELECT, ELEMENT_CHANNELS_SELECT,
  ELEMENT_STATIC_MULTI_SELECT, ELEMENT_EXTERNAL_MULTI_SELECT, ELEMENT_USERS_MULTI_SELECT,
  ELEMENT_CHANNELS_MULTI_SELECT, ELEMENT_CONVERSATIONS_MULTI_SELECT, ELEMENT_USERS_MULTI_SELECT,
  ELEMENT_CHECKBOXES, ELEMENT_RADIO_BUTTONS, ELEMENT_DATEPICKER, ELEMENT_TIME_PICKER,
]

/**
 * Block specific error
 * catch it if you can
 * nothing except name
 *
 * @returns BlockError
 */
class BlockError extends Error {

}

const isValidBlockType = (type) => {
  if (!SUPPORTED_BLOCKS.includes(type)) {
    throw new BlockError(`Unsupported block type '${type}'`)
  }
  return true
}

const isValidHeaderBlock = headerText => {
  if (!isPresentString(headerText, 3000)) {
    throw new BlockError('Header block needs to have headerText')
  }
  return true
}

const isValidInputBlock = (labelText, element) => {
  if (!labelText) {
    throw new BlockError('Input block needs to have a labelText')
  }

  if (!VALID_INPUT_ELEMENTS.includes(element.type)) {
    throw new BlockError(`${element.type} is not supported input element`)
  }
  return true
}

const buildBlock = (type, props = {}) =>
  isValidBlockType(type) && typedWithoutUndefined(type, {
    ...omit(props, ['blockId']),
    block_id: props.blockId,
  })

const isValidSection = (sectionText) => {
  if (
    !sectionText
    || !isObject(sectionText)
    || ![TEXT_FORMAT_MRKDWN, TEXT_FORMAT_PLAIN].includes(sectionText.type)
  ) {
    throw new BlockError('Section has to contain text object')
  }
  // T0D0 add checks for accessory and fields elements
  return true
}

const isValidContext = (elements) => {
  if (!elements || !Array.isArray(elements) || elements.length === 0) {
    throw new Error('Context needs to have an array of elements')
  }

  if (elements.some(({ type } = {}) => !VALID_CONTEXT_ELEMENTS.includes(type))) {
    throw new Error('Context elements can be only image or text')
  }

  return true
}
const isValidActions = (elements) => {
  if (!elements || !Array.isArray(elements)) {
    throw new BlockError('Actions require an array of elements')
  }
  if (elements.length > 5) {
    throw new BlockError('Each actions block can have only up to 5 elements')
  }
  if (elements.some(({ type } = {}) => !VALID_ACTIONS_ELEMENTS.includes(type))) {
    throw new BlockError('Invalid element for actions')
  }

  return true
}


/**
 * section block
 *
 * @param {object} text - required text object
 * @param {object} opts - { blockId, fields, accessory }
 *
 * @returns {object}
 */
const section = (sectionText, { blockId, fields, accessory } = {}) =>
  isValidSection(sectionText, { blockId, fields, accessory }) && buildBlock(BLOCK_SECTION, {
    text: sectionText,
    blockId,
    fields,
    accessory,
  })

/**
 * Divider block
 *
 * @param {object} opts - { blockId }
 *
 * @returns {object}
 */
const divider = ({ blockId } = {}) => buildBlock(BLOCK_DIVIDER, { blockId })

/**
 * Context block
 * valid elements are
 * ELEMENT_IMAGE, TEXT_FORMAT_MRKDWN, TEXT_FORMAT_PLAIN
 *
 * @param {object[]} - required array of valid elements
 * @param {object} - { blockId }
 *
 * @returns {object}
 */
const context = (elements, { blockId } = {}) =>
  isValidContext(elements) && buildBlock(BLOCK_CONTEXT, { blockId, elements })

/**
 * Actions block - can contain up to 5 elements
 * Valid elements are:
 * ELEMENT_BUTTON, ELEMENT_OVERFLOW, ELEMENT_DATEPICKER, ELEMENT_USERS_SELECT,
 * ELEMENT_STATIC_SELECT, ELEMENT_CHANNELS_SELECT,
 * ELEMENT_CONVERSATIONS_SELECT, ELEMENT_EXTERNAL_SELECT
 *
 * @param {{object[]} elements - required array of valid elements
 * @param {object} opts - { blockId }
 *
 * @returns {object}
 */
const actions = (elements, { blockId } = {}) =>
  isValidActions(elements) && buildBlock(BLOCK_ACTIONS, { blockId, elements })

/**
 * Image block
 *
 * @param {string} imageUrl - required image Url
 * @param {string} altText - required alt text
 * @param {object} opts - { titleText, blockId }
 *
 * @returns {object}
 */
const image = (imageUrl, altText, { titleText, blockId } = {}) => buildBlock(BLOCK_IMAGE, {
  ...elImage(imageUrl, altText),
  blockId,
  title: titleText ? text(titleText) : undefined,
})

/**
 * Inputblock
 *
 * @param {string} labelText - required label text
 * @param {object} element - required input element
 * @param {object} opts - { hintText, blockId, optional }
 *
 * @returns {object}
 */
const input = (labelText, element, { hintText, blockId, optional } = {}) =>
  isValidInputBlock(labelText, element) && buildBlock(BLOCK_INPUT, {
    label: text(labelText),
    element,
    blockId,
    hint: hintText ? text(hintText) : undefined,
    optional,
  })

/**
 * HeaderBlock
 *
 * @param {string} headerText - required header text
 * @param {object} opts - { blockId }
 *
 * @returns {object}
 */
const header = (headerText,{ blockId } = {}) =>
  isValidHeaderBlock(headerText) && buildBlock(BLOCK_HEADER, {
    text: text(headerText),
    blockId,
  })



export default {
  section,
  divider,
  image,
  actions,
  context,
  input,
  header,
}

export {
  section,
  divider,
  image,
  actions,
  context,
  input,
  header,
  buildBlock,
  BLOCK_SECTION,
  BLOCK_DIVIDER,
  BLOCK_IMAGE,
  BLOCK_ACTIONS,
  BLOCK_CONTEXT,
  BLOCK_INPUT,
  BLOCK_HEADER,
}
