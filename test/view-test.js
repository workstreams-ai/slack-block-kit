import { expect } from 'chai'
import { modal, VIEW_MODAL } from '../src/view'
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
    expect(() => modal()).to.throw()
  })

  it('should prevent modal with too long title', () => {
    expect(() => modal('This title is way too long to pass 24 characters limit')).to.throw()
  })

  it('should prevent modal with too long submit', () => {
    expect(() => modal(
      titleText,
      dummyBlocks,
      {
        submitText: 'This title is way too long to pass 24 characters limit',
      },
    )).to.throw()
  })

  it('should prevent modal with too long submit', () => {
    expect(() => modal(
      titleText,
      dummyBlocks,
      {
        closeText: 'This title is way too long to pass 24 characters limit',
      },
    )).to.throw()
  })

  it('should prevent no blocks case', () => {
    expect(() => modal(titleText)).to.throw()
  })

  it('should prevent more than 100 blocks case', () => {
    const tooManyBlocks = []
    for (let i = 0; i <= 100; i += 1) {
      tooManyBlocks.push(divider())
    }
    expect(() => modal(titleText, tooManyBlocks)).to.throw()
  })

  it('should prevent too large metadata', () => {
    const tooManyBlocks = []
    for (let i = 0; i <= 500; i += 1) {
      tooManyBlocks.push(divider())
    }

    expect(() => modal(titleText, dummyBlocks, {
      privateMetadata: tooManyBlocks,
    })).to.throw()
  })

  it('should prevent no-string callbackId', () => {
    expect(() => modal(titleText, dummyBlocks, {
      callbackId: true,
    })).to.throw()
  })

  it('should prevent too long callbackId', () => {
    expect(() => modal(titleText, dummyBlocks, {
      callbackId: 'aasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdsd',
    })).to.throw()
  })

  it('should prevent non-boolean clearOnClose', () => {
    expect(() => modal(titleText, dummyBlocks, {
      clearOnClose: 'abc',
    })).to.throw()
  })

  it('should prevent non-boolean clearOnClose', () => {
    expect(() => modal(titleText, dummyBlocks, {
      notifyOnClose: 'abc',
    })).to.throw()
  })

  it('should prevent hash non-string', () => {
    expect(() => modal(titleText, dummyBlocks, {
      hash: true,
    })).to.throw()
  })
  it('should prevent externalId non-string', () => {
    expect(() => modal(titleText, dummyBlocks, {
      externalId: true,
    })).to.throw()
  })
})
