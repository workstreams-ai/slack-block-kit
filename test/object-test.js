import { expect } from 'chai'
import basicObject, {
  TEXT_FORMAT_PLAIN,
  TEXT_FORMAT_MRKDWN,
} from '../src/object'

const {
  text, option, optionGroup, optionGroups, confirm,
} = basicObject

describe('Basic objects test suite', () => {
  context('text object', () => {
    const textValue = 'Too many *coffees*, not enough `meals`'

    it('should render basic text with defaults', () => {
      const expectedObject = {
        type: TEXT_FORMAT_PLAIN,
        text: textValue,
      }
      expect(text(textValue)).deep.eql(expectedObject)
    })

    it('should render empty text with defaults', () => {
      const expectedObject = {
        type: TEXT_FORMAT_PLAIN,
        text: '',
      }
      expect(text('')).deep.eql(expectedObject)
    })
    it('should render with mrkdwn formatting and no emoji', () => {
      const expectedObject = {
        type: TEXT_FORMAT_MRKDWN,
        text: textValue,
      }
      expect(text(textValue, TEXT_FORMAT_MRKDWN, { emoji: true }))
        .deep.eql(expectedObject)
    })

    it('should render with plain_text, verbatim and emoji', () => {
      const expectedObject = {
        type: TEXT_FORMAT_PLAIN,
        text: textValue,
        emoji: true,
        verbatim: true,
      }
      expect(text(
        textValue, TEXT_FORMAT_PLAIN,
        { emoji: true, verbatim: true },
      )).deep.eql(expectedObject)
    })

    it('should render with plain_text, emoji false', () => {
      const expectedObject = {
        type: TEXT_FORMAT_PLAIN,
        text: textValue,
        emoji: false,
      }
      expect(text(
        textValue, TEXT_FORMAT_PLAIN,
        { emoji: false },
      )).deep.eql(expectedObject)
    })
    it('should throw error on undefined text', () => {
      expect(() => text(undefined)).to.throw('There is no `text` without textValue, even empty string is a value')
    })
    it('should throw error on Unsupported formatting values', () => {
      expect(() => text(textValue, 'some-crazy-format')).to.throw('Unsupported formatting value: \'some-crazy-format\'')
    })
    it('should throw error on Unsupported emoji value', () => {
      expect(() => text(textValue, TEXT_FORMAT_PLAIN, { emoji: 'string' })).to.throw('Emoji has to be boolean')
    })
    it('should throw error on Unsupported verbatim value', () => {
      expect(() => text(textValue, TEXT_FORMAT_PLAIN, { verbatim: 'whatever-else' })).to.throw('Verbatim has to be boolean')
    })
  })

  context('option object', () => {
    const textValue = 'Maru'
    const value = 'maru'

    it('should return valid option object', () => {
      const expectedObject = {
        text: {
          type: TEXT_FORMAT_PLAIN,
          text: textValue,
        },
        value,
      }

      expect(option(textValue, value)).deep.eql(expectedObject)
    })

    it('should throw error for undefined value', () => {
      expect(() => option(textValue, undefined)).to.throw('Value has to be a string')
    })
  })

  context('option group object', () => {
    const labelText = 'Group A'
    const optionValue = 'value-3'
    const optionText = '*this is plaintext text*'

    it('should return expected structure for one option group', () => {
      const expectedObject = {
        label: {
          type: TEXT_FORMAT_PLAIN,
          text: labelText,
        },
        options: [
          {
            text: {
              type: TEXT_FORMAT_PLAIN,
              text: optionText,
            },
            value: optionValue,
          },
        ],
      }

      const resultObject = basicObject
        .optionGroup(
          labelText,
          [option(optionText, optionValue)],
        )

      expect(resultObject).deep.eql(expectedObject)
    })
    it('should return expected structure with no options', () => {
      const expectedObject = {
        label: {
          type: TEXT_FORMAT_PLAIN,
          text: labelText,
        },
        options: [],
      }
      expect(basicObject.optionGroup(labelText)).deep.eql(expectedObject)
    })
    it('should throw an error if the label is not a string', () => {
      expect(() => optionGroup(undefined, [])).to.throw('Label has to be a string')
    })

    it('should throw an error if the options are not an array', () => {
      expect(() => optionGroup(labelText, {})).to.throw('Options have to be an array')
    })

    it('should return 2 groups of options in option_groups object', () => {
      const label2Text = 'Group B'
      const option2Value = 'value-2'
      const option2Text = '*another* plain text'
      const expectedOptionGroups = [
        optionGroup(labelText, [
          option(optionText, optionValue),
          option(option2Text, option2Value),
        ]),
        optionGroup(label2Text, [
          option(optionText, optionValue),
          option(option2Text, option2Value),
        ]),
      ]

      const expectedObject = {
        option_groups: expectedOptionGroups,
      }

      expect(optionGroups(expectedOptionGroups)).deep.eql(expectedObject)
    })

    it('should throw an error if optionGroups are not an array', () => {
      expect(() => optionGroups({})).to.throw('Option groups have to be not-empty array')
    })
  })

  context('coufirm', () => {
    const titleText = 'Are you sure you want to kill that dragon?'
    const textType = TEXT_FORMAT_MRKDWN
    const textValue = 'It won\'t be easy to drag that dragon from the bottom of the lake. *Are you sure you want to shoot it*?'
    const confirmText = 'Shoot'
    const denyText = 'Hmm better not'

    it('should create correct confirm object', () => {
      const expectedObject = {
        title: {
          type: TEXT_FORMAT_PLAIN,
          text: titleText,
        },
        text: {
          type: TEXT_FORMAT_MRKDWN,
          text: textValue,
        },
        confirm: {
          type: TEXT_FORMAT_PLAIN,
          text: confirmText,
        },
        deny: {
          type: TEXT_FORMAT_PLAIN,
          text: denyText,
        },
      }
      const result = confirm(titleText, textType, textValue, confirmText, denyText)
      expect(result).deep.eql(expectedObject)
    })

    it('should throw errors on missing params', () => {
      expect(() => confirm(undefined)).to.throw('TitleText has to be a string')
      expect(() => confirm(titleText, undefined)).to.throw('TextType has to be a string')
      expect(() => confirm(titleText, TEXT_FORMAT_PLAIN, undefined)).to.throw('TextValue has to be a string')
      expect(() => confirm(titleText, TEXT_FORMAT_PLAIN, textValue, undefined)).to.throw('ConfirmText has to be a string')
      expect(() => confirm(titleText, TEXT_FORMAT_PLAIN, textValue, confirmText, undefined)).to.throw('DenyText has to be a string')
    })
  })
})
