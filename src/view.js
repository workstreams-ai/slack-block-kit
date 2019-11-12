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
    throw new ViewError('Provide at least 1 block')
  }

  if (blocks.length > 100) {
    throw new ViewError('Not more than 100 blocks are allowed')
  }

  if (callbackId && !isPresentString(callbackId)) {
    throw new ViewError('CallbackId has to be string with max length 255 characters')
  }

  if (externalId && !isPresentString(externalId, 0)) {
    throw new ViewError('externalId has to be a string')
  }
  let privateMetadataString

  if (privateMetadata) {
    privateMetadataString = serializePrivateMetadata(privateMetadata)

    if (!isPresentString(privateMetadataString, 3000)) {
      throw new ViewError('PrivateMmetadata max length is 3000 characters')
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
    throw new ViewError('TitleText has to be a string max 24 characters long')
  }

  if (!blocks.length) {
    throw new ViewError('Provide at least 1 block')
  }

  if (blocks.length > 100) {
    throw new ViewError('Not more than 100 blocks are allowed')
  }

  if (submitText && !isPresentString(submitText, 24)) {
    throw new ViewError('Submit text has to be string up to 24 characters long')
  }

  if (closeText && !isPresentString(closeText, 24)) {
    throw new ViewError('Submit text has to be string up to 24 characters long')
  }

  if (privateMetadata) {
    privateMetadataString = serializePrivateMetadata(privateMetadata)

    if (!isPresentString(privateMetadataString, 3000)) {
      throw new ViewError('PrivateMmetadata max length is 3000 characters')
    }
  }

  if (callbackId && !isPresentString(callbackId)) {
    throw new ViewError('CallbackId has to be string with max length 255 characters')
  }

  if (clearOnClose && !isBoolean(clearOnClose)) {
    throw new ViewError('clearOnClose has to be a boolean')
  }

  if (notifyOnClose && !isBoolean(notifyOnClose)) {
    throw new ViewError('notifyOnClose has to be a boolean')
  }

  if (hash && !isPresentString(hash, 0)) {
    throw new ViewError('hash has to be a string')
  }

  if (externalId && !isPresentString(externalId, 0)) {
    throw new ViewError('externalId has to be a string')
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

export default {
  modal,
  home,
}
