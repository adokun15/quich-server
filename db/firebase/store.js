import { getFirestore } from "firebase-admin/firestore";

export default async function getAllStoreProduct(link) {
  const ref = getFirestore().collection(`store/${link}/products`);

  let products = [];

  await ref.get().then((data) => {
    data.forEach((product) =>
      products.push({ ...product.data(), productId: product.id })
    );
  });

  return { store: products };
}
