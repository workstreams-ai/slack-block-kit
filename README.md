# Block Kit for Slack

## This set of functions is based on Slack Blocks documentation

block - https://api.slack.com/reference/messaging/blocks
element - https://api.slack.com/reference/messaging/block-elements
object - https://api.slack.com/reference/messaging/composition-objects

All required parameters as specified in Slack Doc are passed in as arguments
Optional paramaters are passed in additional argument `opts` object.

For further details on API see src folder.

For interactive elements - *actionId is always first argument*

See `example` folder or example below for quick hints of usage.

---
Example of usage:

```javascript
import { block, element, object, TEXT_FORMAT_MRKDW } from 'slack-block-kit'

const { text, confirm, option, optionGroup, optionGroups } = object
const { 
  button, overflow, staticSelect, externalSelect, 
  usersSelect, conversationsSelect, channelsSelect,
  datePicker,
} = element
const { section, actions, divider, context, image } = block

const blocks = [
  section(
    text(
      '*<https://www.workstreams.ai?source=slack-block-kit|Agile Jedis>*\nLet\'s *rock* and *roll* towards better future!',
      TEXT_FORMAT_MRKDWN
    ), {
      fields: [
        text(':heavy_check_mark: *`get stuff done`* :tada:', TEXT_FORMAT_MRKDWN),
        text(':arrow_double_up: *Priority* over *deadline* :timer_clock:', TEXT_FORMAT_MRKDWN)
      ],
      accessory: datePicker('mission-start', { 
        placeholderText: 'Select a date',
        initialDate: '2019-03-23'
      })
    }),
  actions(
    [
      usersSelect('jedi-knight', 'Choose your Jedi'),
      conversationsSelect('commanding-team', 'Commanding team'),
      channelsSelect('space-ship', 'Choose your squad'),
      staticSelect('weapon', 'Choose your weapon', [
        option('Light sabre', 'light-sabre'),
        option('PAC cannon', 'pac-cannon'),
        option('Dark matter', 'dark-matter'),
        option('Telepathy', 'telepathy'),
      ], {
        initialOption: option('Light sabre', 'light-sabre'),
        confirm: confirm(
          'Confirm your weapon',
          TEXT_FORMAT_MRKDWN,
          'You *will not* be able to change your weapon, choose wisely :thinking_face:',
          'Choose',
          'Let me think again',
        ),
      }),
      externalSelect('special-weapon', 'Special weapon', { minQueryLength: 3 }),
    ], {
      blockId: 'actions-2',
    }
  ),
  image('https://bit.ly/2V2MqwX', 'Jedi power'),
  context(
    [
      text(':heavy_check_mark: The world better should be', TEXT_FORMAT_MRKDWN),
      text(':heavy_exclamation_mark: The air clean is not', TEXT_FORMAT_MRKDWN),
      text(':muscle: You all power have to change it', TEXT_FORMAT_MRKDWN),
    ]
  ),
  section(
    text('*What great shall we build today*?', TEXT_FORMAT_MRKDWN), {
      blockId: 'My-section-block#1',
      accessory: overflow('mission-to-take', [
        option('Pyramid', 'pyramid',),
        option('Build solar power plant', 'solar-plant'),
        option('Sustainable society', 'new-society', ),
        option('Build rocket to Mars', 'rocket'),
        option('Build wall', 'new-society'),
      ])
    }),
  divider(),
  actions(
    [
      button('pyramid','Pyramid'),
      button('solar-plant', 'Solar power plant'),
      button('new-society', 'Sustainable society'),
      button('rocket', 'Rocket to Mars'),
      button('wall', 'Tremendous wall'),
    ],{
      blockId: 'actions-1',
    }),
]
```

Will produce following message
![Slack Block Kit message example](https://s3-us-west-2.amazonaws.com/files.workstreams.ai/public/block-kit-example.jpg)
