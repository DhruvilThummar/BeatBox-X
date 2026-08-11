import os
import shutil
import json
import yt_dlp

# Folders setup (Strict Separation)
MUSIC_DIR = "music"
IMAGE_DIR = "images"
JSON_FILE = "playlist.json"

os.makedirs(MUSIC_DIR, exist_ok=True)
os.makedirs(IMAGE_DIR, exist_ok=True)

# Purana songs hase toh load karishu
playlist_data = []
if os.path.exists(JSON_FILE):
    try:
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            playlist_data = json.load(f)
    except:
        playlist_data = []

print("==================================================")
print("🎵 STRICT SEQUENTIAL DOWNLOADER (1 by 1) 🎵")
print("==================================================\n")

youtube_playlists = {}

# 1. User thi input levu
while True:
    print("-" * 50)
    category = input("👉 Kayi language/category na songs add karva che?\n(Ex: Gujarati, Hindi, English) ya 'done' lakho: ").strip()
    
    if category.lower() == 'done':
        break
    if not category:
        continue

    url = input(f"🔗 '{category}' mate YouTube Playlist ni link aapo: ").strip()
    if not url:
        continue
        
    youtube_playlists[category] = url
    print(f"✅ {category} playlist added!\n")

if not youtube_playlists and not playlist_data:
    print("\n❌ Koi link nathi aapi. Script bandh thai rahi che.")
    exit()

# 2. Sequential Downloading Process Chalu
print("\n🚀 Sequential Downloading Started (Ek pachi biju song download thase)...\n")

for category, playlist_url in youtube_playlists.items():
    print(f"\n📁 Category: {category}")
    print("=" * 40)
    
    # Pehla playlist na badha videos ni list fetch karvi (without downloading)
    extract_opts = {
        'extract_flat': 'in_playlist',
        'quiet': True,
        'skip_download': True
    }
    
    try:
        with yt_dlp.YoutubeDL(extract_opts) as ydl:
            info = ydl.extract_info(playlist_url, download=False)
            entries = info.get('entries', [])
            
        total_songs = len(entries)
        print(f"📊 Total songs found in playlist: {total_songs}\n")
        
        # Ek-ek song ne line ma download karvu (Sequential Loop)
        for idx, entry in enumerate(entries, 1):
            video_id = entry.get('id')
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            
            print(f"⬇️ Downloading song {idx}/{total_songs}: {entry.get('title', 'Unknown Title')}")
            
            ydl_opts = {
                'format': 'bestaudio/best',
                'outtmpl': os.path.join(MUSIC_DIR, '%(id)s.%(ext)s'),
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
                'writethumbnail': True, 
                'quiet': True,
                'no_warnings': True,
                'ignoreerrors': True,
            }

            try:
                with yt_dlp.YoutubeDL(ydl_opts) as song_ydl:
                    video_info = song_ydl.extract_info(video_url, download=True)
                    
                    title = video_info.get('title', 'Unknown Title').replace('"', "'")
                    artist = video_info.get('uploader', 'Unknown Artist').replace('"', "'")
                    
                    mp3_filename = f"{video_id}.mp3"
                    mp3_path = os.path.join(MUSIC_DIR, mp3_filename)
                    
                    cover_filename = ""
                    # Thumbnail check and separate folder move logic
                    for ext in ['.jpg', '.png', '.webp', '.jpeg']:
                        possible_thumb = os.path.join(MUSIC_DIR, f"{video_id}{ext}")
                        if os.path.exists(possible_thumb):
                            safe_title = "".join(c for c in title[:20] if c.isalnum() or c in " -_").strip()
                            cover_filename = f"{safe_title}_{video_id}{ext}"
                            cover_path = os.path.join(IMAGE_DIR, cover_filename)
                            
                            shutil.move(possible_thumb, cover_path)
                            break
                    
                    if os.path.exists(mp3_path):
                        # Requested Sequence: Image -> Music -> Details
                        song_entry = {
                            "cover": f"./images/{cover_filename}" if cover_filename else "",
                            "src": f"./music/{mp3_filename}",
                            "title": title,
                            "artist": artist,
                            "category": category
                        }
                        
                        if song_entry not in playlist_data:
                            playlist_data.append(song_entry)
                            
                        # Incrementally save data so data won't lose if stopped midway
                        with open(JSON_FILE, "w", encoding="utf-8") as f:
                            json.dump(playlist_data, f, indent=4, ensure_ascii=False)
                            
                        print(f"✅ Completed & Saved ({idx}/{total_songs})\n")
                        
            except Exception as song_err:
                print(f"❌ Error downloading song {idx}: {song_err}\n")
                continue
                
    except Exception as pl_err:
        print(f"❌ Playlist Extraction Error: {pl_err}")

print("\n=======================================")
print(f"🎉 ALL DOWNLOADS COMPLETE! Data saved to '{JSON_FILE}' 🎉")
print("=======================================\n")


# https://www.youtube.com/watch?v=CBb0XBH_fT0&list=RDCBb0XBH_fT0&start_radio=1