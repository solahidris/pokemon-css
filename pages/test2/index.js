import CustomCard from '../../lib/components/CustomCard';

export default function Test2Page() {
  // Using a random image from the internet
  const imageUrl = 'https://images.unsplash.com/photo-1542779283-429940ce8336?w=500&h=700&fit=crop';
  const backImageUrl = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-10" style={{ backgroundColor: '#16213e' }}>
      <h1 className="text-white mb-10 font-sans text-4xl">
        Custom Card Test
      </h1>
      
      <div className="max-w-[200px] w-full">
        <CustomCard img={imageUrl} backimg={backImageUrl} />
      </div>

      <p className="text-gray-400 mt-10 text-center max-w-2xl">
        This card uses a random image from the internet with holographic effects!
      </p>

      <div className="mt-5 p-4 bg-white/10 rounded-lg max-w-2xl">
        <p className="text-gray-300 text-sm m-0">
          <strong>Front:</strong> Unsplash (Random nature photo)<br />
          <strong>Back:</strong> GitHub Logo
        </p>
      </div>
    </div>
  );
}

