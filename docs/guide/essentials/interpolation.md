# Variable Interpolation

Pass variables into translations via the vars object:

```json
{
  "greeting": "Hello, {name}!"
}
```

```ts
t('greeting', { name: 'Alice' }); // "Hello, Alice!"
plural('common.items', 5, { name: 'Alice' });
```