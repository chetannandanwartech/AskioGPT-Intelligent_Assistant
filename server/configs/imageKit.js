import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
  publicKey: (process.env.IMAGEKIT_PUBLIC_KEY || "").trim(),
  privateKey: (process.env.IMAGEKIT_PRIVATE_KEY || "").trim(),
  urlEndpoint: (process.env.IMAGEKIT_URL_ENDPOINT || "").trim(),
});

export default imagekit;