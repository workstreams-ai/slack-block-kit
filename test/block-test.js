import { expect } from 'chai'
import {
  section,
  divider,
  image,
  actions,
  context as blockContext,
  BLOCK_SECTION,
  BLOCK_DIVIDER,
  BLOCK_IMAGE,
  BLOCK_ACTIONS,
  BLOCK_CONTEXT,
  buildBlock,
} from '../src/block'

import {
  text, TEXT_FORMAT_MRKDWN, TEXT_FORMAT_PLAIN,
} from '../src/object'
import elements from '../src/element'

const { button, usersSelect } = elements

describe('BlockKit blocks', () => {
  context('blockBuilder', () => {
    it('should throw error on unsupported block type', () => {
      expect(() => buildBlock('checkbox')).to.throw('Unsupported block type \'checkbox\'')
    })
  })

  context('Divider', () => {
    it('should return correct divider structure', () => {
      const expectedBlock = {
        type: BLOCK_DIVIDER,
      }
      const dividerBlock = divider()
      expect(dividerBlock).deep.eql(expectedBlock)
    })
  })

  context('Section', () => {
    const actionId = 'section-action'

    it('should build section block with text, fields and accessory', () => {
      const blockId = 'B1234'
      const expectedBlock = {
        type: BLOCK_SECTION,
        block_id: blockId,
        text: {
          type: TEXT_FORMAT_PLAIN,
          text: 'simple message',
        },
        fields: [
          text('field1'),
          text('field2'),
        ],
        accessory: button(actionId, 'click me'),
      }

      const sectionBlock = section(
        text('simple message'),
        { blockId: 'B1234', fields: expectedBlock.fields, accessory: expectedBlock.accessory },
      )

      expect(sectionBlock).deep.eql(expectedBlock)
    })

    it('should throw error on invalid text object', () => {
      expect(() => section()).to.throw('Section has to contain text object')
      expect(() => section('hello')).to.throw('Section has to contain text object')
      expect(() => section({ type: 'not-supported-type', text: 'hello world' })).to.throw('Section has to contain text object')
    })
  })

  context('context', () => {
    it('should return context structure with text object', () => {
      const textObject = {
        type: TEXT_FORMAT_MRKDWN,
        text: '*hello world*',
      }
      const expectedBlock = {
        type: BLOCK_CONTEXT,
        elements: [
          textObject,
        ],
      }

      const contextBlock = blockContext([textObject])
      expect(contextBlock).deep.eql(expectedBlock)
    })
    it('should throw error on invalid elements param', () => {
      expect(() => blockContext()).to.throw('Context needs to have an array of elements')
      expect(() => blockContext([])).to.throw('Context needs to have an array of elements')
      expect(() => blockContext({})).to.throw('Context needs to have an array of elements')

      expect(() => blockContext(['hello'])).to.throw('Context elements can be only image or text')
      expect(() => blockContext([undefined, undefined])).to.throw('Context elements can be only image or text')
    })
  })

  context('actions', () => {
    it('should build basic actions with users select', () => {
      const usersSelectElement = usersSelect('my-action', 'Select user')
      const expectedBlock = {
        type: BLOCK_ACTIONS,
        elements: [
          usersSelectElement,
        ],
      }
      const actionsBlock = actions([usersSelectElement])
      expect(actionsBlock).deep.eql(expectedBlock)
    })

    it('should throw error on invalid elements', () => {
      expect(() => actions()).to.throw('Actions require an array of elements')
      expect(() => actions({})).to.throw('Actions require an array of elements')

      const actionId = 'click-me'
      const actionButtons = [
        button(actionId, 'click me'),
        button(actionId, 'click me'),
        button(actionId, 'click me'),
        button(actionId, 'click me'),
        button(actionId, 'click me'),
        button(actionId, 'click me'),
      ]
      expect(() => actions(actionButtons)).to.throw('Each actions block can have only up to 5 elements')
      expect(() => actions([elements.image('some-url', 'fake-image')])).to.throw('Invalid element for actions')
      expect(() => actions([undefined])).to.throw('Invalid element for actions')
    })
  })
  context('Image block', () => {
    const imageUrl = 'https://i.stack.imgur.com/hmazD.png'
    const altText = 'Funny lol-cat'

    it('should return minimal image block', () => {
      const expectedBlock = {
        type: BLOCK_IMAGE,
        image_url: imageUrl,
        alt_text: altText,
      }
      expect(image(imageUrl, altText))
        .deep.eql(expectedBlock)
    })

    it('should return image block with all options', () => {
      const titleText = 'Funny lol-cat'
      const expectedBlock = {
        type: BLOCK_IMAGE,
        image_url: imageUrl,
        alt_text: altText,
        title: text(titleText),
        block_id: 'B1234',
      }
      expect(image(imageUrl, altText, { titleText, blockId: 'B1234' }))
        .deep.eql(expectedBlock)
    })
  })
})
