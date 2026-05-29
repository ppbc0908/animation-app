export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* 主视觉区 */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gray-50">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          52集长篇动画
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mb-8">
          一段跨越时空的冒险旅程，每周更新，精彩不断
        </p>
        <button className="px-8 py-4 bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition">
          ▶ 开始观看
        </button>
      </section>

      {/* 热门剧集 */}
      <section className="px-8 py-16">
        <h2 className="text-2xl font-bold mb-6">热门剧集</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((ep) => (
            <div key={ep} className="group cursor-pointer">
              <div className="aspect-video bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-4xl group-hover:bg-gray-300 transition">
                🎬
              </div>
              <p className="font-medium">第{ep}集</p>
              <p className="text-sm text-gray-500">开始的旅程</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
