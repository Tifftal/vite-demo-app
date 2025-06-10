/// <reference types="vite/client" />

declare module "virtual:pwa-register";

declare function __federation_method_setRemote(
  remoteName: string
): Promise<void>;
