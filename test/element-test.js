import { expect } from 'chai'
import {
  image, button, radioButtons, checkboxes,
  staticSelect, usersSelect, channelsSelect, conversationsSelect, externalSelect,
  multiStaticSelect, multiUsersSelect, multiChannelsSelect,
  multiExternalSelect, multiConversationsSelect,
  overflow, datePicker, plainTextInput,
  ELEMENT_IMAGE, ELEMENT_BUTTON, ELEMENT_RADIO_BUTTONS, ELEMENT_CHECKBOXES,
  ELEMENT_STATIC_SELECT, ELEMENT_USERS_SELECT,
  ELEMENT_CHANNELS_SELECT, ELEMENT_CONVERSATIONS_SELECT, ELEMENT_EXTERNAL_SELECT,
  ELEMENT_EXTERNAL_MULTI_SELECT, ELEMENT_USERS_MULTI_SELECT,
  ELEMENT_CHANNELS_MULTI_SELECT, ELEMENT_STATIC_MULTI_SELECT,
  ELEMENT_CONVERSATIONS_MULTI_SELECT,
  ELEMENT_OVERFLOW, ELEMENT_DATEPICKER, ELEMENT_PLAIN_TEXT_INPUT,
} from '../src/element'

import {
  text,
  confirm,
  option,
  optionGroup,
  optionGroups,
  filter,
  TEXT_FORMAT_PLAIN,
  CONVERSATION_TYPE_PRIVATE,
  CONVERSATION_TYPE_PUBLIC,
} from '../src/object'

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
    const initialUser = 'U1234'
    const initialConversation = 'C1234'
    const initialChannel = 'C1234'

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
    context('multi selects with full options', () => {
      const maxSelectedItems = 23
      const initialOptions = [options[1], options[0]]
      const multiSelectBaseObject = {
        ...selectBaseObject,
        confirm: confirmObj,
        max_selected_items: maxSelectedItems,
      }
      it('should return static multi select menu', () => {
        const expectedObject = {
          ...multiSelectBaseObject,
          type: ELEMENT_STATIC_MULTI_SELECT,
          options,
          initial_options: initialOptions,
        }
        const result = multiStaticSelect(
          actionId,
          placeholderText,
          options,
          { confirm: confirmObj, maxSelectedItems, initialOptions },
        )

        expect(result).eql(expectedObject)
      })

      it('should return external multi select menu', () => {
        const expectedObject = {
          ...multiSelectBaseObject,
          min_query_length: 0,
          type: ELEMENT_EXTERNAL_MULTI_SELECT,
          initial_options: initialOptions,
        }
        const result = multiExternalSelect(
          actionId,
          placeholderText,
          {
            confirm: confirmObj,
            maxSelectedItems,
            initialOptions,
            minQueryLength: 0,
          },
        )
        expect(result).eql(expectedObject)
      })

      it('should return users multi select menu', () => {
        const expectedObject = {
          ...multiSelectBaseObject,
          type: ELEMENT_USERS_MULTI_SELECT,
          initial_users: [initialUser],
        }
        const result = multiUsersSelect(
          actionId,
          placeholderText,
          {
            confirm: confirmObj,
            maxSelectedItems,
            initialUsers: [initialUser],
          },
        )
        expect(result).eql(expectedObject)
      })

      it('should return conversations multi select menu', () => {
        const expectedObject = {
          ...multiSelectBaseObject,
          type: ELEMENT_CONVERSATIONS_MULTI_SELECT,
          initial_conversations: [initialConversation],
          filter: {
            include: [CONVERSATION_TYPE_PUBLIC, CONVERSATION_TYPE_PRIVATE],
            exclude_external_shared_channels: false,
            exclude_bot_users: false,
          }
        }
        const result = multiConversationsSelect(
          actionId,
          placeholderText,
          {
            confirm: confirmObj,
            maxSelectedItems,
            initialConversations: [initialConversation],
            filter: filter([CONVERSATION_TYPE_PUBLIC, CONVERSATION_TYPE_PRIVATE])
          },
        )
        expect(result).eql(expectedObject)
      })

      it('should return channels multi select menu', () => {
        const expectedObject = {
          ...multiSelectBaseObject,
          type: ELEMENT_CHANNELS_MULTI_SELECT,
          initial_channels: [initialChannel],
        }
        const result = multiChannelsSelect(
          actionId,
          placeholderText,
          {
            confirm: confirmObj,
            maxSelectedItems,
            initialChannels: [initialChannel],
          },
        )
        expect(result).eql(expectedObject)
      })
    })

    context('Default multi selects - no options', () => {
      const expectedTypes = {
        [ELEMENT_EXTERNAL_MULTI_SELECT]: multiExternalSelect,
        [ELEMENT_USERS_MULTI_SELECT]: multiUsersSelect,
        [ELEMENT_CHANNELS_MULTI_SELECT]: multiChannelsSelect,
        [ELEMENT_CONVERSATIONS_MULTI_SELECT]: multiConversationsSelect,
      }
      Object.keys(expectedTypes)
        .forEach(type => it(`should return default ${type}`, () => {
          const expectedObject = {
            type,
            ...selectBaseObject,
          }
          expect(expectedTypes[type](actionId, placeholderText)).eql(expectedObject)
        }))

      it('static select with options', () => {
        const expectedObject = {
          type: ELEMENT_STATIC_MULTI_SELECT,
          ...selectBaseObject,
          options,
        }
        expect(multiStaticSelect(actionId, placeholderText, options)).eql(expectedObject)
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

  context('Radio buttons', () => {
    const option1 = option('option 1', 'option-1')
    const option2 = option('option 2', 'option-2')

    const options = [
      option1, option2,
    ]

    it('should return basic radio buttons', () => {
      const expectedObject = {
        type: ELEMENT_RADIO_BUTTONS,
        action_id: actionId,
        options: [...options],
      }
      const rButtons = radioButtons(actionId, options)
      expect(rButtons).deep.eql(expectedObject)
    })

    it('should return fully configured radio buttons', () => {
      const expectedObject = {
        type: ELEMENT_RADIO_BUTTONS,
        action_id: actionId,
        initial_option: option1,
        options: [...options],
        confirm: confirmObj,
      }
      const rButtons = radioButtons(
        actionId, options, {
          initialOption: option1, confirm: confirmObj,
        },
      )
      expect(rButtons).deep.eql(expectedObject)
    })

    it('should throw errors', () => {
      expect(() => radioButtons()).to.throw('ActionId is required')
      expect(() => radioButtons(actionId)).to.throw('Options have to be not-empty array of options objects')
    })
  })

  context('Checkboxes', () => {
    const option1 = option('option 1', 'option-1')
    const option2 = option('option 2', 'option-2')
    const option3 = option('option 3', 'option-3')

    const options = [
      option1, option2, option3,
    ]

    it('should return basic checkboxes', () => {
      const expectedObject = {
        type: ELEMENT_CHECKBOXES,
        action_id: actionId,
        options: [...options],
      }
      expect(
        checkboxes(actionId, options),
      ).deep.eql(expectedObject)
    })

    it('should return fully configured checkboxes', () => {
      const expectedObject = {
        type: ELEMENT_CHECKBOXES,
        action_id: actionId,
        initial_options: [option1, option2],
        options: [...options],
        confirm: confirmObj,
      }

      expect(
        checkboxes(actionId, options, { initialOptions: [option1, option2], confirm: confirmObj }),
      ).deep.eql(expectedObject)
    })

    it('should throw errors', () => {
      expect(() => checkboxes()).to.throw('ActionId is required')
      expect(() => checkboxes(actionId)).to.throw('Options have to be not-empty array of options objects')
    })
  })

  context('input elements', () => {
    const validActionId = 'myActionId'
    const invalidActionId = true

    it('should return basic plain text input', () => {
      const textInput = plainTextInput(validActionId)
      const expectedObject = {
        type: ELEMENT_PLAIN_TEXT_INPUT,
        action_id: validActionId,
      }

      expect(textInput).eql(expectedObject)
    })

    it('should return full plain text input', () => {
      const inputValues = {
        placeholderText: 'your favourite serie',
        initialValue: 'Expanse',
        multiLine: true,
        minLength: 3,
        maxLength: 100,
      }

      const textInput = plainTextInput(validActionId, inputValues)
      expect(textInput).eql({
        type: ELEMENT_PLAIN_TEXT_INPUT,
        action_id: validActionId,
        initial_value: inputValues.initialValue,
        placeholder: text(inputValues.placeholderText),
        multiline: inputValues.multiLine,
        min_length: inputValues.minLength,
        max_length: inputValues.maxLength,
      })
    })

    it('should trhow an error on missing actionId', () => {
      expect(() => plainTextInput()).to.throw('ActionId is required')
      expect(() => plainTextInput(invalidActionId)).to.throw('ActionId is required')
    })

    it('should throw an error on wrong placeholder', () => {
      expect(() => plainTextInput(validActionId, { placeholderText: true })).to.throw()
    })

    it('should throw an error on wrong initialValuer', () => {
      expect(() => plainTextInput(validActionId, { initialValue: true })).to.throw()
    })

    it('should throw an error on too long minLength', () => {
      expect(() => plainTextInput(validActionId, { minLength: 123123 })).to.throw('minLength parameter has to be number lower than 3000')
    })

    it('should throw an error on too long minLength', () => {
      expect(() => plainTextInput(validActionId, { minLength: true })).to.throw('minLength parameter has to be number lower than 3000')
    })

    it('should throw an error on too long maxLength', () => {
      expect(() => plainTextInput(validActionId, { maxLength: 'some value' })).to.throw('maxLength parameter has to be a number')
    })

    it('should throw an error on wrong multiLine', () => {
      expect(() => plainTextInput(validActionId, { multiLine: 'string value' })).to.throw('Multiline parameter has to be boolean')
    })
  })
})
