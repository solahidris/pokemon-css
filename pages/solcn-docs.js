import Head from 'next/head';
import { useState, useEffect } from 'react';
import { ThreeDCard } from '../packages/solcn-cli/registry/3d-card';

export default function SolcnDocs() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800 selection:text-zinc-100">
      <Head>
        <title>solcn/ui - Beautiful 3D Components</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container mx-auto flex h-14 items-center px-4 max-w-screen-xl">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2 font-bold" href="#">
              <span>solcn/ui</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium text-zinc-400">
              <a className="transition-colors hover:text-white" href="#docs">Docs</a>
              <a className="transition-colors hover:text-white" href="#components">Components</a>
              <a className="transition-colors hover:text-white" href="https://github.com/solahidris/solcn-cli">GitHub</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-screen-xl px-4 py-10 md:py-16">
        {/* Hero Section */}
        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Build your component library with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">solcn</span>
            </h1>
            <p className="max-w-[700px] text-lg text-zinc-400 sm:text-xl">
              Beautifully designed 3D components that you can copy and paste into your apps. 
              Accessible. Customizable. Open Source.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#installation" className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black shadow transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50">
                Get Started
              </a>
              <a href="https://github.com/solahidris/solcn-cli" target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-800 bg-black px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50">
                GitHub
              </a>
            </div>
          </div>
          
          {/* 3D Card Demo */}
          <div className="flex-1 w-full max-w-sm mx-auto md:max-w-md lg:max-w-lg pt-8 md:pt-0">
             <div className="relative rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 md:p-12">
                <ThreeDCard 
                  img="https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=600&h=800&fit=crop" 
                  backimg="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                />
                <div className="mt-6 text-center">
                  <p className="text-sm text-zinc-500">Try hovering and clicking the card!</p>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-16 md:mt-24 border-t border-zinc-800 pt-16">
          <div className="grid gap-10 md:grid-cols-[240px_1fr] lg:gap-20">
            {/* Sidebar */}
            <aside className="hidden md:block">
              <nav className="grid gap-4 text-sm text-zinc-400">
                <div className="grid gap-2">
                  <h4 className="font-medium text-white">Getting Started</h4>
                  <a href="#installation" className="block hover:text-white">Installation</a>
                  <a href="#cli" className="block hover:text-white">CLI</a>
                </div>
                <div className="grid gap-2">
                  <h4 className="font-medium text-white">Components</h4>
                  <a href="#3d-card" className="block text-white font-medium">3D Card</a>
                </div>
              </nav>
            </aside>

            {/* Content */}
            <div className="space-y-12">
              
              {/* Installation Section */}
              <section id="installation" className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Installation</h2>
                  <p className="text-zinc-400">Get started by initializing solcn in your project.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-zinc-100">npx @solahidris/solcn@latest init</code>
                      <CopyButton text="npx @solahidris/solcn@latest init" />
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-zinc-900/50 p-4 text-sm text-zinc-400 border border-zinc-800">
                    <p>This command will:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                      <li>Ask you where to save components (default: <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">components/ui</code>)</li>
                      <li>Create the directory structure</li>
                      <li>Create a <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">solcn.json</code> configuration file</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Add Component Section */}
              <section id="cli" className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Add Components</h2>
                  <p className="text-zinc-400">Use the CLI to add components to your project.</p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-zinc-100">npx @solahidris/solcn@latest add 3d-card</code>
                      <CopyButton text="npx @solahidris/solcn@latest add 3d-card" />
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-zinc-900/50 p-4 text-sm text-zinc-400 border border-zinc-800">
                    <p>This will download the 3D Card component source code directly into your project, giving you full ownership and control.</p>
                  </div>
                </div>
              </section>

              {/* Usage Section */}
              <section id="usage" className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Usage</h2>
                  <p className="text-zinc-400">Import and use the component in your React application.</p>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 relative group">
                  <div className="absolute top-4 right-4">
                    <CopyButton text={`import { ThreeDCard } from '@/components/ui/3d-card';

export default function Page() {
  return (
    <div className="w-[300px] mx-auto">
      <ThreeDCard 
        img="https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=600&h=800&fit=crop" 
        backimg="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
      />
    </div>
  );
}`} />
                  </div>
                  <pre className="overflow-x-auto p-4 pt-0">
                    <code className="text-sm font-mono text-zinc-100 block">
                      <span className="text-purple-400">import</span> {`{ ThreeDCard }`} <span className="text-purple-400">from</span> <span className="text-green-400">'@/components/ui/3d-card'</span>;
                      {'\n\n'}
                      <span className="text-purple-400">export default function</span> <span className="text-blue-400">Page</span>() {'{'}
                      {'\n  '}
                      <span className="text-purple-400">return</span> (
                      {'\n    '}
                      <span className="text-blue-300">&lt;div</span> <span className="text-sky-300">className</span>=<span className="text-green-400">"w-[300px] mx-auto"</span><span className="text-blue-300">&gt;</span>
                      {'\n      '}
                      <span className="text-blue-300">&lt;ThreeDCard</span> 
                      {'\n        '}
                      <span className="text-sky-300">img</span>=<span className="text-green-400">"https://images.unsplash.com/..."</span> 
                      {'\n        '}
                      <span className="text-sky-300">backimg</span>=<span className="text-green-400">"https://github.com/..."</span>
                      {'\n      '}
                      <span className="text-blue-300">/&gt;</span>
                      {'\n    '}
                      <span className="text-blue-300">&lt;/div&gt;</span>
                      {'\n  '}
                      );
                      {'\n}'}
                    </code>
                  </pre>
                </div>
              </section>

              {/* Props Table */}
              <section id="props" className="space-y-6 pb-20">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Props</h2>
                  <p className="text-zinc-400">Customization options for the 3D Card.</p>
                </div>

                <div className="rounded-lg border border-zinc-800 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-900 text-zinc-100 border-b border-zinc-800">
                      <tr>
                        <th className="px-4 py-3 font-medium">Prop</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Default</th>
                        <th className="px-4 py-3 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 bg-zinc-950">
                      <tr className="hover:bg-zinc-900/50">
                        <td className="px-4 py-3 font-mono text-purple-400">img</td>
                        <td className="px-4 py-3 text-zinc-400">string</td>
                        <td className="px-4 py-3 text-zinc-500">-</td>
                        <td className="px-4 py-3 text-zinc-300">URL for the front image (required)</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/50">
                        <td className="px-4 py-3 font-mono text-purple-400">backimg</td>
                        <td className="px-4 py-3 text-zinc-400">string</td>
                        <td className="px-4 py-3 text-zinc-500">same as img</td>
                        <td className="px-4 py-3 text-zinc-300">URL for the back image</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/50">
                        <td className="px-4 py-3 font-mono text-purple-400">disableClickEnlarge</td>
                        <td className="px-4 py-3 text-zinc-400">boolean</td>
                        <td className="px-4 py-3 text-zinc-500">false</td>
                        <td className="px-4 py-3 text-zinc-300">Disables the click-to-enlarge feature</td>
                      </tr>
                      <tr className="hover:bg-zinc-900/50">
                        <td className="px-4 py-3 font-mono text-purple-400">disableHoverCardGlow</td>
                        <td className="px-4 py-3 text-zinc-400">boolean</td>
                        <td className="px-4 py-3 text-zinc-500">false</td>
                        <td className="px-4 py-3 text-zinc-300">Disables the hover glow effect</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={copy}
      className="p-2 text-zinc-400 hover:text-white transition-colors rounded hover:bg-zinc-800"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      )}
    </button>
  );
}

