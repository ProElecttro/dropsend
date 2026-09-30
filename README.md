# DropSend

DropSend is a simple way to send photos from my phone directly to my PC.

It runs locally on my PC, so there is no need to deploy it anywhere. I use Tailscale to connect my phone and PC, and the photos are saved directly to a predefined folder on the PC.

## Setup

Clone the repo:

```bash
git clone https://github.com/ProElecttro/dropsend.git
cd dropsend
```

Start the containers:

```bash
docker compose up -d --build
```

Check that everything is running:

```bash
docker compose ps
```

## Using it

On the PC:

```text
http://localhost/dropsend
```

From my phone, with Tailscale connected:

```text
http://<pc-tailscale-hostname>/dropsend
```

For example:

```text
http://purushottams-macbook-air/dropsend
```

Select the photos and upload them. They will be stored in:

```text
./uploads/
```

## Stopping it

```bash
docker compose down
```

To start it again:

```bash
docker compose up -d
```

## Tech

Node.js, Express, Docker, Docker Compose, Nginx and Tailscale.

The main idea is to run everything locally and use Tailscale to access it from my phone. No cloud deployment or external storage is required.


## What if you don't want to run it on your laptop?

Take it one step further.

Instead of running DropSend on your laptop, keep a Raspberry Pi at home and use it as your personal photo storage box.

You're on a trip, your phone storage is full, and you don't want to delete anything. Just connect to your home network through Tailscale and send the photos directly to the Raspberry Pi.

And if you want to get more interesting with it, you could use a BeagleBone Black as a small controller to remotely power or trigger the Raspberry Pi, start the DropSend container, and get everything running without even touching the Pi.

So the setup becomes:

Phone → Tailscale → Raspberry Pi → Storage

with the BeagleBone acting as the remote control layer.

At that point, DropSend isn't really just a photo-transfer app anymore. It's a small self-hosted photo storage system you can access from anywhere.

