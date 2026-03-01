//Read Doc Late: Send a generated waybill to coustomer!

import { WhatsappUrlForMedia } from "../../whatsapp";

//Upload;
export const uploadMediaToMeta = async (media, media_type) => {
  const mediareq = await WhatsappUrlForMedia("POST", {
    file: media,
    type: media_type, //application/pdf
    messaging_product: "whatsapp",
  });

  return mediareq;
};

export const GetMediaDataFromMeta = async (mediaId) => {
  const mediareq = await WhatsappUrlForMedia("GET", { mediaId });

  return mediareq;
};

export const DeleteMediaDataFromMeta = async (mediaId) => {
  const mediareq = await WhatsappUrlForMedia("Delete", { mediaId });
  return mediareq;
};
