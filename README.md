## Minimal lo-fi app

Use PWA capabilities and local-vault to operate without the server.

### How it works

The reactive state of the app is being persisted into indexedDB by local-vault that provides both local authorization and data encription.
The whole app state is encrypted with user's passkey stored in device local keychain
The local assets are being cached via service worker precaching

### Stack

- `valtio` as a state manager
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
