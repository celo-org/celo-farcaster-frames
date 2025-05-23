export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  
  // The .well-known/farcaster.json route is used to provide the configuration for the Frame.
  // You need to generate the accountAssociation payload and signature using this link:

  const config = {
    "accountAssociation": {
      "header": "eyJmaWQiOjEwMjQ1MjMsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhjMTkwMjRCQzREQmI4Mjk3RjA2NzRhMmZBNTlkMEI0NDZBY0FCMTNhIn0",
      "payload": "eyJkb21haW4iOiJjZWxvLWZhcmNhc3Rlci1mcmFtZXMtY2hpLnZlcmNlbC5hcHAifQ",
      "signature": "MHgyNGUwMGE4ZWNiZjJiMjU0MzhmZTRjMzA1ZjkxNDEwODEzODM2MWVlZDBjOTZkNzcxNDIyOWVhNjNjMjIyY2UxNDMxNGUwNjFkY2I5MmNmNzM5YzUyNzRiNTE2MjRjMDA1ZjY2MzkyZDk1MWUxMWUwMTdjMDc1NjdjMWU4YjY5MjFi"
    },
    frame: {
      version: "1",
      name: "Celo Hypercerts Marketplace",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/hypercert-img-url.png`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/celosplash.png`,
      splashBackgroundColor: "#EDFDFC",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}