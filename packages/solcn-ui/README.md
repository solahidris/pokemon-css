# @solahidris/ui

A beautiful React UI library featuring interactive 3D card components with holographic effects and smooth spring animations.

## Installation

```bash
npm install @solahidris/ui
```

or

```bash
yarn add @solahidris/ui
```

## Components

### ThreeDCard

An interactive 3D card component with holographic effects, tilt animations, and click-to-enlarge functionality.

#### Features

- ✨ Holographic glare effects that follow mouse movement
- 🎴 Smooth 3D tilt animations powered by spring physics
- 🔍 Click-to-enlarge with full-screen preview and 360° flip animation
- 🎯 Customizable front and back images
- ⚙️ Optional disable flags for click and hover effects
- 📱 Responsive and touch-friendly
- 🚀 Zero dependencies (only React required)
- 🎨 Fully customizable styling

#### Usage

```jsx
import { ThreeDCard } from '@solahidris/ui';

function App() {
  return (
    <div style={{ width: '300px' }}>
      <ThreeDCard 
        img="https://example.com/front-image.jpg"
        backimg="https://example.com/back-image.jpg"
      />
    </div>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `img` | `string` | Required | URL of the front image |
| `backimg` | `string` | Same as `img` | URL of the back image (optional) |
| `disableClickEnlarge` | `boolean` | `false` | Disable click-to-enlarge feature |
| `disableHoverCardGlow` | `boolean` | `false` | Disable hover glow effect |

#### Examples

**Basic Usage**

```jsx
<ThreeDCard img="https://example.com/card.jpg" />
```

**With Custom Back Image**

```jsx
<ThreeDCard 
  img="https://example.com/front.jpg"
  backimg="https://example.com/back.jpg"
/>
```

**Disable Click Enlarge**

```jsx
<ThreeDCard 
  img="https://example.com/card.jpg"
  disableClickEnlarge={true}
/>
```

**Disable Hover Glow**

```jsx
<ThreeDCard 
  img="https://example.com/card.jpg"
  disableHoverCardGlow={true}
/>
```

**Disable All Interactive Effects**

```jsx
<ThreeDCard 
  img="https://example.com/card.jpg"
  disableClickEnlarge={true}
  disableHoverCardGlow={true}
/>
```

#### Styling

The card respects its container width and maintains a 0.718 aspect ratio (similar to trading cards). Simply wrap it in a container with your desired width:

```jsx
<div style={{ width: '250px', margin: '0 auto' }}>
  <ThreeDCard img="https://example.com/card.jpg" />
</div>
```

#### Grid Layout Example

```jsx
<div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  padding: '20px'
}}>
  <ThreeDCard img="https://example.com/card1.jpg" />
  <ThreeDCard img="https://example.com/card2.jpg" />
  <ThreeDCard img="https://example.com/card3.jpg" />
</div>
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with touch support

## License

MIT © solah

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

If you find a bug or have a feature request, please open an issue on [GitHub](https://github.com/solah/solcn-ui/issues).

