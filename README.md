## Minimal lo-fi app

Use PWA capabilities and local-vault to operate without the server.

### How it works

This branch is for playing with wasm SQLite and signals

### Stack

- `@preact/react-signals` as a state manager
- `sqlocal` SQLite on OFPS backend
- `kysely` For query building
- `local-vault` for authorization
- `vite-pwa-plugin` for precaching assets
- Shadcn components

### Run

For dev mode run

```sh
npm run dev
```

The `web-auth-api` and service worker require valid ssl certificate, so for best DX use [cloudflare tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/trycloudflare/)

```sh
npm run start:tunnel
```

Now you can open the tunnel url or scan the QR code with your device camera

> Note: You may need to manually remove your passkeys sometimes
