# Export the palette

## Export to JSON

{% hint style="success" %}
The JSON file format is ideal for design tokens because it can be handled with ease.
{% endhint %}

You can export every color shade to JSON on your local machine, according to this model:

```json
{
  "Starting color 1": {
    "minStopName": {
      "rgb": {
        "r": 207,
        "g": 205,
        "b": 255
      },
      "lch": {
        "l": 84,
        "c": 26,
        "h": 294
      },
      "hex": "#d0cdff",
      "type": "color"
    },
    …
    "maxStopName": {
      "rgb": {
        "r": 0,
        "g": 16,
        "b": 150
      },
      "lch": {
        "l": 18,
        "c": 84,
        "h": 304
      },
      "hex": "#001097"
      "type": "color"
    },
  },
  …
  "Starting color N": {
    "minStopName": {
      "rgb": {
        "r": 255,
        "g": 178,
        "b": 89
      },
      "lch": {
        "l": 78,
        "c": 58,
        "h": 70
      },
      "hex": "#ffb359",
      "type": "color"
    },
    …
    "maxStopName": {
      "rgb": {
        "r": 95,
        "g": 0,
        "b": 0
      },
      "lch": {
        "l": 17,
        "c": 47,
        "h": 35
      },
      "hex": "#600000",
      "type": "color"
    }
  }
}
```

## Export to CSS Custom Properties

You can export every color shade to CSS on your local machine, according to this model:

```css
:root {
  --starting-color-1-min-stop-name: rgb(207, 205, 255);
  …
  --starting-color-1-max-stop-name: rgb(0, 16, 150);
  
  …
  
  --starting-color-N-min-stop-name: rgb(255, 178, 89);
  …
  --starting-color-N-min-stop-name: rgb(95, 0, 0);
}
```
