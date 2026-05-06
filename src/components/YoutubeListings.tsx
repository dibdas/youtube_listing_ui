import { useEffect, useState } from 'react';
import { ThumbsDown } from 'lucide-react';
type VideoThumbnail = {
  url: string;
  width?: number;
  height?: number;
}
interface VideoSnippet {
  title: string;
  channelTitle: string;
   description:string;
   publishedAt:string;
  thumbnails: {
   default: VideoThumbnail;
    medium?: VideoThumbnail;
    high?: VideoThumbnail;
  };
}
type VideoStatistics ={
  viewCount: string;
likeCount: string;
commentCount: string;
}
interface Items {
    id: string;
    items: Video;
}
interface Video {
 
  snippet: VideoSnippet;
  statistics: VideoStatistics;
}
function YoutubeListings() {
  const [videos, setVideos] = useState<Items[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVideo, setSelectedVideo] = useState<Items | null>(null);

  useEffect(() => {
    fetch('https://api.freeapi.app/api/v1/public/youtube/videos')
      .then((res) => res.json())
      .then((json) => {
        // FreeAPI structure is usually { data: { data: [...] } }
        setVideos(json?.data?.data || []); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-10 font-sans">Loading...</div>;

  return (
    <div className="bg-white min-h-screen p-4 font-sans">
      {/* 1. MAIN LISTING GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {videos?.map((video) => (
          <div 
            key={video?.id} 
            className="cursor-pointer group"
            onClick={() => setSelectedVideo(video)} // OPEN COMPONENT ON CLICK
          >
            <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
              <img
                src={video?.items?.snippet?.thumbnails?.high?.url || "https://placeholder.com"}
                alt={video?.items?.snippet?.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex mt-3 gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                <img src={video?.items?.snippet?.thumbnails?.default?.url} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-sm line-clamp-2 leading-tight text-gray-900">{video?.items?.snippet?.title}</h3>
                <p className="text-gray-600 text-xs mt-1">{video?.items?.snippet?.channelTitle}</p>
                <p className="text-gray-600 text-xs">{video?.items?.statistics?.viewCount} views</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. DETAIL COMPONENT (MODAL OVERLAY) */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-4 md:p-10">
          <button 
            onClick={() => setSelectedVideo(null)} // CLOSE COMPONENT
            className="mb-6 flex items-center gap-2 text-blue-600 font-bold hover:underline"
          >
            ← Back to Feed
          </button>

          <div className="max-w-5xl mx-auto">
            {/* Video Player Placeholder */}
            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={selectedVideo.items.snippet.thumbnails.high?.url} 
                  className="w-full h-full object-cover opacity-80" 
                  alt="Player"
                />
            </div>

            {/* Video Info */}
            <div className="mt-6">
              <h1 className="text-2xl font-bold text-gray-900">{selectedVideo.items.snippet.title}</h1>
              
              <div className="flex flex-wrap items-center justify-between mt-4 border-b pb-6 gap-4">
                <div className="flex items-center gap-3">
  
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                      <img src={selectedVideo?.items?.snippet?.thumbnails?.default?.url} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="font-bold">{selectedVideo.items.snippet.channelTitle}</p>
                        <p className="text-xs text-gray-500">1.2M subscribers</p>
                    </div>
                </div>

                <div className="flex gap-2">
                  <span className="bg-gray-100 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-200">{selectedVideo.items.statistics.viewCount} views</span>
                    <button className="bg-gray-100 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-200">
                      👍 {selectedVideo.items.statistics.likeCount}
                    </button>
                    <button className="bg-gray-100 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-200">
                       <ThumbsDown size={20} color="#4dffe1" />
                    </button>
                    <button className="bg-black text-white px-6 py-2 rounded-full font-medium text-sm">
                      Subscribe
                    </button>
                </div>
              </div>

              <div className="mt-6 bg-gray-100 p-4 rounded-xl">
                <p className="font-bold text-sm mb-1">{selectedVideo.items.statistics.viewCount} views</p>
                <p className="text-sm text-gray-700 leading-relaxed text-black">
                     <strong>{new Date(selectedVideo.items.snippet.publishedAt).toLocaleString()}</strong> This video has {selectedVideo.items.statistics.viewCount}views {selectedVideo.items.statistics.commentCount} comments.
                  
                    The description and more details from {selectedVideo.items.snippet.description} would appear here.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

export default YoutubeListings;
