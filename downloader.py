import os
import shutil
import json
import yt_dlp

# Folders setup
MUSIC_DIR = "music"
IMAGE_DIR = "images"
JSON_FILE = "playlist.json"

os.makedirs(MUSIC_DIR, exist_ok=True)
os.makedirs(IMAGE_DIR, exist_ok=True)

# Purana songs hase toh load karishu, nahi toh navu list banavshu
playlist_data = []
if os.path.exists(JSON_FILE):
    try:
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            playlist_data = json.load(f)
    except:
        playlist_data = []

print("==================================================")
print("🎵 INTERACTIVE YOUTUBE PLAYLIST TO JSON DOWNLOADER 🎵")
print("==================================================\n")

youtube_playlists = {}

# 1. User thi input levu
while True:
    print("-" * 50)
    category = input("👉 Kayi language/category na songs add karva che?\n(Ex: Gujarati, Hindi, English) ya exit karva 'done' lakho: ").strip()
    
    if category.lower() == 'done':
        break
        
    if not category:
        print("⚠️ Category nu naam khali na rakhay. Fari try karo.")
        continue

    url = input(f"🔗 '{category}' mate YouTube Playlist ni link aapo: ").strip()
    
    if not url:
        print("⚠️ Link khali che. Fari try karo.")
        continue
        
    youtube_playlists[category] = url
    print(f"✅ {category} ni playlist list ma add thai gai!\n")

if not youtube_playlists and not playlist_data:
    print("\n❌ Tame koi link nathi aapi ane purano data pan nathi. Script bandh thai rahi che.")
    exit()

# 2. Downloading Process Chalu
print("\n🚀 Category-wise Playlist Downloading Started...\n")

for category, playlist_url in youtube_playlists.items():
    print(f"\n📁 Starting Playlist for Category: {category}")
    print("=" * 40)
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f'{MUSIC_DIR}/%(title)s.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'writethumbnail': True, 
        'quiet': False,             
        'extract_flat': False,      
        'ignoreerrors': True,       
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            playlist_info = ydl.extract_info(playlist_url, download=True)
            
            if 'entries' in playlist_info:
                for video in playlist_info['entries']:
                    if not video:
                        continue
                        
                    try:
                        title = video.get('title', 'Unknown Title').replace('"', "'")
                        artist = video.get('uploader', 'Unknown Artist').replace('"', "'")
                        
                        base_filename = ydl.prepare_filename(video)
                        base_name_without_ext = os.path.splitext(base_filename)[0]
                        mp3_filename = os.path.basename(f"{base_name_without_ext}.mp3")
                        
                        # Thumbnail format check karvu
                        thumb_ext = ""
                        for ext in ['.webp', '.jpg', '.png']:
                            if os.path.exists(f"{base_name_without_ext}{ext}"):
                                thumb_ext = ext
                                break
                        
                        cover_filename = ""
                        if thumb_ext:
                            old_thumb_path = f"{base_name_without_ext}{thumb_ext}"
                            safe_title = "".join(x for x in title[:25] if x.isalnum() or x in " -_")
                            cover_filename = f"{safe_title.strip()}{thumb_ext}" 
                            new_thumb_path = os.path.join(IMAGE_DIR, cover_filename)
                            
                            if os.path.exists(old_thumb_path):
                                shutil.move(old_thumb_path, new_thumb_path)
                        
                        # Check duplicate entry
                        song_entry = {
                            "title": title,
                            "artist": artist,
                            "category": category,
                            "src": f"./music/{mp3_filename}",
                            "cover": f"./images/{cover_filename}" if cover_filename else ""
                        }
                        
                        if song_entry not in playlist_data:
                            playlist_data.append(song_entry)
                            
                    except Exception as e:
                        print(f"⚠️ Song processing error: {e}")
                        
    except Exception as e:
        print(f"❌ Playlist Error: {e}")

# 3. Save to playlist.json
with open(JSON_FILE, "w", encoding="utf-8") as f:
    json.dump(playlist_data, f, indent=4, ensure_ascii=False)

print("\n=======================================")
print(f"🎉 SUCCESS! Data saved to '{JSON_FILE}' 🎉")
print("=======================================\n")