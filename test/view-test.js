import { expect } from 'chai'
import {
  modal, home, workflowStep,
  VIEW_MODAL, VIEW_HOME, VIEW_WORKFLOW_STEP,
  VIEW_TITLE_TEXT_ERROR,
  VIEW_NO_BLOCKS_ERROR,
  VIEW_TOO_MANY_BLOCKS_ERROR,
  VIEW_SUBMIT_TEXT_ERROR,
  VIEW_CLOSE_TEXT_ERROR,
  VIEW_PMD_TOO_LONG_ERROR,
  VIEW_CALLBACK_ID_ERROR,
  VIEW_CLEAR_ON_CLOSE_ERROR,
  VIEW_NOTIFY_ON_CLOSE_ERROR,
  VIEW_HASH_ERROR,
  VIEW_EXTERNAL_ID_ERROR,
} from '../src/view'
import { text } from '../src/object'
import { divider } from '../src/block'

describe('Modal view', () => {
  const titleText = 'Test modal'
  const submitText = 'Do it'
  const closeText = 'Don\'t do it'
  const dummyBlocks = [
    divider(),
  ]
  const privateMetadataObject = {
    some: 'data',
    other: 'values',
  }
  const callbackId = 'validCallbackId'
  const clearOnClose = true
  const notifyOnClose = true
  const hash = 'my-little-hash'
  const externalId = 'external-id'

  context('Modal view', () => {
    it('should produce basic modal without options', () => {
      const expectedObject = {
        type: VIEW_MODAL,
        title: text(titleText),
        blocks: dummyBlocks,
      }

      expect(modal(titleText, dummyBlocks)).eql(expectedObject)
    })

    it('should produce full modal with all options', () => {
      const expectedObject = {
        type: VIEW_MODAL,
        title: text(titleText),
        blocks: dummyBlocks,
        private_metadata: JSON.stringify(privateMetadataObject),
        submit: text(submitText),
        close: text(closeText),
        callback_id: callbackId,
        clear_on_close: clearOnClose,
        notify_on_close: notifyOnClose,
        hash,
        external_id: externalId,
      }

      const result = modal(
        titleText,
        dummyBlocks,
        {
          submitText,
          closeText,
          privateMetadata: privateMetadataObject,
          callbackId,
          clearOnClose,
          notifyOnClose,
          hash,
          externalId,
        },
      )

      expect(result).eql(expectedObject)
    })

    it('should produce full modal with all string private metadata', () => {
      const expectedObject = {
        type: VIEW_MODAL,
        title: text(titleText),
        blocks: dummyBlocks,
        private_metadata: 'someVar=someValue',
      }

      const result = modal(
        titleText,
        dummyBlocks,
        {
          privateMetadata: 'someVar=someValue',
        },
      )

      expect(result).eql(expectedObject)
    })

    it('should prevent modal without title', () => {
      expect(() => modal()).to.throw(VIEW_TITLE_TEXT_ERROR)
    })

    it('should prevent modal with too long title', () => {
      expect(() => modal('This title is way too long to pass 24 characters limit')).to.throw(VIEW_TITLE_TEXT_ERROR)
    })

    it('should prevent modal with too long submit', () => {
      expect(() => modal(
        titleText,
        dummyBlocks,
        {
          submitText: 'This title is way too long to pass 24 characters limit',
        },
      )).to.throw(VIEW_SUBMIT_TEXT_ERROR)
    })

    it('should prevent modal with too long close', () => {
      expect(() => modal(
        titleText,
        dummyBlocks,
        {
          closeText: 'This title is way too long to pass 24 characters limit',
        },
      )).to.throw(VIEW_CLOSE_TEXT_ERROR)
    })

    it('should prevent no blocks case', () => {
      expect(() => modal(titleText)).to.throw(VIEW_NO_BLOCKS_ERROR)
    })

    it('should prevent more than 100 blocks case', () => {
      const tooManyBlocks = []
      for (let i = 0; i <= 100; i += 1) {
        tooManyBlocks.push(divider())
      }
      expect(() => modal(titleText, tooManyBlocks)).to.throw(VIEW_TOO_MANY_BLOCKS_ERROR)
    })

    it('should prevent too large metadata', () => {
      const tooManyBlocks = []
      for (let i = 0; i <= 500; i += 1) {
        tooManyBlocks.push(divider())
      }

      expect(() => modal(titleText, dummyBlocks, {
        privateMetadata: tooManyBlocks,
      })).to.throw(VIEW_PMD_TOO_LONG_ERROR)
    })

    it('should prevent no-string callbackId', () => {
      expect(() => modal(titleText, dummyBlocks, {
        callbackId: true,
      })).to.throw(VIEW_CALLBACK_ID_ERROR)
    })

    it('should prevent too long callbackId', () => {
      expect(() => modal(titleText, dummyBlocks, {
        callbackId: 'aasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdsd',
      })).to.throw(VIEW_CALLBACK_ID_ERROR)
    })

    it('should prevent non-boolean clearOnClose', () => {
      expect(() => modal(titleText, dummyBlocks, {
        clearOnClose: 'abc',
      })).to.throw(VIEW_CLEAR_ON_CLOSE_ERROR)
    })

    it('should prevent non-boolean clearOnClose', () => {
      expect(() => modal(titleText, dummyBlocks, {
        notifyOnClose: 'abc',
      })).to.throw(VIEW_NOTIFY_ON_CLOSE_ERROR)
    })

    it('should prevent hash non-string', () => {
      expect(() => modal(titleText, dummyBlocks, {
        hash: true,
      })).to.throw(VIEW_HASH_ERROR)
    })
    it('should prevent externalId non-string', () => {
      expect(() => modal(titleText, dummyBlocks, {
        externalId: true,
      })).to.throw(VIEW_EXTERNAL_ID_ERROR)
    })
  })

  context('Home view', () => {
    it('should produce basic modal without options', () => {
      const expectedObject = {
        type: VIEW_HOME,
        blocks: dummyBlocks,
      }
      expect(home(dummyBlocks)).eql(expectedObject)
    })

    it('should produce full home view with all options', () => {
      const expectedObject = {
        type: VIEW_HOME,
        blocks: dummyBlocks,
        private_metadata: JSON.stringify(privateMetadataObject),
        callback_id: callbackId,
        external_id: externalId,
      }

      const result = home(
        dummyBlocks,
        {
          privateMetadata: privateMetadataObject,
          callbackId,
          externalId,
        },
      )

      expect(result).eql(expectedObject)
    })
    it('should prevent no blocks', () => {
      expect(() => home([])).to.throw(VIEW_NO_BLOCKS_ERROR)
      expect(() => home()).to.throw(VIEW_NO_BLOCKS_ERROR)
    })
    it('should prevent no-string callbackId', () => {
      expect(() => home(dummyBlocks, {
        callbackId: true,
      })).to.throw(VIEW_CALLBACK_ID_ERROR)
    })

    it('should prevent too long callbackId', () => {
      expect(() => home(dummyBlocks, {
        callbackId: 'aasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdsd',
      })).to.throw(VIEW_CALLBACK_ID_ERROR)
    })

    it('should prevent externalId non-string', () => {
      expect(() => home(dummyBlocks, {
        externalId: true,
      })).to.throw(VIEW_EXTERNAL_ID_ERROR)
    })

    it('should prevent more than 100 blocks case', () => {
      const tooManyBlocks = []
      for (let i = 0; i <= 100; i += 1) {
        tooManyBlocks.push(divider())
      }
      expect(() => home(tooManyBlocks)).to.throw(VIEW_TOO_MANY_BLOCKS_ERROR)
    })


    it('should prevent too large metadata', () => {
      const tooManyBlocks = []
      for (let i = 0; i <= 500; i += 1) {
        tooManyBlocks.push(divider())
      }

      expect(() => home(dummyBlocks, {
        privateMetadata: tooManyBlocks,
      })).to.throw(VIEW_PMD_TOO_LONG_ERROR)
    })
  })

  context('Workflow step', () => {
     it('should produce basic workflow step without options', () => {
      const expectedObject = {
        type: VIEW_WORKFLOW_STEP,
        blocks: dummyBlocks,
      }

      expect(workflowStep(dummyBlocks)).eql(expectedObject)
    })
    
    it('should produce full workflow step with all options', () => {
      const expectedObject = {
        type: VIEW_WORKFLOW_STEP,
        blocks: dummyBlocks,
        private_metadata: JSON.stringify(privateMetadataObject),
        callback_id: callbackId,
      }

      const result = workflowStep(
        dummyBlocks,
        {
          privateMetadata: privateMetadataObject,
          callbackId,
        },
      )

      expect(result).eql(expectedObject)
    })

    it('should prevent more than 100 blocks case', () => {
      const tooManyBlocks = []
      for (let i = 0; i <= 100; i += 1) {
        tooManyBlocks.push(divider())
      }
      expect(() => workflowStep(tooManyBlocks)).to.throw(VIEW_TOO_MANY_BLOCKS_ERROR)
    })
    
    it('should prevent no blocks case', () => {
      expect(() => workflowStep([])).to.throw(VIEW_NO_BLOCKS_ERROR)
    })

    it('should prevent too long metadata', () => {
      const tooManyBlocks = []
      for (let i = 0; i <= 500; i += 1) {
        tooManyBlocks.push(divider())
      }

      expect(() => workflowStep(dummyBlocks, { privateMetadata: { tooManyBlocks }})).to.throw(VIEW_PMD_TOO_LONG_ERROR)
    })
    
    it('should prevent no-string callbackId', () => {
      expect(() => workflowStep(dummyBlocks, {
        callbackId: true,
      })).to.throw(VIEW_CALLBACK_ID_ERROR)
    })

  })
})
