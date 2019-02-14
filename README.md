# Block Kit for Slack

## This is coming soon!

---
Example of usage:

```javascript
  import { block, element, object, TEXT_FORMAT_MRKDW } from 'slack-block-kit'

  const { text, option } = object
  const { button, overflow } = element
  const { section, actions, divider, context, image } = block

  const blocks = [
    section(
      text('Hello World! :wave:\n\n*What great shall we build today*?', TEXT_FORMAT_MRKDWN), {
        blockId: 'My-section-block#1',
        accessory: overflow('action-to-take', [
          option('Option 1', 'option-1'),
          option('Option 2', 'option-2'),
          option('Option 3', 'option-3'),
          option('Option 4', 'option-4'),
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
    image('https://bit.ly/2V2MqwX', 'Jedi power'),
    context(
      [
        text(':heavy_check_mark: The world better should be', TEXT_FORMAT_MRKDWN),
        text(':heavy_check_mark: The air clean is not', TEXT_FORMAT_MRKDWN),
        text(':heavy_check_mark: You all power have to change it', TEXT_FORMAT_MRKDWN),
      ]
    )
  ]
```

Will produce following message
![Slack Block Kit message example](https://s3-us-west-2.amazonaws.com/files.workstreams.ai/public/block-kit-example.jpg)
