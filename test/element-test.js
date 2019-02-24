import { expect } from 'chai'
import element, {
  ELEMENT_IMAGE, ELEMENT_BUTTON, ELEMENT_STATIC_SELECT, ELEMENT_USERS_SELECT,
  ELEMENT_CHANNELS_SELECT, ELEMENT_CONVERSATIONS_SELECT, ELEMENT_EXTERNAL_SELECT,
  ELEMENT_OVERFLOW, ELEMENT_DATEPICKER,
} from '../src/element'

import basicObject, {
  TEXT_FORMAT_PLAIN,
} from '../src/object'

const {
  image, button, staticSelect, usersSelect, channelsSelect, conversationsSelect,
  externalSelect, overflow, datePicker,
} = element

const {
  text, confirm, option, optionGroup, optionGroups,
} = basicObject

describe('Elements test suit', () => {
  const actionId = 'my-action'
  const confirmObj = confirm(
    'Are you sure',
    TEXT_FORMAT_PLAIN,
    'This is one-way only action',
    'Yes do it',
    'Ahh no please',
  )

  context('image', () => {
    const imageUrl = 'https://i.stack.imgur.com/hmazD.png'
    const altText = 'Funny lol-cat'

    it('should construct valid image element', () => {
      const expectedObject = {
        type: ELEMENT_IMAGE,
        image_url: imageUrl,
        alt_text: altText,
      }

      expect(image(imageUrl, altText)).deep.eql(expectedObject)
    })

    it('should throw an error if imageUrl is missing', () => {
      const expectedErrorMessage = 'Image url is required as string'
      const expectedFailingCalls = [
        () => image(undefined, altText),
        () => image(true, altText),
        () => image({}, altText),
      ]

      expectedFailingCalls.forEach(fn => expect(fn).to.throw(expectedErrorMessage))
    })

    it('should throw an error if altText is missing', () => {
      const expectedErrorMessage = 'Alt text is required as string'
      const expectedFailingCalls = [
        () => image(imageUrl),
        () => image(imageUrl, true),
        () => image(imageUrl, {}),
      ]

      expectedFailingCalls.forEach(fn => expect(fn).to.throw(expectedErrorMessage))
    })
  })

  context('Button element', () => {
    const textValue = 'Click me'
    const urlValue = 'https://google.com'
    const value = 'my-value'

    it('should return valid minimal button object', () => {
      const expectedObject = {
        type: ELEMENT_BUTTON,
        text: text(textValue),
        action_id: actionId,
      }
      expect(button(actionId, textValue)).deep.eql(expectedObject)
    })

    it('should return valid full extended button object', () => {
      const expectedObject = {
        type: ELEMENT_BUTTON,
        text: text(textValue),
        action_id: actionId,
        url: urlValue,
        value,
        confirm: confirmObj,
      }

      expect(
        button(actionId, textValue, { url: urlValue, value, confirm: confirmObj }),
      ).deep.eql(expectedObject)
    })

    it('should return valid partial extended button object', () => {
      const expectedObject = {
        type: ELEMENT_BUTTON,
        text: text(textValue),
        action_id: actionId,
        value,
      }

      expect(
        button(actionId, textValue, { value, confirm: undefined, url: undefined }),
      ).deep.eql(expectedObject)
    })

    it('should throw error on missing actionId', () => {
      const expectedErrorMessage = 'ActionId is required'
      const expectedFailingCalls = [
        () => button(undefined, textValue),
        () => button(true, textValue),
        () => button({}, textValue),
      ]

      expectedFailingCalls.forEach(fn => expect(fn).to.throw(expectedErrorMessage))
    })

    it('should throw error on missing text Value', () => {
      const expectedErrorMessage = 'Button needs some text'
      const expectedFailingCalls = [
        () => button(actionId),
        () => button(actionId, true),
        () => button(actionId, {}),
      ]

      expectedFailingCalls.forEach(fn => expect(fn).to.throw(expectedErrorMessage))
    })
  })
  context('Select menus', () => {
    const placeholderText = 'Choose option'
    const options = [
      option('option 1', 'option-1'),
      option('option 2', 'option-2'),
    ]
    const optionGroupsObj = optionGroups([
      optionGroup('Group 1', options),
      optionGroup('Group 2', options),
    ])
    const initialOption = options[0]
    const selectBaseObject = {
      action_id: actionId,
      placeholder: text(placeholderText),
    }
    context('Static select element', () => {
      const basicExpectedObj = {
        ...selectBaseObject,
        type: ELEMENT_STATIC_SELECT,
      }

      it('should return basic static select element with options', () => {
        const expectedObject = {
          ...basicExpectedObj,
          options,
        }
        expect(staticSelect(actionId, placeholderText, options)).deep.eql(expectedObject)
      })

      it('should return optionGroups instead of options', () => {
        const expectedObject = {
          ...basicExpectedObj,
          ...optionGroupsObj,
        }
        expect(staticSelect(
          actionId, placeholderText, undefined, { optionGroups: optionGroupsObj },
        )).eql(expectedObject)
        expect(staticSelect(
          actionId, placeholderText, options, { optionGroups: optionGroupsObj },
        )).eql(expectedObject)
      })

      it('should return obj with initial value and confirm', () => {
        const expectedObject = {
          ...basicExpectedObj,
          options,
          initial_option: initialOption,
          confirm: confirmObj,
        }
        expect(
          staticSelect(actionId, placeholderText, options, { initialOption, confirm: confirmObj }),
        ).deep.eql(expectedObject)
      })

      it('should trow an error with options are missing', () => {
        expect(() => staticSelect(actionId, placeholderText)).to.throw('Options have to be not-empty array of options objects')
      })

      it('should throw an error on missing actionId', () => {
        expect(() => staticSelect(undefined, placeholderText, options)).to.throw('ActionId is required')
      })
      it('should throw an error on missing placeholderText', () => {
        expect(() => staticSelect(actionId, null, options)).to.throw('Placeholder text is required')
      })
    })

    context('external select element', () => {
      const basicExpectedObj = {
        ...selectBaseObject,
        type: ELEMENT_EXTERNAL_SELECT,
      }
      const minQueryLength = 0

      it('should return minimal external select object', () => {
        const expectedObject = {
          ...basicExpectedObj,
        }
        expect(externalSelect(actionId, placeholderText)).deep.eql(expectedObject)
      })

      it('should return external select with all opts', () => {
        const expectedObject = {
          ...basicExpectedObj,
          initial_option: initialOption,
          min_query_length: minQueryLength,
          confirm: confirmObj,
        }

        expect(externalSelect(actionId, placeholderText, {
          initialOption, minQueryLength, confirm: confirmObj,
        })).deep.eql(expectedObject)
      })

      it('should throw an error on missing actionId', () => {
        expect(() => externalSelect(undefined, placeholderText)).to.throw('ActionId is required')
      })
      it('should throw an error on missing placeholderText', () => {
        expect(() => externalSelect(actionId, null)).to.throw('Placeholder text is required')
      })
    })

    context('Users select element', () => {
      const initialUser = 'U1234'
      const basicExpectedObj = {
        ...selectBaseObject,
        type: ELEMENT_USERS_SELECT,
      }
      it('should return basic users select', () => {
        expect(usersSelect(actionId, placeholderText)).deep.eql(basicExpectedObj)
      })

      it('should return users select with all opts', () => {
        const expectedObject = {
          ...basicExpectedObj,
          confirm: confirmObj,
          initial_user: initialUser,
        }

        expect(usersSelect(actionId, placeholderText, { confirm: confirmObj, initialUser }))
          .deep.eql(expectedObject)
      })
    })

    context('Conversations select', () => {
      const initialConversation = 'C1234'
      const basicExpectedObj = {
        ...selectBaseObject,
        type: ELEMENT_CONVERSATIONS_SELECT,
      }
      it('should return basic conversations select', () => {
        expect(conversationsSelect(actionId, placeholderText)).deep.eql(basicExpectedObj)
      })

      it('should return conversations select with all opts', () => {
        const expectedObject = {
          ...basicExpectedObj,
          confirm: confirmObj,
          initial_conversation: initialConversation,
        }

        expect(
          conversationsSelect(
            actionId, placeholderText,
            { confirm: confirmObj, initialConversation },
          ),
        ).deep.eql(expectedObject)
      })
    })

    context('Channels select', () => {
      const initialChannel = 'C1234'
      const basicExpectedObj = {
        ...selectBaseObject,
        type: ELEMENT_CHANNELS_SELECT,
      }
      it('should return basic channels select', () => {
        expect(channelsSelect(actionId, placeholderText)).deep.eql(basicExpectedObj)
      })

      it('should return channels select with all opts', () => {
        const expectedObject = {
          ...basicExpectedObj,
          confirm: confirmObj,
          initial_channel: initialChannel,
        }

        expect(channelsSelect(actionId, placeholderText, { confirm: confirmObj, initialChannel }))
          .deep.eql(expectedObject)
      })
    })
    context('overflow menu', () => {
      it('should return basic overflow menu', () => {
        expect(overflow(actionId, options)).deep.eql({
          type: ELEMENT_OVERFLOW,
          action_id: actionId,
          options,
        })
      })
      it('should return overflow menu with confirm', () => {
        expect(overflow(actionId, options, { confirm: confirmObj })).deep.eql({
          type: ELEMENT_OVERFLOW,
          action_id: actionId,
          options,
          confirm: confirmObj,
        })
      })

      it('should throw error on missing actionId', () => {
        expect(() => overflow(undefined, options)).to.throw('ActionId is required')
      })
      it('should throw error on missing options', () => {
        expect(() => overflow(actionId)).to.throw('Options have to be not-empty array of options objects')
        expect(() => overflow(actionId, {})).to.throw('Options have to be not-empty array of options objects')
        expect(() => overflow(actionId, [])).to.throw('Options have to be not-empty array of options objects')
      })
    })
  })
  context('Date elements', () => {
    context('date picker element', () => {
      const placeholderText = 'Pick a date'

      it('should return basic datePicker', () => {
        const expectedObject = {
          type: ELEMENT_DATEPICKER,
          action_id: actionId,
        }
        expect(datePicker(actionId)).eql(expectedObject)
      })

      it('should return advanced  datePicker', () => {
        const initialDate = '2019-01-18'
        const expectedObject = {
          type: ELEMENT_DATEPICKER,
          action_id: actionId,
          placeholder: text(placeholderText),
          initial_date: initialDate,
          confirm: confirmObj,
        }

        expect(
          datePicker(actionId, { placeholderText, initialDate, confirm: confirmObj }),
        ).deep.eql(expectedObject)
      })
      it('should throw error on missing actionId', () => {
        expect(() => datePicker(undefined)).to.throw('ActionId is required')
      })
    })
  })
})
