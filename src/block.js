import {
  isObject, omit, omitBy, isUndefined,
} from 'lodash'

import object, {
  TEXT_FORMAT_MRKDWN, TEXT_FORMAT_PLAIN,
} from './object'

import element, {
  ELEMENT_IMAGE,
  ELEMENT_BUTTON,
  ELEMENT_OVERFLOW,
  ELEMENT_DATEPICKER,
  ELEMENT_USERS_SELECT,
  ELEMENT_STATIC_SELECT,
  ELEMENT_CHANNELS_SELECT,
  ELEMENT_CONVERSATIONS_SELECT,
  ELEMENT_EXTERNAL_SELECT,
} from './element'

// block types
const BLOCK_SECTION = 'section'
const BLOCK_DIVIDER = 'divider'
const BLOCK_IMAGE = 'image'
const BLOCK_ACTIONS = 'actions'
const BLOCK_CONTEXT = 'context'

const SUPPORTED_BLOCKS = [
  BLOCK_SECTION, BLOCK_DIVIDER, BLOCK_CONTEXT, BLOCK_ACTIONS, BLOCK_IMAGE,
]

const VALID_CONTEXT_ELEMENTS = [ELEMENT_IMAGE, TEXT_FORMAT_MRKDWN, TEXT_FORMAT_PLAIN]
const VALID_ACTIONS_ELEMENTS = [
  ELEMENT_BUTTON, ELEMENT_OVERFLOW, ELEMENT_DATEPICKER, ELEMENT_USERS_SELECT,
  ELEMENT_STATIC_SELECT, ELEMENT_CHANNELS_SELECT, ELEMENT_CONVERSATIONS_SELECT,
  ELEMENT_EXTERNAL_SELECT,
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

const buildBlock = (type, props = {}) =>
  isValidBlockType(type) && omitBy({
    type,
    block_id: props.blockId,
    ...omit(props, ['blockId']),
  }, isUndefined)

const isValidSection = (text) => {
  if (
    !text
    || !isObject(text)
    || ![TEXT_FORMAT_MRKDWN, TEXT_FORMAT_PLAIN].includes(text.type)
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
const section = (text, { blockId, fields, accessory } = {}) =>
  isValidSection(text, { blockId, fields, accessory }) && buildBlock(BLOCK_SECTION, {
    text,
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
  ...element.image(imageUrl, altText),
  blockId,
  title: titleText ? object.text(titleText) : undefined,
})

export default {
  section,
  divider,
  image,
  actions,
  context,
}

export {
  buildBlock,
  BLOCK_SECTION,
  BLOCK_DIVIDER,
  BLOCK_IMAGE,
  BLOCK_ACTIONS,
  BLOCK_CONTEXT,
}
