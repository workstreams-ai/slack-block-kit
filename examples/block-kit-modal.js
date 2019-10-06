import createExampleBlocks from './example-blocks'
import { modal } from '../src/view'

const modalPayload = modal(
  'Example modal',
  createExampleBlocks(),
  {
    closeText: 'Not now',
    submitText: 'Got it',
    privateMetadata: {
      someVar: 'value',
      otherVar: true,
    },
    callbackId: 'my-callback-id',
    clearOnClose: true,
    notifyOnClose: true,
    externalId: 'unique-external-id',
  },
)
// eslint-disable-next-line no-console
console.log(JSON.stringify(modalPayload))
