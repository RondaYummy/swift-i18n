## Linked messages

If there’s a locale messages key that will always have the same concrete text as another one you can just link to it.

To link to another locale messages key, all you have to do is to prefix its contents with an `@:key` sign followed by the full name of the locale messages key including the namespace you want to link to.

#### Locale messages the below:

```json
{
  "en": {
    "message": {
      "the_world": "the world",
      "dio": "DIO:",
      "linked": "@:message.dio @:message.the_world !!!!"
    }
  }
}
```
It’s `en` locale that has hierarchical structure in the object.

The `message.the_world` has `the_world` and `message.dio`. The `message.linked` has `@:message.dio @:message.dio @:message.the_world !!!!`, and it’s linked to the locale messages key with `message.dio` and `message.the_world`.

#### The following is an example of the use of `$t()` or `t()` in a template:

```html
<p>{{ $t('message.linked') }}</p>
```

The first argument is `message.linked` as the locale messages key as a parameter to `t`.

#### As result the below:

```html
<p>DIO: the world !!!!</p>
```