import createExampleBlocks from './example-blocks'
import { view, block, element, object } from '../src'

const { input } = block
const { plainTextInput, checkboxes, radioButtons } = element
const { option } = object

const inputBlocks = [
  input('Your daily basics', checkboxes('daily-checklist', [
    option('Have a breakfast', 'breakfast'),
    option('Have a lunch', 'lunch'),
    option('Have a dinner', 'dinner'),
    option('Sleep', 'sleep'),
    option('repeat', 'repeat'),
  ]),
    {
      initialOptions: [
        option('Have a breakfast', 'breakfast'),
        option('Have a lunch', 'lunch'),
      ]
    }
  ),
  input('Night or Day person?', radioButtons('night-day', [
    option('Night', 'night', { descriptionText: 'Definitely prefer to stay awake late at night' }),
    option('Day', 'day', { descriptionText: 'Waking up before dawn, falling asleep with dusk' })
  ]))
]

const modalPayload = view.modal(
  'Example modal',
  [...inputBlocks, ...createExampleBlocks()],
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
