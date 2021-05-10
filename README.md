# vdown

**vdown** is a Vimeo downloader that let you download audio/video data from a vimeo stream and combine them into a single video file.

## Install

```bash
git clone https://github.com/erremauro/vdown.git
cd vdown
yarn install
```

## How to use it

Inspect the page that contains the video you wish to download locally and from
the network information tab, find its related `master.json` and copy the file URL.

Now you can use `./bin/vdown` to download your video.

### Download a single video

You can download a single video by specifing the `master.json` URL and optionally
an output name for your video. If you don't specify a name for your video the 
output file will be named using the vimeo's `clip_id` (UUID).

To download a single video use the command:

```bash
./bin/vdown --url "https://my.cdn.com/master.json" --output "~/Movies/my_video.mp4"
```

### Download multiple videos

Create a JSON document that contains all your downloads, structured as follow:

```json
{
	"dest": "~/Downloads",
	"files": [
		{ 
			"name": "01 - My First File.mp4",
			"url": "https://my.cdn.com/1234/master.json"
		},
		{ 
			"name": "02 - My Second File.mp4",
			"url": "https://my.cdn.com/5678/master.json"
		},
	]
}
```

Feed the document to **vdown** using the command:

```bash
./bin/vdown --json ./download.json
```
