# solcn

A CLI for adding beautiful 3D components to your project. Inspired by shadcn/ui.

## Usage

Initialize solcn in your project:

```bash
npx @solahidris/solcn@latest init
```

Add components to your project:

```bash
npx @solahidris/solcn@latest add 3d-card
```

## Available Components

- **3d-card** - Interactive 3D card with holographic effects

## How it Works

Unlike traditional npm packages, solcn copies the component source code directly into your project. This gives you:

- ✅ Full control over the code
- ✅ No external dependencies to manage
- ✅ Easy customization
- ✅ Copy-paste friendly

## Example

After running `npx @solahidris/solcn init` and `npx @solahidris/solcn add 3d-card`:

```jsx
import { ThreeDCard } from '@/components/ui/3d-card';

export default function Home() {
  return (
    <div style={{ width: '300px' }}>
      <ThreeDCard 
        img="https://example.com/image.jpg"
        backimg="https://example.com/back.jpg"
      />
    </div>
  );
}
```

## Component Props

### ThreeDCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `img` | `string` | Required | Front image URL |
| `backimg` | `string` | Same as `img` | Back image URL |
| `disableClickEnlarge` | `boolean` | `false` | Disable click-to-enlarge |
| `disableHoverCardGlow` | `boolean` | `false` | Disable hover glow effect |

## License

MIT

## Author

solahidris

