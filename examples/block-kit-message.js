import {
  object, element, block, TEXT_FORMAT_MRKDWN,
} from '../src'

const {
  text, confirm, option, optionGroup, optionGroups,
} = object
const {
  button, overflow, staticSelect, externalSelect,
  usersSelect, conversationsSelect, channelsSelect,
  datePicker, multiStaticSelect, multiConversationsSelect, multiUsersSelect, multiChannelsSelect,
} = element
const {
  section, actions, divider, context, image,
} = block

const blocks = [
  section(
    text(
      '*<https://www.workstreams.ai?source=slack-block-kit|Agile Jedis>*\nLet\'s *rock* and *roll* towards better future!',
      TEXT_FORMAT_MRKDWN,
    ), {
      fields: [
        text(':heavy_check_mark: *`get stuff done`* :tada:', TEXT_FORMAT_MRKDWN),
        text(':arrow_double_up: *Priority* over *deadline* :timer_clock:', TEXT_FORMAT_MRKDWN),
      ],
      accessory: datePicker('mission-start', {
        placeholderText: 'Select a date',
        initialDate: '2019-03-23',
      }),
    },
  ),
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
    },
  ),
  image('https://bit.ly/2V2MqwX', 'Jedi power'),
  context(
    [
      text(':heavy_check_mark: The world better should be', TEXT_FORMAT_MRKDWN),
      text(':heavy_exclamation_mark: The air clean is not', TEXT_FORMAT_MRKDWN),
      text(':muscle: You all power have to change it', TEXT_FORMAT_MRKDWN),
    ],
  ),
  section(
    text('*What great shall we build today*?', TEXT_FORMAT_MRKDWN), {
      blockId: 'My-section-block#1',
      accessory: overflow('mission-to-take', [
        option('Pyramid', 'pyramid'),
        option('Build solar power plant', 'solar-plant'),
        option('Sustainable society', 'new-society'),
        option('Build rocket to Mars', 'rocket'),
        option('Build wall', 'new-society'),
      ]),
    },
  ),
  divider(),
  actions(
    [
      button('pyramid', 'Pyramid'),
      button('solar-plant', 'Solar power plant'),
      button('new-society', 'Sustainable society'),
      button('rocket', 'Rocket to Mars'),
      button('wall', 'Tremendous wall'),
    ],
    {
      blockId: 'actions-1',
    },
  ),
  section(
    text('Make sure you choose the right gear'), {
      accessory: multiStaticSelect(
        'gear',
        'Available gear', null, {
          optionGroups: optionGroups([
            optionGroup('Water', [
              option('Surf board', 'surf-board'),
              option('Dingy', 'dingy'),
              option('Canoe', 'canoe'),
            ]),
            optionGroup('Earth', [
              option('Long board', 'long-board'),
              option('Bicycle', 'bicycle'),
              option('Mile shoes', 'mile-shoes'),
            ]),
            optionGroup('Air', [
              option('Kite', 'kite'),
              option('Hover board', 'hover-board'),
              option('Paraglide', 'paraglide'),
            ]),
          ]),
          initialOptions: [
            // option('Surf board', 'surf-board'),
            // option('Long board', 'long-board'),
            option('Kite', 'kite'),
          ],

          maxSelectedItems: 3,
        },
      ),
      blockId: 'gear',
    },
  ),
  section(
    text('The power is in numbers!'), {
      accessory: multiUsersSelect(
        'members',
        'Choose your squad members',
        {
          maxSelectedItems: 2,
          confirm: confirm(
            'Confirm your *team selection*',
            TEXT_FORMAT_MRKDWN,
            'You *will not* be able to change once you depart, choose wisely :thinking_face:',
            'I know what I\'m doing',
            'Let me think again',
          ),
        },
      ),
      blockId: 'teams',
    },
  ),
  section(
    text('Communication is key'), {
      accessory: multiConversationsSelect(
        'broadcast',
        'Choose your rescue broadcast',
        { maxSelectedItems: 2 },
      ),
      blockId: 'conversations',
    },
  ),
  section(
    text('Channel it like a PRO'), {
      accessory: multiChannelsSelect(
        'broadcast',
        'Choose your radio channels',
        { maxSelectedItems: 2 },
      ),
      blockId: 'channels',
    },
  ),
]

// eslint-disable-next-line no-console
console.log(JSON.stringify({
  blocks,
}))
