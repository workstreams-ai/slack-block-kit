import isObject from 'lodash.isobject'
import isBoolean from 'lodash.isboolean'
import { text } from './object'
import { isPresentString, typedWithoutUndefined } from './utils'

/**
 * BlockKit View specific errors
 *
 * @returns {ViewError}
 */
export class ViewError extends Error {

}

export const VIEW_MODAL = 'modal'
export const VIEW_HOME = 'home'
export const VIEW_WORKFLOW_STEP = 'workflow_step'

export const VIEW_TITLE_TEXT_ERROR = 'TitleText has to be a string max 24 characters long'
export const VIEW_NO_BLOCKS_ERROR = 'Provide at least 1 block'
export const VIEW_TOO_MANY_BLOCKS_ERROR = 'Not more than 100 blocks are allowed'
export const VIEW_SUBMIT_TEXT_ERROR = 'Submit text has to be string up to 24 characters long'
export const VIEW_CLOSE_TEXT_ERROR = 'Close text has to be string up to 24 characters long'
export const VIEW_PMD_TOO_LONG_ERROR = 'PrivateMetadata max length is 3000 characters'
export const VIEW_CALLBACK_ID_ERROR = 'CallbackId has to be string with max length 255 characters'
export const VIEW_CLEAR_ON_CLOSE_ERROR = 'clearOnClose has to be a boolean'
export const VIEW_NOTIFY_ON_CLOSE_ERROR = 'notifyOnClose has to be a boolean'
export const VIEW_HASH_ERROR = 'hash has to be a string'
export const VIEW_EXTERNAL_ID_ERROR = 'externalId has to be a string'

const serializePrivateMetadata = (privateMetadata) => {
  if (isObject(privateMetadata)) {
    return JSON.stringify(privateMetadata)
  }
  return privateMetadata
}

/**
 * home tab view
 *
 * @param [block] blocks - required 1-100 blocks
 * @param {object} opts - { privateMetadata, callbackId, externalId }
 *
 * @returns {object}
 */

export const home = (
  blocks = [],
  {
    privateMetadata,
    callbackId,
    externalId,
  } = {},
) => {
  if (!blocks.length) {
    throw new ViewError(VIEW_NO_BLOCKS_ERROR)
  }

  if (blocks.length > 100) {
    throw new ViewError(VIEW_TOO_MANY_BLOCKS_ERROR)
  }

  if (callbackId && !isPresentString(callbackId)) {
    throw new ViewError(VIEW_CALLBACK_ID_ERROR)
  }

  if (externalId && !isPresentString(externalId, 0)) {
    throw new ViewError(VIEW_EXTERNAL_ID_ERROR)
  }
  let privateMetadataString

  if (privateMetadata) {
    privateMetadataString = serializePrivateMetadata(privateMetadata)

    if (!isPresentString(privateMetadataString, 3000)) {
      throw new ViewError(VIEW_PMD_TOO_LONG_ERROR)
    }
  }

  return typedWithoutUndefined(VIEW_HOME, {
    blocks,
    private_metadata: privateMetadataString || undefined,
    callback_id: callbackId,
    external_id: externalId,
  })
}

/**
 * modal view
 *
 * @param string titleText - required title text
 * @param [block] blocks - required 1-100 blocks
 * @param {object} opts - { closeText, submitText,
 *  privateMetadata, callbackId, clearOnClose, notifyOnClose, hash, externalId }
 *
 * @returns {object}
 */

export const modal = (
  titleText,
  blocks = [],
  {
    closeText,
    submitText,
    privateMetadata,
    callbackId,
    clearOnClose,
    notifyOnClose,
    hash,
    externalId,
  } = {},
) => {
  let privateMetadataString

  if (!isPresentString(titleText, 24)) {
    throw new ViewError(VIEW_TITLE_TEXT_ERROR)
  }

  if (!blocks.length) {
    throw new ViewError(VIEW_NO_BLOCKS_ERROR)
  }

  if (blocks.length > 100) {
    throw new ViewError(VIEW_TOO_MANY_BLOCKS_ERROR)
  }

  if (submitText && !isPresentString(submitText, 24)) {
    throw new ViewError(VIEW_SUBMIT_TEXT_ERROR)
  }

  if (closeText && !isPresentString(closeText, 24)) {
    throw new ViewError(VIEW_CLOSE_TEXT_ERROR)
  }

  if (privateMetadata) {
    privateMetadataString = serializePrivateMetadata(privateMetadata)

    if (!isPresentString(privateMetadataString, 3000)) {
      throw new ViewError(VIEW_PMD_TOO_LONG_ERROR)
    }
  }

  if (callbackId && !isPresentString(callbackId)) {
    throw new ViewError(VIEW_CALLBACK_ID_ERROR)
  }

  if (clearOnClose && !isBoolean(clearOnClose)) {
    throw new ViewError(VIEW_CLEAR_ON_CLOSE_ERROR)
  }

  if (notifyOnClose && !isBoolean(notifyOnClose)) {
    throw new ViewError(VIEW_NOTIFY_ON_CLOSE_ERROR)
  }

  if (hash && !isPresentString(hash, 0)) {
    throw new ViewError(VIEW_HASH_ERROR)
  }

  if (externalId && !isPresentString(externalId, 0)) {
    throw new ViewError(VIEW_EXTERNAL_ID_ERROR)
  }

  return typedWithoutUndefined(VIEW_MODAL, {
    title: text(titleText),
    blocks,
    submit: submitText ? text(submitText) : undefined,
    close: closeText ? text(closeText) : undefined,
    private_metadata: privateMetadataString || undefined,
    callback_id: callbackId,
    clear_on_close: clearOnClose,
    notify_on_close: notifyOnClose,
    hash,
    external_id: externalId,
  })
}

export const workflowStep = (
  blocks,
  {
    privateMetadata,
    callbackId,
  } = {},
) => {
  let privateMetadataString
  
  if (!blocks.length) {
    throw new ViewError(VIEW_NO_BLOCKS_ERROR)
  }

  if (blocks.length > 100) {
    throw new ViewError(VIEW_TOO_MANY_BLOCKS_ERROR)
  }

  if (privateMetadata) {
    privateMetadataString = serializePrivateMetadata(privateMetadata)

    if (!isPresentString(privateMetadataString, 3000)) {
      throw new ViewError(VIEW_PMD_TOO_LONG_ERROR)
    }
  }

  if (callbackId && !isPresentString(callbackId)) {
    throw new ViewError(VIEW_CALLBACK_ID_ERROR)
  }

  return typedWithoutUndefined(VIEW_WORKFLOW_STEP, {
    blocks,
    private_metadata: privateMetadataString || undefined,
    callback_id: callbackId,
  })
}

export default {
  modal,
  home,
  workflowStep,
}
